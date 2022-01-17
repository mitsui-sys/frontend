<template>
  <v-main>
    <v-container fluid fill-height>
      <v-row>
        <v-col cols="12" sm="8" md="6" lg="6" xl="6">
          <v-card>
            <v-toolbar>表示</v-toolbar>
            <v-card-text>
              <v-switch
                v-model="development"
                label="開発者モード"
                @change="changeDev"
              />
              <v-container fluid>
                <v-autocomplete
                  v-model="selectedTable"
                  :items="tableNameList"
                  @change="changeTable"
                  dense
                  filled
                />
                <v-btn @click="registerTableShown">登録</v-btn>
                <v-row>
                  <v-switch
                    v-for="col in headers"
                    :key="col.value"
                    v-model="col.shown"
                    :label="`${col.text}`"
                  ></v-switch>
                </v-row>
              </v-container>
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
      selectedTable: "",
      tableItems: [],
      development: false,
      loading: false,
      logHeaders: [],
      logContents: [],
      userHeaders: [],
      userContents: [],
      searchHeaders: [],
      searchContents: [],
      headers: [
        { text: "id", value: "id" },
        { text: "name", value: "name" },
        { text: "layer", value: "layer" },
        { text: "content", value: "content" },
      ],
      contents: [
        { id: 1, name: "kanko1", layer: "包蔵地1", content: "" },
        { id: 2, name: "kanko2", layer: "包蔵地2", content: "" },
        { id: 3, name: "kanko3", layer: "包蔵地3", content: "" },
      ],
      host: "harima-isk",
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
      let query = `http://localhost:50001/table`;
      this.axios
        .get(query)
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
    changeTable() {
      let query = "";
      query = `http://localhost:50001/columns/${this.selectedTable}`;
      this.axios
        .get(query)
        .then((res) => {
          //成功時
          console.log("table", res.data);
          const columns = res.data.columns;
          let headers = this.headers;
          headers = [];
          for (const i in columns) {
            const columnName = columns[i].columnName;
            headers.push({ text: columnName, value: columnName, shown: true });
          }
          this.headers = headers;
          console.log(columns);
        })
        .catch((err) => {
          return err.response;
        });
    },
    selectTableShown() {
      const url = `http://localhost:50001/display/${this.selectedTable}`;
      this.axios
        .get(url)
        .then((res) => {
          //成功時
          console.log("table", res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    registerTableShown() {
      const url = `http://localhost:50001/display/${this.selectedTable}`;
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
      this.axios
        .post(url, data, option)
        .then((res) => {
          //成功時
          console.log("table", res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    changeTableShown() {
      const url = `http://localhost:50001/display/${this.selectedTable}`;
      const data = {
        data: {
          key: "name",
          id: this.selectedTable,
          update: { display: JSON.stringify(this.headers) },
        },
      };
      const option = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      this.axios
        .put(url, data, option)
        .then((res) => {
          //成功時
          console.log("table", res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    deleteTableShown() {
      const url = `http://localhost:50001/display/${this.selectedTable}`;
      const data = {};
      const option = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      this.axios
        .delete(url, data, option)
        .then((res) => {
          //成功時
          console.log("table", res.data);
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
    this.getLogData();
    this.getUserData();
  },
};
</script>
