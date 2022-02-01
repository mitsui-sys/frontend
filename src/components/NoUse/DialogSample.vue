<template>
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
        <v-combobox outlined :items="combo_items" label="combobox"></v-combobox>
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
</template>
