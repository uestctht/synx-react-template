import { message } from "antd";
import XLSX from "xlsx";
const MIME = {
  image: "image/*",
  audio: "audio/*",
  pdf: "application/pdf",
  // 'ppt': 'application/vnd.ms-powerpoint',
  ppt:
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  pptx:
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  word:
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  docx:
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  doc: "application/msword",
  excel: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  xls: "application/vnd.ms-excel",
  text: "text/plain",
  txt: "text/plain",
  zip: "aplication/zip",
};
/* 获取Excel数据 */
export function readExcel(
  file,
  fileKeys = [],
  validation = [],
  openDulicate = true,
  callBack = () => {}
) {
  let f = file;
  if (!(f instanceof File)) return;
  let reader = new FileReader();
  reader.onload = (event) => {
    try {
      let data = event.target.result;
      let workbook = XLSX.read(data, { type: "array" });
      let keys = Object.keys(workbook.Sheets);
      if (Object.keys(workbook.Sheets).length < 1) {
        throw Error("模板格式错误");
      }
      let sheet = workbook.Sheets[keys[0]];
      let ref = sheet["!ref"];
      let group = /^[A-Z]+(\d+):[A-Z]+(\d+)$/.exec(ref);
      if (!group) {
        throw Error("模板格式错误");
      }
      let s = Number(group[1]);
      let e = Number(group[2]);

      let atters = ["A", "B", "C", "D", "E", "F"];
      let success = [];
      let fails = [];
      let duplicates = [];
      for (let i = s + 1; i <= e; ++i) {
        let obj = {};
        fileKeys.forEach((key, index) => {
          obj[key] = sheet[atters[index] + i + ""]
            ? sheet[atters[index] + i + ""].w.trim()
            : "";
        });
        let checkRes = excelDataValidate(obj, validation, success);
        if (!checkRes.result) {
          fails.push({
            ...obj,
            message: checkRes.message,
          });
        } else if (openDulicate && checkDulicate(success, obj)) {
          duplicates.push(obj);
        } else {
          success.push(obj);
        }
      }
      callBack({ success, fails, duplicates });
    } catch (e) {
      message.error("给定的文件格式错误，或浏览器版本不支持");
    }
  };
  reader.readAsArrayBuffer(f);
}
/* excel读取数据校验 */
function excelDataValidate(data, validation = [], success) {
  let res = {
    result: true,
    message: "",
  };
  if (Array.isArray(validation)) {
    for (let i = 0; i < validation.length; i++) {
      let { key, fn, message } = validation[i];
      if (data[key]) {
        let tmpRes = fn(data[key], success);
        if (!tmpRes) {
          res.result = false;
          res.message = message;
          break;
        }
      }
    }
  }
  return res;
}
/* excel数据重复性校验 */
function checkDulicate(success, obj) {
  return success.find((item) => {
    let keys = Object.keys(obj);
    let res = true;
    keys.forEach((key) => (res &= item[key] === obj[key]));
    return res;
  });
}
/* 选择文件函数 */
export function selectFile(callBack) {
  let el = document.createElement("input");
  el.setAttribute("id", "__FILE_INPUT__");
  el.setAttribute("type", "file");
  el.setAttribute("style", "display:none");
  document.body.appendChild(el);
  el.addEventListener("change", () => {
    callBack(el.files);
  });
  el.click();
}
