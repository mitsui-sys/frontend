<template>
  <v-dialog v-model="dialog" max-width="700px" scrorable @click:outside="close">
    <v-card>
      <v-card-title>
        <span class="text-h5">{{ "ファイル選択" }}</span>
        <v-spacer></v-spacer>
        <v-switch v-model="isNew" label="新規作成" />
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-container style="max-height: 500px" class="overflow-auto">
          <v-row>
            <template v-if="isNew">
              <v-file-input
                v-model="file"
                label="ファイル名"
                show-size
                counter
                multiple
                @change="onChangeFileInput"
              />
              <v-btn
                dark
                outlined
                rounded
                color="primary"
                @click="onClickUploadFileBtn"
                >アップロード</v-btn
              >
            </template>
            <template v-else>
              <v-list flat subheader three-line>
                <v-list-item-group v-model="settings" active-class="">
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
                        ></v-list-item-title>

                        <v-list-item-subtitle
                          v-text="file.subtitle"
                        ></v-list-item-subtitle>
                        <v-list-item-subtitle
                          v-text="file.path"
                        ></v-list-item-subtitle>
                      </v-list-item-content>

                      <v-list-item-action>
                        <v-btn icon>
                          <v-icon color="grey lighten-1"
                            >mdi-information</v-icon
                          >
                        </v-btn>
                      </v-list-item-action>
                    </template>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </template>
          </v-row>
        </v-container>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn outlined color="blue darken-1" text @click="save">
          {{ dialogYesText }}
        </v-btn>
        <v-btn outlined color="blue darken-1" text @click="close">
          {{ dialogNoText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "FileDialog",
  props: ["path", "dialog"],
  data() {
    return {
      isNew: false,
      columns: [],
      selectedName: "",
      dialogYesText: "選択",
      dialogNoText: "キャンセル",
      url: "http://harima-isk:50001",
      files: [],
      items: [],
      settings: [],
      file: [],
    };
  },
  computed: {},
  methods: {
    save() {
      const id = this.settings;
      if (id == undefined) {
        alert("選択されていません");
        return;
      }
      this.$emit("clickSubmit", this.files[id].path);
      this.$emit("update:dialog", false);
    },
    close() {
      this.$emit("update:dialog", false);
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
