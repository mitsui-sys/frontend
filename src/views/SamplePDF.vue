<template>
  <div>
    <v-btn @click="openPDF">ボタン</v-btn>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentPage: 0,
      pageCount: 0,
    };
  },
  methods: {
    openPDF() {
      console.log("mounted");
      window.open("resources/test.pdf");
    },
  },
  mounted() {},
};
</script>
