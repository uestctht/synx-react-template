import React, { useEffect, useState } from "react";
import { Modal, TimePicker, Form, Input, Button } from "antd";
import moment from "moment";
const format = "HH:mm";
export default function EditModal(props) {
  const [startTime, setStartTime] = useState(props.startTime);
  const [endTime, setEndTime] = useState(props.endTime);
  const [location, setLocation] = useState(props.location);
  useEffect(() => {
    setStartTime(props.startTime);
    setEndTime(props.endTime);
    setLocation(props.location);
  }, [props]);
  function handleChangeStartTime(time) {
    setStartTime(time.unix() * 1000);
  }
  function handleChangeEndTime(time) {
    setEndTime(time.unix() * 1000);
  }
  function handleSubmit() {
    const { submit } = props;
    submit({ startTime, endTime, location });
  }

  return (
    <Modal {...props} title="上课时间及地点配置" footer={null}>
      <Form.Item label="开始上课时间">
        <TimePicker
          format={format}
          value={moment(moment(startTime).format(format), format)}
          onChange={handleChangeStartTime}
        ></TimePicker>
      </Form.Item>
      <Form.Item label="结束上课时间">
        <TimePicker
          format={format}
          value={moment(moment(endTime).format(format), format)}
          onChange={handleChangeEndTime}
        ></TimePicker>
      </Form.Item>
      <Form.Item label="上课地点">
        <Input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        ></Input>
      </Form.Item>
      <div style={{ textAlign: "center" }}>
        <Button type="primary" onClick={handleSubmit}>
          确定
        </Button>
      </div>
    </Modal>
  );
}
