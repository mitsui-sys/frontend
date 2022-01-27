<template>
  <v-container>
    <v-row>
      <v-btn @click="nextPage">印刷</v-btn>
      <v-btn @click="prevPage">戻る</v-btn>
      <v-btn @click="nextPage">次へ</v-btn>
      <span> {{ currentPageNum }}/{{ totalPageNum }} </span>
    </v-row>
    <v-row>
      <pdf
        :src="path"
        :page="currentPageNum"
        @num-pages="totalPageNum = $event"
      ></pdf>
    </v-row>
  </v-container>
</template>
<script>
import pdf from "vue-pdf";
export default {
  props: {
    path: {
      type: String,
      default: "",
      required: true,
    },
  },
  data() {
    return {
      pdfUrl: "/slide.pdf",
      currentPageNum: 1,
      totalPageNum: 0,
    };
  },
  components: {
    pdf,
  },
  methods: {
    prevPage() {
      if (this.currentPageNum <= 1) {
        this.currentPageNum = this.totalPageNum;
        return;
      }
      this.currentPageNum = this.currentPageNum - 1;
    },
    nextPage() {
      if (this.currentPageNum >= this.totalPageNum) {
        this.currentPageNum = 1;
        return;
      }
      this.currentPageNum = this.currentPageNum + 1;
    },
  },
};
</script>
