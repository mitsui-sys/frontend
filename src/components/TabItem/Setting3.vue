<template>
  <v-card color="#fff">
    <v-toolbar> ログ設定 </v-toolbar>
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
import Moment from "moment";
import http from "@/modules/http";
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
        replace: [],
      },
    };
  },
  computed: {
    url() {
      return this.$store.getters[`backend/url`];
    },
  },
  methods: {
    async getReplace() {
      const data = await http.getReplace(this.url);
      this.replace = data;
      console.log(data);
    },
    applyChanges(select) {
      // console.log("parentChange", select);
      this.select = select;
    },
    getLogData() {
      const url = `${this.url}/system/log`;
      this.axios
        .get(url)
        .then((res) => {
          const columnNames = res.data.columns.map((x) => x.columnName);
          let headers = [];
          //属性名書き換え
          const rowsR = this.replace.rows;

          for (const i in columnNames) {
            let name = columnNames[i];
            const value = columnNames[i];

            //データがあるなら書き換える
            const data = rowsR.filter(
              (x) => x.table == "log" && x.column == name
            );
            if (data.length > 0) {
              const newdata = data.shift();
              name = newdata.replace;
            }

            headers.push({ text: name, value: value, sortDesc: false });
          }
          let rows = res.data.rows;
          console.log(rows);
          for (const key in rows) {
            const _date = rows[key]["created"];
            rows[key]["created"] = Moment(_date).format("YYYY/MM/DD");
          }
          this.log.headers = Object.assign(headers);
          this.log.items = Object.assign(rows);
        })
        .catch((error) => {
          console.log(error);
          alert(
            "処理が正しく行えませんでした。時間をおいてやり直してください。"
          );
        });
    },
  },
  mounted() {
    this.getReplace();
    this.$nextTick(() => {
      this.getLogData();
    });
  },
};
</script>
