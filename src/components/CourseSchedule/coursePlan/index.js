import React from "react";
import { Card, Tag, Icon, Button, message } from "antd";
import { TimeHeader } from "../timeHeader";
import { CourseTable } from "../courseTable";
import styles from "./index.less";
import PropType from "prop-types";
import { Drag, Drop } from "dnd.js";
export class CoursePlan extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      planName: "",
      projectId: null,
      startTime: null,
      endTime: null,
      courseEntities: [],
      days: 0,
      planInfo: null,
    };
  }
  componentDidMount() {
    this.init(this.props);
  }
  componentWillReceiveProps(props) {
    setImmediate(() => this.init(props));
    //this.init(props);
  }

  /* 初始化方案信息，将方案信息托管到state上 */
  init = (props) => {
    const { planInfo } = props;
    if (planInfo) {
      this.setState({
        ...planInfo,
        planInfo: { ...planInfo },
      });
      setImmediate(() => {
        if (this.state.startTime) {
          this.timeHeader.getDurtaions(
            Number(this.state.startTime),
            Number(this.state.endTime),
            this.state.days,
            "date"
          );
        } else {
          this.timeHeader.getDurtaions(null, null, this.state.days, "day");
        }
        this.courseTable.setCourseEntites(this.state.courseEntities);
      });
    }
  };
  setCourseSchedule = (data) => {
    const newCourseEntites = [...this.state.courseEntities];
    for (let i = 0; i < newCourseEntites.length; i++) {
      if (newCourseEntites[i].id === data.id) {
        newCourseEntites[i] = data;
      }
    }
    this.props.update(newCourseEntites);
    // this.setState({
    //   courseEntities: newCourseEntites,
    // });
    // setImmediate(() => {
    //   this.courseTable.setCourseEntites(newCourseEntites);
    // });
  };
  setCurrentDuration = (data, mode) => {
    this.courseTable.setCurrentDuration(data, mode);
  };
  render() {
    const {
      planName,
      courseEntities,
      status,
      planInfo,
      startTime,
    } = this.state;
    return (
      <div className={styles["plan-container"]}>
        <Card>
          {this.state.planInfo === null ? (
            <div>暂无数据</div>
          ) : (
            <>
              <div className={styles["plan-header"]}>
                <h2 className={styles["plan-name"]}>{`教学方案:${
                  planName || ""
                }`}</h2>
                <TimeHeader
                  ref={(el) => (this.timeHeader = el)}
                  setDuration={this.setCurrentDuration}
                ></TimeHeader>
              </div>

              <div className={styles["content-container"]}>
                {/* <div className={styles["course-list"]}>
                  {courseEntities.map((course, index) => {
                    if (course.times === course.schedules.length) {
                      return null;
                    }
                    const id = `${course.name}-${index}`;
                    return (
                      <CourseEntity
                        entity={course}
                        key={index}
                        id={id}
                      ></CourseEntity>
                    );
                  })}
                  {status === "edit" ? null : (
                    <a>
                      <div
                        className={styles["add-class"]}
                        onClick={() => this.props.addCourse()}
                      >
                        <Icon type="plus" className={styles["icon"]}></Icon>
                        新增课程
                      </div>
                    </a>
                  )}
                </div> */}

                <CourseTable
                  ref={(el) => (this.courseTable = el)}
                  setSchedule={this.setCourseSchedule}
                  addCourse={(template) => this.props.addCourse(template)}
                ></CourseTable>
              </div>
            </>
          )}
        </Card>
      </div>
    );
  }
}
CoursePlan.propType = {
  planInfo: PropType.object,
  update: PropType.func,
  addCourse: PropType.func,
};
CoursePlan.defaultProps = {
  planInfo: null,
  addCourse: () => {},
  update: (data) => {
    console.log(data);
  },
};
function CourseEntity(props) {
  const { entity, id } = props;
  return (
    <Tag
      color={entity.schedules.length === entity.times ? "gray" : "blue"}
      className={styles["course-entity"]}
      id={id}
      style={{
        whiteSpace: "pre-wrap",
        overflow: "hidden",
        display: "block",
        wordWrap: "break-word",
      }}
    >
      <span className={styles["course-name"]}>{entity.name}</span>
      <span className={styles["course-name"]}>{`(${moment(
        entity.startTime
      ).format("YYYY/MM/DD")}-${moment(entity.endTime).format(
        "YYYY/MM/DD"
      )})`}</span>
      <span className={styles["course-name"]}>{`共${entity.times}次课`}</span>
      <span
        className={styles["course-name"]}
      >{`已安排${entity.schedules.length}次课`}</span>
    </Tag>
  );
}
