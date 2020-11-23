import { storiesOf } from "@storybook/react";
import React from "react";
import { readExcel, selectFile } from "./index.js";
import { Button } from "antd";
storiesOf("组件", module).add("导入excel", () => (
  <Button onClick={importExcel}>导入excel</Button>
));
function importExcel() {
  selectFile((files) =>
    readExcel(files[0], ["name", "age", "height"], [], true, (res) =>
      console.log(res)
    )
  );
}
