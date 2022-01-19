<template>
  <!--
  <v-content>
    <h1>お絵かきアプリ</h1>
    <div>
      <canvas
        id="draw-area"
        width="400px"
        height="400px"
        style="border: 1px solid #000000"
        @mousenmove="paint"
      ></canvas>
        -->
  <!-- 色を選択できるカラーパレットを用意する。 
      <span id="color-palette"></span>
    </div>
    <div>
      <button id="clear-button">全消し</button>
    </div>
    <div>
      <button id="eraser-button">消しゴムモード</button>
    </div>
    <v-data-table header="" items=""> </v-data-table>
  </v-content>
  -->
  <div>{{ "test" }}</div>
</template>
<script>
export default {
  name: "document",
  data() {
    return {
      title: "404 NOT FOUND",
      message: "お探しのページが見つかりませんでした。",
      mouse: {
        x: 0,
        y: 0,
      },
      docitems: [],
    };
  },
  methods: {
    paint() {
      this.mouse.x = event.clientX;
      this.mouse.y = event.clientY;
    },
    getDocumentData() {
      const url = `${this.url}/document`;
      console.log("get all document", url);
      this.axios
        .get(url)
        .then((res) => {
          //成功時
          console.log("success", res.data);
          this.docitems = res.data.rows;
          // const json = JSON.parse(rows[0].display);
          // this.headers = json;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  mounted() {
    this.getDocumentData();
  },
};
</script>
