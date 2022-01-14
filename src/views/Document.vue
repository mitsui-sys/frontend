<template>
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
      <!-- 色を選択できるカラーパレットを用意する。 -->
      <span id="color-palette"></span>
    </div>
    <div>
      <button id="clear-button">全消し</button>
    </div>
    <div>
      <button id="eraser-button">消しゴムモード</button>
    </div>
  </v-content>
</template>
<v-card>

</v-card>
<script>
export default {
  name: "document",
  data() {
    return {
      title: "404 NOT FOUND",
      message: "お探しのページが見つかりませんでした。",
      mouseX: 0,
      mouseY: 0,
    };
  },
  methods: {
    paint(e) {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    },
  },
};
</script>
