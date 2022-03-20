<template>
  <div id="mapid" style="height: 600px"></div>
</template>

<script>
import "leaflet/dist/leaflet.css";
import L from "leaflet";

export default {
  mounted() {
    L.map("app", { center: L.latLng(35.6825, 139.752778), zoom: 15 }).addLayer(
      L.tileLayer("https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png")
    );
  },
};
</script>

<style>
#mapid {
  height: 400px;
  outline: 1px;
}
</style>
