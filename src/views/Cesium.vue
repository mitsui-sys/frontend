<template>
  <div class="viewer"></div>
</template>

<script>
// import * from "https://cesium.com/downloads/cesiumjs/releases/1.81/Build/Cesium/Cesium.js"

export default {
  name: "Cesium",
  data() {
    return {
      center: [35.681, 139.763],
      zoom: 14,
      marker: [35.681, 139.763],
    };
  },
  methods: {},
};
</script>

<style>
.viewer {
  width: 100%;
  height: 400px;
}
</style>
