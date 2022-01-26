<template>
  <v-card color="#fff" class="condition">
    <v-row>
      <v-card-title
        class="d-flex justify-center"
        :class="`text-${bkPoint.titleModel}`"
        >検索条件</v-card-title
      >
    </v-row>
    <v-card-text class="d-flex justify-center flex-column search">
      <div class="flex">
        <v-subheader class="flex-col" :class="`text-${bkPoint.model}`"
          >台帳名</v-subheader
        >
        <v-autocomplete
          v-model="select"
          :items="tables"
          :class="`text-${bkPoint.model}`"
          outlined
          label="選択"
        ></v-autocomplete>
        <v-btn
          @click="onSubmit"
          class="flex-col mb-9 mr-1"
          :class="`text-${bkPoint.model}`"
          >検索</v-btn
        >
        <v-btn
          @click="addInput"
          class="flex-col mb-9 mr-1"
          :class="`text-${bkPoint.model}`"
          >条件追加</v-btn
        >
        <v-btn
          @click="onClear"
          class="flex-col mb-9 mr-1"
          :class="`text-${bkPoint.model}`"
          >クリア</v-btn
        >
      </div>
      <v-card max-height="200" class="overflow-auto ma-0">
        <div
          v-for="(item, index) in queryCondition"
          :key="index"
          class="flex"
          height="50px"
        >
          <v-subheader class="flex-col mt-3" :class="`text-${bkPoint.model}`"
            >条件{{ index + 1 }}</v-subheader
          >
          <v-select
            v-model="item.text"
            class="flex-col"
            :items="shownHeaders"
            label="項目"
            :class="`text-${bkPoint.model}`"
          ></v-select>
          <!-- 各入力ボックス -->
          <v-text-field
            v-model="item.value"
            class="flex-col ml-3 mr-3"
            type="text"
            label="条件"
            :class="`text-${bkPoint.model}`"
          />
          <!-- 入力ボックスの削除ボタン -->
          <v-btn
            class="flex-col"
            type="button"
            @click="removeInput(index)"
            :class="`text-${bkPoint.model}`"
          >
            削除
          </v-btn>
        </div>
      </v-card>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "filterling",
  prop: ["bkPoint", "tables", "items"],
  data() {
    return {
      title: "",
      select: "",
      queryCondition: [],
    };
  },
  computed: {
    columns() {
      return this.items[this.select];
    },
  },
  methods: {
    addInput() {
      this.queryCondition.push({ text: "", rule: "", value: "" }); // 配列に１つ空データを追加する
    },
    // ボタンをクリックしたときのイベント ③
    removeInput(index) {
      this.queryCondition.splice(index, 1); // 👈 該当するデータを削除
    },
    onSearch() {
      this.$emit("search");
    },
    onClear() {
      this.selectedName = "";
      this.queryCondition = [];
      this.$emit("clear");
    },
  },
};
</script>
