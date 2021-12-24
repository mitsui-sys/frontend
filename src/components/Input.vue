<template>
  <v-text-field
    v-if="name == 'a'"
    v-model="item.value"
    placeholder="値1を入力"
    outlined
    clearable
    dense
  />
  <v-text-field
    v-else-if="name == 'b'"
    v-model="item.value"
    placeholder="値2を入力"
    outlined
    clearable
    dense
  />
  <v-text-field
    v-else-if="name == 'c'"
    v-model="item.value"
    placeholder="値3を入力"
    outlined
    clearable
    dense
  />
</template>

<script>
export default {
  name: "aboinputut",
  data() {
    return {
      name: "a",
    };
  },
};
</script>
