<template>
  <v-app>
    <v-data-table
      dense
      :headers="tblPropertyHeader"
      :items="tblSelected"
      :items-per-page="25"
      :footer-props="{ itemsPerPageOptions: [5, 25, 50, -1] }"
      class="property"
    >
    </v-data-table>
    <v-snackbar v-model="snack" :timeout="3000" :color="snackColor">
      {{ snackText }}

      <template v-slot:action="{ attrs }">
        <v-btn v-bind="attrs" text @click="snack = false"> Close </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
export default {
  name: "TableContent",
  computed: {
    tblHeader() {
      return this.$store.getters[`table/header`];
    },
    tblContent() {
      return this.$store.getters[`table/content`];
    },
    tblSelected() {
      return this.$store.getters[`table/selected`];
    },
    tblPropertyHeader() {
      return this.$store.getters[`table/p_header`];
    },
    db_ip() {
      return this.$store.getters[`db/ip`];
    },
    db_port() {
      return this.$store.getters[`db/port`];
    },
    db_ipaddress() {
      return this.$store.getters[`db/ipaddress`];
    },
  },
  data() {
    return {
      snack: false,
      snackColor: "",
      snackText: "",
      max25chars: (v) => v.length <= 25 || "Input too long!",
      pagination: {},
      success: false,
    };
  },
  methods: {
    selected() {
      console.log(this.sendData);
      this.items = this.sendData;
    },
    save() {
      this.snack = true;
      this.snackColor = "success";
      this.snackText = "Data saved";
    },
    cancel() {
      this.snack = true;
      this.snackColor = "error";
      this.snackText = "Canceled";
    },
    open() {
      this.snack = true;
      this.snackColor = "info";
      this.snackText = "Dialog opened";
    },
    close() {
      console.log("Dialog closed");
    },
  },
};
</script>

<style>
.property.v-data-table {
  white-space: nowrap;
  color: #333333;
}
.property.v-data-table th {
  border: 2px #333333 solid;
  background: #55cccc;
  font-size: 32px !important;
  color: #333333;
  bold: true;
}

.property.v-data-table td {
  background: #dddddd;
  border: 1px solid;
  font-size: 24px !important;
}
.property.v-data-table tr:nth-child(odd) td {
  background: #fff;
}
</style>
