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
                >地物テーブル名</v-subheader
              >
            </v-col>
            <v-col>
              <v-autocomplete
                v-model="selectTable"
                :items="table_bunkazai"
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
              <v-subheader :class="`text-${bkPoint.model}`"
                >システムテーブル名</v-subheader
              >
            </v-col>
            <v-col>
              <v-autocomplete
                v-model="selectCityisdb"
                :items="table_cityisdb"
                :class="`text-${bkPoint.model}`"
                @change="getCityisdbTable"
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
            <v-switch
              v-model="item.shown"
              v-for="(item, index) in selectCityisdbTableCols"
              :label="item.columnName"
              :key="index"
              @change="getCityisdbTableSetting"
            />
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
            <v-text-field
              v-model="value1"
              type="text"
              label="文字列"
              :height="bkPoint.btnHeight"
              outlined
            />
            <v-text-field
              v-model="value2"
              type="number"
              label="数値"
              :height="bkPoint.btnHeight"
              outlined
            />
            <v-text-field
              v-model="value3"
              type="date"
              label="日付"
              :height="bkPoint.btnHeight"
              outlined
            />
          </v-row>
        </v-container>
      </v-card>
    </v-card-text>
  </v-card>
</template>

<script>
// import UserField from "@/components/TextField/UserField.vue";
// import PasswordField from "@/components/TextField/PasswordField.vue";
import http from "@/modules/http";

export default {
  name: "setting1",
  props: ["bkPoint"],
  data() {
    return {
      selectTable: "",
      selectCityisdb: "",
      selectedDisplay: "",
      development: false,
      tableItems: [],
      displayItems: [],
      headers: [],
      enabled: true,
      list: [
        { name: "John", id: 0 },
        { name: "Joao", id: 1 },
        { name: "Jean", id: 2 },
      ],
      dragging: false,
      myArray: [],
      drag: false,
      value1: "",
      value2: "",
      value3: "",
      selectCityisdbTableCols: [],
    };
  },
  //   components: { UserField, PasswordField },
  computed: {
    tableNameList() {
      return this.$store.getters[`table/tableNameList`];
    },
    table_bunkazai() {
      return this.$store.getters[`table/bunkazai`];
    },
    table_cityisdb() {
      return this.$store.getters[`table/cityisdb`];
    },
    draggingInfo() {
      return this.dragging ? "under drag" : "";
    },
  },
  methods: {
    changeDev() {
      console.log("development", this.development);
      this.$store.dispatch(`config/updateDevelopment`, this.development);
    },
    async getTableName() {
      this.select = [];
      const url = `/table`;
      const res = await http.get(url);
      if (res.status == 200) {
        this.$store.dispatch(`table/updateTableNameList`, res.data.rows);
      } else {
        console.error(res);
      }
    },
    async getBunkazai() {
      const url = `/table`;
      const res = await http.get(url);
      if (res.status == 200) {
        // console.log(res);
        this.$store.dispatch(
          `table/updateBunkazai`,
          res.data.rows.map((x) => x.tablename) || []
        );
        // console.log(this.table_bunkazai);
      } else {
        console.error(res);
      }
    },
    async getCityisdb() {
      const url = `/system`;
      const res = await http.get_test(url);
      if (res.status == 200) {
        // console.log(res);
        this.$store.dispatch(
          `table/updateCityisdb`,
          res.data.rows.map((x) => x.tablename) || []
        );
        // console.log(this.table_cityisdb);
      } else {
        console.error(res);
      }
    },
    async getCityisdbTable() {
      const tableName = this.selectCityisdb;
      const url = `/test/${tableName}`;
      const res = await http.get_test(url);
      if (res.status == 200) {
        console.log(res.data);
        let cols = res.data.columns;
        for (let c of cols) {
          const name = c.columnName;
          c["value"] = name;
          c["text"] = name;
          c["shown"] = true;
        }
        this.selectCityisdbTableCols = cols;
        // console.log(this.table_cityisdb);
      } else {
        console.error(res);
      }
    },
    getCityisdbTableSetting() {
      //表示属性の設定
      const json = JSON.stringify(this.selectCityisdbTableCols);
      console.log("json", json);
      // console.log(this.selectCityisdbTableCols);
      const url = "/display";
      const data = { data: { display: json }, cond: {} };
      const res = http.update(url, data);
      console.log(res);
    },
    async getTableShown() {
      const url = `/display`;
      const res = await http.get(url);
      if (res.status == 200) {
        console.log("表示データ取得", res.data);
        const rows = res.data.rows;
        this.displayItems = rows.map((row) => row.name);
      } else {
        console.error(res);
      }
    },
    async selectTableShown() {
      const table = this.selectedDisplay;
      const url = `/display/${table}`;
      const res = await http.get(url);
      if (res.status == 200) {
        console.log("特定の表示データ取得", res.data);
        const rows = res.data.rows;
        if (rows.length <= 0) {
          console.log(`台帳${table}が存在しません`);
          return;
        }
        const display = rows[0].display;
        if (display == undefined) {
          console.log("表示設定がありません");
          return;
        }
        const json = JSON.parse(display);
        this.headers = json;
        console.log(json);
      } else {
        console.error(res);
      }
    },
    async registerGetColumns() {
      const table = this.selectedDisplay;
      const url = `/db/${table}`;
      const res = await http.get(url);
      if (res.status == 200) {
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
      } else {
        console.error(res);
      }
    },
    async registerTableShown() {
      const url = `/display`;
      const data = {
        data: {
          name: this.selectTable,
          display: JSON.stringify(this.headers),
        },
      };
      const res = await http.create(url, data);
      if (res.status == 200) {
        console.log("success", res.data);
      } else {
        console.error(res);
      }
    },
    async changeTableShown() {
      const table = this.selectedDisplay;
      const url = `/display`;
      const data = {
        data: {
          key: { name: table },
          update: { display: JSON.stringify(this.headers) },
        },
      };
      const res = await http.create(url, data);
      if (res.status == 200) {
        console.log("成功", res.data);
      } else {
        console.error(res);
      }
    },
    async deleteTableShown() {
      const table = this.selectedDisplay;
      const url = `/display`;
      const data = {
        data: {
          key: { name: table },
        },
      };
      const res = await http.create(url, data);
      if (res.status == 200) {
        console.log("成功", res.data);
      } else {
        console.error(res);
      }
    },
  },
  beforeCreate() {
    // リアクティブデータ作成前に行いたい処理
  },
  created() {
    // リアクティブデータ作成後に行いたい処理
  },
  beforeMount() {
    // DOMにマウントされる前に行いたい処理
  },
  mounted() {
    // DOMにマウントされた後に行いたい処理
    this.getBunkazai();
    this.getCityisdb();
    this.getTableName();
    this.getTableShown();
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

<style scoped>
.buttons {
  margin-top: 35px;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
</style>
