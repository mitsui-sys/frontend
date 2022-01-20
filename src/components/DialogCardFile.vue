<template>
  <v-card>
    <v-card-title>
      <span class="text-caption">{{ "ファイル選択" }}</span>
      <v-spacer></v-spacer>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-container>
        <v-row>
          <!--
          <v-col cols="" style="max-height: 400px" class="overflow-auto">
            <v-list dense>
              <v-subheader>Folders</v-subheader>
              <v-list-item-group v-model="folderId" color="primary">
                <v-list-item v-for="(item, i) in dirs" :key="i">
                  <v-list-item-icon>
                    <v-icon v-text="item.icon"></v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title
                      v-text="item.title"
                      class="text-caption"
                    ></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-col>
          -->
          <v-col cols="12" style="max-height: 400px" class="overflow-auto">
            <v-list flat subheader three-line>
              <v-list-item-group
                v-model="fileId"
                active-class=""
                @change="selectFile"
              >
                <v-subheader inset>Files</v-subheader>
                <v-list-item v-for="(file, i) in files" :key="i" outlined>
                  <template v-slot:default="{ active }">
                    <v-list-item-action>
                      <v-checkbox :input-value="active"></v-checkbox>
                    </v-list-item-action>

                    <v-list-item-avatar>
                      <v-icon
                        :class="file.color"
                        dark
                        v-text="file.icon"
                      ></v-icon>
                    </v-list-item-avatar>

                    <v-list-item-content>
                      <v-list-item-title
                        v-text="file.title"
                        class="text-caption"
                      ></v-list-item-title>
                      <v-list-item-subtitle
                        v-text="file.path"
                        class="text-caption"
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
      </v-container>
    </v-card-text>

    <v-card-actions>
      <v-container>
        <v-row>
          <v-divider></v-divider>
        </v-row>
        <v-row>
          <v-col cols="3">
            <v-subheader class="text-caption">ファイル名</v-subheader>
          </v-col>
          <v-col>
            <v-text-field
              v-model="selectedPath"
              class="text-caption mx-5"
              hide-details
              outlined
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row class="justify-end">
          <v-btn outlined color="blue darken-1" text @click="submit">
            {{ dialogYesText }}
          </v-btn>
          <v-btn outlined color="blue darken-1" text @click="cancel">
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
      selectedPath: "",
      dialogYesText: "選択",
      dialogNoText: "キャンセル",
      url: "http://harima-isk:50001",
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
  computed: {},
  methods: {
    selectFile() {
      const id = this.fileId;
      this.selectedPath = this.files[id].path;
    },
    submit() {
      const id = this.fileId;
      if (id == undefined || id == null) {
        alert("選択されていません");
        return;
      }
      this.returnData.filepath = Object.assign(this.files[id].path);
      this.$emit("update:param", this.returnData.filepath);
      this.$emit("clickCancel");
    },
    cancel() {
      this.$emit("clickCancel");
    },
    getCurrentFile() {
      const url = `${this.url}/upload`;
      // ファイルをアップロードします。
      this.axios
        .get(url)
        .then((res) => {
          // 成功した場合
          console.log("ファイル一覧", res.data);
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
    this.getCurrentFile();
  },
};
</script>
