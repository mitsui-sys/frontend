<template>
  <v-card color="#fff">
    <v-toolbar> ログ設定 </v-toolbar>
    <v-card-text>
      <MyTable
        :headers="shownHeaders"
        :items="showContents"
        :itemkey="log.itemkey"
        :bkPoint="bkPoint"
        :sortByItem="sortByItem"
        :sortByDesc="sortByDesc"
        @childChange="applyChanges"
      />
    </v-card-text>
  </v-card>
</template>

<script>
// :headers="log.headers"
// :items="log.items"
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
      headers: [],
      contents: [],
      sortByItem: [],
      sortByDesc: [],
    };
  },
  computed: {
    shownHeaders() {
      return this.headers.filter((h) => h.shown > 0);
    },
    editHeaders() {
      return this.headers.filter((h) => h.shown > 1);
    },
    showContents() {
      let data = this.contents;
      for (const i in data) {
        let row = data[i];
        // const headers = this.shownHeaders.filter((x) => x.type == "DATE");
        const headers = this.shownHeaders.filter((x) => x.data_type == "日付");
        for (const h of headers) {
          // const text = h.text;
          const text = h.value;
          const value = row[text];
          //空でなければ
          if (value) {
            row[text] = Moment(value).format("YYYY/MM/DD");
          }
        }
      }
      return data;
    },
    defaultItem() {
      let data = [];
      let header = Object.assign(this.editHeaders);
      console.log("初期値", header);
      for (const h of header) {
        const type = this.setDataType(h.type);
        data.push({
          text: h.text,
          value: null,
          type: type,
          text_origin: h.value,
        });
      }
      return data;
    },
    replaceData() {
      return this.$store.getters[`table/replace`];
    },
    displayData() {
      return this.$store.getters[`table/display`];
    },
  },
  methods: {
    setDataType(typeName) {
      return typeName == "整数" || typeName == "小数"
        ? "number"
        : typeName == "文字列"
        ? "text"
        : typeName == "日付"
        ? "date"
        : "text";
    },
    initilize() {
      const user_replace =
        this.replaceData.rows.filter((x) => x.table == "log") || null;
      //表示属性の順序を変更する
      const user_replace_new = user_replace.sort((a, b) => {
        if (a.display_number < b.display_number) return -1;
        if (b.display_number < a.display_number) return 1;
        return 0;
      });
      let newReplaceData = [];
      for (let rep of user_replace_new) {
        rep["text"] = rep["replace"];
        rep["value"] = rep["column"];
        rep["type"] = this.setDataType(rep["data_type"]);
        rep["shown"] = rep["display_type"];
        newReplaceData.push(rep);
      }
      // console.log("属性表示", newReplaceData);
      this.headers = newReplaceData;
    },
    applyChanges(select) {
      // console.log("parentChange", select);
      this.select = select;
    },
    async getLogData() {
      const url = `/system/log`;
      const res = await http.get(url);
      if (res.status == 200) {
        // this.getDisplayData(res);
        this.contents = res.data.rows;
      } else {
        console.log(res);
        alert("処理が正しく行えませんでした。時間をおいてやり直してください。");
      }
    },
  },
  created() {
    this.initilize();
    this.$nextTick(() => {
      this.getLogData();
    });
  },
};
</script>
