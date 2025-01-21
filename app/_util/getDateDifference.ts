export const getDateDifference = (createdDate: Date) => {
  let res = "";
  let curDate = new Date();
  let dateDiff = Math.abs((curDate.getTime() - createdDate.getTime()) / 1000);
  if (dateDiff < 60) {
    res = Math.floor(dateDiff) + ` second${dateDiff > 1 ? "s" : ""} ago`;
  } else if (dateDiff < 3600) {
    let flooredDateDiff = Math.floor(dateDiff / 60);
    res = flooredDateDiff + ` minute${flooredDateDiff > 1 ? "s" : ""} ago`;
  } else if (dateDiff < 86400) {
    let flooredDateDiff = Math.floor(dateDiff / 3600);
    res = flooredDateDiff + ` hour${flooredDateDiff > 1 ? "s" : ""} ago`;
  } else if (dateDiff < 2620800) {
    let flooredDateDiff = Math.floor(dateDiff / 86400);
    res = flooredDateDiff + ` day${dateDiff > 1 ? "s" : ""} ago`;
  } else if (dateDiff < 31449600) {
    let flooredDateDiff = Math.floor(dateDiff / 2620800);
    res = flooredDateDiff + ` month${flooredDateDiff > 1 ? "s" : ""} ago`;
  } else {
    let flooredDateDiff = Math.floor(dateDiff / 31449600);
    res = flooredDateDiff + ` year${flooredDateDiff > 1 ? "s" : ""} ago`;
  }

  return res;
};
