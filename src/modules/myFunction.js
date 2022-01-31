function formatToDateString(date) {
  const dateRule = /^[0-9]{4}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])$/;
  // 空文字の場合、変換しない
  if (date === "") return;
  // 形式が正しくない場合、変換しない
  if (!dateRule.test(date)) return;
  const str = String(date);
  // 表示用に加工
  const displayDate = `${str.slice(0, 4)}/${str.slice(4, 6)}/${str.slice(
    6,
    8
  )}`;
  // DB保存用に加工
  const outputDate = `${str.slice(0, 4)}-${str.slice(4, 6)}-${str.slice(6, 8)}`;
  return displayDate, outputDate;
}
export default {
  formatToDateString,
};
