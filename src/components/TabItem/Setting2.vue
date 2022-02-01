<template>
  <v-card color="#fff">
    <v-toolbar>
      {{ title }}
      <v-spacer />
      <v-divider vertical />
      <v-btn v-for="(b, i) in buttons" :key="i" class="mx-2">
        {{ b.name }}
      </v-btn>
    </v-toolbar>
    <v-card-text>
      <MyTable
        :headers="user.headers"
        :items="user.items"
        :itemkey="user.itemkey"
        :bkPoint="bkPoint"
        @childChange="applyChanges"
      />
    </v-card-text>
    <v-btn @click="paswwordDialog = true">ボタン</v-btn>
    <v-dialog v-model="paswwordDialog" max-width="700px" scrorable>
      <CardPassword :clickSubmit="onSubmit" :clickCancel="onCancel" />
    </v-dialog>
  </v-card>
</template>

<script>
import Moment from "moment";
import MyTable from "@/components/DataTable/MyTable";
import CardPassword from "@/components/Card/CardPassword";
export default {
  name: "setting2",
  components: { MyTable, CardPassword },
  props: ["bkPoint"],
  data() {
    return {
      title: "ユーザー情報",
      buttons: [
        { name: "新規作成", color: "" },
        { name: "閲覧", color: "" },
        { name: "更新", color: "" },
        { name: "削除", color: "" },
      ],
      user: {
        select: [],
        headers: [],
        items: [],
        data: [],
        sorts: {},
        sortBy: "no",
        sortDesc: false,
        itemkey: "no",
      },
      tableHeight: 300,
      display: [],
      editItem: [],
      originItem: [],
      selectIndex: "",
      paswwordDialog: false,
    };
  },
  computed: {
    url() {
      return this.$store.getters[`backend/url`];
    },
  },
  methods: {
    onSubmit(data) {
      console.log(data);
      this.passwordDialog = false;
    },
    onCancel(data) {
      console.log(data);
      this.passwordDialog = false;
    },
    applyChanges(select) {
      // console.log("parentChange", select);
      this.select = select;
    },
    toggleOrder(text, index) {
      console.log(this.user.sortBy, index);
      const desc = !this.user.headers[index].sortDesc;
      this.user.headers[index].sortDesc = desc ? true : false;
      this.user.sortBy = text;
      this.user.sortDesc = desc;
    },
    getUserData() {
      const url = `${this.url}/system/user`;
      this.loading = true;
      this.axios
        .get(url)
        .then((res) => {
          console.log("success", res.data);
          this.user.data = Object.assign(res.data);
          const columnNames = res.data.columns.map((x) => x.columnName);
          let h = [];
          let sorts = {};
          for (const i in columnNames) {
            const name = columnNames[i];
            h.push({ text: name, value: name, sortDesc: false });
            sorts[name] = true;
          }

          let rows = res.data.rows;
          console.log(rows);
          for (const key in rows) {
            const _date = rows[key]["created_day"];
            rows[key]["created_day"] = Moment(_date).format("YYYY/MM/DD");
          }
          this.user.headers = Object.assign(h);
          this.user.items = Object.assign(rows);
          this.user.sorts = Object.assign(sorts);
        })
        .catch((error) => {
          console.log(error);
          alert(
            "処理が正しく行えませんでした。時間をおいてやり直してください。"
          );
        })
        .finally(() => {
          this.loading = false;
        });
    },
    close() {
      this.isEditing = false;
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    open(index) {
      this.selectIndex = index;

      if (this.selectIndex != -1) {
        if (this.select.length <= 0) {
          alert("選択されていません");
          return;
        }
        const item = Object.assign(this.select[0]);
        console.log(item);
        this.originItem = Object.assign(item);
        const edit = Object.assign(this.defaultItem);
        let data = [];
        for (const i in edit) {
          const text = edit[i].text;
          data.push({ text: text, value: item[text] });
        }
        this.editItem = Object.assign(data);
      } else {
        this.editItem = Object.assign(this.defaultItem);
      }
      this.dialog = true;
    },
    save() {
      const origin = this.originItem;
      const id = origin.gid;
      console.log("origin", id);

      //insert
      let data = {};
      const item = Object.assign(this.editItem);
      for (const i in item) {
        const text = item[i].text;
        const value = item[i].value;
        if (value != null && value != "") data[text] = value;
      }
      const content1 = { data: data };

      //update
      data = {};
      const item1 = Object.assign(this.editItem);
      let dataSize = 0;
      for (const i in item1) {
        const text = item1[i].text;
        const value = item1[i].value;
        if (value != origin[text]) {
          data[text] = value;
          dataSize++;
        }
      }
      const content2 = { data: { key: { gid: id }, update: data } };

      //delete
      const content3 = { gid: id };

      const index = this.selectIndex;
      if (index == -1) {
        this.insert(content1);
      } else if (index == 0) {
        const key = "ファイルパス";
        if (key in origin) {
          this.filepath = origin[key];
          this.filedialog = true;
          console.log("ファイル一覧を表示");
        } else {
          console.log("ファイルパスが存在しません");
        }
      } else if (index == 1) {
        if (dataSize <= 0) {
          console.log("更新する値が存在しません");
        } else {
          this.update(content2);
        }
      } else if (index == 2) {
        this.delete(content3);
      } else {
        this.close();
      }
      this.dialog = false;
    },
  },
  created() {
    // リアクティブデータ作成後に行いたい処理
    this.getUserData();
  },
};
</script>
