import Cookies from 'js-cookie'

const PhoneKey = 'Customer-Phone'

export function getPhone() {
  return Cookies.get(PhoneKey)
}

export function setPhone(Phone) {
  return Cookies.set(PhoneKey, Phone, { expires: 1 })
}

export function removePhone() {
  return Cookies.remove(PhoneKey)
}
