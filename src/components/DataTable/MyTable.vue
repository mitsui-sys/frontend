<template>
  <div>
    <v-data-table
      v-model="select"
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
      hide-default-header
      hide-default-footer
      @page-count="pageCount = $event"
    >
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
  props: ["headers", "items", "itemkey", "bkPoint"],
  data() {
    return {
      title: "ユーザー情報",
      isCheck: false,
      user: {
        sorts: {},
      },
      sortBy: "no",
      sortDesc: false,
      select: [],
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
    select(newVal, oldVal) {
      if (this.isCheck) console.log(newVal, oldVal);
      this.$emit("childChange", newVal);
    },
  },
  methods: {
    toggleOrder(text, index) {
      const desc = !this.headers[index].sortDesc;
      this.headers[index].sortDesc = desc ? true : false;
      this.sortBy = text;
      this.sortDesc = desc;
    },
  },
  created() {},
  mounted() {},
};
</script>
