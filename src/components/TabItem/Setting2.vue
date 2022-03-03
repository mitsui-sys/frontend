<template>
  <v-card color="#fff">
    <v-toolbar>
      {{ title }}
      <v-spacer />
      <!--
      <v-btn @click="onPassword" :class="`text-${bkPoint.model} mx-2`">
        権限レベル更新
      </v-btn>
      <v-btn @click="onPassword" :class="`text-${bkPoint.model} mx-2`">
        グループ名更新
      </v-btn>
      -->
      <v-btn @click="onPassword" :class="`text-${bkPoint.model} mx-2`">
        パスワード更新
      </v-btn>
      <v-btn @click="open(-1)" :class="`text-${bkPoint.model} mx-2`">
        新規登録
      </v-btn>

      <v-btn
        @click="open(0)"
        v-if="select.length > 0"
        :disabled="!select.length > 0"
        :class="`text-${bkPoint.model} mx-2`"
      >
        閲覧
      </v-btn>
      <v-btn
        @click="open(1)"
        v-if="select.length > 0 && loginData.level >= 1"
        :disabled="!select.length > 0"
        :class="`text-${bkPoint.model} mx-2`"
      >
        編集
      </v-btn>
      <v-btn
        @click="open(2)"
        v-if="select.length > 0 && loginData.level >= 1"
        :disabled="!select.length > 0"
        :class="`text-${bkPoint.model} mx-2`"
      >
        削除
      </v-btn>
    </v-toolbar>
    <v-card-text>
      <MyTable
        :headers="shownHeaders"
        :items="showContents"
        :itemkey="user.itemkey"
        :bkPoint="bkPoint"
        :sortByItem="sortByItem"
        :sortByDesc="sortByDesc"
        @childChange="applyChanges"
      />
    </v-card-text>
    <v-dialog v-model="dialogP" max-width="700px" scrorable persistent>
      <CardPassword
        :bkPoint="bkPoint"
        @clickSubmit="updatePassword"
        @clickCancel="onCancel"
      />
    </v-dialog>
    <v-dialog v-model="dialog" max-width="700px" scrorable persistent>
      <CardInput
        :dialogType="selectIndex"
        :header="editHeaders"
        :content="editItem"
        :loginType="loginData"
        :bkPoint="bkPoint"
        @clickSubmit="save"
        @clickCancel="close"
      />
    </v-dialog>
    <v-snackbar v-model="snackbar" :top="true" :timeout="timeout">
      <span :class="`text-${bkPoint.model}`">{{ snackbarText }}</span>
      <v-btn color="pink" text @click="snackbar = false">閉じる</v-btn>
    </v-snackbar>
  </v-card>
</template>

<script>
import Moment from "moment";
import http from "@/modules/http";
import MyTable from "@/components/DataTable/MyTable";
import CardInput from "@/components/Card/CardInput";
import CardPassword from "@/components/Card/CardPassword";
export default {
  name: "setting2",
  components: { MyTable, CardPassword, CardInput },
  props: ["bkPoint"],
  data() {
    return {
      title: "ユーザー情報",
      buttons: [
        { name: "新規作成", color: "" },
        { name: "閲覧", color: "" },
        { name: "更新", color: "" },
        { name: "削除", color: "" },
      ],
      user: {
        select: [],
        headers: [],
        items: [],
        data: [],
        sorts: {},
        sortBy: "no",
        sortDesc: false,
        itemkey: "no",
      },
      tableHeight: 300,
      display: [],
      editItem: [],
      originItem: [],
      selectIndex: "",
      dialog: false,
      dialogP: false,
      select: [],
      replace: [],
      headers: [],
      contents: [],
      snackbar: false,
      snackbarText: "成功",
      snackbarColor: "green",
      timeout: 1000,
      sortByItem: ["no"],
      sortByDesc: [false],
      defaultColSetting: {
        text: "",
        value: "",
        shown: 0,
        type: "型なし",
        main_key: false,
      },
    };
  },
  computed: {
    loginData() {
      return this.$store.getters[`auth/login`];
    },
    shownHeaders() {
      return this.headers.filter((h) => h.shown > 0);
    },
    editHeaders() {
      return this.headers.filter((h) => h.shown > 1);
    },
    showContents() {
      let data = this.contents;
      for (const i in data) {
        let row = data[i];
        // const headers = this.shownHeaders.filter((x) => x.type == "DATE");
        const headers = this.shownHeaders.filter((x) => x.data_type == "日付");
        for (const h of headers) {
          // const text = h.text;
          const text = h.value;
          const value = row[text];
          //空でなければ
          if (value) {
            row[text] = Moment(value).format("YYYY/MM/DD");
          }
        }
      }
      return data;
    },
    defaultItem() {
      let data = [];
      let header = Object.assign(this.editHeaders);
      console.log("初期値", header);
      for (const h of header) {
        // const type = this.setDataType(h.type);
        data.push({
          text: h.text,
          value: null,
          type: h.type,
          text_origin: h.value,
        });
      }
      return data;
    },
    replaceData() {
      return this.$store.getters[`table/replace`];
    },
    displayData() {
      return this.$store.getters[`table/display`];
    },
  },
  methods: {
    setDataType(typeName) {
      return typeName == "整数" || typeName == "小数"
        ? "number"
        : typeName == "文字列"
        ? "text"
        : typeName == "日付"
        ? "date"
        : "text";
    },
    initilize() {
      const user_replace =
        this.replaceData.rows.filter((x) => x.table == "user") || null;
      console.log("置換設定", user_replace);
      //表示属性の順序を変更する
      const user_replace_new = user_replace.sort((a, b) => {
        if (a.display_number < b.display_number) return -1;
        if (b.display_number < a.display_number) return 1;
        return 0;
      });
      let newReplaceData = [];
      for (let rep of user_replace_new) {
        rep["text"] = rep["replace"];
        rep["value"] = rep["column"];
        // rep["type"] = rep["data_type"];
        rep["type"] = this.setDataType(rep["data_type"]);
        rep["shown"] = rep["display_type"];
        newReplaceData.push(rep);
      }
      // console.log("置換設定_新", newReplaceData);
      this.headers = newReplaceData;
      // console.log("show", this.shownHeaders);
      // console.log("edit", this.editHeaders);
    },
    onPassword() {
      this.selectIndex = 1;
      if (this.select.length <= 0) {
        alert("選択されていません");
        return;
      }
      this.originItem = Object.assign(this.select[0]);
      this.dialogP = true;
    },
    updatePassword(password) {
      console.log(password);
      const origin = this.originItem;
      const id = origin.no;
      let data = {};
      // 更新項目がある場合

      data["update"] = Moment().format("YYYY/MM/DD");
      data["password"] = password;
      const content2 = { data: { key: { no: id }, update: data } };
      this.dialogP = false;
      this.update(content2);
    },
    onCancel() {
      this.dialogP = false;
    },
    applyChanges(select) {
      // console.log("parentChange", select);
      this.select = select;
    },
    toggleOrder(text, index) {
      console.log(this.user.sortBy, index);
      const desc = !this.user.headers[index].sortDesc;
      this.user.headers[index].sortDesc = desc ? true : false;
      this.user.sortBy = text;
      this.user.sortDesc = desc;
    },
    close() {
      this.isEditing = false;
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    open(index) {
      this.selectIndex = index;

      if (this.selectIndex != -1) {
        //閲覧:0
        //更新:1
        //削除:2
        if (this.select.length <= 0) {
          alert("選択されていません");
          return;
        }
        const selected = this.select[0];
        console.log("選択データ", selected);
        this.originItem = Object.assign(selected);
        const headers =
          this.selectIndex == 1 ? this.editHeaders : this.shownHeaders;
        let data = [];
        for (const header of headers) {
          let value = selected[header.value];
          //日付型かつデータが存在すればYYYY-MM-DD形式に変換
          if (value) {
            if (header.type == "date") {
              value = Moment(value).format("YYYY-MM-DD");
            }
          }
          data.push({
            text: header.text,
            text_origin: header.value,
            value: value,
            type: header.type,
          });
          console.log(data);
        }
        this.editItem = Object.assign(data);
      } else {
        this.editItem = Object.assign(this.defaultItem);
      }
      this.dialog = true;
    },
    async save(params) {
      //新規作成・更新・削除
      const selectedIndex = this.selectIndex;

      console.log("params", params);
      const origin = this.originItem;
      console.log("origin", origin);
      const id = origin.no;
      console.log("id", id);

      let data = {};

      //insert
      if (selectedIndex == -1) {
        console.log("新規作成");
        for (const param of params) {
          console.log(param);
          const text = param.text_origin;
          const value = param.value;
          if (value != null && value != "") data[text] = value;
        }
        //パスワードが空なら
        if (!data["password"] || data["password"] == "") {
          alert("パスワードが入力されていません。");
          return;
        }
        const url = `/system/user/login?user_name=${data["user_name"]}`;
        const res = await http.get(url);
        if (res.status == 200) {
          if (res.data.rows.length > 0) {
            alert("その名前は既に使われています。");
            return;
          }
          const content1 = { data: data };
          this.insert(content1);
        } else {
          console.error(res);
        }
      } else if (selectedIndex == 0) {
        console.log("閲覧");
        const key = "ファイルパス";
        if (key in origin) {
          this.filepath = origin[key];
          this.filedialog = true;
          console.log("ファイル一覧を表示");
        } else {
          console.log("ファイルパスが存在しません");
        }
      } else if (selectedIndex == 1) {
        console.log("更新");
        //update
        let dataSize = 0;
        for (const param of params) {
          const text = param.text_origin;
          const value = param.value;
          data[text] = value;
          dataSize++;
        }
        if (dataSize <= 0) {
          console.log("更新する値が存在しません");
        } else {
          const content2 = { data: { key: { no: id }, update: data } };
          this.update(content2);
        }
      } else if (selectedIndex == 2) {
        console.log("削除");
        //delete
        const content3 = { no: id };
        this.delete(content3);
      } else {
        this.close();
      }
      this.dialog = false;
    },

    async getUserData() {
      this.select = [];
      const url = `/system/user`;
      const res = await http.get(url);
      if (res.status == 200) {
        console.log("success");
        //表示データ
        this.contents = res.data.rows;
      } else {
        console.log(res);
        alert("処理が正しく行えませんでした。時間をおいてやり直してください。");
      }
    },

    async insert(data) {
      console.log(data);
      const url = `/system/user`;
      const res = await http.create(url, data);
      if (res.status == 200) {
        this.getUserData();
        this.snackbarText = "新規登録 成功";
        this.snackbar = true;
        http.registerLog(
          this.loginData.name,
          "台帳管理",
          "ユーザー管理",
          "新規登録　成功"
        );
      } else {
        this.snackbarText = "新規登録 失敗";
        this.snackbar = true;
        http.registerLog(
          this.loginData.name,
          "台帳管理",
          "ユーザー管理",
          "新規登録　失敗"
        );
      }
    },
    async update(data) {
      const url = `/system/user`;
      const res = await http.update(url, data);
      if (res.status == 200) {
        this.getUserData();
        this.snackbarText = "更新 成功";
        this.snackbar = true;
        console.log(res);
        http.registerLog(
          this.loginData.name,
          "台帳管理",
          "ユーザー管理",
          "更新　成功"
        );
      } else {
        this.snackbarText = "更新 失敗";
        this.snackbar = true;
        console.log(res);
        http.registerLog(
          this.loginData.name,
          "台帳管理",
          "ユーザー管理",
          "更新　失敗"
        );
      }
    },
    async delete() {
      const select = this.select;
      if (select.length <= 0) {
        console.error("選択されていません");
        return;
      }
      const mainkey = "no";
      const id = select[0][mainkey];
      const url = `/system/user?${mainkey}=${id}`;
      const res = await http.remove(url);
      if (res.status == 200) {
        console.log(res);
        this.getUserData();
        this.snackbarText = "削除 成功";
        this.snackbar = true;
        http.registerLog(
          this.loginData.name,
          "台帳管理",
          "ユーザー管理",
          "削除　成功"
        );
      } else {
        this.snackbarText = "削除 失敗";
        this.snackbar = true;
        http.registerLog(
          this.loginData.name,
          "台帳管理",
          "ユーザー管理",
          "削除　失敗"
        );
      }
    },
  },
  created() {
    this.initilize();
    this.$nextTick(() => {
      this.getUserData();
    });
  },
};
</script>
