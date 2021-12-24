<template>
  <div>
    <v-card color="#fff">
      <v-card-title class="d-flex justify-center pa-0 mt-6 mb-3"
        >検索条件</v-card-title
      >
      <v-card-text class="d-flex justify-center flex-column">
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field v-model="tableName" label="テーブル名" />
            </v-col>
          </v-row>
        </v-container>
        <div v-for="(item, index) in queryCondition" :key="index">
          <v-container>
            <v-row>
              <v-col cols="5">
                <v-select
                  v-model="item.text"
                  :items="tblHeader"
                  label="項目"
                ></v-select>
              </v-col>
              <!--<v-col cols="3">
                <v-select
                  v-model="item.rule"
                  :items="operater"
                  label="項目"
                ></v-select>
              </v-col>-->
              <v-col>
                <!-- 各入力ボックス -->
                <v-text-field
                  v-model="item.value"
                  type="text"
                  label="条件"
                  :rules="[rules.required]"
                />
              </v-col>

              <v-col cols="2">
                <!-- 入力ボックスの削除ボタン -->
                <v-btn block type="button" @click="removeInput(index)">
                  削除
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </div>

        <v-card-actions>
          <v-container>
            <v-row>
              <v-col cols="2">
                <v-btn @click="submit">検索</v-btn>
              </v-col>
              <v-col cols="2">
                <v-btn @click="addInput">検索条件追加</v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card-actions>
      </v-card-text>
    </v-card>
    <v-container width="1024px">
      <v-data-table
        :headers="tblHeaderA"
        :items="tblContent"
        :search="search"
        :items-per-page="25"
        :footer-props="{ itemsPerPageOptions: [5, 25, 50, 100] }"
        @click:row="clickRow"
        class="display"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>My CRUD</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-btn class="mb-2" @click="getTemplateWorkbook()">
              Excel出力
            </v-btn>
            <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  dark
                  class="mb-2"
                  v-bind="attrs"
                  v-on="on"
                >
                  新規登録
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="text-h5">{{ formTitle }}</span>
                </v-card-title>
                <v-card-text>
                  <div
                    class="mx-9"
                    v-for="(item, key, index) in tblHeader"
                    :key="index"
                  >
                    <v-text-field
                      v-model="item.value"
                      placeholder="値を入力"
                      outlined
                      dense
                    >
                      <template v-slot:label>
                        {{ item.text }}
                      </template>
                    </v-text-field>
                  </div>
                </v-card-text>
                <UserRegister />
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="close">
                    キャンセル
                  </v-btn>
                  <v-btn color="blue darken-1" text @click="save"> Save </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="dialogDelete" max-width="500px">
              <v-card>
                <v-card-title class="text-h5"
                  >この要素を本当に削除してもよろしいですか?</v-card-title
                >
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeDelete"
                    >キャンセル</v-btn
                  >
                  <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                    >OK</v-btn
                  >
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
          <v-icon @click="deleteItem(item)"> mdi-delete </v-icon>
        </template>
      </v-data-table>
    </v-container>
  </div>
</template>

<script>
import XlsxPopulate from "xlsx-populate";
import { saveAs } from "file-saver";
import UserRegister from "./userRegister";

export default {
  name: "Sheet",
  component: { UserRegister },
  data() {
    return {
      dialog: false,
      dialogDelete: false,
      editedItem: {},
      editedIndex: -1,
      defaultItem: {},
      selectedId: -1,
      valid: false,
      tableName: "tbl_shokai",
      singleSelect: false,
      success: false,
      search: "",
      pagination: {},
      operater: [
        { text: "=", value: "=", rule: "=" },
        { text: "LIKE", value: "LIKE", rule: "LIKE" },
        { text: ">", value: ">", rule: ">" },
        { text: "<", value: "<", rule: "<" },
        { text: ">=", value: ">=", rule: ">=" },
        { text: "<=", value: "<=", rule: "<=" },
      ],
      workbooks: [],
      queryCondition: [],
      rules: {
        required: (v) => !!v || "必須項目です",
        max25chars: (v) => (v && v.length) <= 25 || "最大25文字です。",
        AccountId: (v) => {
          return /^[0-9]{12}$/.test(v) || "アカウントID は12桁の数値です";
        },
        bucketName: (v) => {
          return (
            /^[a-z0-9.-]{3,63}$/.test(v) ||
            "バケット名 のフォーマットが正しくありません"
          );
        },
      },
    };
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },
  computed: {
    tblName() {
      return this.$store.getters[`table/name`];
    },
    tblHeader() {
      return this.$store.getters[`table/header`];
    },
    tblHeaderA() {
      return this.$store.getters[`table/headerA`];
    },
    tblContent() {
      return this.$store.getters[`table/content`];
    },
    tblSelected() {
      return this.$store.getters[`table/selected`];
    },
    tblCond() {
      return this.$store.getters[`table/conditions`];
    },
    tblParams() {
      return this.$store.getters[`table/params`];
    },
    db_ip() {
      return this.$store.getters[`db/ip`];
    },
    db_port() {
      return this.$store.getters[`db/port`];
    },
    db_ipaddress() {
      return this.$store.getters[`db/ipaddress`];
    },
    backend_ip() {
      return this.$store.getters[`backend/ip`];
    },
    backend_port() {
      return this.$store.getters[`backend/port`];
    },
    backend_ipaddress() {
      return this.$store.getters[`backend/ipaddress`];
    },
    formTitle() {
      return this.editedIndex === -1 ? "新規登録" : "編集";
    },
  },
  methods: {
    editItem(item) {
      this.editedIndex = this.tblContent.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.tblContent.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.tblContent.splice(this.editedIndex, 1);
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.tblContent[this.editedIndex], this.editedItem);
      } else {
        this.tblContent.push(this.editedItem);
      }
      this.close();
    },
    validate() {
      this.$refs.form.validate();
    },
    addInput() {
      this.queryCondition.push({ text: "", rule: "", value: "" }); // 配列に１つ空データを追加する
    },
    // ボタンをクリックしたときのイベント ③
    removeInput(index) {
      this.queryCondition.splice(index, 1); // 👈 該当するデータを削除
    },
    // deleteItem(item) {
    //   const index = this.serverDatas.indexOf(item);
    //   confirm("本当に削除しますか") && this.serverDatas.splice(index, 1);
    // },
    submit() {
      //項目を入力したか確認
      // const result = this.$refs.form.validate();
      console.log("cond", this.queryCondition);
      this.$store.dispatch(`table/updateName`, this.tableName);
      this.$store.dispatch(`table/updateCond`, this.queryCondition);
      console.log("query", this.tblParams);
      let queryStr = `${this.backend_ipaddress}/db?${this.tblParams}`;
      this.axios
        .get(queryStr)
        .then((res) => {
          this.$store.dispatch(`table/updateData`, res);
          console.log("Header", this.tblHeader);
          console.log("Content", this.tblContent);
          // let data = [this.tblHeader];
          // console.log("Data", data);
          // for (let key in data) {
          //   data[key].value = "";
          // }
          // this.editedItem = data.slice(0, this.tblContent.length);
          // this.defaultItem = data.slice(0, this.tblContent.length);
          console.log(this.editedItem, this.defaultItem);
        })
        .catch((err) => {
          return err.response;
        });
    },
    clickRow(row) {
      this.selectedId = row.id;
      this.$store.dispatch(`table/updateSelected`, row);
      console.log("selected", this.tblSelected);
    },
    async getWorkbook(url) {
      const res = await this.axios.get(url, { responseType: "arraybuffer" });
      console.log(res.data);
      const workbook = await XlsxPopulate.fromDataAsync(res.data);
      return workbook;
    },
    writeCell(worksheet, postion, val) {
      worksheet.cell(postion).value(val);
    },
    async download(workbook, fileName) {
      const wbout = await workbook.outputAsync();
      const blob = new Blob([wbout], { type: "application/octet-stream" });
      saveAs(blob, fileName);
    },
    getBlankWorkbook() {
      XlsxPopulate.fromBlankAsync().then((workbook) => {
        // Modify the workbook.
        workbook.sheet("Sheet1").cell("A1").value("This is neat!");

        // Write to file.
        // return workbook.toFileAsync("./out.xlsx");
        this.download(workbook, "out.xlsx");
      });
    },
    copyRanges(sourceRange, destRange) {
      sourceRange.forEach((cell, rowIndex, columnIndex) => {
        const destCell = destRange.cell(rowIndex, columnIndex);

        // get style object from current cell
        const style = cell.styles;
        // set the values of the destination cell
        destCell.value(cell.value());

        // set the styles of the cell
        destCell.style(style);
      });
    },
    getTemplateWorkbook() {
      console.log("/resources/test.xlsx");
      this.getWorkbook("/resources/test.xlsx")
        .then((workbook) => {
          console.log("workbook", workbook);
          let sheet = workbook.sheet(0);
          let headers = [];
          for (let key of Object.keys(this.tblHeader)) {
            let text = this.tblHeader[key].text;
            headers.push(text);
          }
          console.log("Header", headers);
          console.log(this.tblContent);
          let datas = [];
          for (let key of Object.keys(this.tblContent)) {
            let row = this.tblContent[key];
            console.log(row);
            let data = headers.map((h) => row[h]);
            datas.push(data);
          }
          console.log("Content", datas);
          // sheet.cell(1, 1).value([headers]);
          // sheet.cell(2, 1).value(datas);
          this.writeCell(sheet, "A2", [headers]);
          this.writeCell(sheet, "A3", datas);
          this.copyRanges(sheet.range("A1:E15"), sheet.range("A16:E31"));
          let filename = "out.xlsx";

          this.download(workbook, filename);
        })
        .catch((error) => {
          console.log("error", error);
          // throw error;
        });
    },
  },
  async mounted() {
    this.$store.dispatch(`db/updateIP`, "172.20.30.214");
    this.$store.dispatch(`db/updatePort`, 5432);
    this.submit();

    this.$nextTick(() => {
      //this.getResizableTable();
    });
  },
};
</script>

<style>
.search.v-form {
}

.display.v-data-table {
  white-space: nowrap;
  color: #333333;
}
.display.v-data-table th {
  border: 2px #333333 solid;
  background: #55cccc;
  font-size: 32px !important;
  color: #333333;
  bold: true;
}

.display.v-data-table td {
  background: #dddddd;
  border: 1px solid;
  font-size: 24px !important;
}
.display.v-data-table tr:nth-child(odd) td {
  background: #fff;
}
</style>
