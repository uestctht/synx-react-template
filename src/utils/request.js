import axios from "axios";
import { setLoginStatus } from "../redux/action";
import { message } from "antd";
axios.defaults.timeout = 10000;
axios.defaults.withCredentials = true;

axios.interceptors.request.use(
  (config) => {
    if (window.sessionStorage.getItem("loginInfo")) {
      let data = window.sessionStorage.getItem("loginInfo");
      data = JSON.parse(data);
      // 如果没有本地token直接返回
      if (!data.Authorization) {
        return config;
      }
      config.headers["Authorization"] = data.Authorization;
    }
    return config;
  },
  (error) => {
    //发送请求错误操作
    console.log("请求失败");
    return Promise.reject(error);
  }
);
axios.interceptors.response.use(
  (response) => {
    //处理登陆过期操作
    if (response.data.status === -1) {
      alert("登陆已过期");
      window.location.href = "#/login";
      return Promise.reject(response);
    }
    return response.data;
  },
  (error) => {
    console.log("请求error", error.message);
    return Promise.reject(error);
  }
);
export function request(api, query, params = {}) {
  return axios.request({
    method: api.method,
    url: api.url,
    params: query,
    data: params,
  });
}
