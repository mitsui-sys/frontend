<template>
  <v-container class="grey lighten-5">
    <v-row no-gutters>
      <v-col v-for="n in 3" :key="n" cols="12" sm="4">
        <v-card class="pa-2" outlined tile> One of three columns </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <v-card>
          <v-card-title>v-text-field</v-card-title>
          <v-container class="grey lighten-5">
            <v-row>
              <v-col cols="4">
                <v-subheader>名前</v-subheader>
              </v-col>
              <v-col>
                <v-text-field label="名前" placeholder="名前を入力" outlined />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="4">
                <v-subheader>数値</v-subheader>
              </v-col>
              <v-col>
                <v-text-field label="数値" placeholder="数値を入力" outlined />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="4">
                <v-subheader>メールアドレス</v-subheader>
              </v-col>
              <v-col cols="8">
                <v-text-field
                  label="Email address"
                  value="example"
                  suffix="@gmail.com"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="4">
                <v-subheader>Suffix for time zone</v-subheader>
              </v-col>
              <v-col cols="8">
                <v-text-field
                  label="Label Text"
                  value="12:30:00"
                  type="time"
                  suffix="PST"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-card class="mx-auto" max-width="500">
          <v-card-title>v-list</v-card-title>
          <v-list>
            <v-list-item-group v-model="model">
              <v-list-item v-for="(item, i) in items" :key="i">
                <v-list-item-icon>
                  <v-icon v-text="item.icon"></v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-text="item.text"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col col="6">
        <v-card>
          <v-card-title>v-btn</v-card-title>
          <v-row no-gutters>
            <v-btn block> Block Button </v-btn>
          </v-row>
          <v-row align="center" justify="space-around">
            <v-btn depressed> Normal </v-btn>
            <v-btn depressed color="primary"> Primary </v-btn>
            <v-btn depressed color="error"> Error </v-btn>
            <v-btn depressed disabled> Disabled </v-btn>
          </v-row>
          <v-row>
            <v-btn class="mx-2" fab dark small color="primary">
              <v-icon dark> mdi-minus </v-icon>
            </v-btn>

            <v-btn class="mx-2" fab dark small color="pink">
              <v-icon dark> mdi-heart </v-icon>
            </v-btn>

            <v-btn class="mx-2" fab dark color="indigo">
              <v-icon dark> mdi-plus </v-icon>
            </v-btn>

            <v-btn class="mx-2" fab dark color="teal">
              <v-icon dark> mdi-format-list-bulleted-square </v-icon>
            </v-btn>

            <v-btn class="mx-2" fab dark large color="cyan">
              <v-icon dark> mdi-pencil </v-icon>
            </v-btn>

            <v-btn class="mx-2" fab dark large color="purple">
              <v-icon dark> mdi-android </v-icon>
            </v-btn>
          </v-row>
        </v-card>
      </v-col>
      <v-col col="6">
        <v-card>
          <v-card-title>v-combobox</v-card-title>
          <v-container fluid>
            <v-row>
              <v-col cols="12">
                <v-combobox
                  v-model="select"
                  :items="items"
                  label="Combobox"
                  multiple
                  outlined
                  dense
                ></v-combobox>
              </v-col>
              <v-col cols="12">
                <v-combobox
                  v-model="select"
                  :items="items"
                  label="I use chips"
                  multiple
                  chips
                ></v-combobox>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col col="6">
        <v-card>
          <v-card-title>v-carousel</v-card-title>
          <v-carousel
            cycle
            height="400"
            hide-delimiter-background
            show-arrows-on-hover
          >
            <v-carousel-item v-for="(slide, i) in slides" :key="i">
              <v-sheet :color="colors[i]" height="100%">
                <v-row class="fill-height" align="center" justify="center">
                  <div class="text-h2">{{ slide }} Slide</div>
                </v-row>
              </v-sheet>
            </v-carousel-item>
          </v-carousel>
        </v-card>
      </v-col>
      <v-col col="6">
        <v-card>
          <v-container fluid>
            <v-row align="center">
              <v-col cols="12">
                <v-autocomplete
                  v-model="values"
                  :items="items"
                  outlined
                  dense
                  chips
                  small-chips
                  label="Outlined"
                  multiple
                ></v-autocomplete>
              </v-col>
              <v-col cols="12">
                <v-autocomplete
                  v-model="values"
                  :items="items"
                  dense
                  chips
                  small-chips
                  label="Solo"
                  multiple
                  solo
                ></v-autocomplete>
              </v-col>
              <v-col cols="12">
                <v-autocomplete
                  v-model="value"
                  :items="items"
                  dense
                  filled
                  label="Filled"
                ></v-autocomplete>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
        <v-card class="overflow-hidden" color="purple lighten-1" dark>
          <v-toolbar flat color="purple">
            <v-icon>mdi-account</v-icon>
            <v-toolbar-title class="font-weight-light">
              User Profile
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn
              color="purple darken-3"
              fab
              small
              @click="isEditing = !isEditing"
            >
              <v-icon v-if="isEditing"> mdi-close </v-icon>
              <v-icon v-else> mdi-pencil </v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text>
            <v-text-field
              :disabled="!isEditing"
              color="white"
              label="Name"
            ></v-text-field>
            <v-autocomplete
              :disabled="!isEditing"
              :items="states"
              :filter="customFilter"
              color="white"
              item-text="name"
              label="State"
            ></v-autocomplete>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn :disabled="!isEditing" color="success" @click="save">
              Save
            </v-btn>
          </v-card-actions>
          <v-snackbar v-model="hasSaved" :timeout="2000" absolute bottom left>
            Your profile has been updated
          </v-snackbar>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col col="6">
        <v-card flat>
          <v-card-text>
            <v-container fluid>
              <v-row>
                <v-col cols="12" sm="4" md="4">
                  <v-checkbox
                    v-model="ex4"
                    label="red"
                    color="red"
                    value="red"
                    hide-details
                  ></v-checkbox>
                  <v-checkbox
                    v-model="ex4"
                    label="red darken-3"
                    color="red darken-3"
                    value="red darken-3"
                    hide-details
                  ></v-checkbox>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-checkbox
                    v-model="ex4"
                    label="indigo"
                    color="indigo"
                    value="indigo"
                    hide-details
                  ></v-checkbox>
                  <v-checkbox
                    v-model="ex4"
                    label="indigo darken-3"
                    color="indigo darken-3"
                    value="indigo darken-3"
                    hide-details
                  ></v-checkbox>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-checkbox
                    v-model="ex4"
                    label="orange"
                    color="orange"
                    value="orange"
                    hide-details
                  ></v-checkbox>
                  <v-checkbox
                    v-model="ex4"
                    label="orange darken-3"
                    color="orange darken-3"
                    value="orange darken-3"
                    hide-details
                  ></v-checkbox>
                </v-col>
              </v-row>

              <v-row class="mt-12">
                <v-col cols="12" sm="4" md="4">
                  <v-checkbox
                    v-model="ex4"
                    label="primary"
                    color="primary"
                    value="primary"
                    hide-details
                  ></v-checkbox>
                  <v-checkbox
                    v-model="ex4"
                    label="secondary"
                    color="secondary"
                    value="secondary"
                    hide-details
                  ></v-checkbox>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-checkbox
                    v-model="ex4"
                    label="success"
                    color="success"
                    value="success"
                    hide-details
                  ></v-checkbox>
                  <v-checkbox
                    v-model="ex4"
                    label="info"
                    color="info"
                    value="info"
                    hide-details
                  ></v-checkbox>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-checkbox
                    v-model="ex4"
                    label="warning"
                    color="warning"
                    value="warning"
                    hide-details
                  ></v-checkbox>
                  <v-checkbox
                    v-model="ex4"
                    label="error"
                    color="error"
                    value="error"
                    hide-details
                  ></v-checkbox>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col col="6">
        <v-card>
          <v-file-input
            :rules="rules"
            accept="image/png, image/jpeg, image/bmp"
            placeholder="Pick an avatar"
            prepend-icon="mdi-camera"
            show-size
            label="File input"
          ></v-file-input>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col col="6">
        <v-card> </v-card>
      </v-col>
      <v-col col="6">
        <v-card> </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col col="6">
        <v-card>
          <v-container fluid>
            <v-radio-group v-model="column" column>
              <v-radio label="Option 1" value="radio-1"></v-radio>
              <v-radio label="Option 2" value="radio-2"></v-radio>
            </v-radio-group>
            <hr />
            <v-radio-group v-model="row" row>
              <v-radio label="Option 1" value="radio-1"></v-radio>
              <v-radio label="Option 2" value="radio-2"></v-radio>
            </v-radio-group> </v-container
        ></v-card>
      </v-col>
      <v-col col="6">
        <v-card flat color="transparent">
          <v-subheader>Min and max range slider</v-subheader>

          <v-card-text>
            <v-row>
              <v-col class="px-4">
                <v-range-slider
                  v-model="range"
                  :max="max"
                  :min="min"
                  hide-details
                  class="align-center"
                >
                  <template v-slot:prepend>
                    <v-text-field
                      :value="range[0]"
                      class="mt-0 pt-0"
                      hide-details
                      single-line
                      type="number"
                      style="width: 60px"
                      @change="$set(range, 0, $event)"
                    ></v-text-field>
                  </template>
                  <template v-slot:append>
                    <v-text-field
                      :value="range[1]"
                      class="mt-0 pt-0"
                      hide-details
                      single-line
                      type="number"
                      style="width: 60px"
                      @change="$set(range, 1, $event)"
                    ></v-text-field>
                  </template>
                </v-range-slider>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col col="6">
        <v-card></v-card>
      </v-col>
      <v-col col="6">
        <v-card></v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    items: [
      {
        icon: "mdi-inbox",
        text: "Inbox",
      },
      {
        icon: "mdi-star",
        text: "Star",
      },
      {
        icon: "mdi-send",
        text: "Send",
      },
      {
        icon: "mdi-email-open",
        text: "Drafts",
      },
    ],
    select: ["Inbox", "Star"],
    values: ["Inbox", "Star"],
    value: null,
    colors: [
      "indigo",
      "warning",
      "pink darken-2",
      "red lighten-1",
      "deep-purple accent-4",
    ],
    slides: ["First", "Second", "Third", "Fourth", "Fifth"],
    hasSaved: false,
    isEditing: null,
    model: null,
    states: [
      { name: "Florida", abbr: "FL", id: 1 },
      { name: "Georgia", abbr: "GA", id: 2 },
      { name: "Nebraska", abbr: "NE", id: 3 },
      { name: "California", abbr: "CA", id: 4 },
      { name: "New York", abbr: "NY", id: 5 },
    ],
    ex4: [
      "red",
      "indigo",
      "orange",
      "primary",
      "secondary",
      "success",
      "info",
      "warning",
      "error",
      "red darken-3",
      "indigo darken-3",
      "orange darken-3",
    ],
    rules: [
      (value) =>
        !value ||
        value.size < 2000000 ||
        "Avatar size should be less than 2 MB!",
    ],
    min: -50,
    max: 90,
    range: [-20, 70],
    column: null,
    row: null,
  }),
  methods: {
    onFinish(rsp) {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.snackbarColor = rsp === this.expectedOtp ? "success" : "warning";
        this.text = `Processed OTP with "${rsp}" (${this.snackbarColor})`;
        this.snackbar = true;
      }, 3500);
    },
    customFilter(item, queryText, itemText) {
      console.log(itemText);
      const textOne = item.name.toLowerCase();
      const textTwo = item.abbr.toLowerCase();
      const searchText = queryText.toLowerCase();

      return (
        textOne.indexOf(searchText) > -1 || textTwo.indexOf(searchText) > -1
      );
    },
    save() {
      this.isEditing = !this.isEditing;
      this.hasSaved = true;
    },
  },
};
</script>

<style>
.position-relative {
  position: relative;
}
</style>
