<template>
  <v-btn class="info" @click="dialog = true"
    >パスワード更新
    <v-dialog v-model="dialog" max-width="500px" scrorable persistent>
      <CardPasswordUpdate
        :dialog="dialog"
        :bkPoint="bkPoint"
        @clickSubmit="dialog = false"
        @clickCancel="dialog = false"
      />
    </v-dialog>
  </v-btn>
</template>
<script>
// import http from "@/modules/http";
import CardPasswordUpdate from "@/components/Card/CardPasswordUpdate";
export default {
  components: { CardPasswordUpdate },
  props: {
    bkPoint: {
      default: "",
    },
  },
  data() {
    return {
      dialog: false,
      show: false,
      internal_user: "",
      internal_password: "",
    };
  },
  watch: {
    user(val) {
      this.internal_user = val;
    },
    password(val) {
      this.internal_password = val;
    },
  },
  methods: {
    async confirm() {},
    close() {
      this.dialog = false;
    },
  },
  mounted() {},
};
</script>
