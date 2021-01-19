exports.incDate = function incDate(curDate){
  return curDate.setDate(curDate.getDate() + 1);
}


// let date = new Date('Sat Dec 12 2020 01:02:56 GMT+0530 (India Standard Time)')
// console.log(incDate(date) + '  ' + date + 1607801576000);