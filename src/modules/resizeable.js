//テーブル幅設定
// このページのテーブルというテーブル全てリサイズ可にする
const getResizableTable = () => {
  var tables = document.getElementsByTagName("table");
  for (var i = 0; i < tables.length; i++) {
    this.resizableGrid(tables[i]);
  }
};

// テーブルごとにリサイズ用の設定を追加
const resizableGrid = (table) => {
  var row = table.getElementsByTagName("tr")[0],
    cols = row ? row.children : undefined;
  if (!cols) return;

  table.style.overflow = "hidden";

  var tableHeight = table.offsetHeight;

  // テーブルのカラムとカラムの間にドラッグできるdivを挿入
  for (var i = 0; i < cols.length; i++) {
    var div = createDiv(tableHeight);
    cols[i].appendChild(div);
    cols[i].style.position = "relative";
    setListeners(div);
  }

  // 挿入したdivとdocument全体にイベントリスナーを付与
  function setListeners(div) {
    var pageX, curCol, nxtCol, curColWidth, nxtColWidth;

    /* <div> */
    // マウス押下時
    div.addEventListener("mousedown", (e) => {
      curCol = e.target.parentElement;
      nxtCol = curCol.nextElementSibling;
      pageX = e.pageX;

      var padding = paddingDiff(curCol);

      curColWidth = curCol.offsetWidth - padding;
      if (nxtCol) nxtColWidth = nxtCol.offsetWidth - padding;
    });

    // マウスホバー時
    div.addEventListener("mouseover", (e) => {
      e.target.style.borderRight = "2px solid #0000ff";
    });

    // マウスホバー解除時
    div.addEventListener("mouseout", (e) => {
      e.target.style.borderRight = "";
    });

    /* document */
    // マウスカーソル移動時
    document.addEventListener("mousemove", (e) => {
      if (curCol) {
        var diffX = e.pageX - pageX;

        if (nxtCol) nxtCol.style.width = nxtColWidth - diffX + "px";

        curCol.style.width = curColWidth + diffX + "px";
      }
    });

    // バブリング抑止
    div.addEventListener("click", function (e) {
      e.stopPropagation();
    });

    // マウス押下解除時
    document.addEventListener("mouseup", (e) => {
      console.log(e);
      curCol = undefined;
      nxtCol = undefined;
      pageX = undefined;
      nxtColWidth = undefined;
      curColWidth = undefined;
    });
  }

  // リサイズ用divの実体を作成
  function createDiv(height) {
    var div = document.createElement("div");
    div.style.top = 0;
    div.style.right = 0;
    div.style.width = "5px";
    div.style.position = "absolute";
    div.style.cursor = "col-resize";
    div.style.userSelect = "none";
    div.style.height = height + "px";
    return div;
  }

  // この辺はよくわからん
  function paddingDiff(col) {
    if (getStyleVal(col, "box-sizing") == "border-box") {
      return 0;
    }

    var padLeft = getStyleVal(col, "padding-left");
    var padRight = getStyleVal(col, "padding-right");
    return parseInt(padLeft) + parseInt(padRight);
  }

  function getStyleVal(elm, css) {
    return window.getComputedStyle(elm, null).getPropertyValue(css);
  }
};

export default {
  getResizableTable,
  resizableGrid,
};
