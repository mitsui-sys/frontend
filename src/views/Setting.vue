<template>
  <v-main>
    <v-container fluid fill-height>
      <v-row>
        <v-col cols="12" sm="8" md="6" lg="6" xl="6">
          <v-card>
            <v-toolbar>設定</v-toolbar>
            <v-card-text>
              <v-switch
                v-model="development"
                label="開発者モード"
                @change="changeDev"
              />
              <v-container fluid>
                <v-row>
                  <v-col v-for="col in headers" :key="col.value">
                    <v-switch
                      v-model="col.shown"
                      :label="`${col.text}`"
                    ></v-switch>
                  </v-col>
                </v-row>
              </v-container>
              <p class="text-center">
                新規登録は
                <router-link to="/signup">こちら</router-link>
              </p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="8" md="6" lg="4" xl="3">
          <v-card color="#fff">
            <v-toolbar> ユーザー情報 </v-toolbar>
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
        <v-col cols="12" sm="8" md="6" lg="4" xl="3">
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
        <v-col cols="12" sm="8" md="6" lg="4" xl="3">
          <v-card color="#fff">
            <v-toolbar> データ </v-toolbar>
            <v-card-text>
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
            </v-card-text>
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
  },
  methods: {
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
