<template>
  <div class="cesiumContainer"></div>
</template>

<script>
// import * from "https://cesium.com/downloads/cesiumjs/releases/1.81/Build/Cesium/Cesium.js"
// import "node_modules/cesium/Build/Cesium/Widgets/widgets.css";
// import * as Cesium from "node_modules/cesium/Build/Cesium/Cesium.js";
// import "../plugins/widgets.css";
// import * as Cesium from "../plugins/Cesium.js";
// window.CESIUM_BASE_URL = "/";
// import * as Cesium from "cesium";
// import "cesium/Build/Cesium/Widgets/widgets.css";

export default {
  name: "Cesium",
  data() {
    return {
      center: [35.681, 139.763],
      zoom: 14,
      marker: [35.681, 139.763],
      point: null,
    };
  },
  methods: {
    initialize() {
      // const viewer = new Cesium.Viewer("cesiumContainer", {
      //   // imageryProvider: new Cesium.TileMapServiceImageryProvider({
      //   // 	url: Cesium.buildModuleUrl("Assets/Textures/NaturalEarthII"),
      //   // }),
      //   //Use OpenStreetMaps
      //   imageryProvider: new Cesium.OpenStreetMapImageryProvider({
      //     url: "https://a.tile.openstreetmap.org/",
      //     credit: "OSM",
      //     // url: 'https://cyberjapandata.gsi.go.jp/xyz/ort/',
      //     // fileExtension: 'jpg',
      //     // credit: '電子国土基本図（オルソ画像）'
      //   }),
      //   baseLayerPicker: false,
      //   timeline: false,
      //   homeButton: false,
      //   vrButton: true,
      //   geocoder: false,
      //   infoBox: false,
      //   navigationHelpButton: false,
      //   sceneModePicker: false,
      // });
      // this.point = viewer.entities.add({
      //   name: "福井市", //レイヤ名
      //   description: "ここは福井市です。", //レイヤの説明
      //   position: Cesium.Cartesian3.fromDegrees(136.223554, 36.061957, 0), //経度,緯度,高さ
      //   point: {
      //     pixelSize: 10, //ポイントのサイズ
      //     color: Cesium.Color.BLUE, //ポイントの色
      //   },
      // });
      // Add Cesium OSM Buildings, a global 3D buildings layer.
      // const buildingTileset = viewer.scene.primitives.add(
      //   Cesium.createOsmBuildings()
      // );
      // Fly the camera to San Francisco at the given longitude, latitude, and height.
      // viewer.camera.flyTo({
      //   destination: Cesium.Cartesian3.fromDegrees(-122.4175, 37.655, 400),
      //   orientation: {
      //     heading: Cesium.Math.toRadians(0.0),
      //     pitch: Cesium.Math.toRadians(-15.0),
      //   },
      // });
      // viewer.camera.flyTo({
      //   destination: Cesium.Cartesian3.fromDegrees(
      //     136.194763,
      //     36.047711,
      //     45000.0
      //   ),
      // });
      // viewer.zoomTo(viewer.entities); //レイヤにズーム
      // viewer.scene.globe.enableLighting = true;
    },
  },
};
</script>

<style scoped>
.viewer {
  width: 100%;
  height: 400px;
}
.fullSize {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  border: none;
  width: 100%;
  height: 100%;
}
</style>
