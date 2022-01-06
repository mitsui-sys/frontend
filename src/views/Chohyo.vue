<template>
  <v-content>
    <v-container fluid fill-height>
      <v-row class="lighten-4" align-content="center" justify="end">
        <v-btn class="blue--text" to="/">メインメニューに戻る</v-btn>
      </v-row>
      <v-row class="lighten-4" justify="center" align-content="center">
        <v-col
          cols="4"
          align="center"
          class="yellow balck--text"
          outline-color="black"
        >
          {{ title }}
        </v-col>
      </v-row>
      <v-row class="lighten-4" justify="center" align-content="center">
        <v-col
          cols="6"
          align="center"
          v-for="(content, index) in contents"
          :key="index"
        >
          <v-btn>
            {{ content.name }}
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-content>
</template>

<script>
export default {
  name: "Daityo",
  data() {
    return {
      title: "帳票出力",
      wrap_length: 6,
      contents: [
        { name: "チェックリスト", link: "" },
        { name: "総括調書", link: "" },
        { name: "年度別総括調書", link: "" },
        { name: "基本台帳総括調書", link: "" },
        { name: "管渠延長調書", link: "" },
        { name: "年度別管渠延長調書", link: "" },
        { name: "マンホール調書", link: "" },
        { name: "年度別マンホール調書", link: "" },
        { name: "桝調書", link: "" },
        { name: "年度別桝調書", link: "" },
      ],
    };
  },
};
</script>
