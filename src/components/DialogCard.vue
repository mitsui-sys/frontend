<template>
  <v-card>
    <v-card-title>
      <span :class="`text-${bkPoint.titleModel}`">{{ dialogTitle }}</span>
      <v-spacer></v-spacer>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-container style="max-height: 500px" class="overflow-y-auto">
        <v-row
          v-for="(item, index) in content"
          :key="index"
          no-gutters
          class="pa-0 ma-0"
        >
          <v-col cols="4">
            <v-subheader :class="`text-${bkPoint.model}`">{{
              item.text
            }}</v-subheader>
          </v-col>
          <v-col>
            <!--
              <v-text-field
                v-model="item.value"
                placeholder="値を入力"
                ma-0
                outlined
                dense
                :disabled="!isEditing"
                class="input-items"
                @focus="$event.target.select()"
                @keydown.prevent.tab.exact="moveNext(index)"
                @keydown.prevent.shift.tab="movePrev(index)"
                @keydown.prevent.down="moveNext(index)"
                @keydown.prevent.up="movePrev(index)"
              />
              -->

            <v-text-field
              v-model="content[index].value"
              placeholder="値を入力"
              outlined
              :disabled="!isEditing"
              hide-details
              :class="`text-${bkPoint.model}`"
            >
              <template
                v-slot:append
                v-if="
                  item.text == 'ファイルパス' &&
                  (dialogType == 1 || dialogType == -1)
                "
              >
                <v-btn
                  @click="filedialog = true"
                  :class="`text-${bkPoint.model}`"
                  >選択</v-btn
                >
                <v-dialog v-model="filedialog" max-width="700px" scrorable>
                  <DialogCardFile
                    :param.sync="content[index].value"
                    :dataType="2"
                    :filepath="content[index].value"
                    @clickSubmit="onSubmit"
                    @clickCancel="onCancel"
                  />
                </v-dialog>
              </template>
              <v-text-field
                v-model="inputDate"
                label="入力用"
                @blur="formatToDateString"
                maxlength="8"
                type="date"
                v-if="inputType == 'date'"
                :class="`text-${bkPoint.model}`"
              />
            </v-text-field>
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
        @click="submit"
        :class="`text-${bkPoint.model}`"
      >
        {{ dialogYesText }}
      </v-btn>
      <v-btn
        outlined
        color="blue darken-1"
        text
        @click="cancel"
        :class="`text-${bkPoint.model}`"
      >
        {{ dialogNoText }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import DialogCardFile from "@/components/DialogCardFile";

export default {
  name: "DialogCard",
  components: { DialogCardFile },
  props: ["dialogType", "content", "loginType", "dialog", "bkPoint"],
  data() {
    return {
      pathname: "ファイルパス",
      filedialog: false,
      filepath: "",
      columns: [],
      selectedName: "",
      checkJP: false,
      valid: false,
      singleSelect: false,
      fileType: 2,
      date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      operater: [
        { text: "=", value: "=", rule: "=" },
        { text: "LIKE", value: "LIKE", rule: "LIKE" },
        { text: ">", value: ">", rule: ">" },
        { text: "<", value: "<", rule: "<" },
        { text: ">=", value: ">=", rule: ">=" },
        { text: "<=", value: "<=", rule: "<=" },
      ],
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
        dateRule: (v) => {
          return (
            /^[0-9]{4}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])$/.test(v) ||
            "日付のフォーマットが正しくありません"
          );
        },
      },
      returnData: {
        content: "",
      },
      inputType: "",
    };
  },
  watch: {
    filedialog: (v) => {
      console.log(v);
    },
  },
  computed: {
    dialogTitle() {
      const type = this.dialogType;
      return type == 0
        ? "閲覧"
        : type == 1
        ? "編集"
        : type == 2
        ? "削除"
        : "新規登録";
    },
    dialogYesText() {
      const type = this.dialogType;
      return type == 0
        ? "付属図を開く"
        : type == 1
        ? "更新"
        : type == 2
        ? "削除"
        : "登録";
    },
    dialogNoText() {
      const type = this.dialogType;
      return type == 0 ? "閉じる" : "キャンセル";
    },
    isEditing() {
      const type = this.dialogType;
      return type !== 0 && type !== 2;
    },
  },
  methods: {
    onSubmit(params) {
      this.filedialog = false;
      this.filepath = params.filepath;
    },
    onCancel() {
      this.filedialog = false;
    },
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
    //親コンポーネントへ送信
    submit() {
      this.$emit("clickSubmit", this.content);
    },
    cancel() {
      this.$emit("clickCancel");
    },
  },
};
</script>
