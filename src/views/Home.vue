<template>
  <v-main>
    <v-container fluid fill-height>
      <v-row class="blue lighten-4" justify="center" align-content="center">
        <v-col cols="4" align="center">
          <h1>{{ title }}</h1>
          <v-divider></v-divider>
          <v-container>
            <v-row v-for="(item, index) in items" :key="index">
              <v-col>
                <v-btn
                  :color="item.color"
                  @click="setKind(item)"
                  width="300px"
                  height="100px"
                  >{{ item.text }}</v-btn
                >
              </v-col>
            </v-row>
          </v-container>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      title: "台帳システム",
      label: { link: "利用規約", text: "に同意して利用する" },
      items: [
        { text: "包蔵地台帳", link: "/sheet", color: "gray" },
        { text: "照会・回答調査台帳", link: "/sheet", color: "gray" },
        { text: "発掘調査台帳", link: "/sheet", color: "gray" },
        { text: "指定文化財台帳", link: "/sheet", color: "gray" },
        { text: "ファイル登録", link: "/fileregister", color: "gray" },
        // { text: "台帳管理", link: "/sheet"},
        // { text: "帳票出力", link: "/chohyo"},
        { text: "操作方法", link: "/manual" },
        { text: "問い合わせ", link: "/help" },
      ],
    };
  },
  methods: {
    setKind(item) {
      this.$store.dispatch(`config/updateKind`, item.text);
      this.$router.push(item.link);
    },
  },
  mounted() {},
};
</script>
