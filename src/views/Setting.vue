<template>
  <v-main>
    <v-container fluid fill-height>
      <v-row>
        <v-col cols="12" sm="8" md="6" lg="6" xl="6">
          <v-card>
            <v-toolbar>ログ</v-toolbar>
            <v-data-table
              :headers="logHeaders"
              :items="logContents"
              class="elevation-1 overflow-auto"
              fixed-header
              fixed-footer
              height="300px"
            >
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="8" md="6" lg="4" xl="3">
          <v-card color="#fff" outlined>
            <v-toolbar> ユーザー情報 </v-toolbar>
            <v-data-table
              :headers="userHeaders"
              :items="userContents"
              class="userinfo elevation-1 overflow-auto"
              fixed-header
              fixed-footer
              height="300px"
              :header-props="{
                'sort-icon': '▼',
              }"
              :items-per-page="5"
            >
            </v-data-table>
          </v-card>
        </v-col>
        <v-col cols="12" sm="8" md="6" lg="4" xl="3">
          <v-card color="#fff" outlined>
            <v-toolbar> ログ </v-toolbar>
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
          </v-card>
        </v-col>
        <v-col cols="12" sm="8" md="6" lg="4" xl="3">
          <v-card color="#fff" outlined>
            <v-toolbar> データ </v-toolbar>
            <v-data-table
              :headers="headers"
              :items="contents"
              class="userdata elevation-1 overflow-auto"
              fixed-header
              fixed-footer
              height="300px"
              :header-props="{
                'sort-icon': '▼',
              }"
              :items-per-page="5"
            >
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
export default {
  name: "Setting",
  components: {},
  data() {
    return {
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
      host: "localhost",
    };
  },
  computed: {
    loginData() {
      return this.$store.getters[`auth/login`];
    },
  },
  methods: {
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
          console.log(headers);
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

    getSearchData() {
      const username = this.loginData.name;
      const url = `http://${this.host}:50001/system/search/${username}`;
      this.loading = true;
      this.axios
        .get(url)
        .then((res) => {
          console.log(res.data);
          const columnNames = res.data.columns.map((x) => x.columnName);
          let headers = [];
          for (const i in columnNames) {
            const name = columnNames[i];
            headers.push({ text: name, value: name });
          }

          const contents = res.data.rows;

          this.userHeaders = headers;
          this.userContents = contents;
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
          const contents = res.data.rows;
          this.searchHeaders = h;
          this.searchContents = contents;
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
    this.getLogData();
    this.getSearchData();
    this.getUserData();
  },
};
</script>
