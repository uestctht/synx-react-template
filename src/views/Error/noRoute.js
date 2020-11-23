import React from "react";
import { Result, Button } from "antd";

export class ErrorFind extends React.PureComponent {
  render() {
    return (
      <Result
        status="404"
        title="404"
        subTitle="页面不存在"
        extra={<Button type="primary">返回首页</Button>}
      />
    );
  }
}
