<template>
  <div>
    <v-card class="d-flex flex-column flex-wrap" width="600">
      <v-form ref="form" v-model="valid">
        <v-card-title class="d-flex justify-center pa-0 mt-6 mb-3"
          >新規登録</v-card-title
        >
        <v-card-text class="d-flex justify-center flex-column">
          <div class="mx-9" v-for="(item, key, index) in items" :key="index">
            <v-text-field placeholder="値を入力" outlined dense>
              <template v-slot:label>
                {{ item.text }}
              </template>
            </v-text-field>
          </div>
          <div class="text-center">
            <v-btn class="primary" :disabled="!valid" @click="register"
              >登録</v-btn
            >
          </div>
        </v-card-text>
      </v-form>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "userRegister",
  computed: {
    tblHeader() {
      return this.$store.getters[`table/header`];
    },
    tblContent() {
      return this.$store.getters[`table/content`];
    },
    tblSelected() {
      return this.$store.getters[`table/selected`];
    },
    backend_ip() {
      return this.$store.getters[`backend/ip`];
    },
    backend_port() {
      return this.$store.getters[`backend/port`];
    },
    backend_ipaddress() {
      return this.$store.getters[`backend/ipaddress`];
    },
  },
  data() {
    return {
      valid: false,
      valueRules: [
        (v) => !!v || "user name is required",
        // (v) => (v && v.length <= 15) || "最大15文字です。",
      ],
      nameRules: [
        (v) => !!v || "user name is required",
        (v) => (v && v.length <= 15) || "最大15文字です。",
      ],
      mailRules: [
        (v) => !!v || "mail is required",
        (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
      ],
      pwRules: [(v) => !!v || "password is required"],
      headers: [],
      items: [
        { text: "ID", value: "999" },
        { text: "名前", value: "kanko" },
        { text: "メールアドレス", value: "test@sample.com" },
        { text: "住所", value: "大阪府大阪市" },
        { text: "日付", value: "2021/01/01" },
      ],
    };
  },
  methods: {
    validate() {
      this.$refs.form.validate();
    },
    submitTwitter() {
      // ツイッターログインの処理
    },
    submitGoogle() {
      // グーグルログインの処理
    },
    register() {
      const data = this.$refs.form;
      console.log("register", data);
      console.log("ip", this.backend_ipaddress);
      this.axios
        .post(`${this.backend_ipaddress}/db`, data)
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
    },
  },
  mounted() {
    this.axios
      .get("./resources/reg_data.json")
      .then(() => {
        this.items = this.tblHeader.copy();
        console.log("mounted", this.items);
      })
      .catch((error) => console.error(error));
  },
};
</script>
