<template>
  <v-card color="#fff">
    <v-toolbar>
      {{ title }}
      <v-spacer />
      <v-divider vertical />
      <v-btn v-for="(b, i) in buttons" :key="i" class="mx-2">
        {{ b.name }}
      </v-btn>
      <!--
      <v-divider vertical />
      <span class="mx-2">
        新規登録は
        <router-link to="/signup">こちら</router-link>
      </span>
      -->
    </v-toolbar>
    <v-card-text>
      <MyTable
        :headers="user.headers"
        :items="user.items"
        :itemkey="user.itemkey"
        :bkPoint="bkPoint"
        @childChange="applyChanges"
      />
    </v-card-text>
  </v-card>
</template>

<script>
import Moment from "moment";
import MyTable from "@/components/DataTable/MyTable";
export default {
  name: "setting2",
  components: { MyTable },
  props: ["bkPoint"],
  data() {
    return {
      title: "ユーザー情報",
      buttons: [
        { name: "新規作成", color: "", event: "" },
        { name: "閲覧", color: "", event: "" },
        { name: "更新", color: "", event: "" },
        { name: "削除", color: "", event: "" },
      ],
      user: {
        select: [],
        headers: [],
        items: [],
        data: [],
        sorts: {},
        sortBy: "no",
        sortDesc: false,
        itemkey: "no",
      },
      tableHeight: 300,
      select: [],
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
    toggleOrder(text, index) {
      console.log(this.user.sortBy, index);
      const desc = !this.user.headers[index].sortDesc;
      this.user.headers[index].sortDesc = desc ? true : false;
      this.user.sortBy = text;
      this.user.sortDesc = desc;
    },
    getUserData() {
      const url = `${this.url}/system/user`;
      this.loading = true;
      this.axios
        .get(url)
        .then((res) => {
          console.log("success", res.data);
          this.user.data = Object.assign(res.data);
          const columnNames = res.data.columns.map((x) => x.columnName);
          let h = [];
          let sorts = {};
          for (const i in columnNames) {
            const name = columnNames[i];
            h.push({ text: name, value: name, sortDesc: false });
            sorts[name] = true;
          }

          let rows = res.data.rows;
          console.log(rows);
          for (const key in rows) {
            const _date = rows[key]["created_day"];
            rows[key]["created_day"] = Moment(_date).format("YYYY/MM/DD");
          }
          this.user.headers = Object.assign(h);
          this.user.items = Object.assign(rows);
          this.user.sorts = Object.assign(sorts);
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
  created() {
    // リアクティブデータ作成後に行いたい処理
    this.getUserData();
  },
};
</script>
