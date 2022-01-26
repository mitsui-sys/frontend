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

export default {
  getFile,
};
