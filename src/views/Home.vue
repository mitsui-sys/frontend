<template>
  <v-content>
    <v-container fluid fill-height>
      <v-row class="blue lighten-4" justify="center" align-content="center">
        <v-col cols="4" align="center">
          <h1>{{ title }}</h1>
          <v-divider></v-divider>
          <v-container>
            <v-row v-for="(item, index) in items" :key="index">
              <v-col>
                <v-btn :to="item.link" :color="item.color">{{
                  item.text
                }}</v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-col>
      </v-row>
    </v-container>
  </v-content>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      title: "台帳システム",
      label: { link: "利用規約", text: "に同意して利用する" },
      items: [
        { text: "包蔵地台帳", link: "/sheet", color: "red" },
        { text: "照会・回答調査台帳", link: "/sheet", color: "blue" },
        { text: "発掘調査台帳", link: "/sheet", color: "green" },
        { text: "指定文化財台帳", link: "/sheet", color: "yellow" },
        { text: "台帳管理", link: "/sheet", color: "gray" },
        { text: "操作方法", link: "/manual" },
        { text: "問い合わせ", link: "/help" },
      ],
    };
  },
  mounted() {},
};
</script>
