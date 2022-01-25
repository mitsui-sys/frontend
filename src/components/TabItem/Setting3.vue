<template>
  <v-card color="#fff">
    <v-toolbar> ログ </v-toolbar>
    <v-card-text>
      <v-data-table
        :headers="log.headers"
        :items="log.items"
        class="elevation-1 overflow-auto"
        show-select
        single-select
        fixed-header
        fixed-footer
        height="300px"
      >
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
// import Moment from "moment";
export default {
  name: "setting3",
  data() {
    return {
      log: {
        headers: [],
        items: [],
      },
    };
  },
  computed: {
    url() {
      return this.$store.getters[`backend/url`];
    },
  },
  methods: {
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
