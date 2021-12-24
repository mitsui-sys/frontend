<template>
  <div class="about">
    <!--マップコンポーネント表示-->
    <MapPane></MapPane>
  </div>
</template>

<script>
// マップコンポーネント読み込み
import MapPane from "@/components/MapPane.vue";

export default {
  name: "about",
  components: {
    MapPane,
  },
};
</script>
