<template>
  <v-dialog v-model="dialog" max-width="700px" scrorable @click:outside="close">
    <v-card>
      <v-card-title>
        <span class="text-h5">{{ dialogTitle }}</span>
        <v-spacer></v-spacer>
      </v-card-title>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn outlined color="blue darken-1" text @click="save">
          {{ dialogYesText }}
        </v-btn>
        <v-btn outlined color="blue darken-1" text @click="close">
          {{ dialogNoText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  name: "Setting",
  components: {},
  data() {
    return {
      dialog: false,
      dialogTitle: "確認",
      dialogYesText: "はい",
      dialogNoText: "いいえ",
    };
  },
  computed: {
    loginData() {
      return this.$store.getters[`auth/login`];
    },
  },
  methods: {
    save() {},
    close() {},
  },
};
</script>
