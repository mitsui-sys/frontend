<template>
  <v-card>
    <v-toolbar :class="`text-${bkPoint.model}`">表示</v-toolbar>
    <v-card-text>
      <v-switch
        v-model="development"
        label="開発者モード"
        @change="changeDev"
      />
      <v-card class="pa-5">
        <v-container fluid>
          <v-row v-if="true">
            <v-col cols="2">
              <v-subheader :class="`text-${bkPoint.model}`"
                >テーブル名</v-subheader
              >
            </v-col>
            <v-col>
              <v-autocomplete
                v-model="selectTable"
                :items="tableNameList"
                :class="`text-${bkPoint.model}`"
                dense
                filled
              />
            </v-col>
            <v-col cols="1">
              <v-btn
                @click="registerTableShown"
                :class="`text-${bkPoint.model}`"
                >登録</v-btn
              >
            </v-col>
            <v-col cols="1">
              <v-btn @click="deleteTableShown" :class="`text-${bkPoint.model}`"
                >削除</v-btn
              >
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="2">
              <v-subheader :class="`text-${bkPoint.model}`">表示名</v-subheader>
            </v-col>
            <v-col>
              <v-autocomplete
                v-model="selectedDisplay"
                :items="displayItems"
                :class="`text-${bkPoint.model}`"
                @change="selectTableShown"
                dense
                filled
              />
            </v-col>
            <v-col cols="2">
              <v-btn
                @click="registerGetColumns"
                :class="`text-${bkPoint.model}`"
                >属性初期化</v-btn
              >
            </v-col>
          </v-row>
          <v-row>
            <v-switch
              v-for="col in headers"
              :key="col.value"
              v-model="col.shown"
              :label="`${col.text} : ${col.type}`"
              @change="changeTableShown"
            ></v-switch>
          </v-row>
        </v-container>
      </v-card>
    </v-card-text>
  </v-card>
</template>

<script>
// import UserField from "@/components/TextField/UserField.vue";
// import PasswordField from "@/components/TextField/PasswordField.vue";
export default {
  name: "setting1",
  props: ["bkPoint"],
  data() {
    return {
      selectTable: "",
      selectedDisplay: "",
      development: false,
      tableItems: [],
      displayItems: [],
      headers: [],
    };
  },
  //   components: { UserField, PasswordField },
  computed: {
    url() {
      return this.$store.getters[`backend/url`];
    },
    tableNameList() {
      return this.$store.getters[`table/tableNameList`];
    },
  },
  methods: {
    changeDev() {
      console.log("development", this.development);
      this.$store.dispatch(`config/updateDevelopment`, this.development);
    },
    getTableName() {
      //DBにあるすべてのテーブル名を取得する
      this.axios
        .get(`${this.url}/table`)
        .then((res) => {
          //成功時
          console.log("テーブル名を全て取得", res.data.rows);
          const rows = res.data.rows;
          this.$store.dispatch(`table/updateTableNameList`, rows);
        })
        .catch((err) => {
          return err.response;
        });
    },
    getTableShown() {
      this.axios
        .get(`${this.url}/display`)
        .then((res) => {
          //成功時
          console.log("表示データ取得", res.data);
          const rows = res.data.rows;
          this.displayItems = rows.map((row) => row.name);
        })
        .catch((err) => {
          console.log("失敗", err);
        });
    },
    selectTableShown() {
      const table = this.selectedDisplay;
      const url = `${this.url}/display/${table}`;
      this.axios
        .get(url)
        .then((res) => {
          //成功時
          console.log("特定の表示データ取得", res.data);
          const rows = res.data.rows;
          if (rows.length <= 0) {
            console.log(`台帳${table}が存在しません`);
            return;
          }
          const json = JSON.parse(rows[0].display);
          this.headers = json;
          console.log(json);
        })
        .catch((err) => {
          console.log("失敗", err);
        });
    },
    registerGetColumns() {
      const table = this.selectedDisplay;
      const url = `${this.url}/db/${table}`;
      this.axios
        .get(url)
        .then((res) => {
          console.log("成功", res);
          const columns = res.data.columns;
          let headers = [];
          for (const i in columns) {
            const c = columns[i];
            const name = c.columnName;
            const shown = c.shown;
            const type = c.type;
            headers.push({ text: name, value: name, shown: shown, type: type });
          }
          this.headers = Object.assign(headers);
        })
        .catch((err) => {
          console.log("失敗", err);
        });
    },
    registerTableShown() {
      const url = `${this.url}/display`;
      const data = {
        data: {
          name: this.selectTable,
          display: JSON.stringify(this.headers),
        },
      };
      const option = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      console.log("表示データ新規作成", url, data, option);
      this.axios
        .post(url, data, option)
        .then((res) => {
          //成功時
          console.log("success", res.data);
        })
        .catch((err) => {
          console.log("失敗", err);
        });
    },
    changeTableShown() {
      const table = this.selectedDisplay;
      const url = `${this.url}/display`;
      const data = {
        data: {
          key: { name: table },
          update: { display: JSON.stringify(this.headers) },
        },
      };
      const option = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      console.log("表示データ更新", url, data, option);
      this.axios
        .put(url, data, option)
        .then((res) => {
          //成功時
          console.log("success", res.data);
        })
        .catch((err) => {
          console.log("失敗", err);
        });
    },
    deleteTableShown() {
      const table = this.selectTable;
      const url = `${this.url}/display`;
      const data = {
        data: {
          key: { name: table },
        },
      };
      const option = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      console.log("表示データ削除", url, data, option);
      this.axios
        .delete(url, data, option)
        .then((res) => {
          //成功時
          console.log("success", res.data);
        })
        .catch((err) => {
          console.log("失敗", err);
        });
    },
  },
  beforeCreate() {
    // リアクティブデータ作成前に行いたい処理
  },
  created() {
    // リアクティブデータ作成後に行いたい処理
    this.getTableName();
    this.getTableShown();
  },
  beforeMount() {
    // DOMにマウントされる前に行いたい処理
  },
  mounted() {
    // DOMにマウントされた後に行いたい処理
  },
  beforeUpdate() {
    // DOMが更新される前に行いたい処理
  },
  updated() {
    // DOMを更新した後に行いたい処理
  },
  beforeDestroy() {
    // Vueインスタンスを破棄する前に行いたい処理
  },
  destroyed() {
    // Vueインスタンスを破棄した後に行いたい処理
  },
  errorCaptured(err, vm, info) {
    // エラー画面やダイアログを表示するなど
    // err : エラー内容
    // vm  : エラーをトリガするVueインスタンス
    // info: エラーをキャッチした捕捉場所
    console.log(err, vm, info);
  },
};
</script>
