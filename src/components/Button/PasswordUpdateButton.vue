<template>
  <v-btn
    class="info"
    @click="dialog = true"
    id="loginbtn"
    :class="`text-${bkPoint.model}`"
    :width="bkPoint.btnWidth + 100"
    :height="bkPoint.btnHeight"
    >パスワード更新
    <v-dialog v-model="dialog" max-width="500px" scrorable persistent>
      <CardPasswordUpdate
        :dialog="dialog"
        :bkPoint="bkPoint"
        @clickSubmit="save"
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
    user: {
      type: String,
      default: "",
      required: true,
    },
    password: {
      type: String,
      default: "",
      required: true,
    },
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
  computed: {
    loginData() {
      return this.$store.getters[`auth/login`];
    },
    loginElapsed() {
      return this.$store.getters[`auth/elapsed`];
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
