<template>
  <v-content>
    <v-container fluid fill-height>
      <v-row>
        <v-col cols="12" sm="8" md="6" lg="4" xl="3">
          <v-card>
            <v-toolbar>test</v-toolbar>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="8" md="6" lg="4" xl="3">
          <v-card color="#fff" outlined>
            <v-toolbar> ユーザー情報 </v-toolbar>
            <v-data-table
              :headers="userHeader"
              :items="userContents"
              class="userinfo elevation-1 overflow-auto"
              disable-pagination
              hide-default-footer
              fixed-header
              height="200px"
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
              :headers="searchHeader"
              :items="searchContents"
              class="userlog elevation-1 overflow-auto"
              disable-pagination
              hide-default-footer
              fixed-header
              height="200px"
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
              disable-pagination
              hide-default-footer
              fixed-header
              height="200px"
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
  </v-content>
</template>

<script>
export default {
  name: "Setting",
  components: {},
  data() {
    return {
      loading: false,
      userHeader: [],
      userContents: [],
      searchHeader: [],
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
    };
  },
  computed: {
    loginData() {
      return this.$store.getters[`auth/login`];
    },
  },
  methods: {
    getSearchData() {
      const username = this.loginData.name;
      const url = `http://harima-isk:50001/system/search/${username}`;
      let body = {};
      let option = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      this.loading = true;
      this.axios
        .get(url, body, option)
        .then((res) => {
          console.log(res.data);
          const columnNames = res.data.columns.map((x) => x.columnName);
          let headers = [];
          for (const i in columnNames) {
            const name = columnNames[i];
            headers.push({ text: name, value: name });
          }

          const contents = res.data.rows;

          this.userHeader = headers;
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
      const url = `http://harima-isk:50001/system/user`;
      let body = {};
      let option = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      this.loading = true;
      this.axios
        .get(url, body, option)
        .then((res) => {
          console.log(res.data);
          const columnNames = res.data.columns.map((x) => x.columnName);
          let h = [];
          for (const i in columnNames) {
            const name = columnNames[i];
            h.push({ text: name, value: name });
          }
          const contents = res.data.rows;
          this.searchHeader = h;
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
    this.getSearchData();
    this.getUserData();
  },
};
</script>
