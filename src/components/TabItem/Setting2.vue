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
      <v-data-table
        v-model="user.select"
        :headers="user.headers"
        :items="user.items"
        :sort-by.sync="user.sortBy"
        :sort-desc.sync="user.sortDesc"
        item-key="no"
        :items-per-page="25"
        :footer-props="{ itemsPerPageOptions: [5, 25, 50, 100] }"
        class="userlog elevation-1 overflow-auto"
        fixed-header
        fixed-footer
        show-select
        single-select
        :height="tableHeight"
        :header-props="{
          'sort-icon': '▼',
        }"
        hide-default-header
      >
        <template v-slot:header="{ props: { headers } }">
          <thead>
            <tr>
              <th
                v-for="(h, index) in headers"
                :class="h.class"
                :key="index"
                @click="toggleOrder(h.text, index - 1)"
              >
                <span :class="`text-${bkPoint.model} mx-2`">{{ h.text }}</span>
                <v-btn v-if="h.text != ''" icon
                  ><v-icon v-if="!h.sortDesc">mdi-arrow-up</v-icon
                  ><v-icon v-if="h.sortDesc">mdi-arrow-down</v-icon></v-btn
                >
              </th>
            </tr>
          </thead>
        </template>
        <template v-slot:item="{ item, isSelected, select }">
          <tr
            :class="[{ 'v-data-table__selected': isSelected }]"
            @click="select(!isSelected)"
          >
            <td>
              <v-simple-checkbox
                :value="isSelected"
                :ripple="false"
                @input="select($event)"
              />
            </td>
            <td
              v-for="(header, index) in user.headers"
              :key="index"
              :class="`text-${bkPoint.model}`"
            >
              {{ item[header.value] }}
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
import Moment from "moment";
export default {
  name: "setting2",
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
    };
  },
  computed: {
    url() {
      return this.$store.getters[`backend/url`];
    },
    bkPoint() {
      // $vuetify.breakpointでブレークポイントを取得
      const bkPt = this.$vuetify.breakpoint;
      const point = {
        name: bkPt.name,
        cardHeight: 800,
        cardWidth: 800,
        cardMinHeight: 300,
        cardMinWidth: 400,
        btnWidth: 350,
        btnHeight: 50,
        titleModel: "h3",
        model: "h5",
      };
      switch (bkPt.name) {
        case "xl":
        case "lg":
        case "md":
          point.cardHeight = 800;
          point.cardWidth = 800;
          point.btnWidth = 350;
          point.btnHeight = 50;
          point.titleModel = "h4";
          point.model = "h6";
          break;
        case "sm":
        case "xs":
          point.cardHeight = 800;
          point.cardWidth = 800;
          // point.cardMinHeight = 400;
          // point.cardMinWidth = 400;
          point.btnWidth = 350;
          point.btnHeight = 50;
          point.titleModel = "h5";
          point.model = "subtitle1";
          break;
        default:
          break;
      }
      return point;
    },
  },
  methods: {
    toggleOrder(text, index) {
      console.log(this.user.sortBy, index);
      const desc = !this.user.headers[index].sortDesc;
      this.user.headers[index].sortDesc = desc ? true : false;
      this.user.sortBy = text;
      this.user.sortDesc = desc;
    },
    // nextSort(headers, sortBy) {
    //   let index = headers.findIndex((h) => h.value === sortBy);
    //   index = (index + 1) % headers.length;
    //   sortBy = headers[index].value;
    // },
    getUserData() {
      const url = `${this.url}/system/user`;
      this.loading = true;
      this.axios
        .get(url)
        .then((res) => {
          console.log(res.data);
          this.user.data = Object.assign(res.data);
          const columnNames = res.data.columns.map((x) => x.columnName);
          let h = [];
          let sorts = {};
          for (const i in columnNames) {
            const name = columnNames[i];
            h.push({ text: name, value: name, sortDesc: true });
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
