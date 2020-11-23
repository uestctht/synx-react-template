import React, { useState, useEffect, useRef } from "react";
import { Radio, Input, Button } from "antd";
import styles from "./index.less"

export default function CustomDescription(props) {
  const [pass, setPass] = useState(true);
  const [comment, setComment] = useState("");
  const { TextArea } = Input;

  function handleSubmit() {
    const { submit } = props;
    submit(pass, comment)
  }

  function onChange(event) {
    setPass(event.target.value)
  }

  function onInputChange(event) {
    setComment(event.target.value)
  }

  return (
    <div>
      <p style={{ fontWeight: 500 }}>审核结果</p>
      <Radio.Group
        className={styles["radio"]}
        value={pass}
        onChange={onChange}
        defaultValue={true}>
        <Radio value={true}>通过</Radio>
        <Radio value={false}>拒绝</Radio>
      </Radio.Group>
      {!pass && <TextArea
        rows={3}
        placeholder="我的附言"
        value={comment}
        onChange={onInputChange} />}
      <div className={styles["footer"]}>
        <Button type="primary" onClick={handleSubmit}>
          提交
        </Button>
      </div>
    </div>
  );
}