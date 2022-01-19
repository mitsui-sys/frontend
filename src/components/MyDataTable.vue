<template>
  <v-data-table
    v-model="selected"
    :headers="shownHeaders"
    :items="contents"
    :items-per-page="25"
    :footer-props="{ itemsPerPageOptions: [5, 25, 50, 100] }"
    item-key="gid"
    show-select
    single-select
    @click:row="clickRow"
    class="elevation-1 overflow-auto"
    fixed-header
    fixed-footer
    height="400px"
    calculate-widths
    :header-props="{
      'sort-icon': '▼',
    }"
  >
    <template v-slot:top> </template>

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
        <td v-for="header in shownHeaders" :key="header.value">
          {{ item[header.value] }}
        </td>
      </tr>
    </template>
  </v-data-table>
</template>

<script>
export default {
  name: "Dialog",
  props: ["selected", "headers", "contents"],
  data() {
    return {
      page: 0,
    };
  },
  computed: {
    shownHeaders() {
      return this.header.filter((x) => x.shown);
    },
  },
};
</script>
