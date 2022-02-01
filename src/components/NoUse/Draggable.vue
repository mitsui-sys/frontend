<template>
  <v-app>
    <draggable v-model="items" draggable=".item">
      <div v-for="item in items" :key="item.id" class="item">
        {{item.name}}
      </div>
    </draggable>
    <button>表示</button>
  </v-app>
</template>
<script>
import draggable from "vuedraggable";

export default {
  name: "Draggable",
  components: {
      draggable
  },
  data() {
    return {
      drag:false,
      items:[
        { id: 1, name:"test1"},
        { id: 2, name:"test2"},
        { id: 3, name:"test3"},
        { id: 4, name:"test4"},
        { id: 5, name:"test5"}
      ],
    }
  },
  methods: {
    showItems() {
      alert(this.items.map(val => { return val.id }))
    }
  }
}