<template>
  <div>
    <div id="app">
      <h1>{{ message }}</h1>
      <h2>{{ sort_key }}: {{ sort_asc ? "昇順" : "降順" }}</h2>
    </div>
    <div>検索：<input type="text" v-model="search" /></div>
    <table>
      <thead>
        <tr>
          <th @click="sortBy('name')" :class="addClass('name')">Name</th>
          <th @click="sortBy('email')" :class="addClass('email')">Email</th>
          <th @click="sortBy('website')" :class="addClass('website')">
            Website
          </th>
        </tr>
      </thead>
      <tbody>
        <!--<tr v-for="user in sort_uupdated_users" :key="user.id">-->
        <tr v-for="user in sort_users" :key="user.id">
          <td v-html="highLight(user.name)"></td>
          <td v-html="highLight(user.email)"></td>
          <td v-html="highLight(user.website)"></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "GetSampleData",
  data() {
    return {
      message: "Hello World",
      users: [],
      search: [],
      sort_key: "",
      sort_asc: true,
    };
  },
  computed: {
    updated_users() {
      let searchWord = this.search;
      console.log("search:", searchWord);
      if (searchWord === "") return this.users;
      return this.users.filter((user) => {
        return (
          user.name.includes(searchWord) ||
          user.email.includes(searchWord) ||
          user.website.includes(searchWord)
        );
      });
    },
    sort_users() {
      if (this.sort_key != "") {
        let set = 1;
        this.sort_asc ? (set = 1) : (set = -1);
        this.users.slice().sort((a, b) => {
          if (a[this.sort_key] < b[this.sort_key]) return -1 * set;
          if (a[this.sort_key] > b[this.sort_key]) return 1 * set;
          return 0;
        });
        return this.users;
      } else {
        return this.users;
      }
    },
  },
  methods: {
    sortBy(key) {
      this.sort_key === key
        ? (this.sort_asc = !this.sort_asc)
        : (this.sort_asc = true);
      this.sort_key = key;
    },
    addClass(key) {
      return {
        asc: this.sort_key === key && this.sort_asc,
        desc: this.sort_key === key && !this.sort_asc,
      };
    },
    getData() {
      this.axios
        .get("https://jsonplaceholder.typicode.com/users")
        .then((res) => {
          this.users = res.data;
          console.log(this.users);
        });
    },
    highLight(text) {
      let searchWord = this.search;
      if (searchWord === "") return text;
      if (!text.includes(searchWord)) return text;
      const re = new RegExp(searchWord, "ig");

      return text.replace(re, function (search) {
        return (
          '<span style="background-color:yellow;font-weight:bold">' +
          search +
          "</span>"
        );
      });
    },
    hightLightText() {
      let search = "";
      const highLight = (text) => {
        let searchWord = this.search;
        if (searchWord === "") return text;
        if (!text.includes(searchWord)) return text;
        const re = new RegExp(searchWord, "ig");
        return text.replace(re, function (search) {
          "" + search + "";
        });
      };
      return { search, highLight };
    },
  },
  mounted() {
    this.getData();
  },
};
</script>

<style scoped>
table {
  border-collapse: collapse;
  width: 100%;
}

td,
th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}

th {
  color: white;
  background-color: #1e90ff;
}
.asc::after {
  content: "↓";
}
.desc::after {
  content: "↑";
}
</style>
