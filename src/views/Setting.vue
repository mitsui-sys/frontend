<template>
  <v-main>
    <v-container fluid fill-height>
      <v-row>
        <v-col cols="12" sm="8" md="8" lg="8" xl="6">
          <v-card>
            <v-toolbar>表示</v-toolbar>
            <v-card-text>
              <v-switch
                v-model="development"
                label="開発者モード"
                @change="changeDev"
              />
              <v-card class="pa-5">
                <v-container fluid>
                  <v-row>
                    <v-subheader>テーブル名</v-subheader>
                    <v-autocomplete
                      v-model="selectedTable"
                      :items="tableNameList"
                      dense
                      filled
                    />
                    <v-btn @click="registerTableShown">登録</v-btn>
                    <v-btn @click="deleteTableShown">削除</v-btn>
                  </v-row>
                  <v-row>
                    <v-subheader>表示名</v-subheader>
                    <v-autocomplete
                      v-model="selectedDisplay"
                      :items="displayItems"
                      @change="selectTableShown"
                      dense
                      filled
                    />
                  </v-row>
                  <v-row>
                    <v-switch
                      v-for="col in headers"
                      :key="col.value"
                      v-model="col.shown"
                      :label="`${col.text}`"
                      @change="changeTableShown"
                    ></v-switch>
                  </v-row>
                </v-container>
              </v-card>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="8" md="6" lg="8" xl="3">
          <v-card color="#fff">
            <v-toolbar>
              ユーザー情報
              <v-spacer />
              新規登録は
              <router-link to="/signup">こちら</router-link>
            </v-toolbar>
            <v-card-text>
              <v-data-table
                :headers="searchHeaders"
                :items="searchContents"
                class="userlog elevation-1 overflow-auto"
                fixed-header
                fixed-footer
                height="300px"
                :header-props="{
                  'sort-icon': '▼',
                }"
                :items-per-page="5"
              >
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="8" md="6" lg="8" xl="3">
          <v-card color="#fff">
            <v-toolbar> ログ </v-toolbar>
            <v-card-text>
              <v-data-table
                :headers="logHeaders"
                :items="logContents"
                class="elevation-1 overflow-auto"
                fixed-header
                fixed-footer
                height="300px"
              >
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
import Moment from "moment";
export default {
  name: "Setting",
  components: {},
  data() {
    return {
      tableItems: [],
      selectedTable: "",
      displayItems: [],
      selectedDisplay: "",
      development: false,
      loading: false,
      logHeaders: [],
      logContents: [],
      userHeaders: [],
      userContents: [],
      searchHeaders: [],
      searchContents: [],
      headers: [],
      contents: [
        { id: 1, name: "kanko1", layer: "包蔵地1", content: "" },
        { id: 2, name: "kanko2", layer: "包蔵地2", content: "" },
        { id: 3, name: "kanko3", layer: "包蔵地3", content: "" },
      ],
      host: "harima-isk",
      url: "http://harima-isk:50001",
    };
  },
  computed: {
    loginData() {
      return this.$store.getters[`auth/login`];
    },
    tableNameList() {
      return this.$store.getters[`table/tableNameList`];
    },
  },
  methods: {
    init() {
      //DBにあるすべてのテーブル名を取得する
      const url = `${this.url}/table`;
      this.axios
        .get(url)
        .then((res) => {
          //成功時
          console.log("table", res.data.rows);
          const rows = res.data.rows;
          this.$store.dispatch(`table/updateTableNameList`, rows);
          console.log(this.tableNameList);
        })
        .catch((err) => {
          return err.response;
        });
    },
    getTableShown() {
      const url = `${this.url}/display`;
      console.log("get all display", url);
      this.axios
        .get(url)
        .then((res) => {
          //成功時
          console.log("success", res.data);
          const rows = res.data.rows;
          this.displayItems = rows.map((row) => row.name);
          // const json = JSON.parse(rows[0].display);
          // this.headers = json;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    selectTableShown() {
      const table = this.selectedDisplay;
      const url = `${this.url}/display/${table}`;
      console.log("select display", url);
      this.axios
        .get(url)
        .then((res) => {
          //成功時
          console.log("success", res.data);
          const rows = res.data.rows;
          if (rows.length <= 0) {
            console.log(`台帳${table}が存在しません`);
            return;
          }
          const json = JSON.parse(rows[0].display);
          this.headers = json;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    registerTableShown() {
      const table = this.selectedTable;
      const url = `${this.url}/display/${table}`;
      const data = {
        data: {
          name: this.selectedTable,
          display: JSON.stringify(this.headers),
        },
      };
      const option = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      console.log("insert display", url, data, option);
      this.axios
        .post(url, data, option)
        .then((res) => {
          //成功時
          console.log("success", res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    changeTableShown() {
      const table = this.selectedDisplay;
      const url = `${this.url}/display/${table}`;
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
      console.log("update display", url, data, option);
      this.axios
        .put(url, data, option)
        .then((res) => {
          //成功時
          console.log("success", res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    deleteTableShown() {
      const table = this.selectedTable;
      const url = `http://localhost:50001/display/${table}`;
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
      console.log("delete display", url, data, option);
      this.axios
        .delete(url, data, option)
        .then((res) => {
          //成功時
          console.log("success", res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    changeDev() {
      console.log("development", this.development);
      this.$store.dispatch(`config/updateDevelopment`, this.development);
    },
    getLogData() {
      const url = `http://${this.host}:50001/system/log`;
      this.loading = true;
      this.axios
        .get(url)
        .then((res) => {
          console.log(res.data);
          // const columnNames = res.data.columns.map((x) => x.columnName);
          const columnNames = res.data.columns.map((x) => x.columnName);
          // const headers = columnNames.reduce(
          //   (obj, x) => obj.push({ text: x, value: x }),
          //   []
          // );
          let headers = [];
          for (const i in columnNames) {
            const name = columnNames[i];
            headers.push({ text: name, value: name });
          }

          this.logHeaders = headers;
          this.logContents = res.data.rows;
        })
        .catch((error) => {
          console.log(error);
          alert(
            "処理が正しく行えませんでした。時間をおいてやり直してください。"
          );
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getUserData() {
      const url = `http://${this.host}:50001/system/user`;
      this.loading = true;
      this.axios
        .get(url)
        .then((res) => {
          console.log(res.data);
          const columnNames = res.data.columns.map((x) => x.columnName);
          let h = [];
          for (const i in columnNames) {
            const name = columnNames[i];
            h.push({ text: name, value: name });
          }
          let rows = res.data.rows;
          console.log(rows);
          for (const key in rows) {
            const _date = rows[key]["created_day"];
            rows[key]["created_day"] = Moment(_date).format("YYYY/MM/DD");
          }
          this.searchHeaders = h;
          this.searchContents = rows;
        })
        .catch((error) => {
          console.log(error);
          alert(
            "処理が正しく行えませんでした。時間をおいてやり直してください。"
          );
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
  mounted() {
    this.init();
    this.getTableShown();
    this.getLogData();
    this.getUserData();
  },
};
</script>
