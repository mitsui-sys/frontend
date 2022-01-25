<template>
  <v-card>
    <v-toolbar>表示</v-toolbar>
    <v-card-text>
      <v-switch
        v-model="development"
        label="開発者モード"
        @change="changeDev"
      />
      <v-card class="pa-5">
        <v-container fluid>
          <v-row>
            <v-subheader>テーブル名</v-subheader>
            <v-autocomplete
              v-model="selectedTable"
              :items="tableNameList"
              dense
              filled
            />
            <v-btn @click="registerTableShown">登録</v-btn>
            <v-btn @click="deleteTableShown">削除</v-btn>
          </v-row>
          <v-row>
            <v-subheader>表示名</v-subheader>
            <v-autocomplete
              v-model="selectedDisplay"
              :items="displayItems"
              @change="selectTableShown"
              dense
              filled
            />
          </v-row>
          <v-row>
            <v-switch
              v-for="col in headers"
              :key="col.value"
              v-model="col.shown"
              :label="`${col.text}`"
              @change="changeTableShown"
            ></v-switch>
          </v-row>
        </v-container>
      </v-card>
    </v-card-text>
  </v-card>
</template>
