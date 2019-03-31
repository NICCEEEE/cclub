let date = '2019-12-30'
let reg = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/
console.log(date.match(reg).groups)
let {year, month, day} = date.match(reg).groups
console.log(year, month, day)