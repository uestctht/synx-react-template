import React from "react";
import { Select } from "antd";
import { storiesOf } from "@storybook/react";
import { CourseTable } from "../src/components/CourseSchedule/courseTable";
import { TimeHeader } from "../src/components/CourseSchedule/timeHeader";
import { CoursePlan } from "../src/components/CourseSchedule/coursePlan";
import { planInfo } from "../src/components/CourseSchedule/coursePlan/test";
import AutoComplete from "../src/components/AutoComplete";
import "antd/dist/antd.css";

storiesOf("组件", module)
  .add("课表组件", () => <CourseTable></CourseTable>)
  .add("时间头", () => (
    <TimeHeader
      startDatetime={1598944357000}
      endDatetime={1601449957000}
    ></TimeHeader>
  ))
  .add("课程方案配置", () => <CoursePlan planInfo={planInfo}></CoursePlan>)
  .add("文件上传", () => (
    <FileUpload
      url={"http://202.115.22.95/rocop/roc/file/upload"}
      config={{
        id: "258308755626795726",
        key: "file_rocop_eims_enterprise_acceptance_letter",
      }}
      getUriList={getUriList.bind(this)}
    ></FileUpload>
  ));
