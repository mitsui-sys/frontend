import axios from "axios";
import Moment from "moment";

const http = axios.create({
  baseURL: "http://LG2201001:50001",
  // baseURL: "http://harima-isk:50001",
  headers: {
    "Content-type": "application/json",
    // "X-Requested-With": "XMLHttpRequest",
  },
});

const getFile = async (filepath) => {
  try {
    const requestBody = { path: filepath };
    // ファイルを取得するための POST リクエスト。レスポンスタイプを指定する
    const response = await this.axios.post("/api/download", requestBody, {
      // responseType: "blob",
      responseType: "blob",
    });
    console.log("Success", response);
    // 取得したファイルをダウンロードできるようにする
    const blob = new Blob([response.data]);
    const fileURL = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = fileURL;
    const filename = filepath.split("/").reverse()[0];
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
  } catch (error) {
    // リクエスト時に Blob 形式を指定しているので、レスポンスの Blob を変換して内容を取り出す
    try {
      const blob = error.response.data;
      const text = await blob.text();
      const json = JSON.parse(text);
      console.error("Error Object : ", json);
    } catch (innerError) {
      console.error("Inner Error : ", innerError);
      console.error("Error : ", error);
    }
  }
};

const registerLog = (name, doc, action, content) => {
  const url = `/system/log/register`;
  const now = Moment().format("YYYY/MM/DD HH:mm:ss");
  const json = JSON.stringify(content);
  const data = {
    data: {
      user_name: name,
      document: doc,
      rireki: action,
      rireki_content: json,
      created: now,
    },
  };
  create(url, data);
};

const getReplace = async (url) => {
  url = `/system/replace`;
  return http.get(url);
};

const getAll = (url) => {
  return http.get(url);
};

const get = (url) => {
  return http.get(url);
};

const create = (url, data) => {
  return http.post(url, data);
};

const update = (url, data) => {
  return http.put(url, data);
};

const remove = (url) => {
  return http.delete(url);
};

const removeAll = (url) => {
  return http.delete(url);
};

const findByTitle = (title) => {
  return http.get(`/tutorials?title=${title}`);
};

export default {
  getAll,
  get,
  create,
  update,
  remove,
  removeAll,
  findByTitle,
  getFile,
  registerLog,
  getReplace,
};
