import React from "react";
import PropType from "prop-types";
import { Button, Icon } from "antd";
import moment from "moment";
import styles from "./index.less";
export class TimeHeader extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      durations: [],
      page: 0,
      current: 0,
      mode: "date",
    };
  }
  render() {
    return (
      <div className={styles["container"]}>
        <Button
          icon="left"
          disabled={this.state.current === 0}
          onClick={this.goPrePage}
          className={styles["left-button"]}
        ></Button>
        {this.showDuration()}
        <Button
          icon="right"
          disabled={this.state.current === this.state.durations.length - 1}
          onClick={this.goNextPage}
          className={styles["right-button"]}
        ></Button>
      </div>
    );
  }
  getDurtaions = (startDatetime, endDatetime, days, mode) => {
    let durations = [];
    let idx = startDatetime;
    if (mode === "date") {
      while (idx <= endDatetime) {
        const day = new Date(idx).getDay();
        let ed;
        if (day === 0) {
          ed = idx;
          durations.push({
            st: idx,
            ed: idx,
          });
        } else {
          let left = 7 - day;
          if (idx + 60 * 60 * 24 * 1000 * left > endDatetime) {
            ed = endDatetime;
          } else {
            ed = idx + 60 * 60 * 24 * 1000 * left;
          }
          durations.push({
            st: idx,
            ed: ed,
          });
        }
        idx = ed + 60 * 60 * 24 * 1000;
      }
    } else {
      let idx = 1;
      while (idx <= days) {
        let ed = idx + 6;
        if (ed > days) {
          ed = days;
        }
        durations.push({
          st: idx,
          ed: ed,
        });
        idx = ed + 1;
      }
    }
    this.setState({
      durations: [...durations],
      mode: mode,
    });
    if (durations.length !== 0) {
      this.props.setDuration(durations[0], mode);
    }
    this.setState({
      current: 0,
    });
  };
  showDuration = () => {
    if (this.state.durations.length === 0) {
      return null;
    }
    const curDuration = this.state.durations[this.state.current];
    return (
      <Duration
        startDatetime={curDuration.st}
        endDatetime={curDuration.ed}
        mode={this.state.mode}
      ></Duration>
    );
  };
  goPrePage = () => {
    this.setState({
      current: this.state.current - 1,
    });
    setImmediate(() => {
      this.props.setDuration(
        this.state.durations[this.state.current],
        this.state.mode
      );
    });
  };
  goNextPage = () => {
    this.setState({
      current: this.state.current + 1,
    });
    setImmediate(() => {
      this.props.setDuration(
        this.state.durations[this.state.current],
        this.state.mode
      );
    });
  };
}

function Duration(props) {
  const { startDatetime, endDatetime, mode } = props;
  return (
    <>
      {mode === "date" ? (
        <span className={styles["duration"]}>
          {`${moment(startDatetime).format("YYYY/MM/DD")}-${moment(
            endDatetime
          ).format("YYYY/MM/DD")}`}
        </span>
      ) : (
        <span className={styles["duration"]}>
          {`第${startDatetime}天-第${endDatetime}天`}
        </span>
      )}
    </>
  );
}

TimeHeader.propType = {
  setDuration: PropType.func,
};
TimeHeader.defaultProps = {
  setDuration: () => {},
};
