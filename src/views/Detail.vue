<template>
  <div></div>
</template>

<script>
import http from "@/modules/http";
export default {
  data() {
    return {};
  },
  computed: {
    detail_user() {
      return this.$store.getters[`table/detail_user`];
    },
    detail_search() {
      return this.$store.getters[`table/detail_search`];
    },
  },
  methods: {
    async getReplace() {
      const url = "/system/replace";
      const res = await http.getReplace(url);
      if (res.status == 200) {
        const data = res.data;
        await this.$store.dispatch(`table/updateReplace`, data);
        console.log("Replace", this.replaceData);
      } else {
        console.error(res);
      }
    },
    async getDisplay() {
      const url = "/display";
      const res = await http.get(url);
      if (res.status == 200) {
        const data = res.data;
        await this.$store.dispatch(`table/updateDisplay`, data);
        console.log("Display", this.displayData);
      } else {
        console.error(res);
      }
    },
  },
  mounted() {
    //クエリパラメータがあれば
    let query = this.$route.query;

    if (Object.keys(query).length > 0) {
      console.log("query", query);
      //パラメータにlayerが存在するか

      if ("layer" in query) {
        // const layer = query.layer;
        // const user = query.user;
        console.log(query);
        this.$store.dispatch(`table/updateDetail`, query);
        this.$nextTick(() => {
          console.log(this.detail_user);
          console.log(this.detail_search);
          this.$router.push("/detailview");
        });
      }
    }
  },
};
</script>
