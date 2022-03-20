<template>
  <div class="mapPane">
    <!--マップ表示-->
    <div id="map"></div>
  </div>
</template>

<script>
// OpenLayersを読み込み
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import { fromLonLat } from "ol/proj";
import MVT from "ol/format/MVT";
import TileDebug from "ol/source/TileDebug";
import VectorTileLayer from "ol/layer/VectorTile";
import VectorTileSource from "ol/source/VectorTile";

export default {
  name: "MapPane",
  mounted: function () {
    // マップオブジェクト生成
    this.mapCreate();
  },
  methods: {
    // マップオブジェクト生成
    mapCreate: function () {
      const vtLayer = new VectorTileLayer({
        declutter: true,
        source: new VectorTileSource({
          maxZoom: 6,
          format: new MVT(),
          url:
            // "https://ahocevar.com/geoserver/gwc/service/tms/1.0.0/" +
            // "ne:ne_10m_admin_0_countries@EPSG%3A900913@pbf/{z}/{x}/{-y}.pbf",
            "http://lg2201001:8080/geoserver/gwc/service/tms/1.0.0/geological:地質図@EPSG:6673_L2500@png/{z}/{x}/{y}.png",
        }),
      });

      // MIERUNE MONO読み込み
      new Map({
        target: "map",
        layers: [
          new TileLayer({
            source: new XYZ({
              url: "https://tile.mierune.co.jp/mierune_mono/{z}/{x}/{y}.png",
              attributions:
                'Maptiles by <a href="http://mierune.co.jp" target="_blank">MIERUNE</a>, under CC BY. Data by <a href="http://osm.org/copyright" target="_blank">OpenStreetMap</a> contributors, under ODbL.',
              attributionsCollapsible: false,
              tileSize: [256, 256],
              minZoom: 0,
              maxZoom: 18,
            }),
          }),
          new TileLayer({
            source: new TileDebug({
              template: "z:{z} x:{x} y:{-y}",
              projection: vtLayer.getSource().getProjection(),
              tileGrid: vtLayer.getSource().getTileGrid(),
              zDirection: 1,
            }),
          }),
        ],

        view: new View({
          center: fromLonLat([134.87, 34.711]),
          zoom: 13,
        }),
      });
    },
  },
};
</script>

<style scoped>
/*マップサイズ*/
#map {
  z-index: 0;
  height: 300px;
  width: 400px;
}
</style>
