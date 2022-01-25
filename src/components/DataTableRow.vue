<template>
  <v-data-table
    v-model="selectData"
    :headers="headers"
    :items="items"
    class="document elevation-1 overflow-auto"
    show-select
    single-select
    fixed-header
    fixed-footer
    height="300px"
    :header-props="{
      'sort-icon': '▼',
    }"
    :items-per-page="5"
    hide-default-header
  >
    <template v-slot:header="{ props: { headers } }">
      <thead>
        <tr>
          <th v-for="(h, index) in headers" :class="h.class" :key="index">
            <span :class="`text-${bkPoint.model}`">{{ h.text }}</span>
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
          v-for="header in headers"
          :key="header.value"
          :class="`text-${bkPoint.model}`"
        >
          {{ item[header.value] }}
        </td>
      </tr>
    </template>
  </v-data-table>
</template>

<script>
export default {
  //   mixins: [programmatic],
  props: {
    message: {
      type: String,
      required: true,
    },
    okAction: {
      type: Function,
      required: true,
    },
    cancelAction: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      a: "",
      b: null,
    };
  },
  methods: {
    ok() {
      this.okAction();
      this.close();
    },
    cancel() {
      this.cancelAction();
      this.close();
    },
  },
};
</script>
