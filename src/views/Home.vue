<template>
  <v-container fill-height fluid>
    <v-row
      class="blue lighten-4"
      style="height: 450px"
      justify="center"
      align-content="center"
    >
      <v-col cols="4" align="center">
        <h1>{{ title }}</h1>
        <v-divider></v-divider>
        <v-container>
          <v-row v-for="(item, index) in items" :key="index">
            <v-col>
              <v-btn :to="item.link">{{ item.text }}</v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      title: "台帳システム",
      label: { link: "利用規約", text: "に同意して利用する" },
      items: [
        { text: "台帳システムへ", link: "/login" },
        { text: "操作方法", link: "/manual" },
        { text: "問い合わせ", link: "/help" },
      ],
    };
  },
  mounted() {},
};
</script>
