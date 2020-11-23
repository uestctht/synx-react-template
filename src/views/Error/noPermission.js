import React from "react";
import { Result, Button } from "antd";
export class NoPermission extends React.PureComponent {
  render() {
    return (
      <Result
        status="403"
        title="403"
        subTitle="抱歉，你没有权限访问页面"
        extra={<Button type="primary">返回首页</Button>}
      />
    );
  }
}
