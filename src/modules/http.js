import axios from "axios";
import Moment from "moment";

const http = axios.create({
  baseURL: "http://harima-isk:50001",
  // baseURL: "http://localhost:50001",
  headers: {
    "Content-type": "application/json",
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

const registerLog = (host, name, doc, action, content) => {
  const url = `${host}/system/log/register`;
  const now = Moment().format("YYYY/MM/DD HH:mm:ss");
  const json = JSON.stringify(content);
  const cond = {
    data: {
      user_name: name,
      document: doc,
      rireki: action,
      rireki_content: json,
      created: now,
    },
  };
  const option = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  axios
    .post(url, cond, option)
    .then((response) => {
      console.log(response);
      console.log("ログ登録", cond);
    })
    .catch((error) => {
      console.log(error);
    });
};

const getReplace = async (host) => {
  const url = `${host}/system/replace`;
  let res = await axios
    .get(url)
    .then((response) => {
      console.log("置換", response.data);
      return response.data;
    })
    .catch((error) => {
      console.log(error);
      return null;
    });
  return res;
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
