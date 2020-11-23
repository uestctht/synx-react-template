import React, { useEffect, useState } from "react";
import styles from "./index.less";
import { Drop, Drag } from "dnd.js";
import moment from "moment";
import { Tag, Icon, Popconfirm, Button } from "antd";
import EditModal from "./editModal";
import { cloneDeep } from "loadsh";
export default function ClassContainer(props) {
  const { id, data, addCourse, deleteCourse, updateCourse, type } = props;
  useEffect(() => {
    if (id) {
      //console.log(id);
      initDropOption(id, type);
    }
  }, [id]);
  if (data === null) {
    return (
      <td style={{ background: "#b2b2b2" }}>
        <div className={styles["class-container"]}>
          <div className={styles["text-container"]}></div>
        </div>
      </td>
    );
  }
  return (
    <td>
      <div className={styles["class-container"]} id={id}>
        <div className={styles["text-container"]}>
          {data.map((item) => (
            <div id={`id-${item.uuid}`} key={item.uuid}>
              <ClassDetail
                course={item}
                deleteCourse={deleteCourse}
                id={`id-${item.uuid}`}
                timeId={id}
                updateCourse={updateCourse}
                type={type}
              ></ClassDetail>
            </div>
          ))}
        </div>
      </div>
      <div style={{ textAlign: "right", margin: "2px" }}>
        <a onClick={() => addCourse(id, type)}>
          <Icon type="plus"></Icon>新增课程安排
        </a>
      </div>
    </td>
  );

  function initDropOption(id, type) {
    new Drop(`#${id}`, {
      name: id,
      onDrop() {},
      onDragEnd(params) {
        if (params.enter === true) {
          if (params.el.attributes.id) {
            updateCourse(params.data, type, id);
          }
        }
      },
    });
  }
}

function ClassDetail(props) {
  const { course, deleteCourse, updateCourse, type, timeId, id } = props;
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    if (id) {
      initDragOptions(course);
    }
  }, [course]);
  return (
    <Tag color="blue" className={styles["class-detail"]}>
      <div className={styles["detail-container"]}>
        <div className={styles["edit"]}>
          <Popconfirm
            title="确认删除?"
            okText="确定"
            cancelText="取消"
            onConfirm={() => {
              deleteCourse(course.uuid, course.entityId);
            }}
          >
            <Icon type="close"></Icon>
          </Popconfirm>
        </div>
        <span className={styles["class-detail-name"]}>{course.name}</span>
        <div>
          <Icon type="clock-circle" />
          {`${moment(Number(course.startTime)).format("HH:mm")}-${moment(
            Number(course.endTime)
          ).format("HH:mm")}`}
        </div>
        <div>
          <Icon type="environment" />
          {course.location}
        </div>
        <div className={styles["edit"]} onClick={() => setShowModal(true)}>
          <Icon type="edit"></Icon>
        </div>
      </div>
      <EditModal
        visible={showModal}
        onCancel={() => setShowModal(false)}
        startTime={course.startTime}
        endTime={course.endTime}
        place={course.location}
        submit={handleSubmit}
        type={type}
      ></EditModal>
    </Tag>
  );
  function initDragOptions(data) {
    console.log(666, data);
    new Drag(`#${id}`, {
      data: data,
      onDragStart: function (params) {
        console.log("监听到拖动开始");
      },
    });
  }
  function handleSubmit(data) {
    const startTime =
      moment(
        `${moment(course.startTime).format("YYYY/MM/DD")} ${moment(
          data.startTime
        ).format("HH:mm")}`
      ).unix() * 1000;
    const endTime =
      moment(
        `${moment(course.endTime).format("YYYY/MM/DD")} ${moment(
          data.endTime
        ).format("HH:mm")}`
      ).unix() * 1000;
    setShowModal(false);
    const newCourse = cloneDeep(course);
    newCourse.startTime = startTime;
    newCourse.endTime = endTime;
    newCourse.location = data.location;
    updateCourse(newCourse, type, timeId);
  }
}
