<template>
  <draggable v-model="myArray" group="people" item-key="id">
    <template #item="{element}">
      <div>{{element.name}}</div>
    </template>
  </draggable>
</template>
<script>
import draggable from "vuedraggable";

export default {
    components: {
        draggable
    },
}