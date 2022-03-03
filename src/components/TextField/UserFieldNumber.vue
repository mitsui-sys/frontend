<template>
  <v-text-field
    v-model="value"
    :class="`text-${bkPoint.model}`"
    @input="$emit('update:user', $event)"
    :rules="[required]"
    type="number"
  >
  </v-text-field>
</template>
<script>
export default {
  props: {
    user: {
      type: Number,
      default: null,
      required: true,
    },
    bkPoint: {},
  },
  data() {
    return {
      required: (value) => !!value || "必ず入力してください", // 入力必須の制約
      limit_length: (value) =>
        value.length <= 10 || "10文字以内で入力してください", // 文字数の制約
    };
  },
};
</script>
