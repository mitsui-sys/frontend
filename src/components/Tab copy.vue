<template>
  <v-app>
    <v-card>
      <v-toolbar color="cyan" dark flat>
        <v-app-bar-nav-icon></v-app-bar-nav-icon>

        <v-toolbar-title>Your Dashboard</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn icon>
          <v-icon>mdi-magnify</v-icon>
        </v-btn>

        <v-btn icon>
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>

        <template v-slot:extension>
          <v-tabs
            v-model="tab"
            fixed-tabs
            align-with-title
            next-icon="mdi-arrow-right-bold-box-outline"
            prev-icon="mdi-arrow-left-bold-box-outline"
          >
            <v-tabs-slider color="yellow"></v-tabs-slider>

            <v-tab v-for="item in items" :key="item.tab">
              {{ item.tab }}
            </v-tab>
          </v-tabs>
        </template>
      </v-toolbar>

      <v-tabs-items v-model="tab">
        <v-tab-item v-for="item in items" :key="item.tab">
          <v-card flat>
            <component v-bind:is="item.content"></component>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </v-app>
</template>

<script>
import Sheet from "./Sheet";
import IP from "./IPSetting";

export default {
  name: "Tab",
  components: { Sheet, IP },
  data() {
    return {
      tab: null,
      items: [
        { tab: "Sheet", content: "Sheet" },
        { tab: "IP Setting", content: "IP" },
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
