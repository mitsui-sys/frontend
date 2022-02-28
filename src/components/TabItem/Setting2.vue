<template>
  <v-card color="#fff">
    <v-toolbar>
      {{ title }}
      <v-spacer />
      <v-btn @click="onPassword" :class="`text-${bkPoint.model} mx-2`">
        権限レベル更新
      </v-btn>
      <v-btn @click="onPassword" :class="`text-${bkPoint.model} mx-2`">
        グループ名更新
      </v-btn>
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
        :items="contents"
        :itemkey="user.itemkey"
        :bkPoint="bkPoint"
        :sortByItem="sortByItem"
        :sortByDesc="sortByDesc"
        @childChange="applyChanges"
      />
    </v-card-text>
    <v-dialog v-model="dialogP" max-width="700px" scrorable persistent>
      <CardPassword @clickSubmit="updatePassword" @clickCancel="onCancel" />
    </v-dialog>
    <v-dialog v-model="dialog" max-width="700px" scrorable persistent>
      <CardInput
        :dialogType="selectIndex"
        :header="headers"
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
      let rows = [];
      for (const i in this.contents) {
        let row = Object.assign(row, this.contents[i]);
        console.log(row);
        const _date = row["created_day"];
        row["created_day"] = Moment(_date).format("YYYY/MM/DD");
        rows.push(this.contents[i]);
      }
      return rows;
    },
  },
  methods: {
    async getReplace() {
      const url = "/system/replace";
      const res = await http.getReplace(url);
      if (res.status == 200) {
        const data = res.data;
        this.replace = data;
      } else {
        console.error(res);
      }

      const res1 = await http.get("/system/user");
      if (res1.status == 200) {
        //ユーザ一覧を取得
        const data = res1.data;
        //列情報取得
        const columns = data.columns;
        //列名取得
        const colNames = columns.map((x) => x.columnName);
        //表示設定を取得
        let headers = [];
        const replace = this.replace.rows;
        for (const name of colNames) {
          const repdata =
            replace
              .filter((x) => x.table == "user" && x.column == name)
              .shift() || undefined;
          const data = {
            text: repdata.replace || name,
            value: name,
            shown: repdata.display_type || 0,
            type: repdata.data_type || "型なし",
            main_key: repdata.main_key || false,
          };
          headers.push(data);
        }
        this.headers = headers;
        console.log("headers", headers);
      } else {
        console.error(res1);
      }
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

      data["created_day"] = Moment().format("YYYY/MM/DD");
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
        console.log("選択データ登録", this.originItem);
        const headers =
          this.selectIndex == 1 ? this.editHeaders : this.shownHeaders;
        console.log("editHeader");
        let data = [];
        for (const header of headers) {
          data.push({
            text: header.text,
            text_origin: header.value,
            value: selected[header.value],
            type: header.type,
          });
        }
        this.editItem = Object.assign(data);
        // const edit = Object.assign(this.defaultItem);
        // let data = [];
        // for (const i in this.shownHeaders) {
        //   const text = edit[i].text;
        //   data.push({ text: text, value: selected[text] });
        // }
        // console.log(data);
        // this.editItem = Object.assign(data);
      } else {
        //新規作成
        let data = [];
        for (const header of this.editHeaders) {
          data.push({
            text: header.text,
            text_origin: header.value,
            value: "",
            type: header.type,
          });
        }
        this.editItem = data;
      }
      this.dialog = true;
    },
    save(params) {
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
          const text = param.text_origin;
          const value = param.value;
          if (value != null && value != "") data[text] = value;
        }
        const content1 = { data: data };
        this.insert(content1);
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
      const url = `/system/user`;
      const res = await http.create(url, data);
      if (res.status == 200) {
        http.registerLog(
          this.url,
          this.loginData.name,
          "ユーザー設定",
          "新規登録",
          data
        );
        this.getUserData();
        this.snackbarText = "新規登録 成功";
        this.snackbar = true;
      } else {
        http.registerLog(
          this.url,
          this.loginData.name,
          "ユーザー設定",
          "新規登録:失敗",
          data
        );
        this.snackbarText = "新規登録 失敗";
        this.snackbar = true;
      }
    },
    async update(data) {
      const url = `/system/user`;
      const res = await http.update(url, data);
      if (res.status == 200) {
        http.registerLog(
          this.url,
          this.loginData.name,
          "ユーザー設定",
          "更新",
          data
        );
        this.getUserData();
        this.snackbarText = "更新 成功";
        this.snackbar = true;
        console.log(res);
      } else {
        this.snackbarText = "更新 失敗";
        this.snackbar = true;
        console.log(res);
      }
    },
    async delete(data) {
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
        http.registerLog(
          this.url,
          this.loginData.name,
          "ユーザー設定",
          "削除",
          data
        );
        this.getUserData();
        this.snackbarText = "削除 成功";
        this.snackbar = true;
      } else {
        this.snackbarText = "削除 失敗";
        this.snackbar = true;
        console.log(res);
      }
    },
  },
  created() {
    // リアクティブデータ作成後に行いたい処理
    this.getReplace();
    this.$nextTick(() => {
      this.getUserData();
    });
  },
};
</script>
