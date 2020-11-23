export function getUrlSearch(str) {
  if (str[0] !== "?") {
    return [];
  }
  const searchStr = str.substring(1);
  const items = searchStr.split("&");
  return items.map((item) => {
    let arr = item.split("=");
    if (arr.length === 1) {
      return {
        key: item,
        value: item,
      };
    } else {
      return {
        key: arr[0],
        value: arr[1],
      };
    }
  });
}
export function deepCloneObject(obj) {
  if (typeof obj !== "object") {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.concat();
  } else {
    return JSON.parse(JSON.stringify(obj));
  }
}
