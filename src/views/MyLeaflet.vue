<template>
  <v-card width="400px">
    <div id="mapid"></div>
  </v-card>
</template>

<script>
import "leaflet/dist/leaflet.css";
import L from "leaflet";

export default {
  mounted() {
    L.map("app", { center: L.latLng(35.6825, 139.752778), zoom: 15 }).addLayer(
      L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png")
    );
  },
};
</script>

<style>
#mapid {
  height: 400px;
}
</style>
