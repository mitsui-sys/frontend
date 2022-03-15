<!--マップコンポーネント-->
<template>
  <div class="mapPane">
    <!--マップ表示-->
    <div id="map"></div>
  </div>
</template>

<script>
// OpenLayersを読み込み
import "ol-layerswitcher/dist/ol-layerswitcher.css";
import "ol/ol.css";
import Graticule from "ol/layer/Graticule";
import Stroke from "ol/style/Stroke";
import OSM from "ol/source/OSM";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import TileDebug from "ol/source/TileDebug";
import XYZ from "ol/source/XYZ";

import LayerGroup from "ol/layer/Group";
import SourceOSM from "ol/source/OSM";
import SourceStamen from "ol/source/Stamen";

import { transform } from "ol/proj";
import { applyTransform } from "ol/extent";
import { get as getProjection, getTransform } from "ol/proj";
import { register } from "ol/proj/proj4";
import proj4 from "proj4";

import WMTS from "ol/source/WMTS";
import WMTSTileGrid from "ol/tilegrid/WMTS";
import { getTopLeft, getWidth } from "ol/extent";

import {
  ScaleLine,
  OverviewMap,
  // defaults as defaultControls,
} from "ol/control";
import LayerSwitcher from "ol-layerswitcher";
// プラグイン読み込み
// import sync from "ol-hashed";

export default {
  name: "MapPane",
  data() {
    return {
      map: null,
      scaleText: 0,
      layer: [],
      proj4Data: {
        EPSG2447: {
          code: "2447",
          name: "JGD2000 / Japan Plane Rectangular CS V",
          def: "+proj=tmerc +lat_0=36 +lon_0=134.3333333333333 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
          bbox: [35.71, 133.13, 34.13, 135.47],
        },
        EPSG2448: {
          code: "2448",
          name: "JGD2000 / Japan Plane Rectangular CS VI",
          def: "+proj=tmerc +lat_0=36 +lon_0=136 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
          bbox: [36.33, 134.86, 33.4, 136.99],
        },
        EPSG30165: {
          code: "30165",
          name: "Tokyo / Japan Plane Rectangular CS V",
          def: "+proj=tmerc +lat_0=36 +lon_0=134.3333333333333 +k=0.9999 +x_0=0 +y_0=0 +ellps=bessel +towgs84=-146.414,507.337,680.507,0,0,0,0 +units=m +no_defs",
          bbox: [35.71, 133.13, 34.13, 135.47],
        },
        EPSG30166: {
          code: "30166",
          name: "Tokyo / Japan Plane Rectangular CS VI",
          def: "+proj=tmerc +lat_0=36 +lon_0=136 +k=0.9999 +x_0=0 +y_0=0 +ellps=bessel +towgs84=-146.414,507.337,680.507,0,0,0,0 +units=m +no_defs",
          bbox: [36.33, 134.86, 33.4, 136.99],
        },
      },
    };
  },
  computed: {
    osmSource() {
      return new OSM();
    },
    debugLayer() {
      return new TileLayer({
        title: "DebugLayer",
        source: new TileDebug({
          tileGrid: this.osmSource.getTileGrid(),
          projection: this.osmSource.getProjection(),
        }),
        visible: false,
      });
    },
    graticule() {
      return new Graticule({
        title: "Graticule",
        // the style to use for the lines, optional.
        strokeStyle: new Stroke({
          color: "rgba(255,120,0,0.9)",
          width: 2,
          lineDash: [0.5, 4],
        }),
        showLabels: true,
        visible: false,
        wrapX: false,
      });
    },
  },
  methods: {
    search() {
      // resultSpan.innerHTML = 'Searching ...';
      // fetch('https://epsg.io/?format=json&q=' + query)
      //   .then(function (response) {
      //     return response.json();
      //   })
      //   .then(function (json) {
      //     const results = json['results'];
      //     if (results && results.length > 0) {
      //       for (let i = 0, ii = results.length; i < ii; i++) {
      //         const result = results[i];
      //         if (result) {
      //           const code = result['code'];
      //           const name = result['name'];
      //           const proj4def = result['proj4'];
      //           const bbox = result['bbox'];
      //           if (
      //             code &&
      //             code.length > 0 &&
      //             proj4def &&
      //             proj4def.length > 0 &&
      //             bbox &&
      //             bbox.length == 4
      //           ) {
      //             setProjection(code, name, proj4def, bbox);
      //             return;
      //           }
      //         }
      //       }
      //     }
      //     setProjection(null, null, null, null);
      //   });
    },
    initLayer() {
      // // レイヤーの生成
      // var std_layer = new XYZ(
      //   "標準地図", // レイヤー名
      //   "https://cyberjapandata.gsi.go.jp/xyz/std/${z}/${x}/${y}.png", // url
      //   {
      //     // options(attribution:帰属,minZoomLevel:最小倍率(未使用),maxZoomLevel:最大倍率)
      //     attribution:
      //       "<a href='http://www.gsi.go.jp/kikakuchousei/kikakuchousei40182.html' target='_blank'>国土地理院</a>",
      //     maxZoomLevel: 18,
      //   }
      // );

      // var blank_layer = new XYZ(
      //   "白地図", // レイヤー名
      //   "https://cyberjapandata.gsi.go.jp/xyz/blank/${z}/${x}/${y}.png", // url
      //   {
      //     // options(attribution:帰属,minZoomLevel:最小倍率(未使用),maxZoomLevel:最大倍率)
      //     attribution:
      //       "<a href='http://www.gsi.go.jp/kikakuchousei/kikakuchousei40182.html' target='_blank'>国土地理院</a>",
      //     maxZoomLevel: 18,
      //   }
      // );
      const osm = new TileLayer({
        title: "OSM",
        type: "base",
        visible: true,
        source: new SourceOSM(),
      });

      const watercolor = new TileLayer({
        title: "Water color",
        type: "base",
        visible: false,
        source: new SourceStamen({
          layer: "watercolor",
        }),
      });

      const mierune = new TileLayer({
        title: "mierune",
        type: "base",
        visible: false,
        source: new XYZ({
          url: "https://tile.mierune.co.jp/mierune_mono/{z}/{x}/{y}.png",
          attributions:
            'Maptiles by <a href="http://mierune.co.jp" target="_blank">MIERUNE</a>, under CC BY. Data by <a href="http://osm.org/copyright" target="_blank">OpenStreetMap</a> contributors, under ODbL.',
          attributionsCollapsible: false,
          tileSize: [256, 256],
          minZoom: 0,
          maxZoom: 18,
        }),
      });
      const tile_osm = new TileLayer({
        title: "osm_tile",
        opacity: 0.5,
        source: this.osmSource,
      });

      const _proj = this.proj4Data["EPSG2447"];
      this.setProj4(_proj);
      const projection = this.getProjExtent(_proj);
      const projectionExtent = projection.getExtent();
      const size = getWidth(projectionExtent) / 256;
      const resolutions = new Array(19);
      const matrixIds = new Array(19);
      for (let z = 0; z < 19; ++z) {
        // generate resolutions and matrixIds arrays for this WMTS
        resolutions[z] = size / Math.pow(2, z);
        matrixIds[z] = `EPSG:2447:${z}`; //z;
      }
      const wmts = new TileLayer({
        title: "WMTS",
        source: new WMTS({
          attributions:
            'Tiles © <a href="https://mrdata.usgs.gov/geology/state/"' +
            ' target="_blank">USGS</a>',
          // url: "https://mrdata.usgs.gov/mapcache/wmts",
          url: "http;//harima-isk:8080/geoserver/gwc/service/wmts",
          layer: "harima_bunkazai:包蔵地",
          matrixSet: "EPSG:2447",
          format: "image/png",

          tileGrid: new WMTSTileGrid({
            origin: getTopLeft(projectionExtent),
            resolutions: resolutions,
            matrixIds: matrixIds,
          }),
          style: "default",
          wrapX: true,
          opacity: 0.7,
          isBaseLayer: false,
        }),
      });

      this.addLayer(osm);
      this.addLayer(watercolor);
      this.addLayer(mierune);
      this.addLayer(tile_osm);
      this.addLayer(this.debugLayer);
      this.addLayer(this.graticule);
      this.addLayer(wmts);
    },
    setMap() {
      this.initLayer();
      const baseMaps = new LayerGroup({
        title: "Base maps",
        layers: this.layer,
      });

      const layerSwitcher = new LayerSwitcher({
        reverse: true,
        groupSelectStyle: "group",
      });

      this.map = new Map({
        target: "map",
        layers: baseMaps,
        view: new View({
          projection: "EPSG:3857",
          center: [0, 0],
          zoom: 1,
        }),
      });

      this.map.addControl(layerSwitcher);
      this.map.addControl(new ScaleLine());
      this.map.addControl(new OverviewMap());
    },

    addLayer(layer) {
      this.layer.push(layer);
    },
    setProj4(projection) {
      console.log(projection.name);
      const newProjCode = "EPSG:" + projection.code;
      proj4.defs(newProjCode, projection.def);
      register(proj4);
    },
    getProjExtent(projection) {
      const code = projection.code;
      const bbox = projection.bbox;
      const newProjCode = "EPSG:" + code;
      const newProj = getProjection(newProjCode);
      const fromLonLat = getTransform("EPSG:4326", newProj);
      let worldExtent = [bbox[1], bbox[2], bbox[3], bbox[0]];
      newProj.setWorldExtent(worldExtent);

      // approximate calculation of projection extent,
      // checking if the world extent crosses the dateline
      if (bbox[1] > bbox[3]) {
        worldExtent = [bbox[1], bbox[2], bbox[3] + 360, bbox[0]];
      }
      const extent = applyTransform(worldExtent, fromLonLat, undefined, 8);
      newProj.setExtent(extent);
      return newProj;
    },

    setProjection(projection) {
      this.setProj4(projection);
      const newProj = this.getProjExtent(projection);
      const extent = newProj.getExtent();

      const newView = new View({
        projection: newProj,
      });
      this.map.setView(newView);
      newView.fit(extent);
    },
    setView() {},
    // マップオブジェクト生成
    mapCreate() {
      //座標系の設定
      const projection2447 = getProjection("EPSG:2447");
      const projectionExtent = projection2447.getExtent();
      const size = getWidth(projectionExtent) / 256;
      console.log(size);
      const resolutions = new Array(19);
      const matrixIds = new Array(19);
      for (let z = 0; z < 19; ++z) {
        // generate resolutions and matrixIds arrays for this WMTS
        resolutions[z] = size / Math.pow(2, z);
        matrixIds[z] = z;
      }

      const harima_wmts = new TileLayer({
        title: "harima_wmts",
        opacity: 0.5,
        type: "base",
        visible: false,
        source: new WMTS({
          url: "http;//harima-isk:8080/geoserver/gwc/service/wmts?REQUEST=GetCapabilities",
          attributions:
            'Maptiles by <a href="http://mierune.co.jp" target="_blank">MIERUNE</a>, under CC BY. Data by <a href="http://osm.org/copyright" target="_blank">OpenStreetMap</a> contributors, under ODbL.',
          attributionsCollapsible: false,
          format: "image/png",
          projection: projection2447,
          tileGrid: new WMTSTileGrid({
            origin: getTopLeft(projectionExtent),
            resolutions: resolutions,
            matrixIds: matrixIds,
          }),
          style: "default",
          wrapX: true,
        }),
      });
      this.addLayer(harima_wmts);
      this.map.updateSize();
    },
    mapClick(event) {
      //クリック位置経緯度取得
      console.log(event);
      const lonlat = transform(event.coordinate, "EPSG:3857", "EPSG:4326");
      //経緯度表示
      alert("lat: " + lonlat[1] + ", lat: " + lonlat[0]);
    },
  },
  mounted() {
    // this.mapCreate();
    this.setMap();
    const _proj = this.proj4Data["EPSG2447"];
    this.setProjection(_proj);
    // マップオブジェクト生成
    // this.mapCreate();
  },
};
</script>

<style scoped>
/*マップサイズ*/
#map {
  z-index: 0;
  height: 600px;
}
</style>
