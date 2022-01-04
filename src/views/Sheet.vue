<template>
  <v-container fluid>
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
        <v-spacer></v-spacer>
        <v-btn class="mb-2" @click="getTemplateWorkbook()"> Excel出力 </v-btn>
        <v-divider class="mx-4" inset vertical></v-divider>
        <div>
          <v-btn
            class="mb-2"
            @click="registerItem()"
            v-if="selected.length > 0 && loginData.level >= 1"
          >
            地図システムで確認
          </v-btn>
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
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-btn
            color="alert"
            dark
            class="mb-2"
            @click="inputSample()"
            v-if="loginData.level >= 1"
          >
            入力例
          </v-btn>
        </div>
        <v-dialog v-model="dialog" max-width="700px" scrorable>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
              <v-spacer></v-spacer>
              <v-btn
                v-if="loginData.level >= 1 && editedIndex >= 0 && development"
                @click="isEditing = !isEditing"
              >
                <v-icon v-if="isEditing"> mdi-close </v-icon>
                <v-icon v-else> mdi-pencil </v-icon>
                {{ "編集" }}</v-btn
              >
              <v-btn
                v-if="loginData.level >= 1 && editedIndex >= 0 && development"
              >
                <v-icon> mdi-delete </v-icon>
                {{ "削除" }}</v-btn
              >
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <v-container style="max-height: 500px" class="overflow-y-auto">
                <v-row
                  v-for="(item, index) in editedItem"
                  :key="`edited${index}`"
                  no-gutters
                >
                  <v-col cols="4">
                    <v-subheader>{{ item.text }}</v-subheader>
                  </v-col>
                  <v-col>
                    <v-text-field
                      v-model="item.value"
                      placeholder="値を入力"
                      ma-0
                      outlined
                      clearable
                      dense
                      :disabled="!isEditing"
                      class="input-items"
                      ref="focusThis"
                      :forcus-key="index"
                      @keydown.enter.exact="save"
                      @keydown.prevent.tab.exact="moveNext(index)"
                      @keydown.prevent.shift.tab="movePrev(index)"
                      @keydown.prevent.down="moveNext(index)"
                      @keydown.prevent.up="movePrev(index)"
                    />
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                outlined
                color="blue darken-1"
                text
                @click="save"
                v-if="editedIndex != 0"
              >
                {{ dialogYesText }}
              </v-btn>
              <v-btn outlined color="blue darken-1" text @click="close">
                {{ dialogNoText }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="700px">
          <v-card>
            <v-card-title class="text-h5"
              >選択したアイテムを削除しますか?</v-card-title
            >
            <v-data-table
              :headers="tblHeader"
              :items="selected"
              :page.sync="page"
              :items-per-page="25"
              :footer-props="{ itemsPerPageOptions: [5, 25, 50, 100] }"
              class="display"
              hide-default-header
              hide-default-footer
              >>
            </v-data-table>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                >はい</v-btn
              >
              <v-btn color="blue darken-1" text @click="closeDelete"
                >いいえ</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogTest" max-width="700px">
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>
            <v-card-text>
              <v-radio-group v-model="colors">
                <v-radio
                  v-for="n in 3"
                  :key="n"
                  :label="`Radio ${n}`"
                  :value="n"
                ></v-radio>
              </v-radio-group>
              <v-combobox
                outlined
                :items="combo_items"
                label="combobox"
              ></v-combobox>
              <v-file-input show-size label="File input"></v-file-input>
              <v-text-field
                v-model="inputDate"
                label="入力用"
                @blur="formatToDateString"
                maxlength="8"
                type="date"
              />
              <!--              :rules="[rules.required, rules.yyyymmdd]" -->
              <v-menu
                v-model="menu2"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="date"
                    label="Picker without buttons"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>

                <v-date-picker
                  v-model="date"
                  locale="jp-ja"
                  :day-format="(date) => new Date(date).getDate()"
                  @input="menu2 = false"
                ></v-date-picker>
              </v-menu>
              <v-color-picker
                dot-size="25"
                swatches-max-height="200"
              ></v-color-picker>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn outlined color="blue darken-1" text> {{ "はい" }} </v-btn>
              <v-btn outlined color="blue darken-1" text>
                {{ "いいえ" }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
      <v-data-table
        v-model="selected"
        :headers="tblHeader"
        :items="tblContent"
        :page.sync="page"
        :items-per-page="25"
        :footer-props="{ itemsPerPageOptions: [5, 25, 50, 100] }"
        item-key="unique_id"
        show-select
        @page-count="pageCount = $event"
        @click:row="clickRow"
        class="display elevation-1 overflow-auto"
        disable-pagination
        hide-default-footer
        fixed-header
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
            <td v-for="header in tblHeader" :key="header.value">
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
import XlsxPopulate from "xlsx-populate";
import { saveAs } from "file-saver";

export default {
  name: "Sheet",
  data() {
    return {
      editedNumber: -1,
      isShown: true,
      isEditing: false,
      editedIndex: -1,
      responce: [],
      isDevelopment: false,
      dateRule: /^[0-9]{4}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])$/,
      inputDate: "",
      displayDate: "",
      outputDate: "",
      columns: [],
      selectedName: "",
      checkJP: false,
      dialog: false,
      dialogDelete: false,
      dialogTest: false,
      editedItem: {},

      selected: [],
      selectedId: -1,
      valid: false,
      singleSelect: false,
      success: false,
      date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      menu: false,
      modal: false,
      menu2: false,
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
      colors: "",
      combo_items: ["Programming", "Design", "Vue", "Vuetify"],
      items: [
        { text: "ID", value: "999" },
        { text: "名前", value: "kanko" },
        { text: "メールアドレス", value: "test@sample.com" },
        { text: "住所", value: "大阪府大阪市" },
        { text: "日付", value: "2021/01/01" },
      ],
      workbooks: [],
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
    dialogDelete(val) {
      val || this.closeDelete();
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
      // let option = {
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      // };
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
    tblHeader() {
      return this.isShown
        ? this.$store.getters[`table/shownHeaders`]
        : this.$store.getters[`table/header`];
    },
    shownHeaders() {
      return this.$store.getters[`table/shownHeaders`];
    },
    tblContent() {
      // return this.$store.getters[`table/content`];
      //1214 idを
      return this.$store.getters[`table/content`].map((item, index) => ({
        unique_id: index,
        ...item,
      }));
    },
    tblSelected() {
      return this.$store.getters[`table/selected`];
    },
    tblCond() {
      return this.$store.getters[`table/conditions`];
    },
    tblReplace() {
      return this.$store.getters[`table/replace`];
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
    backend_url() {
      return this.$store.getters[`backend/url`];
    },
    formTitle() {
      return this.editedIndex === 0
        ? "閲覧"
        : this.editedIndex === 1
        ? "編集"
        : this.editedIndex === 2
        ? "削除"
        : "新規登録";
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
      let header = Object.assign(this.tblHeader);
      console.log(header);
      for (let key in header) {
        data.push({ text: header[key].text, value: "" });
      }
      console.log("defaultItem", data);
      return data;
    },
    elements() {
      return this.$refs.focusThis;
    },
    dialogYesText() {
      return this.editedIndex == 0
        ? ""
        : this.editedIndex == 1
        ? "更新"
        : this.editedIndex == 2
        ? "削除"
        : "登録";
    },
    dialogNoText() {
      return this.editedIndex == 1
        ? "キャンセル"
        : this.editedIndex == 2
        ? "キャンセル"
        : "閉じる";
    },
  },
  methods: {
    moveFocus(i) {
      if (this.$refs.focusThis[i]) {
        this.$refs.focusThis[i].focus();
      }
    },
    moveNext(i) {
      console.log(`index:${i}`);
      this.moveFocus(i + 1);
    },
    movePrev(i) {
      console.log(`index:${i}`);
      this.moveFocus(i - 1);
    },
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
    clear() {
      this.$store.dispatch(`table/updateTableName`, []);
      this.$store.dispatch(`table/updateCond`, []);
      this.$store.dispatch(`table/updateData`, []);
    },
    inputSample() {
      this.dialogTest = true;
    },
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
    deleteItem() {
      if (this.selected.length <= 0) {
        return;
      }
      this.dialogDelete = true;
    },
    deleteItemConfirm() {
      this.deleteRows();
      this.closeDelete();
    },
    close() {
      this.isEditing = false;
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
      if (this.editedIndex == 0) {
        console.log("閉じるだけ");
      } else {
        if (this.editedIndex == 1) {
          this.updateRows();
        } else if (this.editedIndex == 2) {
          this.deleteRows();
        } else {
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
    initialize() {
      let postdata = {
        host: this.host,
        port: this.port,
        database: this.tableName,
        user: this.user,
        password: this.password,
      };
      let query = `${this.backend_url}/init`;
      console.log("post", postdata);
      this.axios
        .post(query, postdata)
        .then((res) => {
          this.items = res.data;
          this.$store.dispatch(`table/updateTableNameList`, res.data);
          console.log("tableNameList", this.tableNameList);
          this.$store.dispatch(`table/updateData`, []);
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
    submit() {
      //項目を入力したか確認
      // const result = this.$refs.form.validate();
      if (this.selectedName.length <= 0) {
        alert("テーブル名が入力されていません");
        return;
      }
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
      console.log(url);
      var moment = require("moment");
      this.axios
        .get(url, body, option)
        .then((res) => {
          let data = res.data;
          this.responce = data;
          if (data.length > 0) {
            for (let key in data) {
              let _date = data[key]["request_day"];
              res.data[key]["request_day"] = moment(_date).format("YYYY/MM/DD");
            }
            this.$store.dispatch(`table/updateData`, data);
          } else {
            this.$store.dispatch(`table/updateData`, []);
          }
        })
        .catch((error) => {
          console.log(error);
        });
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
        })
        .catch((error) => {
          alert("追加失敗");
          console.log(error);
        });
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
      console.log(url, cond, option);
      this.axios
        .put(url, cond, option)
        .then((response) => {
          console.log(response);
          this.submit();
        })
        .catch((error) => {
          alert("更新失敗");
          console.log(error);
        });
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
        })
        .catch((error) => {
          alert("削除失敗");
          console.log(error);
        });
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
        let newSheetName = "result";
        if (workbook.sheet(newSheetName)) {
          workbook.deleteSheet(newSheetName);
          workbook.addSheet(newSheetName);
        } else {
          workbook.addSheet(newSheetName);
        }
        let newSheet = workbook.sheet(newSheetName);
        // Modify the workbook.
        newSheet.cell("A1").value("This is neat!");

        // Write to file.
        // return workbook.toFileAsync("./out.xlsx");
        this.download(workbook, "out.xlsx");
      });
    },
    copyRanges(sourceRange, destRange) {
      sourceRange.forEach((cell, rowIndex, columnIndex) => {
        const destCell = destRange.cell(rowIndex, columnIndex);

        // get style object from current cell
        const style = cell.style([
          "bold",
          "italic",
          "underline",
          "strikethrough",
          "fontSize",
          "fontFamily",
          "fontColor",
          "horizontalAlignment",
          "verticalAlignment",
          "wrapText",
          "shrinkToFit",
          "textDirection",
          "textRotation",
          "verticalText",
          "fill",
          "border",
          "numberFormat",
        ]);
        // set the values of the destination cell
        destCell.value(cell.value());

        // set the styles of the cell
        destCell.style(style);
      });
    },
    getTemplateWorkbook() {
      this.getWorkbook("/resources/test.xlsx")
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
          let header = this.tblHeader;
          let content = this.tblContent;
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
            this.copyRanges(copy, destRange);
            this.writeCell(newSheet, "A" + (count * 24 + 2), datas[i]);
            count += 1;
          }

          let filename = "out.xlsx";

          this.download(wb, filename);
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
