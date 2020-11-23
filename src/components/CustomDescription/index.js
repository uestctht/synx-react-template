import React, { useState, useEffect, useRef } from "react";
import { Descriptions, Modal, Radio, Input, Divider, Button } from "antd";
import styles from "./index.less";

export default function CustomDescription(props) {
  const [pass, setPass] = useState(true);
  const [comment, setComment] = useState("");
  const { TextArea } = Input;

  function handleSubmit() {
    const { submit } = props;
    submit(pass, comment)
  }

  return (
    <Modal {...props} className={styles["container"]} width="800px">
      <Descriptions {...props} title={null}>
        {props.data && props.data.map(item => (
          <Descriptions.Item
            label={item.label}
            span={item.span}>
            {item.render()}
          </Descriptions.Item>
        ))}
      </Descriptions>
      <Divider className={styles["divider"]}></Divider>
      {props.action}
    </Modal>
  );
}