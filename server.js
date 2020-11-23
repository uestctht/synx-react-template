const express = require("express");

const app = express();

app.get("/api/info", (req, res) => {
  res.json({
    info: "测试",
  });
});
app.get("/courseApi/type/list", (req, res) => {
  //console.log(req);
  setTimeout(() => {
    res.json({
      data: [
        { label: "类别一", value: "1" },
        { label: "类别二", value: "2" },
      ],
    });
  }, 500);
});
app.listen("9092");
