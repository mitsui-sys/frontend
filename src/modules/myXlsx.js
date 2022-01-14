//Excelシート操作
import XlsxPopulate from "xlsx-populate";
import xPopWrapper from "xlsx-populate-wrapper";
import path from "path";
import { saveAs } from "file-saver";
import axios from "axios";

const getWorkbookWrpper = async (file) => {
  const filePath = path.resolve(file);
  const workbook = await new xPopWrapper(filePath);

  workbook
    .init()
    .then((wb) => {
      // シート名の一覧を取得
      console.log(wb.getSheetNames());
      // => ['Sheet1', 'Sheet2', 'Sheet3']

      // シート名を指定してヘッダ一覧の取得
      console.log(workbook.getHeadings("Sheet1"));
      // => ['Title1', 'Title2', 'Title3']

      // シート名を指定してJSONデータとして取得
      const jsonData = workbook.getData("Sheet1");
      console.log(jsonData);
      /*
      [
        {
          'Title1': '1',
          'Title2': '2',
          'Title3': '3',
        },
        {
          'Title1': '5',
          'Title2': '6',
          'Title3': '7',
        },
        {
          'Title1': '11',
          'Title2': '12',
          'Title3': '13',
        }
      ]
    */

      // データを書き換える
      jsonData[0].Title3 = "a";
      jsonData[1].Title3 = "b";
      jsonData[2].Title3 = "c";

      workbook.update("Sheet1", jsonData); // 更新

      return workbook.commit(); // ファイルに書き込み
    })
    .catch((error) => {
      throw error;
    });
};

const getWorkbook = async (url) => {
  const res = await axios.get(url, { responseType: "arraybuffer" });
  const workbook = await XlsxPopulate.fromDataAsync(res.data);
  return workbook;
};
const writeCell = (worksheet, postion, val) => {
  worksheet.cell(postion).value(val);
};
const download = async (workbook, fileName) => {
  const wbout = await workbook.outputAsync();
  const blob = new Blob([wbout], { type: "application/octet-stream" });
  saveAs(blob, fileName);
};
const getBlankWorkbook = () => {
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
};
const copyRanges = (sourceRange, destRange) => {
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
};
/**
 * return
 * @param {*} datas テーブルデータ
 */
const getTemplateWorkbook = (datas) => {
  getWorkbook("/resources/テンプレート.xlsx")
    .then((wb) => {
      // シート名の一覧を取得
      // console.log("Sheet Name", wb.sheets);
      let copy = wb.sheet("Sheet1").usedRange();
      console.log(copy.width, copy.height);

      // resultというSheetを作成
      // resultシートが既にある場合エラーとなるので、存在した場合は削除し、新しく作成する
      const newSheetName = "result";
      if (wb.sheet(newSheetName)) {
        wb.deleteSheet(newSheetName);
        wb.addSheet(newSheetName);
      } else {
        wb.addSheet(newSheetName);
      }
      // const newSheet = wb.sheet(newSheetName);
      const newSheet = wb.sheet("Sheet1");
      //テンプレートへの書き込み
      // let count = 0;
      // for (let i in datas) {
      //   // this.writeCell(newSheet, "A" + (count * 24 + 1), style);
      //   let rangeStr = "A" + (count * 24 + 1) + ":C" + (count * 24 + 24);
      //   let destRange = newSheet.range(rangeStr);
      //   copyRanges(copy, destRange);
      //   writeCell(newSheet, "A" + (count * 24 + 2), datas[i]);
      //   count += 1;
      // }
      // const assigns = {
      //   __date__: "令和4年1月14日",
      //   __name__: "播磨太郎", // エクセル内の__name__という文字列を置換
      //   __address__: "加古郡播磨町東本荘1丁目5番30番",
      //   __doc_number__: 5,
      //   __doc_date__: "令和  年  月  日",
      //   __city_date__: "令和  年  月  日",
      //   __place__: "加古郡播磨町大中1丁目1番2号",
      //   __area__: "約500㎡",
      //   __owner_name__: "播磨太郎",
      //   __owner_address__: "加古郡播磨町東本荘1丁目5番30番",
      //   __iseki_name__: "大中遺跡",
      //   __work_content__: "木造2階建個人住宅",
      //   __worker_name__: "播磨太郎",
      //   __worker_address__: "加古郡播磨町東本荘1丁目5番30番",
      //   __producter_name__: "未定",
      //   __producter_address__: "",
      //   __start__: "令和4年7月1日（予定）",
      //   __end__: "令和4年12月末",
      //   __option__: "",
      // };
      // console.log(assigns);
      for (const i in datas) {
        const d = datas[i];
        newSheet._rows.forEach((row) => {
          row._cells.forEach((cell) => {
            const key = cell.value();
            // if (assigns[key]) cell.value(assigns[key]);
            if (d[key]) cell.value(d[key]);
          });
        });
      }

      let filename = "download.xlsx";

      download(wb, filename);
    })
    .catch((error) => {
      console.log("error", error);
      // throw error;
    });
};

export default {
  getWorkbook,
  writeCell,
  download,
  getBlankWorkbook,
  getTemplateWorkbook,
  copyRanges,
  getWorkbookWrpper,
};
