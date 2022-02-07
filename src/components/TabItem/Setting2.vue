<template>
  <v-card color="#fff">
    <v-toolbar>
      {{ title }}
      <v-spacer />
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
        :items="user.items"
        :itemkey="user.itemkey"
        :bkPoint="bkPoint"
        @childChange="applyChanges"
      />
    </v-card-text>
    <v-dialog v-model="dialogP" max-width="700px" scrorable>
      <CardPassword @clickSubmit="updatePassword" @clickCancel="onCancel" />
    </v-dialog>
    <v-dialog v-model="dialog" max-width="700px" scrorable>
      <CardInput
        :dialogType="selectIndex"
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
      snackbar: false,
      snackbarText: "成功",
      snackbarColor: "green",
      timeout: 1000,
    };
  },
  computed: {
    url() {
      return this.$store.getters[`backend/url`];
    },
    loginData() {
      return this.$store.getters[`auth/login`];
    },
    shownHeaders() {
      return this.headers.filter((h) => h.shown);
    },
  },
  methods: {
    async getReplace() {
      const url = "/system/replace";
      const replace = await http.getReplace(url);
      this.replace = replace;
      console.log(replace);

      const res = await http.get("/display");
      if (res.status == 200) {
        const rows = res.data.rows.filter((x) => x.type == 0);
        const name = "ユーザー";
        const display = rows.filter((x) => x.name == name).shift().display;
        const json = JSON.parse(display);

        //データがあるなら書き換える
        const rowsR = replace.data.rows;
        let defaultItem = [];
        for (const i in json) {
          const text = json[i].text;
          const data = rowsR.filter(
            (x) => x.table == "user" && x.column == text
          );
          if (data.length > 0) {
            const newdata = data.shift();
            json[i].text = newdata.replace;
          }
          defaultItem.push({
            text: text,
            value: "",
            sortDesc: false,
            shown: true,
          });
        }
        this.defaultItem = Object.assign(defaultItem);
        this.headers = json;
        console.log(json);
      } else {
        console.log(res);
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
        if (this.select.length <= 0) {
          alert("選択されていません");
          return;
        }
        const item = Object.assign(this.select[0]);
        console.log(item);
        this.originItem = Object.assign(item);
        const edit = Object.assign(this.defaultItem);
        let data = [];
        for (const i in edit) {
          const text = edit[i].text;
          data.push({ text: text, value: item[text] });
        }
        this.editItem = Object.assign(data);
      } else {
        this.editItem = Object.assign(this.defaultItem);
      }
      this.dialog = true;
    },
    save(params) {
      console.log("submit", params);
      const origin = this.originItem;
      const id = origin.no;
      console.log("origin", id);

      //insert
      let data = {};
      const item = Object.assign(this.editItem);
      for (const i in item) {
        const text = item[i].text;
        const value = item[i].value;
        if (value != null && value != "") data[text] = value;
      }
      const content1 = { data: data };

      //update
      data = {};
      const item1 = Object.assign(this.editItem);
      let dataSize = 0;
      for (const i in item1) {
        const text = item1[i].text;
        const value = item1[i].value;
        if (value != origin[text]) {
          data[text] = value;
          dataSize++;
        }
      }
      const content2 = { data: { key: { no: id }, update: data } };

      //delete
      const content3 = { no: id };

      const index = this.selectIndex;
      if (index == -1) {
        this.insert(content1);
      } else if (index == 0) {
        const key = "ファイルパス";
        if (key in origin) {
          this.filepath = origin[key];
          this.filedialog = true;
          console.log("ファイル一覧を表示");
        } else {
          console.log("ファイルパスが存在しません");
        }
      } else if (index == 1) {
        if (dataSize <= 0) {
          console.log("更新する値が存在しません");
        } else {
          this.update(content2);
        }
      } else if (index == 2) {
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
        console.log("success", res.data);
        this.user.data = Object.assign(res.data);

        //表示データ
        let rows = res.data.rows;
        console.log(rows);
        for (const key in rows) {
          const _date = rows[key]["created_day"];
          rows[key]["created_day"] = Moment(_date).format("YYYY/MM/DD");
        }
        this.user.items = Object.assign(rows);
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
