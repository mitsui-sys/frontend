<template>
  <v-content>
    <v-container fluid fill-height>
      <v-row class="black lighten-4" justify="center" align-content="center">
        <v-col cols="4" align="center" class="white--text">
          {{ title }}
        </v-col>
      </v-row>
      <v-row class="lighten-4" justify="center" align-content="center">
        <v-col cols="4" align="center">
          {{ message }}
          <v-divider></v-divider>
          <p class="text-center">
            <router-link to="/">ホームへ戻る</router-link>
          </p>
        </v-col>
      </v-row>
    </v-container>
  </v-content>
</template>
<v-card>

</v-card>
<script>
export default {
  name: "error",
  data() {
    return {
      title: "404 NOT FOUND",
      message: "お探しのページが見つかりませんでした。",
    };
  },
};
</script>
