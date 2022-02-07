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
          <v-btn icon @click="moveUpDir" :disabled="download"
            ><v-icon>mdi-arrow-up</v-icon></v-btn
          >
        </v-col>
        <v-col cols="1"
          ><v-btn icon @click="reflesh" :disabled="download"
            ><v-icon>mdi-refresh</v-icon></v-btn
          ></v-col
        >
        <v-col cols=""
          ><v-text-field
            v-model="dirpath"
            hide-details
            outlined
            disabled
            :class="`text-${bkPoint.model}`"
        /></v-col>
      </v-row>
    </v-container>
    <v-divider></v-divider>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="12" style="height: 400px" class="overflow-auto">
            <v-list
              id="folderlist"
              flat
              subheader
              v-if="dirs.length > 0 && displayType != 1"
            >
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
            <v-list
              id="filelist"
              flat
              subheader
              two-line
              v-if="files.length > 0 && displayType != 2"
            >
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
        <v-row v-if="!download">
          <v-col cols="2">
            <v-subheader :class="`text-${bkPoint.model}`">{{
              selectedHeader
            }}</v-subheader>
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
            v-if="!download"
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
import http from "@/modules/http";
export default {
  name: "DialogCardFile",
  props: ["filepath", "displayType", "download", "visible", "bkPoint"],
  data() {
    return {
      isNew: false,
      columns: [],
      defaultDir: "付属図書",
      selectDir: "付属図書",
      selectedHeader: "選択",
      selectedPath: "",
      dialogYesText: "選択",
      dialogNoText: "キャンセル",
      dirpath: "",
      dirs: [],
      currentDirs: [],
      files: [],
      file: [],
      fileId: 0,
      folderId: 1,
    };
  },
  watch: {
    visible() {
      const folderpath = `${this.defaultDir}\\${this.filepath}`;
      this.getFilePath(folderpath);
    },
  },
  computed: {
    url() {
      return this.$store.getters[`backend/url`];
    },
  },
  methods: {
    replaceSlash(path) {
      return path.replaceAll("/", "\\");
    },
    reflesh() {
      const dir = Object.assign(this.selectDir);
      this.getFilePath(dir);
    },
    clickDirectory(dir) {
      //パス名
      const path = this.replaceSlash(dir);
      this.getFilePath(path);
      this.selectDir = path;
      //選択パス名
      const path1 = path.split("\\").slice(1).join("\\");
      this.selectedPath = path1;
    },
    clickFile(file) {
      this.selectedPath = Object.assign(file);
      if (this.download) {
        this.getFile(file);
      }
    },
    submit() {
      const path = Object.assign(this.selectedPath);
      console.log(path);
      this.$emit("input", path);
      this.$emit("clickCancel");
    },
    cancel() {
      this.$emit("clickCancel");
    },
    moveUpDir() {
      if (this.selectDir == this.defaultDir) {
        alert("ルートディレクトリです");
        return;
      }
      const dir = this.selectDir
        .split("\\")
        .reverse()
        .slice(1)
        .reverse()
        .join("\\");
      this.selectDir = dir;
      const path1 = dir.split("\\").slice(1).join("\\");
      this.selectedPath = path1;
      this.getFilePath(dir);
    },
    getFile(filepath) {
      const url = `/download`;
      http.getFile(url, filepath);
    },
    async getFilePath(dir) {
      const url = `/upload?path=${dir}\\*`;
      const res = await http.get(url);
      if (res.status == 200) {
        // 成功した場合
        const dirs = res.data.dirs;
        const files = res.data.files;
        console.log(dirs, files, dir);
        this.files = files;
        this.dirs = dirs;
        this.dirpath = Object.assign(dir);
        this.selectDir = Object.assign(dir);
        // this.snackbarText = "新規登録 成功";
        // this.snackbar = true;
      } else {
        // エラーの場合
        console.log(res);
        // this.snackbarText = "データ取得 失敗";
        // this.snackbar = true;
      }
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
    async onClickUploadFileBtn() {
      // ファイルアップロード先のURLは置き換えてください。
      const url = `/upload`;

      // フォームデータを生成し、設定します。
      let formData = new FormData();

      // 第一引数の"file"はファイルデータの項目名です。
      // ファイルアップロード先の項目名に合わせる必要があります。
      formData.append(
        "uploaded_file",
        new Blob([this.fileData.data], { type: this.fileData.type }),
        this.fileData.fileName
      );

      // // Content-typeに"mutlipart/form-data"を設定します。
      // const option = {
      //   headers: {
      //     "Content-type": "multipart/form-data",
      //   },
      // };

      // // ファイルをアップロードします。
      // this.axios
      //   .post(url, formData, option)
      //   .then((response) => {
      //     // 成功した場合
      //     console.log("成功", response);
      //   })
      //   .catch((e) => {
      //     // エラーの場合
      //     console.log(e);
      //   });
      const res = await http.create(url);
      if (res.status == 200) {
        //     // 成功した場合
        //     console.log("成功", response);
        // this.snackbarText = "新規登録 成功";
        // this.snackbar = true;
      } else {
        // エラーの場合
        console.log(res);
        // this.snackbarText = "データ取得 失敗";
        // this.snackbar = true;
      }
    },
  },
  mounted() {
    const folderpath = `${this.defaultDir}\\${this.filepath}`;
    this.getFilePath(folderpath);
  },
  created() {},
};
</script>
