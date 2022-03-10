<template>
  <v-card>
    <v-card-title>
      <span>{{ dialogTitle }}</span>
      <v-spacer></v-spacer>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <div>
        <p><span></span><span></span></p>
        <p v-for="(item, index) in editItem" :key="index">
          <span class="d-inline-block" style="min-width: 150px">{{
            item.text
          }}</span
          ><span class="d-inline-block">{{ item.value }}</span>
        </p>
        <v-text-field
          v-model="detailTest[index].value"
          v-for="(item, index) in detailTest"
          :key="index"
          outlined
        >
          <template v-slot:prepend>
            <span class="d-inline-block text-truncate" style="min-width: 150px">
              {{ item.text }}
            </span>
          </template>
          <template v-slot:append-outer>
            <v-btn>
              <v-icon left> mdi-menu </v-icon>
              Menu
            </v-btn>
          </template>
        </v-text-field>
      </div>
      <v-dialog v-model="filedialog" max-width="700px" scrorable persistent>
        <CardFile
          :displayType="2"
          :filepath="content[index].value"
          :visible="filedialog"
          :bkPoint="bkPoint"
          @input="content[index].value = $event"
          @clickSubmit="onSubmit"
          @clickCancel="onCancel"
        />
      </v-dialog>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        v-if="showSubmit"
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
        v-if="showClose"
      >
        {{ dialogNoText }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import CardFile from "@/components/Card/CardFile";

export default {
  name: "DialogCard",
  components: { CardFile },
  props: [
    "dialogType",
    "header",
    "content",
    "loginType",
    "dialog",
    "bkPoint",
    "showClose",
  ],
  data() {
    return {
      headerName: "項目名",
      valueName: "値",
      placeHolderName: "",
      filedialog: false,
      filepath: "",
      date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      colName: "uri",
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
      inputType: "",
      innerShowClose: true,
    };
  },
  watch: {
    filedialog: (v) => {
      console.log(v);
    },
    content(v) {
      console.log("入力データ", v);
    },
  },
  computed: {
    showSubmit() {
      let isShow = true;
      const content = this.content;
      const type = this.dialogType;
      const name = this.colName;
      console.log(name);
      if (type == 0) {
        isShow = false;
        for (const i in content) {
          const text = content[i]["text"];
          if (text == name) {
            isShow = true;
            break;
          }
        }
      }

      return isShow;
    },
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
  mounted() {
    if (this.showClose) this.innerShowClose = Object.assign(this.showClose);
  },
};
</script>
