<template>
  <v-btn @click="windowClose">このボタンを押すとページが閉じます</v-btn>
</template>
<script>
export default {
  name: "App",
  component: {},
  data() {
    return {
      windowSetting: {
        top: 0,
        left: 0,
        height: 400,
        width: 600,
        resizable: "yes",
        scrollbars: "yes",
        location: "no",
      },
    };
  },
  computed: {},
  methods: {
    joinData(data, separator = ",") {
      let items = [];
      for (const x in data) {
        items.push(`${x}=${data[x]}`);
      }
      return items.join(separator);
    },
    linkToOtherWindow() {
      const query = this.$route.query;
      console.log(query);
      let resolvedRoute = this.$router.resolve({
        name: "page",
        query: query,
      });
      const ws = this.windowSetting;
      const options = this.joinData(ws);
      window.open(resolvedRoute.href, "詳細画面", options);
      window.close();
    },
    windowClose() {
      window.open("about:blank").close();
    },
  },
  mounted() {
    // window.open("_self").close();
    // window.open("_self", "_blank").close();
    this.linkToOtherWindow();
  },
};
</script>
