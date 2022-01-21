<template>
  <v-card>
    <v-card-title>
      <span :class="`text-${bkPoint.model}`">{{ "ファイル選択" }}</span>
      <v-spacer></v-spacer>
    </v-card-title>
    <v-divider></v-divider>
    <v-container block>
      <v-row justify="center">
        <v-col cols="1">
          <v-btn icon @click="moveUpDir"><v-icon>mdi-arrow-up</v-icon></v-btn>
        </v-col>
        <v-col cols="1"
          ><v-btn icon @click="reflesh"
            ><v-icon>mdi-refresh</v-icon></v-btn
          ></v-col
        >
        <v-col cols=""
          ><v-text-field
            v-model="dirpath"
            hide-details
            outlined
            :class="`text-${bkPoint.model}`"
        /></v-col>
      </v-row>
    </v-container>
    <v-divider></v-divider>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="12" style="height: 400px" class="overflow-auto">
            <v-list flat subheader v-if="dirs.length > 0">
              <v-subheader :class="`text-${bkPoint.model}`"
                >フォルダ</v-subheader
              >
              <v-list-item-group v-model="folderId" color="primary">
                <v-list-item
                  v-for="(item, i) in dirs"
                  :key="i"
                  @click="clickDirectory(item.folder)"
                >
                  <v-list-item-icon>
                    <v-icon v-text="item.icon"></v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title
                      v-text="item.name"
                      :class="`text-${bkPoint.model}`"
                    ></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
            <v-divider v-if="dirs.length > 0 && files.length > 0" />
            <v-list flat subheader two-line v-if="files.length > 0">
              <v-list-item-group v-model="fileId">
                <v-subheader :class="`text-${bkPoint.model}`"
                  >ファイル</v-subheader
                >
                <v-list-item
                  v-for="(file, i) in files"
                  :key="i"
                  outlined
                  @click="clickFile(file.path)"
                >
                  <v-list-item-avatar>
                    <v-icon
                      :class="file.color"
                      dark
                      v-text="file.icon"
                    ></v-icon>
                  </v-list-item-avatar>

                  <v-list-item-content>
                    <v-list-item-title
                      v-text="file.name"
                      :class="`text-${bkPoint.model}`"
                    ></v-list-item-title>
                    <v-list-item-subtitle
                      v-text="file.path"
                      :class="`text-${bkPoint.model}`"
                    ></v-list-item-subtitle>
                  </v-list-item-content>

                  <v-list-item-action>
                    <v-btn icon @click="getFile(file.path)">
                      <v-icon color="grey lighten-1">mdi-information</v-icon>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions>
      <v-container>
        <v-row>
          <v-col cols="4">
            <v-subheader :class="`text-${bkPoint.model}`"
              >ファイル名</v-subheader
            >
          </v-col>
          <v-col>
            <v-text-field
              v-model="selectedPath"
              :class="`text-${bkPoint.model}`"
              hide-details
              outlined
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row class="justify-end">
          <v-btn
            outlined
            color="blue darken-1"
            text
            @click="submit"
            :class="`text-${bkPoint.model}`"
          >
            {{ dialogYesText }}
          </v-btn>
          <v-btn
            outlined
            color="blue darken-1"
            text
            @click="cancel"
            :class="`text-${bkPoint.model}`"
          >
            {{ dialogNoText }}
          </v-btn>
        </v-row>
      </v-container>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "DialogCardFile",
  props: ["filepath"],
  data() {
    return {
      isNew: false,
      columns: [],
      defaultDir: "付属図書",
      selectDir: "付属図書",
      selectedPath: "",
      dialogYesText: "選択",
      dialogNoText: "キャンセル",
      // url: "http://harima-isk:50001",
      dirs: [],
      files: [],

      file: [],
      returnData: {
        filepath: this.filepath,
      },
      fileId: 0,
      folderId: 1,
      items: [
        { text: "Real-Time", icon: "mdi-clock" },
        { text: "Audience", icon: "mdi-account" },
        { text: "Conversions", icon: "mdi-flag" },
      ],
    };
  },
  computed: {
    url() {
      return this.$store.getters[`backend/url`];
    },
    bkPoint() {
      // $vuetify.breakpointでブレークポイントを取得
      const bkPt = this.$vuetify.breakpoint;
      const point = {
        name: bkPt.name,
        minHeight: 200,
        titleModel: "",
        model: "h6",
        btnWidth: 350,
        btnHeight: 50,
      };
      switch (bkPt.name) {
        case "xl":
          point.minHeight = 200;
          point.titleModel = "h3";
          point.model = "h5";
          point.btnWidth = 600;
          point.btnHeight = 150;
          break;
        case "lg":
          point.minHeight = 200;
          point.titleModel = "h4";
          point.model = "h5";
          point.btnWidth = 500;
          point.btnHeight = 100;
          break;
        case "md":
          point.minHeight = 200;
          point.titleModel = "h6";
          point.model = "subtitle-1";
          point.btnWidth = 325;
          point.btnHeight = 50;
          break;
        case "sm":
          point.minHeight = 200;
          point.titleModel = "subtitle-2";
          point.model = "body-1";
          point.btnWidth = 275;
          point.btnHeight = 40;
          break;
        case "xs":
          point.minHeight = 200;
          point.titleModel = "body-2";
          point.model = "button";
          point.btnWidth = 250;
          point.btnHeight = 30;
          break;
        default:
          break;
      }
      return point;
    },
  },
  methods: {
    reflesh() {
      const dir = Object.assign(this.selectDir);
      this.getFilePath(dir);
    },
    clickDirectory(dir) {
      this.selectDir = Object.assign(dir);
      this.getFilePath(dir);
    },
    clickFile(file) {
      this.selectedPath = Object.assign(file);
    },
    submit() {
      this.$emit("update:param", this.selectedPath);
      this.$emit("clickCancel");
    },
    cancel() {
      this.$emit("clickCancel");
    },
    moveUpDir() {
      console.log(this.selectDir, this.defaultDir);
      if (this.selectDir == this.defaultDir) return;
      const dir = this.selectDir
        .split("/")
        .reverse()
        .slice(1)
        .reverse()
        .join("/");
      this.getFilePath(dir);
    },
    async getFile(filepath) {
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
    },
    getFilePath(dir) {
      const url = `${this.url}/upload?path=${dir}/*`;
      this.dirpath = Object.assign(dir);
      // ファイルをアップロードします。
      this.axios
        .get(url)
        .then((res) => {
          // 成功した場合
          this.dirs = res.data.dirs;
          this.files = res.data.files;
        })
        .catch((e) => {
          // エラーの場合
          console.log(e);
        });
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
  },
  created() {
    this.getFilePath(this.defaultDir);
  },
};
</script>
