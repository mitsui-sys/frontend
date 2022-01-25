<template>
  <v-card class="mx-auto">
    <v-container fluid>
      <v-row>
        <v-toolbar>
          <v-toolbar-title>{{ title }}</v-toolbar-title>
          <v-divider class="mx-4" vertical></v-divider>
          件数：{{ contents.length }}
          <v-spacer />
          <v-divider class="mx-4" vertical></v-divider>
          <v-btn @click="open(-1)" outlined>新規登録</v-btn>
          <v-btn @click="open(0)" :disabled="!selectItem.length > 0" outlined
            >閲覧</v-btn
          >

          <v-btn @click="open(1)" :disabled="!selectItem.length > 0" outlined
            >編集</v-btn
          >
          <v-btn @click="open(2)" :disabled="!selectItem.length > 0" outlined
            >削除</v-btn
          >
          <v-divider class="mx-4" vertical></v-divider>
          <v-btn
            class="primary"
            @click="download"
            :disabled="!selectItem.length > 0"
            outlined
            >ダウンロード</v-btn
          >
          <v-dialog v-model="dialog" max-width="700px" scrorable>
            <DialogCard
              :dialogType="selectIndex"
              :content="editItem"
              :loginType="loginData"
              @clickSubmit="save"
              @clickCancel="close"
            />
          </v-dialog>
          <v-snackbar v-model="snackbar" :top="true" :timeout="timeout">
            <span :class="`text-${bkPoint.model}`">{{ snackbarText }}</span>
            <v-btn color="pink" text @click="snackbar = false">閉じる</v-btn>
          </v-snackbar>
        </v-toolbar>
        <v-data-table
          v-model="selectItem"
          :headers="shownHeaders"
          :items="contents"
          class="document elevation-1 overflow-auto"
          show-select
          single-select
          fixed-header
          fixed-footer
          height="300px"
          width="400px"
          :header-props="{
            'sort-icon': '▼',
          }"
          :items-per-page="5"
          hide-default-header
        >
          <template v-slot:header="{ props: { headers } }">
            <thead>
              <tr>
                <th v-for="(h, index) in headers" :class="h.class" :key="index">
                  <span :class="`text-${bkPoint.model}`">{{ h.text }}</span>
                </th>
              </tr>
            </thead>
          </template>
          <template v-slot:item="{ item, isSelected, select }">
            <tr
              :class="[{ 'v-data-table__selected': isSelected }]"
              @click="select(!isSelected)"
            >
              <td>
                <v-simple-checkbox
                  :value="isSelected"
                  :ripple="false"
                  @input="select($event)"
                />
              </td>
              <td
                v-for="header in shownHeaders"
                :key="header.value"
                :class="`text-${bkPoint.model}`"
              >
                {{ item[header.value] }}
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-row>
    </v-container>
  </v-card>
</template>
<script>
import DialogCard from "@/components/DialogCard";
import MyXlsx from "@/modules/myXlsx";

import Moment from "moment";

export default {
  name: "document",
  components: { DialogCard },
  data() {
    return {
      title: "埋蔵文化財発掘届出・通知書",
      message: "お探しのページが見つかりませんでした。",
      mouse: {
        x: 0,
        y: 0,
      },
      headers: [],
      contents: [],
      selectIndex: -1,
      selectItem: [],
      editItem: [],
      originItem: [],
      defaultItem: [],
      url: "http://harima-isk:50001",
      dialog: false,
      snackbar: false,
      snackbarText: "",
      timeout: 1000,
    };
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
  },
  computed: {
    shownHeaders() {
      return this.headers.filter((x) => x.shown);
    },
    loginData() {
      return this.$store.getters[`auth/login`];
    },
    bkPoint() {
      // $vuetify.breakpointでブレークポイントを取得
      const bkPt = this.$vuetify.breakpoint;
      const point = {
        name: bkPt.name,
        cardHeight: 800,
        cardWidth: 800,
        cardMinHeight: 300,
        cardMinWidth: 400,
        btnWidth: 350,
        btnHeight: 50,
        titleModel: "h3",
        model: "h5",
      };
      switch (bkPt.name) {
        case "xl":
        case "lg":
        case "md":
          point.cardHeight = 800;
          point.cardWidth = 800;
          point.btnWidth = 350;
          point.btnHeight = 50;
          point.titleModel = "h4";
          point.model = "h6";
          break;
        case "sm":
        case "xs":
          point.cardHeight = 800;
          point.cardWidth = 800;
          // point.cardMinHeight = 400;
          // point.cardMinWidth = 400;
          point.btnWidth = 350;
          point.btnHeight = 50;
          point.titleModel = "h5";
          point.model = "subtitle1";
          break;
        default:
          break;
      }
      return point;
    },
  },
  methods: {
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.selectIndex = -1;
        this.editItem = Object.assign({}, this.defaultItem);
        this.reflesh();
      });
    },
    save() {
      const item = this.editItem;
      //insert
      let data = {};
      for (const i in item) {
        const text = item[i].text;
        const value = item[i].value;
        if (value != null) data[text] = value;
      }
      const content1 = { data: data };

      //update
      const origin = this.originItem;
      const id = origin.id;
      console.log("origin", id, item);
      data = {};
      for (const i in item) {
        const text = item[i].text;
        const value = item[i].value;
        if (value != origin[text]) {
          data[text] = value;
        }
      }
      const content2 = { data: { key: { id: id }, update: data } };

      //delete
      const content3 = { data: { key: { id: id } } };
      console.log(content3);

      if (this.selectIndex == -1) this.insert(content1);
      if (this.selectIndex == 1) this.update(content2);
      if (this.selectIndex == 2) this.delete(content3);
      this.close();
    },

    open(index) {
      this.selectIndex = index;

      if (this.selectIndex != -1) {
        if (this.selectItem.length <= 0) {
          alert("選択されていません");
          return;
        }
        const item = this.selectItem[0];

        this.originItem = Object.assign(item);
        let edit = Object.assign(this.defaultItem);

        let data = [];
        for (const i in edit) {
          const text = Object.assign(edit[i].text);
          data.push({ text: text, value: item[text] });
        }
        this.editItem = Object.assign(data);
      } else {
        this.editItem = Object.assign(this.defaultItem);
      }

      this.dialog = true;
    },
    download() {
      if (this.selectItem.length <= 0) {
        alert("選択されていません");
        return;
      }
      const assigns = {
        __date__: "令和4年1月14日",
        __name__: "播磨太郎", // エクセル内の__name__という文字列を置換
        __address__: "加古郡播磨町東本荘1丁目5番30番",
        __doc_number__: 5,
        __doc_date__: "令和  年  月  日",
        __city_date__: "令和  年  月  日",
        __place__: "加古郡播磨町大中1丁目1番2号",
        __area__: "約500㎡",
        __owner_name__: "播磨太郎",
        __owner_address__: "加古郡播磨町東本荘1丁目5番30番",
        __iseki_type__: "大中遺跡",
        __iseki_name__: "大中遺跡",
        __iseki_current__: "大中遺跡",
        __iseki_era__: "大中遺跡",
        __site_main__: "大中遺跡",
        __site_content__: "木造2階建個人住宅",
        __site_name__: "播磨太郎",
        __site_address__: "加古郡播磨町東本荘1丁目5番30番",
        __construction_name__: "未定",
        __construction_address__: "",
        __start__: "令和4年7月1日（予定）",
        __end__: "令和4年12月末",
        __option__: "",
        __guidance__: "",
      };

      //テーブル情報を読み込む
      let datas = [];

      const content = this.selectItem;
      console.log(content);
      for (let i in content) {
        let data = Object.assign(assigns);
        const item = content[i];
        data["__date__"] = Moment();
        data["__name__"] = item["user_name"];
        data["__address__"] = item["user_address"];
        data["__doc_number__"] = item["doc_num"];
        data["__doc_date__"] = item["doc_date"];
        data["__city_date__"] = item["city_date"];
        data["__place__"] = item["place_address"];
        data["__area__"] = item["place_area"];
        datas.push(data);
      }
      MyXlsx.getTemplateWorkbook(datas);
    },
    paint() {
      this.mouse.x = event.clientX;
      this.mouse.y = event.clientY;
    },
    getDocumentData() {
      const url = `${this.url}/document`;
      this.axios
        .get(url)
        .then((res) => {
          //成功時
          console.log("success", res.data);
          let columns = Object.assign(res.data.columns);
          let defaultItem = [];
          for (const i in columns) {
            const name = columns[i].columnName;
            columns[i]["text"] = name;
            columns[i]["value"] = name;
            columns[i]["shown"] = name != "id";
            if (name != "id") {
              let content = {};
              content["text"] = name;
              content["value"] = "";
              defaultItem.push(content);
            }
          }
          const check = (colName, colType) => {
            let isCheck;
            for (const i in columns) {
              const name = columns[i].columnName;
              if (colName == name) {
                const type = columns[i].type;
                isCheck = colType == type;
                break;
              }
            }
            return isCheck;
          };
          let rows = Object.assign(res.data.rows);
          for (const i in rows) {
            let row = rows[i];
            for (const key in row) {
              if (check(key, "DATE")) {
                const value = row[key];
                if (value != undefined)
                  row[key] = Moment(value).format("YYYY/MM/DD");
              }
            }
          }

          this.headers = columns;
          this.contents = rows;
          this.defaultItem = Object.assign(defaultItem);
          this.editItem = Object.assign(defaultItem);
          // console.log(defaultItem);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    insert(data) {
      const url = `${this.url}/document`;
      const option = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      console.log("insert document", url, data, option);
      this.axios
        .post(url, data, option)
        .then((res) => {
          //成功時
          console.log("success", res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    update(data) {
      const url = `${this.url}/document`;
      const option = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      console.log("update document", url, data, option);
      this.axios
        .put(url, data, option)
        .then((res) => {
          //成功時
          console.log("success", res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    delete(data) {
      const url = `${this.url}/document`;
      const option = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      console.log("delete document", url, data, option);
      this.axios
        .delete(url, data, option)
        .then((res) => {
          //成功時
          console.log("success", res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    reflesh() {
      this.getDocumentData();
    },
  },
  mounted() {
    this.reflesh();
  },
};
</script>
