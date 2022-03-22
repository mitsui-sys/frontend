<template>
  <div class="mapPane">
    <!--マップ表示-->
    <div id="map"></div>
  </div>
</template>

<script>
import "ol/ol.css";
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

//import { transform } from "ol/proj";
import { applyTransform } from "ol/extent";
import { get as getProjection, getTransform } from "ol/proj";
import { register } from "ol/proj/proj4";
import proj4 from "proj4";

import WMTSLayer from "ol/source/WMTS";
import WMTSTileGrid from "ol/tilegrid/WMTS";
import { getTopLeft } from "ol/extent";
import Projection from "ol/proj/Projection";
import WMTSCapabilities from "ol/format/WMTSCapabilities";

import TileWMS from "ol/source/TileWMS";

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
    };
  },
  mounted: function () {
    // マップオブジェクト生成
    this.mapCreate();
  },
  methods: {
    // マップオブジェクト生成
    mapCreate() {
      this.createMap();
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

      const layer = new TileLayer({
        source: new XYZ({
          url: "https://tile.mierune.co.jp/mierune_mono/{z}/{x}/{y}.png",
          attributions: "",
          //'Maptiles by <a href="http://mierune.co.jp" target="_blank">MIERUNE</a>, under CC BY. Data by <a href="http://osm.org/copyright" target="_blank">OpenStreetMap</a> contributors, under ODbL.',
          attributionsCollapsible: false,
          tileSize: [256, 256],
          minZoom: 0,
          maxZoom: 18,
        }),
      });

      const layer1 = new TileLayer({
        source: new TileDebug({
          template: "z:{z} x:{x} y:{-y}",
          projection: vtLayer.getSource().getProjection(),
          tileGrid: vtLayer.getSource().getTileGrid(),
          zDirection: 1,
        }),
      });

      const wmtsLayer = this.createWMTSLayer();
      const wmtsLayer1 = this.createWMTSPhotoLayer();
      const wmsLayer = this.createWMSLayer("bunkazai:包蔵地");
      const wmsLayer1 = this.createWMSLayer("bunkazai:照会_回答依頼書");

      console.log(layer);
      console.log(layer1);
      console.log(wmtsLayer);
      console.log(wmtsLayer1);
      console.log(wmsLayer);
      console.log(wmsLayer1);

      //geoserverのデータを追加
      var format = "image/png";
      var tiled = new TileLayer({
        visible: false,
        source: new TileWMS({
          url: "http://localhost:8888/geoserver/test/wms",
          params: {
            FORMAT: format,
            VERSION: "1.1.1",
            tiled: true,
            STYLES: "",
            LAYERS: "test:照会_回答依頼書",
            exceptions: "application/vnd.ogc.se_inimage",
            tilesOrigin: 47017.92578125 + "," + -145170.703125,
          },
        }),
      });

      let layers = [wmtsLayer, tiled];

      const view = new View({
        center: fromLonLat([134.87, 34.711]),
        zoom: 13,
      });

      // MIERUNE MONO読み込み
      const map = new Map({
        target: "map",
        layers: layers,
        view: view,
      });
      map
        .getView()
        .fit([30000.0, -160000.0, 70000.0, -120000.0], map.getSize());
      console.log("マップ情報", map);
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
            origin: getTopLeft(defExtent),
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
      });
      return wmtsLayer;
    },
    createWMTSPhotoLayer() {
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
        var layerName = "photo1961:航空写真1961";
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
      });
      return wmtsLayer;
    },
    createWMSLayer(layername) {
      var baseSource = new TileWMS({
        url: "http://lg2201001:8080/geoserver/bunkazai/wms",
        params: {
          format: "image/png",
          transparent: true,
          version: "1.3.0",
          layers: layername,
          tiled: true,
          tilesOrigin: 47017.92578125 + "," + -145170.703125,
        },
        serverType: "geoserver",
      });

      var baseLayer = new TileLayer({
        source: baseSource,
      });
      return baseLayer;
    },
    async createMap() {
      var parser = new WMTSCapabilities();
      var assetUrl = "http://localhost:8888/geoserver/gwc/service/wmts/rest/";
      var response = await fetch(assetUrl + "WMTSCapabilities.xml");
      var text = await response.text();
      var result = parser.read(text);
      console.log(result);
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
  },
};
</script>

<style scoped>
/*マップサイズ*/
#map {
  z-index: 0;
  width: 800px;
  height: 600px;
}
</style>
