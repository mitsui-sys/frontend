<template>
  <v-app>
    <v-container>
      <v-card-title>PostgreSQL サーバー</v-card-title>
      <v-card-text>
        <v-container>
          <v-row v-for="(data, index) in input" :key="index" no-gutters>
            <v-col>
              <v-subheader>{{ data.label }}</v-subheader>
            </v-col>
            <v-col>
              <v-text-field v-model="data.value" counter="20" />
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-divider></v-divider>
      <v-checkbox
        v-model="checkbox1"
        :label="`localhostへ送信: ${checkbox1.toString()}`"
      />
      <v-card-actions>
        <v-btn text v-on:click="submit">送信する</v-btn>
      </v-card-actions>
    </v-container>
    <v-container>
      <v-data-table :headers="headers" :items="items"> </v-data-table>
      <v-snackbar v-model="snack" :timeout="3000" :color="snackColor">
        {{ snackText }}
      </v-snackbar>
    </v-container>
  </v-app>
</template>

<script>
export default {
  name: "IPSetting",
  components: {},
  data() {
    return {
      checkbox1: false,
      // 各テキストボックスの値
      input: [
        { label: "IPアドレス", value: "" },
        { label: "ポート番号", value: "" },
        { label: "データベース名", value: "" },
        { label: "ユーザ", value: "" },
        { label: "パスワード", value: "" },
      ],
      // 送信が成功したかどうかのフラグ
      success: false,
      headers: [
        {
          text: "Table Name",
          value: "tablename",
        },
      ],
      items: [],
      snack: false,
      snackColor: "",
      snackText: "",
      //入力規則
      max25chars: (v) => v.length <= 25 || "Input too long!",
      required: (value) => !!value || "必ず入力してください", // 入力必須の制約
      limit_length: (value) =>
        value.length <= 20 || "20文字以内で入力してください", // 文字数の制約
    };
  },
  computed: {
    host() {
      return this.$store.getters[`table/host`];
    },
    port() {
      return this.$store.getters[`table/port`];
    },
    user() {
      return this.$store.getters[`table/user`];
    },
    password() {
      return this.$store.getters[`table/password`];
    },
    tableName() {
      return this.$store.getters[`table/tableName`];
    },
    tblNameList() {
      return this.$store.getters[`table/tableNameList`];
    },
    backend_ip() {
      return this.$store.getters[`backend/ip`];
    },
    backend_port() {
      return this.$store.getters[`backend/port`];
    },
    backend_url() {
      return this.$store.getters[`backend/url`];
    },
  },

  methods: {
    // 送信を試みるメソッド（「送信する」がクリックされたときに呼ばれる）
    submit() {
      let postdata = {
        host: this.host,
        port: this.port,
        database: this.tableName,
        user: this.user,
        password: this.password,
      };

      let query = this.checkbox1
        ? `http://127.0.0.1:50001/init`
        : `${this.backend_url}/init`;
      console.log("send query", postdata);
      this.axios
        .post(query, postdata)
        .then((res) => {
          this.items = res.data;
          this.$store.dispatch(`table/updateTableNameList`, res.data);
          console.log("tableName", this.tableNameList);
        })
        .catch((err) => {
          return err.response;
        });
    },
    successed() {
      this.snack = true;
      this.snackColor = "success";
      this.snackText = "Success!";
    },
    failed() {
      this.snack = true;
      this.snackColor = "error";
      this.snackText = "Failed!";
    },
  },
  mounted() {},
};
</script>
