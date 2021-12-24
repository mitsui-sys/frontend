<template>
  <v-btn text to="/login" v-if="!loginData.token">ログイン</v-btn>
  <v-menu bottom offset-y v-if="loginData.token">
    <template v-slot:activator="{ on }">
      <v-btn v-on="on">{{ loginData.name }}<v-icon>mdi-account</v-icon></v-btn>
    </template>
    <v-list>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>{{ loginData.name }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>
      <v-list-item to="/setting">
        <v-list-item-content>
          <v-list-item-title class="primary--text">設定</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>
      <v-list-item @click="logout">
        <v-list-item-content>
          <v-list-item-title class="primary--text"
            >ログアウト</v-list-item-title
          >
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  name: "LoginButton",
  data() {
    return {
      content: "",
    };
  },
  computed: {
    loginData() {
      return this.$store.getters[`auth/login`];
    },
  },
  methods: {
    logout() {
      console.log(this.token);
      this.$store.dispatch(`auth/destroy`);
      // already logined
      this.$router.push("/login", () => {});
    },
  },
  mounted() {},
};
</script>
