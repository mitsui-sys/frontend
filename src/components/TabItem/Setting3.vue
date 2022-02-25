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
  methods: {
    async getReplace() {
      const res = await http.getReplace();
      if (res.status == 200) {
        console.log(res.data);
        this.replace = res.data;
      } else {
        console.log(res);
      }
    },
    applyChanges(select) {
      // console.log("parentChange", select);
      this.select = select;
    },
    async getDisplayData(res) {
      const columnNames = res.data.columns.map((x) => x.columnName);
      let headers = [];
      //属性名書き換え
      console.log(this.replace.data.rows);
      const rowsR = this.replace.data.rows;

      for (const i in columnNames) {
        let name = columnNames[i];
        const value = columnNames[i];

        //データがあるなら書き換える
        const data = rowsR.filter((x) => x.table == "log" && x.column == name);
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
    },
    async getLogData() {
      const url = `/system/log`;
      const res = await http.get(url);
      if (res.status == 200) {
        this.getDisplayData(res);
      } else {
        console.log(res);
        alert("処理が正しく行えませんでした。時間をおいてやり直してください。");
      }
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
