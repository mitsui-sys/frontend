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
import http from "@/modules/http";

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
      enabled: true,
      list: [
        { name: "John", id: 0 },
        { name: "Joao", id: 1 },
        { name: "Jean", id: 2 },
      ],
      dragging: false,
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
        console.log(res);
        console.log("テーブル名を全て取得", res.data.rows);
        const rows = res.data.rows;
        this.$store.dispatch(`table/updateTableNameList`, rows);
      } else {
        console.error(res);
      }
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

<style scoped>
.buttons {
  margin-top: 35px;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
</style>
