<template>
  <v-footer dark padless>
    <v-card flat tile class="indigo lighten-1 white--text text-center">
      <v-card-text>
        <v-btn v-for="icon in icons" :key="icon" class="mx-4 white--text" icon>
          <v-icon size="24px">
            {{ icon }}
          </v-icon>
        </v-btn>
      </v-card-text>

      <v-card-text class="white--text pt-0">
        Phasellus feugiat arcu sapien, et iaculis ipsum elementum sit amet.
        Mauris cursus commodo interdum. Praesent ut risus eget metus luctus
        accumsan id ultrices nunc. Sed at orci sed massa consectetur dignissim a
        sit amet dui. Duis commodo vitae velit et faucibus. Morbi vehicula
        lacinia malesuada. Nulla placerat augue vel ipsum ultrices, cursus
        iaculis dui sollicitudin. Vestibulum eu ipsum vel diam elementum tempor
        vel ut orci. Orci varius natoque penatibus et magnis dis parturient
        montes, nascetur ridiculus mus.
      </v-card-text>

      <v-divider></v-divider>

      <v-card-text class="white--text">
        {{ new Date().getFullYear() }} — <strong>Vuetify</strong>
      </v-card-text>
    </v-card>
  </v-footer>
</template>

<script>
export default {
  name: "Sheet",
  data() {
    return {
      icons: ["mdi-facebook", "mdi-twitter", "mdi-linkedin", "mdi-instagram"],
    };
  },
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
    db_ip() {
      return this.$store.getters[`db/ip`];
    },
    db_port() {
      return this.$store.getters[`db/port`];
    },
    db_ipaddress() {
      return this.$store.getters[`db/ipaddress`];
    },
    backend_ip() {
      return this.$store.getters[`backend/ip`];
    },
    backend_port() {
      return this.$store.getters[`backend/port`];
    },
    backend_ipaddress() {
      return this.$store.getters[`backend/ipaddress`];
    },
  },
  methods: {},
};
</script>
