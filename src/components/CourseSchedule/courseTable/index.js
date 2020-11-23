import React from "react";
import styles from "./index.less";
import moment from "moment";
import { getDay } from "../util";
import ClassContainer from "../classContainer";
import { Button, Icon } from "antd";
import { cloneDeep } from "loadsh";
const MORNING_STTIME = "8:30:00";
const MORNING_EDTIME = "12:00:00";
const NOON_STTIME = "12:00:00";
const NOON_EDTIME = "14:30:00";
const AFTERNOON_STTIME = "14:30:00";
const AFTERNOON_EDTIME = "22:00:00";
const deepCloneObject = (obj) => {
  if (typeof obj !== "object") {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.concat();
  } else {
    return JSON.parse(JSON.stringify(obj));
  }
};
let ID = 0;
export class CourseTable extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentDuration: null,
      headerData: [],
      headerMode: "date",
      courseEntities: [],
    };
  }
  /* 添加课程安排 */
  addCourse = (id, type) => {
    const date = id.split("-")[1];
    let startTime = null;
    let endTime = null;
    let day = null;
    if (this.state.headerMode === "date") {
      startTime = new Date(Number(date)).getTime();
      endTime = new Date(Number(date)).getTime();
    } else {
      startTime = new Date("2020/1/1 00:00").getTime();
      endTime = new Date("2020/1/1 00:00").getTime();
      day = date;
    }
    this.props.addCourse({
      startTime: startTime,
      endTime: endTime,
      location: "n/a",
      uuid: new Date().getTime() + "",
      entityId: "",
      day: Number(day),
      durationType: type,
    });
  };
  /* 删除课程安排 */
  deleteCourse = (uuid, entityId) => {
    const newCourseEntity = deepCloneObject(
      this.state.courseEntities.filter((item) => item.id === entityId)[0]
    );
    newCourseEntity.schedules = newCourseEntity.schedules.filter(
      (item) => item.uuid !== uuid
    );
    this.props.setSchedule(newCourseEntity);
  };
  /* 更新课程安排 */
  updateCourse = (data, type, id) => {
    //console.log(id);
    const newCourseEntity = deepCloneObject(
      this.state.courseEntities.filter((item) => item.id === data.entityId)[0]
    );
    const date = id.split("-")[1];
    let startTime = null;
    let endTime = null;
    let day = null;
    let newData = null;
    if (this.state.headerMode === "date") {
      startTime = new Date(Number(date)).getTime();
      endTime = new Date(Number(date)).getTime();
      newCourseEntity.schedules = newCourseEntity.schedules.filter(
        (entity) => entity.uuid !== data.uuid
      );
      if (
        new Date(Number(date)).getDate() !==
        new Date(Number(data.startTime)).getDate()
      ) {
        newData = {
          ...data,
          startTime:
            moment(
              `${moment(startTime).format("YYYY/MM/DD")} ${moment(
                data.startTime
              ).format("HH:mm")}`
            ).unix() * 1000,
          endTime:
            moment(
              `${moment(endTime).format("YYYY/MM/DD")} ${moment(
                data.endTime
              ).format("HH:mm")}`
            ).unix() * 1000,
          day: day,
          durationType: type,
        };
      } else {
        newData = {
          ...data,
          day: day,
          durationType: type,
        };
      }
    } else {
      day = date;
      newCourseEntity.schedules = newCourseEntity.schedules.filter(
        (entity) => entity.uuid !== data.uuid
      );
      newData = {
        ...data,
        day: Number(day),
        durationType: type,
      };
    }
    newCourseEntity.schedules.push(newData);
    //console.log(newCourseEntity);
    this.props.setSchedule(newCourseEntity);
  };
  setCurrentDuration = (currentDuration, mode) => {
    if (currentDuration === null) {
      return;
    }
    let data = [null];
    const { st, ed } = currentDuration;
    if (mode === "date") {
      let stDay = new Date(Number(st)).getDay();
      if (stDay === 0) {
        stDay += 7;
      }
      let left = 7 - stDay + 1;
      for (let i = 1; i < stDay; i++) {
        data.push(null);
      }
      let idx = st;
      while (left > 0) {
        if (idx < Number(ed)) data.push(idx);
        else {
          if (new Date(idx).getDate() === new Date(ed).getDate())
            data.push(idx);
          else {
            data.push(null);
          }
        }
        idx += 24 * 60 * 60 * 1000;
        left--;
      }
    } else {
      for (let i = 0; i < 7; i++) {
        const day = st + i;
        if (day > ed) {
          data.push(null);
        } else {
          data.push(day);
        }
      }
    }
    this.setState({
      currentDuration: data,
      headerData: data,
      headerMode: mode,
    });
  };
  setCourseEntites = (courseEntities) => {
    this.setState({
      courseEntities: courseEntities,
    });
  };
  getTableHeader = () => {
    return this.state.headerData.map((item) => {
      return (
        <TableHeader time={item} mode={this.state.headerMode}></TableHeader>
      );
    });
  };
  /* 获取三个时段课程分别渲染 */
  getMorningClass = () => {
    const res = [null];
    for (let i = 1; i <= 7; i++) {
      if (!this.state.headerData[i]) res.push("invalid");
      else {
        const courses = [];
        const date = this.state.headerData[i];
        this.state.courseEntities.forEach((courseEntity) => {
          if (courseEntity.schedules.length !== 0) {
            courseEntity.schedules.forEach((course) => {
              course.name = courseEntity.name;
              if (this.state.headerMode === "date") {
                if (
                  new Date(date).getDate() ===
                    new Date(course.startTime).getDate() &&
                  course.durationType === "morning"
                ) {
                  courses.push(course);
                }
              } else {
                if (
                  course.day + "" === date + "" &&
                  course.durationType === "morning"
                ) {
                  courses.push(course);
                }
              }
            });
          }
        });
        res.push(courses);
      }
    }
    return res.map((item, index) => {
      if (item === null) {
        return (
          <BoundaryContainer
            text="上午"
            startTime="8:30"
            endTime="12:00"
          ></BoundaryContainer>
        );
      } else if (item === "invalid") {
        return <ClassContainer key={index} data={null}></ClassContainer>;
      } else {
        const id = `morning-${this.state.headerData[index]}`;
        return (
          <ClassContainer
            id={id}
            key={index}
            data={item}
            type="morning"
            addCourse={this.addCourse}
            deleteCourse={this.deleteCourse}
            updateCourse={this.updateCourse}
          ></ClassContainer>
        );
      }
    });
  };
  getNoonClass = () => {
    const res = [null];
    for (let i = 1; i <= 7; i++) {
      if (!this.state.headerData[i]) res.push("invalid");
      else {
        const courses = [];
        const date = this.state.headerData[i];
        this.state.courseEntities.forEach((courseEntity) => {
          if (courseEntity.schedules.length !== 0) {
            courseEntity.schedules.forEach((course) => {
              course.name = courseEntity.name;
              if (this.state.headerMode === "date") {
                if (
                  new Date(date).getDate() ===
                    new Date(course.startTime).getDate() &&
                  course.durationType === "noon"
                ) {
                  courses.push(course);
                }
              } else {
                if (
                  course.day + "" === date + "" &&
                  course.durationType === "noon"
                ) {
                  courses.push(course);
                }
              }
            });
          }
        });
        res.push(courses);
      }
    }
    return res.map((item, index) => {
      if (item === null) {
        return (
          <BoundaryContainer
            text="中午"
            startTime="12:00"
            endTime="14:30"
          ></BoundaryContainer>
        );
      } else if (item === "invalid") {
        return <ClassContainer key={index} data={null}></ClassContainer>;
      } else {
        const id = `noon-${this.state.headerData[index]}`;
        return (
          <ClassContainer
            key={id}
            id={id}
            data={item}
            type="noon"
            addCourse={this.addCourse}
            deleteCourse={this.deleteCourse}
            updateCourse={this.updateCourse}
          ></ClassContainer>
        );
      }
    });
  };
  getAfterNoonClass = () => {
    const res = [null];
    for (let i = 1; i <= 7; i++) {
      if (!this.state.headerData[i]) res.push("invalid");
      else {
        const courses = [];
        const date = this.state.headerData[i];
        this.state.courseEntities.forEach((courseEntity) => {
          if (courseEntity.schedules.length !== 0) {
            courseEntity.schedules.forEach((course) => {
              course.name = courseEntity.name;
              if (this.state.headerMode === "date") {
                if (
                  new Date(date).getDate() ===
                    new Date(course.startTime).getDate() &&
                  course.durationType === "afternoon"
                ) {
                  courses.push(course);
                }
              } else {
                if (
                  course.day + "" === date + "" &&
                  course.durationType === "afternoon"
                ) {
                  courses.push(course);
                }
              }
            });
          }
        });
        res.push(courses);
      }
    }
    return res.map((item, index) => {
      if (item === null) {
        return (
          <BoundaryContainer
            text="下午"
            startTime="14:30"
            endTime="22:00"
            key={index}
          ></BoundaryContainer>
        );
      } else if (item === "invalid") {
        return <ClassContainer key={index} data={null}></ClassContainer>;
      } else {
        const id = `afternoon-${this.state.headerData[index]}`;
        return (
          <ClassContainer
            key={id}
            id={id}
            data={item}
            type="afternoon"
            addCourse={this.addCourse}
            deleteCourse={this.deleteCourse}
            updateCourse={this.updateCourse}
          ></ClassContainer>
        );
      }
    });
  };
  render() {
    return (
      <div>
        <table border="1" className={styles["table"]}>
          <thead>
            <tr>{this.getTableHeader()}</tr>
          </thead>
          <tbody>
            <tr>{this.getMorningClass()}</tr>
            <tr>{this.getNoonClass()}</tr>
            <tr>{this.getAfterNoonClass()}</tr>
          </tbody>
        </table>
      </div>
    );
  }
}
function TableHeader(props) {
  const { time, mode } = props;
  if (!time) {
    return <td style={{ background: "#B2B2B2" }}></td>;
  } else {
    return (
      <td>
        <div className={styles["table-header-container"]}>
          <div className={styles["text-container"]}>
            {mode === "date" ? (
              <>
                <div className={styles["date"]}>
                  {moment(time).format("YYYY/MM/DD")}
                </div>
                <div className={styles["day"]}>{getDay(time)}</div>
              </>
            ) : (
              <div>{`第${time}天`}</div>
            )}
          </div>
        </div>
      </td>
    );
  }
}
function BoundaryContainer(props) {
  const { text, startTime, endTime } = props;
  return (
    <td style={{ background: "#f5f5f5" }}>
      <div className={styles["boundary-container"]}>
        <div className={styles["text-container"]}>
          <div className={styles["text"]}>{text}</div>
          <div className={styles["time"]}>{`${startTime}-${endTime}`}</div>
        </div>
      </div>
    </td>
  );
}
