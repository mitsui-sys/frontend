<template>
  <v-card>
    <v-toolbar>
      <a @click="windowClose">詳細画面を閉じる</a>
      <v-btn v-if="level >= 1" @click="windowPrint">印刷</v-btn>
      <v-btn v-if="level >= 1" @click="windowSubWindow"
        >サブウインドウを開く</v-btn
      >
    </v-toolbar>
    <v-card-title>
      <span class="text-h5">詳細情報</span>
      <v-spacer></v-spacer>
      <v-btn v-if="level >= 1" @click="isEditing = !isEditing">
        <v-icon v-if="isEditing"> mdi-close </v-icon>
        <v-icon v-else> mdi-pencil </v-icon>
        {{ "編集" }}</v-btn
      >
      <v-btn v-if="level >= 1">
        <v-icon> mdi-delete </v-icon>
        {{ "削除" }}</v-btn
      >
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-container style="max-height: 700px" class="overflow-y-auto">
        <v-row v-for="(item, index) in items" :key="index" no-gutters>
          <v-col cols="4">
            <v-subheader>{{ item.text }}</v-subheader>
          </v-col>
          <v-col>
            <v-text-field
              v-model="item.value"
              placeholder="値を入力"
              outlined
              clearable
              dense
              :disabled="!isEditing"
            />
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions v-if="level >= 1">
      <v-spacer></v-spacer>
      <v-btn outlined color="blue darken-1" text :disabled="!isEditing">
        更新
      </v-btn>
      <v-btn outlined color="blue darken-1" text> 閉じる </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "DetailPage",
  data() {
    return {
      title: "台帳システム",
      detailData: { columns: [], rows: [] },
      items: {},
      user: null,
      loading: false,
      level: -1,
      hasSaved: false,
      isEditing: null,
      window: this.$root,
    };
  },
  computed: {
    loginData() {
      return this.$store.getters[`auth/login`];
    },
  },
  methods: {
    windowClose() {
      window.open("about:blank", "_self");
      window.close();
      //   window.open("about:blank", "_self").close();
      //   window.open("", "_self").close();
      //   window.close();
      // `window.closed`を参照することでページが閉じられているかを確認できます。
      if (!window.closed) {
        alert("閉じるのに失敗しました");
      }
    },
    windowPrint() {
      window.print();
    },
    windowSubWindow() {
      let subWinObj1; //サブウインドウオブジェクト
      subWinObj1 = window.open(
        "_self",
        "sample1",
        "top=0,left=0,height=400,width=520,resizable=yes, scrollbars=yes"
      );
      window.focus(); // 自画面からフォーカスを取得
      subWinObj1.focus(); // サブウインドウにフォーカスを設定する
    },
    // サブウインドウを印刷する
    cman_winSubPrint1() {
      let subWinObj1; //サブウインドウオブジェクト
      if (!subWinObj1 || subWinObj1.closed) {
        alert("サブウインドウが見つかりません");
      } else {
        subWinObj1.print();
        subWinObj1.focus(); // サブウインドウにフォーカスを設定する
      }
    },
    getUserData(user) {
      const url = `http://harima-isk:50001/system/user`;
      const body = {};
      const option = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      this.loading = true;
      this.axios
        .get(url, body, option)
        .then((res) => {
          console.log(res.data);
          this.detailData.columns = res.data.columns;
          this.detailData.rows = res.data.rows;
          const rows = res.data.rows;
          for (const i in rows) {
            if (user == rows[i]["user_name"]) {
              this.user = rows[i]["user_name"];
              this.level = rows[i]["level"];
              break;
            }
          }
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getLayerData(layer, content) {
      const url = `http://harima-isk:50001/db/${layer}?${content}`;
      const body = {};
      const option = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      this.loading = true;
      this.axios
        .get(url, body, option)
        .then((res) => {
          const data = res.data;
          if (data.length > 0) {
            let data0 = data[0];
            let tmp = [];
            for (let key in data0) {
              if (!["gid", "geometry"].includes(key)) {
                let row = { text: key, value: data0[key] };
                tmp.push(row);
              }
            }
            this.items = tmp;
          }
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
  mounted() {
    //クエリパラメータがあれば
    let query = this.$route.query;
    if (Object.keys(query).length > 0) {
      console.log(query);
      //パラメータにlayerが存在するか
      if ("layer" in query) {
        const layer = query.layer?.slice();
        const user = query.user?.slice();
        delete query.layer;
        delete query.user;
        let contents = [];
        for (const key in query) {
          contents.push(`${key}=${query[key]}`);
        }
        const content = contents.join("&");
        this.getLayerData(layer, content);
        console.log("ユーザ確認", user);
        this.getUserData(user);
      }
    }
  },
};
</script>
