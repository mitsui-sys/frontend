<!--マップコンポーネント-->
<template>
  <div class="mapPane">
    <v-btn @click="initialPos" :class="`mx-2`">初期画面</v-btn>
    <!--マップ表示-->
    <div id="map"></div>
  </div>
</template>

<script>
// OpenLayersを読み込み

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
// import SourceOSM from "ol/source/OSM";
// import SourceStamen from "ol/source/Stamen";

import { transform } from "ol/proj";
// 投影変換読み込み
import { transformExtent } from "ol/proj";
import { applyTransform } from "ol/extent";
import { get as getProjection, getTransform } from "ol/proj";

import { register } from "ol/proj/proj4";
import proj4 from "proj4";

// import {
//   ScaleLine,
//   OverviewMap,
//   // defaults as defaultControls,
// } from "ol/control";
import LayerSwitcher from "ol-layerswitcher";
import "ol-layerswitcher/dist/ol-layerswitcher.css";

import WMTSLayer from "ol/source/WMTS";
import WMTSTileGrid from "ol/tilegrid/WMTS";
import { getTopLeft } from "ol/extent";
import { getWidth } from "ol/extent";
import Projection from "ol/proj/Projection";
import TileWMS from "ol/source/TileWMS";
import WMTSCapabilities from "ol/format/WMTSCapabilities";

import VectorTile from "ol/source/VectorTile";
import VectorTileLayer from "ol/layer/VectorTile";
import MVT from "ol/format/MVT";

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
        EPSG6673: {
          code: "6673",
          name: "JGD2011 / Japan Plane Rectangular CS V",
          def: "+proj=tmerc +lat_0=36 +lon_0=134.3333333333333 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +units=m +no_defs",
          bbox: [35.71, 133.13, 34.13, 135.47],
        },
      },
      map_extent: [45789.036, -145404.994, 51902.909, -140573.897],
    };
  },
  computed: {
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
    initialPos() {
      if (this.map != null) {
        console.log(this.map);
        // 表示範囲を取得
        console.log(
          transformExtent(
            this.map.getView().calculateExtent(this.map.getSize()),
            "EPSG:6673",
            "EPSG:4326"
          )
        );
        //範囲の緯度経度を取得？
        console.log(this.map.getSize());
        //let mapextent = [30000.0, -160000.0, 70000.0, -120000.0]
        let mapextent = [45789.036, -145404.994, 51902.909, -140573.897];
        //let mapsize = [1000, 750];
        this.map.getView().fit(mapextent, this.map.getSize());
      }
    },
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
    xyzStdLayer() {
      var std_layer = new XYZ(
        "標準地図", // レイヤー名
        "https://cyberjapandata.gsi.go.jp/xyz/std/${z}/${x}/${y}.png", // url
        {
          // options(attribution:帰属,minZoomLevel:最小倍率(未使用),maxZoomLevel:最大倍率)
          attribution:
            "<a href='http://www.gsi.go.jp/kikakuchousei/kikakuchousei40182.html' target='_blank'>国土地理院</a>",
          maxZoomLevel: 18,
        }
      );
      return std_layer;
    },
    xyzBlankLayer() {
      var blank_layer = new XYZ(
        "白地図", // レイヤー名
        "https://cyberjapandata.gsi.go.jp/xyz/blank/${z}/${x}/${y}.png", // url
        {
          // options(attribution:帰属,minZoomLevel:最小倍率(未使用),maxZoomLevel:最大倍率)
          attribution:
            "<a href='http://www.gsi.go.jp/kikakuchousei/kikakuchousei40182.html' target='_blank'>国土地理院</a>",
          maxZoomLevel: 18,
        }
      );
      return blank_layer;
    },
    wmtsOldLayer() {
      // const osm = new TileLayer({
      //   title: "OSM",
      //   type: "base",
      //   visible: true,
      //   source: new SourceOSM(),
      // });
      // const watercolor = new TileLayer({
      //   title: "Water color",
      //   type: "base",
      //   visible: false,
      //   source: new SourceStamen({
      //     layer: "watercolor",
      //   }),
      // });
      // const mierune = new TileLayer({
      //   title: "mierune",
      //   type: "base",
      //   visible: false,
      //   source: new XYZ({
      //     url: "https://tile.mierune.co.jp/mierune_mono/{z}/{x}/{y}.png",
      //     attributions: "", //'Maptiles by <a href="http://mierune.co.jp" target="_blank">MIERUNE</a>, under CC BY. Data by <a href="http://osm.org/copyright" target="_blank">OpenStreetMap</a> contributors, under ODbL.',
      //     attributionsCollapsible: false,
      //     tileSize: [256, 256],
      //     minZoom: 0,
      //     maxZoom: 18,
      //   }),
      // });
      // const _proj = this.proj4Data["EPSG2447"];
      // this.setProj4(_proj);
      // const projection = this.getProjExtent(_proj);
      // const projectionExtent = projection.getExtent();
      // const size = getWidth(projectionExtent) / 256;
      // const resolutions = new Array(19);
      // const matrixIds = new Array(19);
      // for (let z = 0; z < 19; ++z) {
      //   // generate resolutions and matrixIds arrays for this WMTS
      //   resolutions[z] = size / Math.pow(2, z);
      //   matrixIds[z] = `EPSG:2447:${z}`; //z;
      // }
      // const wmts = new TileLayer({
      //   title: "WMTS",
      //   source: new WMTSLayer({
      //     attributions:
      //       'Tiles © <a href="https://mrdata.usgs.gov/geology/state/"' +
      //       ' target="_blank">USGS</a>',
      //     // url: "https://mrdata.usgs.gov/mapcache/wmts",
      //     url: "http;//harima-isk:8080/geoserver/gwc/service/wmts",
      //     layer: "harima_bunkazai:包蔵地",
      //     matrixSet: "EPSG:2447",
      //     format: "image/png",
      //     tileGrid: new WMTSTileGrid({
      //       origin: getTopLeft(projectionExtent),
      //       resolutions: resolutions,
      //       matrixIds: matrixIds,
      //     }),
      //     style: "default",
      //     wrapX: true,
      //     opacity: 0.7,
      //     isBaseLayer: false,
      //   }),
      // });
    },

    initLayer() {
      // // レイヤーの生成
      //OpenStreetMap
      // const osmLayer = this.createOSMLayer();
      // this.addLayer(osmLayer);

      //標準地図
      // const stdLayer = this.createStdLayer();
      // this.addLayer(stdLayer);

      //地質図
      const chishitsuLayer = this.createXYZChishitsuLayer();
      this.addLayer(chishitsuLayer);
      let years = [
        1947, 1961, 1975, 1979, 1984, 1993, 1996, 1999, 2002, 2005, 2008, 2011,
        2014, 2017, 2020,
      ];
      for (let year of years) {
        // const wmtsPhotoLayer = this.createWMTSPhotoLayer(year);
        const wmtsPhotoLayer = this.createXYZPhotoLayer(year);
        this.addLayer(wmtsPhotoLayer);
      }
      let format = "image/png";
      var chikeiTile = new TileLayer({
        title: "地形図",
        visible: true,
        source: new TileWMS({
          url: "http://lg2201001:8080/geoserver/chikei/wms",
          params: {
            FORMAT: format,
            VERSION: "1.1.1",
            tiled: true,
            STYLES: "",
            LAYERS: "chikei:chikei2500",
            exceptions: "application/vnd.ogc.se_inimage",
            tilesOrigin: 45909.34765625 + "," + -145236.3125,
          },
        }),
      });
      this.addLayer(chikeiTile);
      var chibanTile = new TileLayer({
        title: "地番図",
        visible: false,
        source: new TileWMS({
          url: "http://lg2201001:8080/geoserver/chiban/wms",
          params: {
            FORMAT: format,
            VERSION: "1.1.1",
            tiled: true,
            STYLES: "",
            LAYERS: "chiban:chiban",
            exceptions: "application/vnd.ogc.se_inimage",
            tilesOrigin: 46416.69921875 + "," + -145456.71875,
          },
        }),
      });
      this.addLayer(chibanTile);
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

      var projection = new Projection({
        code: "EPSG:6673",
        units: "m",
        axisOrientation: "neu",
      });
      var resolutions = [
        27.999999999999996, 13.999999999999998, 6.999999999999999, 2.8, 1.4,
        0.7,
      ];

      let view = new View({
        center: [0, 0],
        zoom: 2,
        resolutions: resolutions,
        projection: projection,
      });

      this.map = new Map({
        target: "map",
        layers: baseMaps,
        view: view,
      });

      this.map.addControl(layerSwitcher);
      //this.map.addControl(new ScaleLine());
      //this.map.addControl(new OverviewMap());

      //実行後に起動するもの
      this.$nextTick(() => {
        this.initialPos();
      });
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
        source: new WMTSLayer({
          url: "http;//lg2201001:8080/geoserver/gwc/service/wmts?REQUEST=GetCapabilities",
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
    createWMTSLayer() {
      //追加
      var gridsetName = "EPSG:6673_L2500";
      var gridNames = [
        "EPSG:6673_L2500:0",
        "EPSG:6673_L2500:1",
        "EPSG:6673_L2500:2",
        "EPSG:6673_L2500:3",
        "EPSG:6673_L2500:4",
        "EPSG:6673_L2500:5",
      ];
      // var baseUrl = "http://localhost:8888/geoserver/gwc/service/wmts"; //"../service/wmts";
      let baseUrl = "http://lg2201001:8080/geoserver/gwc/service/wmts";

      var projection = new Projection({
        code: "EPSG:6673",
        units: "m",
        axisOrientation: "neu",
      });
      var defExtent = [
        -110992.00295450131, -207439.91742665006, 111215.99704549866,
        -28239.917426650092,
      ];
      var resolutions = [
        27.999999999999996, 13.999999999999998, 6.999999999999999, 2.8, 1.4,
        0.7,
      ];

      function constructSourceWMTS() {
        var style = "";
        var format = "image/png";
        //var infoFormat = "text/html";
        var layerName = "geological:地質図"; //"geo:chishitsu_check";
        const baseParams = [
          "VERSION",
          "LAYER",
          "STYLE",
          "TILEMATRIX",
          "TILEMATRIXSET",
          "SERVICE",
          "FORMAT",
        ];

        const params = {
          VERSION: "1.0.0",
          LAYER: layerName,
          STYLE: style,
          TILEMATRIX: gridNames,
          TILEMATRIXSET: gridsetName,
          SERVICE: "WMTS",
          FORMAT: format,
        };
        var url = baseUrl + "?";
        for (var param in params) {
          if (baseParams.indexOf(param.toUpperCase()) < 0) {
            url = url + param + "=" + params[param] + "&";
          }
        }
        url = url.slice(0, -1);
        console.log("参照URL", url);

        var source = new WMTSLayer({
          url: url,
          layer: params["LAYER"],
          matrixSet: params["TILEMATRIXSET"],
          format: params["FORMAT"],
          projection: projection,
          tileGrid: new WMTSTileGrid({
            tileSize: [256, 256],
            extent: defExtent,
            //origin: getTopLeft(defExtent),
            origin: getTopLeft(defExtent),
            //resolutions: resolutions,
            resolutions: resolutions,
            matrixIds: params["TILEMATRIX"],
          }),
          style: params["STYLE"],
          wrapX: true,
        });
        return source;
      }
      var wmtsLayer = new TileLayer({
        source: constructSourceWMTS(),
        title: "地質図",
        visible: false,
      });
      return wmtsLayer;
    },
    createWMTSPhotoLayer(year) {
      const title = `航空写真${year}`;

      //追加
      var gridsetName = "EPSG:6673";
      var gridNames = [
        "EPSG:6673:0",
        "EPSG:6673:1",
        "EPSG:6673:2",
        "EPSG:6673:3",
        "EPSG:6673:4",
        "EPSG:6673:5",
        "EPSG:6673:6",
        "EPSG:6673:7",
        "EPSG:6673:8",
      ];
      // var baseUrl = "http://localhost:8888/geoserver/gwc/service/wmts"; //"../service/wmts";
      let baseUrl = "http://lg2201001:8080/geoserver/gwc/service/wmts";

      var projection = new Projection({
        code: "EPSG:6673",
        units: "m",
        axisOrientation: "neu",
      });

      function constructSourceWMTS() {
        var style = "";
        var format = "image/png";
        //var infoFormat = "text/html";
        // var layerName = "photo1961:航空写真1961";
        var layerName = `photo${year}:航空写真${year}`;
        var extent = [
          -110992.00295450131, -207439.91742665006, 111215.99704549866,
          -28239.917426650092,
        ];
        var resolutions = [
          27.999999999999996, 13.999999999999998, 6.999999999999999, 2.8, 1.4,
          0.7, 0.27999999999999997, 0.13999999999999999, 0.06999999999999999,
        ];
        const baseParams = [
          "VERSION",
          "LAYER",
          "STYLE",
          "TILEMATRIX",
          "TILEMATRIXSET",
          "SERVICE",
          "FORMAT",
        ];

        const params = {
          VERSION: "1.0.0",
          LAYER: layerName,
          STYLE: style,
          TILEMATRIX: gridNames,
          TILEMATRIXSET: gridsetName,
          SERVICE: "WMTS",
          FORMAT: format,
        };
        var url = baseUrl + "?";
        for (var param in params) {
          if (baseParams.indexOf(param.toUpperCase()) < 0) {
            url = url + param + "=" + params[param] + "&";
          }
        }
        url = url.slice(0, -1);
        console.log("参照URL", url);

        var source = new WMTSLayer({
          url: url,
          layer: params["LAYER"],
          matrixSet: params["TILEMATRIXSET"],
          format: params["FORMAT"],
          projection: projection,
          tileGrid: new WMTSTileGrid({
            tileSize: [256, 256],
            extent: extent,
            origin: getTopLeft(extent),
            resolutions: resolutions,
            matrixIds: params["TILEMATRIX"],
          }),
          style: params["STYLE"],
          wrapX: true,
        });
        return source;
      }
      var wmtsLayer = new TileLayer({
        source: constructSourceWMTS(),
        title: title,
        visible: false,
      });
      return wmtsLayer;
    },
    createWMSLayer(layername) {
      console.log(layername);
      var baseSource = new TileWMS({
        url: "http://lg2201001:8080/geoserver/wms",
        params: {
          format: "image/png",
          transparent: true,
          version: "1.3.0",
          layers: layername,
          tiled: true,
        },
        serverType: "geoserver",
      });

      var baseLayer = new TileLayer({
        title: layername,
        source: baseSource,
      });
      return baseLayer;
    },
    createVectorsLayer() {
      function constructSourceVectorTile() {
        //追加
        var gridsetName = "EPSG:6673_L2500";
        var gridNames = [
          "EPSG:6673_L2500:0",
          "EPSG:6673_L2500:1",
          "EPSG:6673_L2500:2",
          "EPSG:6673_L2500:3",
          "EPSG:6673_L2500:4",
          "EPSG:6673_L2500:5",
        ];
        var baseUrl = "http://localhost:8888/geoserver/gwc/service/wmts";
        var projection = new Projection({
          code: "EPSG:6673",
          units: "m",
          axisOrientation: "neu",
        });
        var defExtent = [
          -110992.00295450131, -207439.91742665006, 111215.99704549866,
          -28239.917426650092,
        ];
        var resolutions = [
          27.999999999999996, 13.999999999999998, 6.999999999999999, 2.8, 1.4,
          0.7,
        ];
        var style = "";
        var format = "application/vnd.mapbox-vector-tile";
        //var infoFormat = "text/html";
        var layerName = "chikei:tikei2500";
        let params = {
          REQUEST: "GetTile",
          SERVICE: "WMTS",
          VERSION: "1.0.0",
          LAYER: layerName,
          STYLE: style,
          TILEMATRIX: gridsetName + ":{z}",
          TILEMATRIXSET: gridsetName,
          FORMAT: format,
          TILECOL: "{x}",
          TILEROW: "{y}",
        };
        var url = baseUrl + "?";
        for (var param in params) {
          url = url + param + "=" + params[param] + "&";
        }
        url = url.slice(0, -1);

        var source = new VectorTile({
          url: url,
          format: new MVT({}),
          projection: projection,
          tileGrid: new WMTSTileGrid({
            tileSize: [256, 256],
            origin: getTopLeft(defExtent),
            resolutions: resolutions,
            matrixIds: gridNames,
          }),
          wrapX: true,
        });
        return source;
      }

      var vectortileLayer = new VectorTileLayer({
        source: constructSourceVectorTile(),
      });
      return vectortileLayer;
    },
    createOSMLayer() {
      const osmLayer = new TileLayer({
        title: "OpenStreetMap",
        visible: true,
        opacity: 1,
        source: new OSM(),
      });
      return osmLayer;
    },
    createStdLayer() {
      const layer = new TileLayer({
        title: "標準地図", // レイヤー名
        visible: true,
        source: new XYZ({
          attributions: [
            "<a href='https://maps.gsi.go.jp/development/ichiran.html' target='_blank'>地理院タイル</a>",
          ],
          url: "https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png",
          projection: "EPSG:3857",
        }),
      });
      return layer;
    },
    createXYZChishitsuLayer() {
      //var gridsetName = "EPSG:6673_L2500";
      let title = "地質図";
      let layerName = "geological:地質図";
      let gridsetName = "EPSG:6673_L2500";
      // var gridNames = [
      //   "EPSG:6673_L2500:0",
      //   "EPSG:6673_L2500:1",
      //   "EPSG:6673_L2500:2",
      //   "EPSG:6673_L2500:3",
      //   "EPSG:6673_L2500:4",
      //   "EPSG:6673_L2500:5",
      // ];
      //連番処理で表示レベル
      let gridSize = 6;
      let gridNames = [...Array(gridSize)].map((_, i) => `${gridsetName}:${i}`);
      var projection = new Projection({
        code: "EPSG:6673",
        units: "m",
        axisOrientation: "neu",
      });
      var defExtent = [
        -110992.00295450131, -207439.91742665006, 111215.99704549866,
        -28239.917426650092,
      ];
      var resolutions = [
        27.999999999999996, 13.999999999999998, 6.999999999999999, 2.8, 1.4,
        0.7,
      ];
      let format = "png";
      let baseUrl = "http://lg2201001:8080/geoserver/gwc/service/tms/1.0.0";
      let url = `${baseUrl}/${layerName}@${gridsetName}@${format}/{z}/{x}/{-y}.${format}`;
      // let url = `http://lg2201001:8080/geoserver/gwc/service/tms/1.0.0/geological:地質図@EPSG:6673_L2500@png/{z}/{x}/{-y}.png`
      const layer = new TileLayer({
        title: title, // レイヤー名
        visible: false,
        source: new XYZ({
          url: url,
          projection: projection,
          tileGrid: new WMTSTileGrid({
            tileSize: [256, 256],
            extent: defExtent,
            //origin: getTopLeft(defExtent),
            origin: getTopLeft(defExtent),
            //resolutions: resolutions,
            resolutions: resolutions,
            matrixIds: gridNames,
          }),
        }),
      });
      return layer;
    },
    createXYZPhotoLayer(year) {
      const title = `航空写真${year}`;
      var layerName = `photo${year}:${title}`;
      //var gridsetName = "EPSG:6673_L2500";
      var gridsetName = "EPSG:6673";
      // var gridNames = [
      //   "EPSG:6673:0",
      //   "EPSG:6673:1",
      //   "EPSG:6673:2",
      //   "EPSG:6673:3",
      //   "EPSG:6673:4",
      //   "EPSG:6673:5",
      //   "EPSG:6673:6",
      //   "EPSG:6673:7",
      //   "EPSG:6673:8",
      // ];
      let gridSize = 9;
      let gridNames = [...Array(gridSize)].map((_, i) => `${gridsetName}:${i}`);
      var projection = new Projection({
        code: "EPSG:6673",
        units: "m",
        axisOrientation: "neu",
      });
      var extent = [
        -110992.00295450131, -207439.91742665006, 111215.99704549866,
        -28239.917426650092,
      ];
      var resolutions = [
        27.999999999999996, 13.999999999999998, 6.999999999999999, 2.8, 1.4,
        0.7, 0.27999999999999997, 0.13999999999999999, 0.06999999999999999,
      ];
      let format = "png";
      let baseUrl = "http://lg2201001:8080/geoserver/gwc/service/tms/1.0.0";
      let url = `${baseUrl}/${layerName}@${gridsetName}@${format}/{z}/{x}/{-y}.${format}`;
      const layer = new TileLayer({
        title: title, // レイヤー名
        visible: false,
        source: new XYZ({
          url: url,
          projection: projection,
          tileGrid: new WMTSTileGrid({
            tileSize: [256, 256],
            extent: extent,
            origin: getTopLeft(extent),
            resolutions: resolutions,
            matrixIds: gridNames,
          }),
        }),
      });
      return layer;
    },
    async createMap() {
      var parser = new WMTSCapabilities();
      var assetUrl = "http://lg2201001:8080/geoserver/gwc/service/wmts/rest/";
      var response = await fetch(assetUrl + "WMTSCapabilities.xml");
      var text = await response.text();
      var result = parser.read(text);
      console.log(result);
    },
  },
  mounted() {
    //this.createMap();
    this.setMap();
    const _proj = this.proj4Data["EPSG6673"];
    this.setProjection(_proj);
    // マップオブジェクト生成
    //this.mapCreate();
  },
};
</script>

<style scoped>
/*マップサイズ*/
#map {
  z-index: 0;
  height: 800px;
  width: 100%;
  border: 1px solid;
}
</style>
