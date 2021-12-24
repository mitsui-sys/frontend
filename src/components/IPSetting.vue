<template>
  <v-app>
    <v-container>
      <v-card-title>PostgreSQL サーバー</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="text1"
          label="IPアドレス"
          :rules="[required, limit_length]"
          counter="20"
        >
        </v-text-field>
        <v-text-field v-model="text2" label="ポート番号" :rules="[required]">
        </v-text-field>
        <v-text-field v-model="text3" label="テーブル名" />
        <v-text-field v-model="text4" label="ユーザ名" />
        <v-text-field v-model="text5" label="パスワード" />
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn text v-on:click="submit">送信する</v-btn>
        <span v-if="success">送信成功！</span>
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

<style>
.container {
}
.v-data-table-header {
  font-size: 20;
}
</style>

<script>
export default {
  name: "IPSetting",
  components: {},
  data() {
    return {
      // 各テキストボックスの値
      text1: "172.20.30.214",
      text2: "5432",
      text3: "harima_houzouchi",
      text4: "postgres",
      text5: "postgres",
      // 送信が成功したかどうかのフラグ
      success: false,
      ip_backend: "127.0.0.1",
      port_backend: "7000",
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
  methods: {
    // 送信を試みるメソッド（「送信する」がクリックされたときに呼ばれる）
    submit() {
      let postdata = {
        host: this.text1,
        port: this.text2,
        database: this.text3,
        user: this.text4,
        password: this.text5,
      };
      let ip = this.ip_backend;
      let port = this.port_backend;
      let query = `http://${ip}:${port}/init`;
      console.log("send query", postdata);
      this.axios
        .post(query, postdata)
        .then((res) => {
          this.items = res.data;
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
