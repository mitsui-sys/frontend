<template>
  <v-container>
    <v-row dense>
      <v-col>
        <v-file-input
          v-model="file"
          accept="image/*"
          label="ファイル名"
          show-size
          @change="onChangeFileInput"
        >
        </v-file-input>
      </v-col>
      <v-col>
        <v-btn
          dark
          outlined
          rounded
          color="primary"
          @click="onClickUploadFileBtn"
          >ファイルアップロード</v-btn
        >
      </v-col>

      <v-col>
        <v-btn @click="getCurrentFile">ファイル一覧</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <div
        class="drop_area"
        @dragenter="dragEnter"
        @dragleave="dragLeave"
        @dragover.prevent
        @drop.prevent="dropFile"
        :class="{ enter: isEnter }"
      >
        ファイルアップロード
      </div>
      <div>
        <ul class="flex">
          <li v-for="file in files" :key="file.id" class="flex-col">
            <v-icon>mdi-file</v-icon>{{ file.name }}
          </li>
        </ul>
      </div>
    </v-row>
  </v-container>
</template>

<script>
// ライブラリを使用します。
import FormData from "form-data";

export default {
  name: "FileRegister",
  data: () => ({
    file: null,
    fileData: null,
    isEnter: false,
    files: [],
  }),

  methods: {
    dragEnter() {
      this.isEnter = true;
      console.log("Enter Drop Area");
    },
    dragLeave() {
      this.isEnter = false;
    },
    dragOver() {
      console.log("DragOver");
    },
    dropFile() {
      console.log("Dropped File");
      console.log(event.dataTransfer.files);
      this.files = [...event.dataTransfer.files];
      const url = "http://harima-isk:50001/upload";
      this.files.forEach((file) => {
        let form = new FormData();
        form.append("file", file);
        const option = {
          headers: {
            "Content-type": "multipart/form-data",
          },
        };
        this.axios
          .post(url, form, option)
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            console.log(error);
          });
      });
      this.isEnter = false;
    },
    // ファイル入力が変更された時呼び出されます。
    onChangeFileInput() {
      this.fileData = new Object();
      // ファイルタイプを設定します。
      this.fileData.type = this.file.type;
      // ファイル名を設定します。
      this.fileData.fileName = this.file.name;
      // ファイルデータを非同期で読み込みます。
      this.readFileAsync(this.file)
        .then((result) => {
          // ファイルデータが読み込めた場合
          // ファイルデータを設定します。
          this.fileData.data = result;
        })
        .catch((e) => {
          // エラーの場合
          console.log(`e=${e}`);
        });
    },

    // ファイルアップロードボタンを押下した時に呼び出されます。
    onClickUploadFileBtn() {
      // ファイルアップロード先のURLは置き換えてください。
      const url = "http://harima-isk:50001/file";

      // フォームデータを生成し、設定します。
      let formData = new FormData();

      // 第一引数の"file"はファイルデータの項目名です。
      // ファイルアップロード先の項目名に合わせる必要があります。
      formData.append(
        "uploaded_file",
        new Blob([this.fileData.data], { type: this.fileData.type }),
        this.fileData.fileName
      );

      // Content-typeに"mutlipart/form-data"を設定します。
      const option = {
        headers: {
          "Content-type": "multipart/form-data",
        },
      };

      // ファイルをアップロードします。
      this.axios
        .post(url, formData, option)
        .then((response) => {
          // 成功した場合
          console.log("成功", response);
        })
        .catch((e) => {
          // エラーの場合
          console.log(e);
        });
    },

    // ファイルデータを非同期で読み込みます。
    readFileAsync(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve(reader.result);
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
      });
    },
    getCurrentFile() {
      const url = "http://harima-isk:50001/system/current";
      // ファイルをアップロードします。
      this.axios
        .get(url)
        .then((response) => {
          // 成功した場合
          console.log("ファイル一覧", response);
        })
        .catch((e) => {
          // エラーの場合
          console.log(e);
        });
    },
  },
};
</script>
