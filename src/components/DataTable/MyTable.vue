<template>
  <div>
    <v-data-table
      v-model="selectdItem"
      :headers="headers"
      :items="items"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      :item-key.sync="itemkey"
      :items-per-page="itemPerPage"
      :footer-props="{ itemsPerPageOptions: itemsPerPageOptions }"
      :page.sync="page"
      class="display elevation-1 overflow-auto"
      :height="tableHeight"
      fixed-header
      fixed-footer
      show-select
      single-select
      default-header
      hide-default-footer
      multi-sort
      @page-count="pageCount = $event"
      :header-props="{ 'sort-icon': 'mdi-triangle' }"
      @click:row="clickRow"
    >
      <!--
      <template v-slot:header="{ props: { headers } }">
        <thead>
          <tr>
            <th
              v-for="(h, index) in headers"
              :class="h.class"
              :key="index"
              @click="toggleOrder(h.value, index - 1)"
              color="primary"
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
      -->
      <!--
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
            v-for="(header, index) in headers"
            :key="index"
            :class="`text-${bkPoint.model}`"
          >
            {{ item[header.value] }}
          </td>
        </tr>
      </template>
      -->
    </v-data-table>
    <v-pagination
      dense
      v-model="page"
      :length="pageCount"
      :total-visible="pageTotal"
      :class="`text-${bkPoint.model}`"
    ></v-pagination>
  </div>
</template>

<script>
export default {
  name: "MyTable",
  props: ["headers", "items", "itemkey", "bkPoint", "sortByItem", "sortByDesc"],
  data() {
    return {
      title: "ユーザー情報",
      isCheck: false,
      user: {
        sorts: {},
      },
      sortBy: [],
      sortDesc: [],
      selectdItem: [],
      tableHeight: 300,
      itemPerPage: 25,
      itemsPerPageOptions: [5, 25, 50, 100],
      page: 1,
      pageCount: 0,
      pageTotal: 7,
    };
  },
  //値の変更を確認する
  watch: {
    items() {
      console.log("表示データ更新");
      this.selectdItem = [];
    },
    selectdItem(newVal, oldVal) {
      console.log("選択データ変更", newVal, oldVal);
      this.$emit("childChange", newVal);
    },
    sortByItem() {
      this.sortBy = this.sortByItem;
      // console.log(this.sortBy);
    },
    sortByDesc() {
      this.sortDesc = this.sortByDesc;
      // console.log(this.sortDesc);
    },
  },
  methods: {
    clickRow(item, row) {
      row.select(!row.isSelected);
      console.log(row);
      // this.$emit("childChange", this.selectdItem);
    },
  },
  created() {},
  mounted() {},
};
</script>
