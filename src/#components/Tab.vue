<template>
  <v-container>
    <v-toolbar color="cyan" dark flat>
      <v-tabs
        v-model="tab"
        background-color="cyan"
        dark
        next-icon="mdi-arrow-right-bold-box-outline"
        prev-icon="mdi-arrow-left-bold-box-outline"
        show-arrows
      >
        <v-tabs-slider color="yellow"></v-tabs-slider>

        <v-tab v-for="item in items" :key="item.tab">
          {{ item.tab }}
        </v-tab>
      </v-tabs>
    </v-toolbar>

    <v-tabs-items v-model="tab">
      <v-tab-item v-for="item in items" :key="item.tab">
        <v-card flat>
          <component v-bind:is="item.content"></component>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script>
import Sheet from "./Sheet";
import IP from "./IPSetting";
// import TableEvent from "./TableEvent";
// import Modal from "./Modal";
import CounterView from "./CounterView";
// import Draggable from "./Draggable.vue";

export default {
  name: "Tab",
  components: {
    Sheet,
    IP,
    // TableEvent,
    // Modal,
    CounterView,
    // Draggable,
  },
  data() {
    return {
      tab: null,
      items: [
        { tab: "Sheet", content: "Sheet" },
        { tab: "IP Setting", content: "IP" },
        // { tab: "Table Event", content: "TableEvent" },
        // { tab: "Modal", content: "Modal" },
        { tab: "CounterView", content: "CounterView" },
        // { tab: "Draggable", content: "Draggable" },
      ],
    };
  }, //
  methods: {},
  computed: {
    selectTab: function () {
      return this.tab.toLowerCase();
    },
  },
};
</script>
