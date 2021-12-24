<template>
  <v-container>
    <div id="map"></div>
  </v-container>
</template>

<script>
import "leaflet/dist/leaflet.css";
import L from "leaflet";

export default {
  name: "MyLeaflet",
  data() {
    return {
      center: [35.681, 139.763],
      zoom: 14,
      marker: [35.681, 139.763],
      tileProviders: [
        {
          name: "MIERUNE Streets",
          visible: true,
          url: "https://api.maptiler.com/maps/jp-mierune-streets/256/{z}/{x}/{y}.png?key=[APIキー]",
          attribution:
            '<a href="https://maptiler.jp/" target="_blank">&copy; MIERUNE</a> <a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
        },
        {
          name: "MIERUNE Gray",
          visible: false,
          url: "https://api.maptiler.com/maps/jp-mierune-gray/256/{z}/{x}/{y}.png?key=[APIキー]",
          attribution:
            '<a href="https://maptiler.jp/" target="_blank">&copy; MIERUNE</a> <a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
        },
      ],
      lat: 35.6825,
      lon: 139.752778,
      map: null,
      currentCircle: null,
      currentPoint: null,
      gsi_attr:
        "<a href='http://maps.gsi.go.jp/development/ichiran.html'>地理院タイル</a>",
      maps: [
        {
          title: "淡色地図",
          url: "https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png",
          attrs:
            "<a href='http://maps.gsi.go.jp/development/ichiran.html'>地理院タイル</a>",
        },
        {
          title: "標準地図",
          url: "https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png",
          attrs:
            "<a href='http://maps.gsi.go.jp/development/ichiran.html'>地理院タイル</a>",
        },
        {
          title: "色別標高図",
          url: "https://cyberjapandata.gsi.go.jp/xyz/relief/{z}/{x}/{y}.png",
          attrs:
            "<a href='http://maps.gsi.go.jp/development/ichiran.html'>地理院タイル</a>",
        },
        {
          title: "写真",
          url: "https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/{z}/{x}/{y}.jpg",
          attrs:
            "<a href='http://maps.gsi.go.jp/development/ichiran.html'>地理院タイル</a>",
        },
        {
          title: "OpenStreetMap",
          url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          attr: "",
        },
      ],

      osm: "",
    };
  },
  methods: {
    getTileLayer(url, attr) {
      return L.tileLayer(url, { attribution: attr });
    },
    getBaseMaps(datas) {
      let maps = {};
      for (let key in datas) {
        let d = datas[key];
        maps[d.title] = this.getTileLayer(d.url, d.attr);
      }
      console.log(maps);
      return maps;
    },
  },
  mounted() {
    console.log([this.lat, this.lon]);
    this.map = L.map("app")
      .setView([this.lat, this.lon], 15)
      .addLayer(L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png"));
    //スケールコントロールを最大幅200px、右下、m単位で地図に追加
    L.control
      .scale({ maxWidth: 200, position: "bottomright", imperial: false })
      .addTo(this.map);
    //ズームコントロールを左下で地図に追加
    // L.control.zoom({ position: "bottomleft" }).addTo(this.map);
    //layersコントロールにbaseMapsオブジェクトを設定して地図に追加
    //コントロール内にプロパティ名が表示される
    let baseMaps = this.getBaseMaps(this.maps);
    L.control.layers(baseMaps).addTo(this.map);
  },
};
</script>

<style>
#map {
  height: 300px;
  width: 100%;
}
.mapPane {
  height: 800px !important;
  margin: 0;
  text-align: left;
}
</style>
