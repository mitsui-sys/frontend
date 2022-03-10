<template>
  <v-container fluid fill-height>
    <v-row>
      <v-col cols="12" align="center">
        <LoginForm />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// import Moment from "moment";
import LoginForm from "@/components/Form/LoginForm";
export default {
  components: { LoginForm },
  data: () => ({
    title: "ログイン",
  }),
  mounted() {},
};
</script>
