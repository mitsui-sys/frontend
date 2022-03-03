import axios from "axios";

const http = axios.create({
  baseURL: "http://LG2201001:50001",
  // baseURL: "http://harima-isk:50001",
  headers: {
    "Content-type": "application/json",
    // "X-Requested-With": "XMLHttpRequest",
  },
});

const http_test = axios.create({
  baseURL: "http://localhost:50001",
  // baseURL: "http://harima-isk:50001",
  headers: {
    "Content-type": "application/json",
    // "X-Requested-With": "XMLHttpRequest",
  },
});

const get_test = async (url) => {
  return await http_test(url);
};

const getFile = async (url, filepath) => {
  try {
    const requestBody = { path: filepath };
    // ファイルを取得するための POST リクエスト。レスポンスタイプを指定する
    const response = await http.post(url, requestBody, {
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
  const json = JSON.stringify(content);
  const data = {
    data: {
      user_name: name,
      document: doc,
      rireki: action,
      rireki_content: json,
    },
  };
  create(url, data);
};

const getReplace = async () => {
  const url = `/system/replace`;
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

// const getFile1 = (url, data) => {
//   const http_file = axios.create({
//     baseURL: "http://LG2201001:50001",
//     // baseURL: "http://harima-isk:50001",
//   });
//   return http_file.post(url, data, {
//     // responseType: "blob",
//     responseType: "blob",
//   });
// };

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
  get_test,
};
