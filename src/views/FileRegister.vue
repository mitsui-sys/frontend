<template>
  <v-container>
    <v-row>
      <v-text-field v-model="filepath" />
      <v-btn @click="dialog = true">選択</v-btn>
      <v-dialog v-model="dialog">
        <DialogCardFile
          :filepath="filepath"
          @clickSubmit="onSubmit"
          @clickCancel="onCancel"
        />
      </v-dialog>
    </v-row>
    <v-row>
      <v-col cols="12" sm="4" md="4">
        <v-file-input
          v-model="file"
          accept="image/*"
          label="ファイル名"
          show-size
          @change="onChangeFileInput"
        >
        </v-file-input>
      </v-col>
      <v-col cols="12" sm="4" md="4">
        <v-btn
          dark
          outlined
          rounded
          color="primary"
          @click="onClickUploadFileBtn"
          >アップロード</v-btn
        >
      </v-col>

      <v-col>
        <v-btn @click="getCurrentDir">フォルダ一覧</v-btn>
        <v-btn @click="getCurrentFile">ファイル一覧</v-btn>
        <v-list subheader three-line>
          <v-subheader inset>Files</v-subheader>
          <v-list-item-group v-model="settings" multiple active-class="">
            <v-list-item v-for="file in files" :key="file.title">
              <template v-slot:default="{ active }">
                <v-list-item-action>
                  <v-checkbox :input-value="active"></v-checkbox>
                </v-list-item-action>

                <v-list-item-avatar>
                  <v-icon :class="file.color" dark v-text="file.icon"></v-icon>
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title v-text="file.title"></v-list-item-title>

                  <v-list-item-subtitle
                    v-text="file.subtitle"
                  ></v-list-item-subtitle>
                  <v-list-item-subtitle
                    v-text="file.path"
                  ></v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-action>
                  <v-btn icon>
                    <v-icon color="grey lighten-1">mdi-information</v-icon>
                  </v-btn>
                </v-list-item-action>
              </template>
            </v-list-item>
          </v-list-item-group>
        </v-list>
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
          <li v-for="file in uploadfiles" :key="file.id" class="flex-col">
            <v-icon>mdi-file</v-icon>{{ file.name }}
          </li>
        </ul>
      </div>
    </v-row>
    <v-row>
      <router-view class="view one"></router-view>
    </v-row>
  </v-container>
</template>

<script>
// ライブラリを使用します。
import FormData from "form-data";
import DialogCardFile from "@/components/Card/CardFile";

export default {
  name: "FileRegister",
  components: { DialogCardFile },
  data: () => ({
    dialog: false,
    filepath: "",
    file: null,
    fileData: null,
    isEnter: false,
    files: [],
    uploadfiles: [],
    settings: [],
    // url: "http://harima-isk:50001",
  }),
  computed: {
    url() {
      return this.$store.getters[`backend/url`];
    },
  },
  methods: {
    onSubmit(params) {
      this.dialog = false;
      this.filepath = params.filepath;
    },
    onCancel() {
      this.dialog = false;
    },
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
      this.uploadfiles = [...event.dataTransfer.files];

      const url = `http://localhost:8000/data/upload`;
      this.uploadfiles.forEach((file) => {
        console.log(file);
        let form = new FormData();
        form.append("uploaded_file", file);
        const option = {
          headers: {
            "Content-type": "multipart/form-data",
          },
        };
        this.axios
          .post(url, form, option)
          .then((response) => {
            console.log("success", response);
            const blob = new Blob([response.data]);
            const fileURL = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = fileURL;
            const filepath = "test.pdf";
            const filename = filepath.split("/").reverse()[0];
            link.setAttribute("download", filename);
            document.body.appendChild(link);
            link.click();
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
      const readFileAsync = (file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            resolve(reader.result);
          };
          reader.onerror = reject;
          reader.readAsArrayBuffer(file);
        });
      };

      // ファイルデータを非同期で読み込みます。
      readFileAsync(this.file)
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
      const url = `${this.url}/upload`;

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
    getCurrentDir() {
      // ファイルアップロード先のURLは置き換えてください。
      const url = `${this.url}/upload/directory`;

      // ファイルをアップロードします。
      this.axios
        .get(url)
        .then((res) => {
          // 成功した場合
          console.log("フォルダ一覧", res.data);
        })
        .catch((e) => {
          // エラーの場合
          console.log(e);
        });
    },
    getCurrentFile() {
      const url = `${this.url}/upload`;
      // ファイルをアップロードします。
      this.axios
        .get(url)
        .then((res) => {
          // 成功した場合
          console.log("ファイル一覧", res.data);
          this.files = res.data.files;
        })
        .catch((e) => {
          // エラーの場合
          console.log(e);
        });
    },
  },
  mounted() {},
};
</script>
