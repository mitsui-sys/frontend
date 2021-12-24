import XLSX from "xlsx";
import XlsxPopulate from "xlsx-populate";
import { saveAs } from "file-saver";

const state = () => ({
  name:"tbl_shokai",
  header: [], 
  content: [], 
  selected:[], 
})

const getters = {
  name: state => state.name,
  header: state => state.header,
  content: state => state.content,
  selected: state => state.selected,
  p_header: state => state.p_header
}

const actions = {
    updateName({ commit}, name){
      commit('updateName', name)
    },
    updateHeader({ commit }, header) {
        commit('updateHeader', header)
    },
    updateContent({ commit }, content) {
        commit('updateHeader', content)
    },
    updateData({ commit }, response) {
      let content = response.data
      let header = [];
      let first = Object.keys(content[0]);
      let width = 100.0 / first.length;
      let size_text = `${parseInt(width)}%`;
      first.forEach((key) => {
          let obj = { text: key, value: key, width: size_text };
          header.push(obj);
      });
      // console.log(header)
      // console.log(content)
      commit('updateHeader', header)
      commit('updateContent', content)
    },
    updateSelected({commit}, selected){
      commit('updateSelected', selected)
    }
}

const mutations = {

    async getWorkbook(url) {
      const res = await this.axios.get(url, { responseType: "arraybuffer" });

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
    daownloadWB() {
      let fileName = "/resources/test.xlsx";
      this.makeWorkbook(fileName);
      this.download(this.workbooks[0], "output.xlsx");
    },
    makeWorkbook(excelName) {
      this.getWorkbook(excelName)
        .then((workbook) => {
          let sheet = workbook.sheet(0);
          let headers = this.headers.map((item) => item["text"]);
          let datas = [];
          for (let key of Object.keys(this.serverDatas)) {
            let row = this.serverDatas[key];
            let data = headers.map((h) => row[h]);
            datas.push(data);
          }
          this.writeCell(sheet, "A1", [headers]);
          this.writeCell(sheet, "A2", datas);
          this.workbooks.push(workbook);
        })
        .catch((error) => {
          console.log("error", error);
          // throw error;
        });
    },
    getTemplateWorkbook() {
      this.getWorkbook("/resources/test.xlsx")
        .then((workbook) => {
          // Modify the workbook.
          // workbook.sheet("Sheet1").cell("A1").value("change");
          let sheet = workbook.sheet(0);
          let headers = this.headers.map((item) => item["text"]);
          let datas = [];
          for (let key of Object.keys(this.serverDatas)) {
            let row = this.serverDatas[key];
            let data = headers.map((h) => row[h]);
            datas.push(data);
          }
          console.log(headers);
          console.log(datas);
          // sheet.cell(1, 1).value([headers]);
          // sheet.cell(2, 1).value(datas);
          this.writeCell(sheet, "A1", [headers]);
          this.writeCell(sheet, "A2", datas);
          let filename = "out.xlsx";

          this.download(workbook, filename);
        })
        .catch((error) => {
          console.log("error", error);
          // throw error;
        });
    }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}