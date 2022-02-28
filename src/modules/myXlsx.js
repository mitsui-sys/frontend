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
const getTemplateWorkbook = (filepath, datas, filename) => {
  getWorkbook(filepath)
    .then((wb) => {
      // シート名の一覧を取得
      // console.log("Sheet Name", wb.sheets);
      let copy = wb.sheet("Sheet1").usedRange().value();
      console.log(copy);
      // const list = copy.reduce((pre, current) => {
      //   pre.push(...current);
      //   return pre;
      // }, []);
      // console.log(list);
      // const f = list.filter((x) => x !== undefined);
      // console.log(f);

      // resultというSheetを作成
      // resultシートが既にある場合エラーとなるので、存在した場合は削除し、新しく作成する
      // const newSheetName = "result";
      // if (wb.sheet(newSheetName)) {
      //   wb.deleteSheet(newSheetName);
      //   wb.addSheet(newSheetName);
      // } else {
      //   wb.addSheet(newSheetName);
      // }
      // const newSheet = wb.sheet(newSheetName);
      const newSheet = wb.sheet("Sheet1");
      for (const i in datas) {
        const d = datas[i];
        newSheet._rows.forEach((row) => {
          row._cells.forEach((cell) => {
            const key = cell.value();
            // console.log(key);
            // console.log(d[key]);
            if (d[key] != undefined) cell.value(d[key]);
          });
        });
      }

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
