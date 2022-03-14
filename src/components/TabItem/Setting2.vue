<template>
  <v-card color="#fff" class="ma-3">
    <v-toolbar outlined>
      <v-toolbar-title :class="`text-${bkPoint.model}`">{{
        title
      }}</v-toolbar-title>
      <v-divider
        class="mx-4"
        :class="`text-${bkPoint.model}`"
        vertical
      ></v-divider>
      <v-toolbar-title :class="`text-${bkPoint.model}`">
        件数：{{ contents.length }}
      </v-toolbar-title>
      <v-spacer />
      <v-btn @click="open(-1)" :class="`text-${bkPoint.model} mx-2`">
        新規登録
      </v-btn>

      <v-btn
        @click="open(0)"
        :disabled="!select.length > 0"
        :class="`text-${bkPoint.model} mx-2`"
      >
        閲覧
      </v-btn>
      <v-btn
        @click="open(1)"
        :disabled="!(select.length > 0 && loginData.level >= 1)"
        :class="`text-${bkPoint.model} mx-2`"
      >
        編集
      </v-btn>
      <v-btn
        @click="open(2)"
        :disabled="!(select.length > 0 && loginData.level >= 1)"
        :class="`text-${bkPoint.model} mx-2`"
      >
        削除
      </v-btn>
      <v-divider class="mx-4" vertical></v-divider>
      <v-btn
        @click="onPassword"
        :disabled="!select.length > 0"
        :class="`text-${bkPoint.model} mx-2`"
      >
        パスワード更新
      </v-btn>
    </v-toolbar>
    <MyTable
      :headers="shownHeaders"
      :items="showContents"
      :itemkey="itemkey"
      :bkPoint="bkPoint"
      :sortByItem="sortByItem"
      :sortByDesc="sortByDesc"
      @childChange="applyChanges"
    />

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
        :showClose="true"
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
      itemkey: "no",
      buttons: [
        { name: "新規作成", color: "" },
        { name: "閲覧", color: "" },
        { name: "更新", color: "" },
        { name: "削除", color: "" },
      ],
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
      sortByItem: [],
      sortByDesc: [],
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
        let rules = [];
        if (h.type == "number") {
          if (h.min) {
            const rule = (v) => v >= h.min || `値は${h.min}以上にしてください`;
            rules.push(rule);
          }
          if (h.max) {
            const rule = (v) => v <= h.max || `値は${h.max}以下にしてください`;
            rules.push(rule);
          }
        } else if (h.type == "date") {
          // if (h.min) {
          //   const rule = (v) => v >= h.min || `値は${h.min}以上にしてください`;
          //   rules.push(rule);
          // }
        }
        data.push({
          text: h.text,
          text_origin: h.value,
          value: null,
          type: h.type,
          min: h.min,
          max: h.max,
          rules: rules,
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
      const name = "ユーザー";
      //属性表示情報の取得
      const data = this.display.filter((x) => x.name == name).shift() || null;
      console.log(name, data);
      if (data != null) {
        //ソート情報の初期化
        const sort_default = JSON.parse(data.sort_default);
        this.sortByItem = sort_default.map((x) => x.column) || [];
        this.sortByDesc = sort_default.map((x) => x.desc) || [];
        console.log(this.sortByItem, this.sortByDesc);
        console.log("sort", sort_default);
      }
      this.sortByItem = ["no"];
      this.sortByDesc = [false];
      console.log(this.sortByItem, this.sortByDesc);

      const user_replace =
        this.replaceData.rows.filter((x) => x.table == "user") || null;
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
        rep["type"] = this.setDataType(rep["data_type"]);
        rep["shown"] = rep["display_type"];
        newReplaceData.push(rep);
      }
      console.log("属性表示", newReplaceData);
      this.headers = newReplaceData;
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
      //今日の日付を取得
      data["update"] = Moment().format("YYYY/MM/DD");
      //更新するパスワードを取得
      data["password"] = password;
      const content2 = { data: { key: { no: id }, update: data } };
      this.dialogP = false;
      this.update(content2);
    },
    onCancel() {
      this.dialogP = false;
    },
    applyChanges(select) {
      this.select = select;
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
        for (const h of headers) {
          //データを取得
          let text = h.text;
          let text_origin = h.value;
          let type = h.type;
          let value = selected[h.value];
          let min = h.min;
          let max = h.max;
          //ルールの設定
          let rules = [];
          if (type == "number") {
            if (h.min) {
              const rule = (v) =>
                v >= h.min || `値は${h.min}以上にしてください`;
              rules.push(rule);
            }
            if (h.max) {
              const rule = (v) =>
                v <= h.max || `値は${h.max}以下にしてください`;
              rules.push(rule);
            }
          }
          //日付型かつデータが存在すればYYYY-MM-DD形式に変換
          if (value) {
            if (type == "date") {
              value = Moment(value).format("YYYY-MM-DD");
            }
          }

          data.push({
            text: text,
            text_origin: text_origin,
            value: value,
            type: type,
            rules: rules,
            min: min,
            max: max,
          });
        }
        console.log(data);
        this.editItem = Object.assign(data);
      } else {
        let data = [];
        let header = Object.assign(this.editHeaders);
        console.log("初期値", header);
        for (const h of header) {
          let rules = [];
          if (h.type == "number") {
            if (h.min) {
              const rule = (v) =>
                v >= h.min || `値は${h.min}以上にしてください`;
              rules.push(rule);
            }
            if (h.max) {
              const rule = (v) =>
                v <= h.max || `値は${h.max}以下にしてください`;
              rules.push(rule);
            }
          } else if (h.type == "date") {
            // if (h.min) {
            //   const rule = (v) => v >= h.min || `値は${h.min}以上にしてください`;
            //   rules.push(rule);
            // }
          }
          data.push({
            text: h.text,
            text_origin: h.value,
            value: null,
            type: h.type,
            min: h.min,
            max: h.max,
            rules: rules,
          });
        }
        this.editItem = Object.assign(data);
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
        console.log(params);
        for (const param of params) {
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
        //delete
        const content3 = { no: id };
        this.delete(content3);
        console.log("削除");
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
        ("/system/log/register");
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
  mounted() {
    this.sortByItem = ["no"];
    this.sortByDesc = [false];
  },
  created() {
    this.initilize();
    this.$nextTick(() => {
      this.getUserData();
    });
  },
};
</script>
