<template>
  <v-container>
    <div id="app">
      <label
        >Files
        <input
          type="file"
          id="files"
          ref="files"
          multiple
          @change="handleFilesUpload()"
        />
      </label>
      <br />
      <div v-for="(file, key) in files" :key="key" class="file-listing">
        {{ file.name }}
        <span class="remove-file" @click="removeFile(key)">Remove</span>
      </div>
      <br />
      <button @click="addFiles()">Add Files</button>
    </div>
  </v-container>
</template>

<script type="text/javascript">
export default {
  name: "FileList",
  data() {
    return { items: [], files: [] };
  },
  methods: {
    addFiles() {
      this.$refs.files.click();
    },

    handleFilesUpload() {
      let uploadedFiles = this.$refs.files;

      for (var i = 0; i < uploadedFiles.length; i++) {
        this.files.push(uploadedFiles[i]);
      }
      console.log("Files", this.files);
      this.writeExcel(uploadedFiles[0]);
    },
    removeFile(key) {
      this.files.splice(key, 1);
    },
    downloadFile(key) {
      let file0 = this.files[key];
      this.writeExcel(file0.file);
    },
  },
};
</script>
