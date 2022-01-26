<template>
  <v-card color="#fff">
    <v-toolbar> ログ </v-toolbar>
    <v-card-text>
      <MyTable
        :headers="log.headers"
        :items="log.items"
        :itemkey="log.itemkey"
        :bkPoint="bkPoint"
        @childChange="applyChanges"
      />
    </v-card-text>
  </v-card>
</template>

<script>
// import Moment from "moment";
import MyTable from "@/components/DataTable/MyTable";
export default {
  name: "setting2",
  components: { MyTable },
  props: ["bkPoint"],
  data() {
    return {
      select: [],
      log: {
        headers: [],
        items: [],
        itemkey: "id",
      },
    };
  },
  computed: {
    url() {
      return this.$store.getters[`backend/url`];
    },
  },
  methods: {
    applyChanges(select) {
      // console.log("parentChange", select);
      this.select = select;
    },
    getLogData() {
      const url = `${this.url}/system/log`;
      this.loading = true;
      this.axios
        .get(url)
        .then((res) => {
          console.log(res.data);
          const columnNames = res.data.columns.map((x) => x.columnName);
          let headers = [];
          for (const i in columnNames) {
            const name = columnNames[i];
            headers.push({ text: name, value: name });
          }
          this.log.headers = Object.assign(headers);
          this.log.items = Object.assign(res.data.rows);
        })
        .catch((error) => {
          console.log(error);
          alert(
            "処理が正しく行えませんでした。時間をおいてやり直してください。"
          );
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
  mounted() {
    this.getLogData();
  },
};
</script>
