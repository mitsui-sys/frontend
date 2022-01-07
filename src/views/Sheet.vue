<template>
  <v-container fluid>
    <h1>{{ kind }}</h1>
    <v-card color="#fff" class="condition">
      <v-card-title class="d-flex justify-center pa-0 mt-6 mb-3"
        >検索条件</v-card-title
      >
      <v-card-text class="d-flex justify-center flex-column search">
        <v-container>
          <v-row>
            <v-col cols="3">
              <v-subheader>テーブル名</v-subheader>
            </v-col>
            <v-col cols="4">
              <v-autocomplete
                v-model="selectedName"
                :items="tableNameList"
                :search-input.sync="search"
                dense
                label="選択"
              ></v-autocomplete>
            </v-col>
            <v-spacer></v-spacer>
          </v-row>
        </v-container>
        <div v-for="(item, index) in queryCondition" :key="index">
          <v-container>
            <v-row>
              <v-col cols="2">
                <v-subheader>条件{{ index + 1 }}</v-subheader>
              </v-col>
              <v-col cols="6">
                <v-select
                  v-model="item.text"
                  :items="shownHeaders"
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
              <v-col cols="4">
                <v-btn @click="addInput">検索条件追加</v-btn>
              </v-col>
              <v-col cols="2">
                <v-btn @click="initialize">クリア</v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card-actions>
      </v-card-text>
    </v-card>
    <v-card>
      <v-toolbar flat outlined>
        <v-toolbar-title>テーブル表示</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        件数:{{ tblContents.length }}
        <v-spacer></v-spacer>
        <v-btn class="mb-2" @click="getTemplateWorkbook()"> Excel出力 </v-btn>

        <v-btn
          class="mb-2"
          @click="registerItem()"
          v-if="selected.length > 0 && loginData.level >= 1"
        >
          地図システムで確認
        </v-btn>
        <v-btn
          class="mb-2"
          @click="registerItem()"
          v-if="selected.length > 0 && loginData.level >= 1"
        >
          ジオメトリ削除
        </v-btn>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-btn
          class="mb-2"
          @click="editItem(0)"
          v-if="selected.length > 0 && loginData.level >= 0"
        >
          閲覧
        </v-btn>
        <v-btn
          class="mb-2"
          @click="editItem(1)"
          v-if="selected.length > 0 && loginData.level >= 1"
        >
          編集
        </v-btn>
        <v-btn
          class="mb-2"
          @click="editItem(2)"
          v-if="selected.length > 0 && loginData.level >= 1"
        >
          削除
        </v-btn>
        <v-btn
          class="mb-2"
          color="primary"
          dark
          @click="createItem()"
          v-if="loginData.level >= 1"
        >
          新規登録
        </v-btn>
        <MyDialog
          :dialogType="editedIndex"
          :content="editedItem"
          :loginType="loginData.level"
          :dialog.sync="dialog"
          @input-content="save"
        />
        <v-snackbar v-model="snackbar" :top="true" :timeout="timeout">
          {{ snackbarText }}
          <v-btn color="pink" text @click="snackbar = false">Close</v-btn>
        </v-snackbar>
      </v-toolbar>
      <v-container fluid>
        <v-row>
          <v-col v-for="col in tblHeaders" :key="col.value">
            <v-switch v-model="col.shown" :label="`${col.text}`"></v-switch>
          </v-col>
        </v-row>
      </v-container>
      <v-data-table
        v-model="selected"
        :headers="shownHeaders"
        :items="tblContents"
        :page.sync="page"
        :items-per-page="25"
        :footer-props="{ itemsPerPageOptions: [5, 25, 50, 100] }"
        item-key="gid"
        show-select
        single-select
        @page-count="pageCount = $event"
        @click:row="clickRow"
        class="display elevation-1 overflow-auto"
        fixed-header
        fixed-footer
        height="500px"
        calculate-widths
        :header-props="{
          'sort-icon': '▼',
        }"
      >
        <template v-slot:top> </template>

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
            <td v-for="header in shownHeaders" :key="header.value">
              {{ item[header.value] }}
            </td>
          </tr>
        </template>
      </v-data-table>
      <v-pagination
        dense
        v-model="page"
        :length="pageCount"
        :total-visible="7"
      ></v-pagination>
    </v-card>
    <br />
  </v-container>
</template>

<script>
import MyXlsx from "@/modules/myXlsx";
import MyDialog from "@/components/Dialog";
import Moment from "moment";

export default {
  name: "Sheet",
  components: { MyDialog },
  data() {
    return {
      tblHeaders: [],
      tblContents: [],
      isShown: true,
      snackbar: false,
      snackbarText: "成功",
      timeout: 1500,
      isEditing: false,
      editedIndex: -1,
      dateRule: /^[0-9]{4}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])$/,
      editedItem: {},
      dialog: false,
      selectedName: "",
      selected: [],
      selectedId: -1,
      valid: false,
      singleSelect: true,
      success: false,
      date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      search: "",
      pagination: {},
      page: 1,
      pageCount: 0,
      itemsPerPage: 5,
      showSelected: true,
      operater: [
        { text: "=", value: "=", rule: "=" },
        { text: "LIKE", value: "LIKE", rule: "LIKE" },
        { text: ">", value: ">", rule: ">" },
        { text: "<", value: "<", rule: "<" },
        { text: ">=", value: ">=", rule: ">=" },
        { text: "<=", value: "<=", rule: "<=" },
      ],
      queryCondition: [],
      rules: {
        yyyymmdd: (value) => {
          const pattern = this.dateRule;
          return pattern.test(value) || "yyyymmdd形式で入力してください";
        },
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
    search(val) {
      // すでに読み込み済みの場合は、何もしない
      // if (this.items.length > 0) return;
      // 読み込み中の場合も、何もしない
      if (this.isLoading) return;

      this.isLoading = true;
      if (val == null) return;
      let url = `${this.backend_url}/columns/${val}`;
      let cond = {};
      let option = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      console.log(url, cond, option);
      this.axios
        .get(url, cond, option)
        .then((res) => {
          console.log("columns", res.data);
          let columns = res.data.columns;
          this.columns = columns;
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => (this.isLoading = false));
    },
  },
  computed: {
    shownHeaders() {
      return this.tblHeaders.filter((h) => h.shown);
    },
    loginData() {
      return this.$store.getters[`auth/login`];
    },
    host() {
      return this.$store.getters[`table/host`];
    },
    port() {
      return this.$store.getters[`table/port`];
    },
    user() {
      return this.$store.getters[`table/user`];
    },
    password() {
      return this.$store.getters[`table/password`];
    },
    tableName() {
      return this.$store.getters[`table/tableName`];
    },
    tableNameList() {
      return this.$store.getters[`table/tableNameList`];
    },
    // tblHeaders() {
    //   return this.isShown
    //     ? this.$store.getters[`table/shownHeaders`]
    //     : this.$store.getters[`table/header`];
    // },
    // shownHeaders() {
    //   return this.$store.getters[`table/shownHeaders`];
    // },
    // tblContents() {
    //   // return this.$store.getters[`table/content`];
    //   //1214 idを
    //   return this.$store.getters[`table/content`].map((item, index) => ({
    //     unique_id: index,
    //     ...item,
    //   }));
    // },
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
    backend_url() {
      return this.$store.getters[`backend/url`];
    },
    updateEditedItem() {
      let editedItem = Object.assign(this.editedItem);
      let sendData = {};
      let data = {};
      console.log("edited", editedItem);
      for (let key in editedItem) {
        let text = editedItem[key]["text"];
        let value = editedItem[key]["value"];
        if (text == "id") sendData["id"] = value;
        data[text] = value;
      }

      let selected = Object.assign(this.selected[0]);
      for (let key in selected) {
        if (data[key] == selected[key]) {
          delete data[key];
        }
      }
      return data;
    },
    insertEditedItem() {
      let editedItem = Object.assign(this.editedItem);
      let sendData = {};
      let data = {};
      console.log("edited", editedItem);
      for (let key in editedItem) {
        let text = editedItem[key]["text"];
        let value = editedItem[key]["value"];
        if (value != null && value != "") data[text] = value;
      }
      sendData["data"] = [data];
      console.log(sendData);
      return sendData;
    },
    defaultItem() {
      let data = [];
      let header = Object.assign(this.shownHeaders);
      for (let key in header) {
        data.push({ text: header[key].text, value: "" });
      }
      return data;
    },
    kind() {
      return this.$store.getters[`config/kind`];
    },
  },
  methods: {
    logout() {
      this.$store.dispatch("auth/destoroy");
    },
    formatToDateString() {
      // 空文字の場合、変換しない
      if (this.inputDate === "") return;
      // 形式が正しくない場合、変換しない
      if (!this.dateRule.test(this.inputDate)) return;
      const str = String(this.inputDate);
      // 表示用に加工
      this.displayDate = `${str.slice(0, 4)}/${str.slice(4, 6)}/${str.slice(
        6,
        8
      )}`;
      // DB保存用に加工
      this.outputDate = `${str.slice(0, 4)}-${str.slice(4, 6)}-${str.slice(
        6,
        8
      )}`;
      this.isEdit = false;
    },
    clickRow() {
      console.log(this.selected);
    },
    clear() {},
    createItem() {
      this.isEditing = true;
      this.editedIndex = -1;
      this.editedItem = Object.assign(this.defaultItem);
      console.log(this.editedItem);
      this.dialog = true;
    },
    registerItem() {
      // let url = `${this.backend_url}/db/${this.selectedName}`;
      const url = "http://harima-isk:50001/system/search/register";
      const layer = this.selectedName;
      const selected = this.selected;
      if (selected == "") {
        alert("テーブル名が選択されていません");
        return;
      }
      const option = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      let rows = [];
      for (const i in selected) {
        const num = selected[i]["番号"];
        // rows.push({ user_name: this.loginData.name, layer: layer, id: num });
        rows.push(`${layer}:${num}`);
      }
      const row = rows.join("&");
      const cond = { data: { user_name: this.loginData.name, search: row } };
      console.log(url, cond, option);
      this.axios
        .post(url, cond, option)
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          alert("登録に失敗しました");
          console.log(error);
        });
    },
    editItem(id = 0) {
      this.editedIndex = id;
      this.isEditing = id == 1;
      let selected = this.selected;
      if (selected.length <= 0) {
        return;
      }
      const selected1 = selected[0];
      this.editedNumber = selected1["番号"];
      const data = Object.assign(this.defaultItem);
      let newData = [];
      for (let key in selected1) {
        for (let i in data) {
          let check = data[i]["text"];
          if (key == check) {
            newData.push({ text: key, value: selected1[key] });
          }
        }
      }

      this.editedItem = Object.assign(newData);
      this.dialog = true;
    },
    close() {
      this.isEditing = false;
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    save(content = -1) {
      const index = this.editedIndex;
      console.log("ダイアログ処理", content, index);
      if (index == 0) {
        console.log("pdfを開く");
        let filepath = "resources/test.pdf";
        window.open(filepath);
      } else {
        if (index == 1) {
          this.updateRows();
        } else if (index == 2) {
          this.deleteRows();
        } else if (index == -1) {
          this.insertRows();
        }
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
    registerLog(action, content) {
      let url = `http://harima-isk:50001/system/log/register`;
      let now = Moment().format("YYYY/MM/DD HH:mm:ss dddd");
      let cond = {
        data: {
          user_name: this.loginData.name,
          document: this.kind,
          rireki: action,
          rireki_content: content,
          created: now,
        },
      };
      console.log(cond);
      let option = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      console.log("操作履歴", url, cond, option);
      this.axios
        .post(url, cond, option)
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    initialize() {
      let postdata = {
        host: this.host,
        port: this.port,
        database: this.tableName,
        user: this.user,
        password: this.password,
      };
      let query = `${this.backend_url}/init`;

      this.axios
        .post(query, postdata)
        .then((res) => {
          this.items = res.data;
          this.$store.dispatch(`table/updateTableNameList`, res.data);
          // console.log("tableNameList", this.tableNameList);
          // this.$store.dispatch(`table/updateData`, []);
        })
        .catch((err) => {
          return err.response;
        });
    },
    selectReplace() {
      let url = `${this.backend_url}/db/replace`;
      let cond = {};
      let option = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      console.log(url, cond, option);
      this.axios
        .get(url, cond, option)
        .then((res) => {
          this.$store.dispatch(`table/updateReplace`, res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    sendDBRequest(type) {
      const url = `${this.backend_url}/db/${this.selectedName}`;
      const option = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      console.log(url, option, type);
    },
    submit() {
      //項目を入力したか確認
      this.$store.dispatch(`table/updateTableName`, this.selectedName);
      let conds = this.queryCondition;
      let contents = [];
      for (let key in conds) {
        let text = conds[key].text;
        let value = conds[key].value;
        contents.push(text + "=" + value);
      }
      let content = contents.join("&");

      let url = `${this.backend_url}/db/${this.selectedName}?${content}`;
      let body = {};
      let option = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      this.axios
        .get(url, body, option)
        .then((res) => {
          const data = res.data;
          const columns = data.columns;
          let rows = data.rows;
          const columnNames = columns.map((x) => x.columnName);
          let headers = [];
          for (const i in columnNames) {
            const name = columnNames[i];
            headers.push({ text: name, value: name, shown: true });
          }

          if (rows.length > 0) {
            // for (const key in rows) {
            //   let _date = data[key]["request_day"];
            //   rows.data[key]["request_day"] =
            //     Moment(_date).format("YYYY/MM/DD");
            // }
            this.tblHeaders = headers;
            this.tblContents = rows;
            console.log(headers);
            console.log(rows);
            // this.$store.dispatch(`table/updateData`, data);
          } else {
            this.tblHeaders = [];
            this.tblContents = [];
            // this.$store.dispatch(`table/updateData`, []);
          }
        })
        .catch((error) => {
          console.log(error);
        });
      this.registerLog("表示", `${this.selectedName}?${content}`);
    },
    insertRows() {
      let url = `${this.backend_url}/db/${this.selectedName}`;
      let cond = this.insertEditedItem;
      let option = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      console.log(url, cond, option);
      this.axios
        .post(url, cond, option)
        .then((response) => {
          console.log(response);
          this.submit();
          this.snackbar = true;
        })
        .catch((error) => {
          alert("追加失敗");
          console.log(error);
        });
      this.registerLog("追加", `${this.selectedName}?${this.insertEditedItem}`);
    },
    updateRows() {
      let url = `${this.backend_url}/db/${this.selectedName}`;
      let cond = {
        data: {
          key: "番号",
          id: this.editedNumber,
          update: this.updateEditedItem,
        },
      };
      let option = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      console.info("update", url, cond, option);
      this.axios
        .put(url, cond, option)
        .then((response) => {
          console.log(response);
          this.submit();
          this.snackbar = true;
        })
        .catch((error) => {
          alert("更新失敗");
          console.log(error);
        });
      this.registerLog("更新", `${this.selectedName}?${this.updateEditedItem}`);
    },
    deleteRows() {
      let url = `${this.backend_url}/db/${this.selectedName}`;
      let cond = { data: { deleteKey: "番号", selectedItem: this.selected } };
      let option = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      console.log(url, cond, option);
      this.axios
        .delete(url, cond, option)
        .then((response) => {
          console.log(response);
          this.submit();
          this.snackbar = true;
        })
        .catch((error) => {
          alert("削除失敗");
          console.log(error);
        });
      this.registerLog("削除", `${this.selectedName}?${cond}`);
    },
    getTemplateWorkbook() {
      MyXlsx.getWorkbook("/resources/test.xlsx")
        .then((wb) => {
          // シート名の一覧を取得
          // console.log("Sheet Name", wb.sheets);
          let copy = wb.sheet("Sheet1").usedRange();

          // resultというSheetを作成
          // resultシートが既にある場合エラーとなるので、存在した場合は削除し、新しく作成する
          let newSheetName = "result";
          if (wb.sheet(newSheetName)) {
            wb.deleteSheet(newSheetName);
            wb.addSheet(newSheetName);
          } else {
            wb.addSheet(newSheetName);
          }
          let newSheet = wb.sheet(newSheetName);

          //テーブル情報を読み込む
          let datas = [];
          const header = this.tblHeaders;
          const content = this.tblContents;
          for (let i in content) {
            let data = [];
            let rowC = content[i];
            for (let key in header) {
              let row = [];
              let text = header[key].text;
              row.push(text);
              row.push(rowC[text]);
              data.push(row);
            }
            datas.push(data);
          }
          console.log("Content", datas);
          let count = 0;
          for (let i in datas) {
            // this.writeCell(newSheet, "A" + (count * 24 + 1), style);
            let rangeStr = "A" + (count * 24 + 1) + ":C" + (count * 24 + 24);
            let destRange = newSheet.range(rangeStr);
            MyXlsx.copyRanges(copy, destRange);
            MyXlsx.writeCell(newSheet, "A" + (count * 24 + 2), datas[i]);
            count += 1;
          }

          let filename = "out.xlsx";

          MyXlsx.download(wb, filename);
        })
        .catch((error) => {
          console.log("error", error);
          // throw error;
        });
    },
    //テーブル幅設定
    // このページのテーブルというテーブル全てリサイズ可にする
    getResizableTable() {
      var tables = document.getElementsByTagName("table");
      for (var i = 0; i < tables.length; i++) {
        this.resizableGrid(tables[i]);
      }
    },

    // テーブルごとにリサイズ用の設定を追加
    resizableGrid(table) {
      var row = table.getElementsByTagName("tr")[0],
        cols = row ? row.children : undefined;
      if (!cols) return;

      table.style.overflow = "hidden";

      var tableHeight = table.offsetHeight;

      // テーブルのカラムとカラムの間にドラッグできるdivを挿入
      for (var i = 0; i < cols.length; i++) {
        var div = createDiv(tableHeight);
        cols[i].appendChild(div);
        cols[i].style.position = "relative";
        setListeners(div);
      }

      // 挿入したdivとdocument全体にイベントリスナーを付与
      function setListeners(div) {
        var pageX, curCol, nxtCol, curColWidth, nxtColWidth;

        /* <div> */
        // マウス押下時
        div.addEventListener("mousedown", (e) => {
          curCol = e.target.parentElement;
          nxtCol = curCol.nextElementSibling;
          pageX = e.pageX;

          var padding = paddingDiff(curCol);

          curColWidth = curCol.offsetWidth - padding;
          if (nxtCol) nxtColWidth = nxtCol.offsetWidth - padding;
        });

        // マウスホバー時
        div.addEventListener("mouseover", (e) => {
          e.target.style.borderRight = "2px solid #0000ff";
        });

        // マウスホバー解除時
        div.addEventListener("mouseout", (e) => {
          e.target.style.borderRight = "";
        });

        /* document */
        // マウスカーソル移動時
        document.addEventListener("mousemove", (e) => {
          if (curCol) {
            var diffX = e.pageX - pageX;

            if (nxtCol) nxtCol.style.width = nxtColWidth - diffX + "px";

            curCol.style.width = curColWidth + diffX + "px";
          }
        });

        // バブリング抑止
        div.addEventListener("click", function (e) {
          e.stopPropagation();
        });

        // マウス押下解除時
        document.addEventListener("mouseup", (e) => {
          console.log(e);
          curCol = undefined;
          nxtCol = undefined;
          pageX = undefined;
          nxtColWidth = undefined;
          curColWidth = undefined;
        });
      }

      // リサイズ用divの実体を作成
      function createDiv(height) {
        var div = document.createElement("div");
        div.style.top = 0;
        div.style.right = 0;
        div.style.width = "5px";
        div.style.position = "absolute";
        div.style.cursor = "col-resize";
        div.style.userSelect = "none";
        div.style.height = height + "px";
        return div;
      }

      // この辺はよくわからん
      function paddingDiff(col) {
        if (getStyleVal(col, "box-sizing") == "border-box") {
          return 0;
        }

        var padLeft = getStyleVal(col, "padding-left");
        var padRight = getStyleVal(col, "padding-right");
        return parseInt(padLeft) + parseInt(padRight);
      }

      function getStyleVal(elm, css) {
        return window.getComputedStyle(elm, null).getPropertyValue(css);
      }
    },
  },
  async mounted() {
    this.initialize();

    this.$nextTick(() => {
      //this.getResizableTable();
    });
  },
};
</script>
