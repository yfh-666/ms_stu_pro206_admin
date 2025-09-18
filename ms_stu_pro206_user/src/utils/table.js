import Cookies from 'js-cookie'
const TableIdKey = 'Customer-TableId'
const TableNumberKey = 'Customer-TableNumber'
// 编号
export function getTableId() {
  return Cookies.get(TableIdKey)
}

export function setTableId(TableId) {
  if(TableId!==undefined){
    return Cookies.set(TableIdKey, TableId, { expires: 1 })
  }
}
export function removeTableId() {
  return Cookies.remove(TableIdKey)
}
// 桌号
export function getTableNumber() {
  return Cookies.get(TableNumberKey)
}

export function setTableNumber(TableNumber) {
  if(TableNumber!==undefined){
  return Cookies.set(TableNumberKey, TableNumber, { expires: 1 })
  }
}

export function removeTableNumber() {
  return Cookies.remove(TableNumberKey)
}
