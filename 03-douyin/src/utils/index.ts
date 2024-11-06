import { IMG_URL } from '@/configs'

export function stopPropagation(e: Event) {
  e.stopImmediatePropagation()
  e.stopPropagation()
  e.preventDefault()
}

export function _notice(val: string) {
  const div = document.createElement('div')
  div.classList.add('global-notice')
  div.textContent = val
  document.body.append(div)
  setTimeout(() => {
    document.body.removeChild(div)
  }, 1000)
}

export function _no() {
  _notice('未实现')
}

/**
 * 包含最大值和最小值
 *
 * @param min
 * @param max
 */
export function random(min, max) {
  const minCeiled = Math.ceil(min)
  const maxFloored = Math.floor(max)
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled)
}

export function checkImgUrl(url) {
  if (!url) return false
  if (
    url.includes('assets/img') ||
    url.includes('file://') ||
    url.includes('data:image') ||
    url.includes('http') ||
    url.includes('https')
  ) {
    return url
  }
  return IMG_URL + url
}

export function duration(v) {
  if (!v) return '00:00'
  const m = Math.floor(v / 60)
  const s = Math.round(v % 60)
  let str: string = ''
  if (m === 0) {
    str = '00'
  } else if (mm > 0 && m < 10) {
    str = `0${m}`
  } else {
    str = `${m}`
  }
  str += ':'
  if (s === 0) {
    str += '00'
  } else if (s > 0 && s < 10) {
    str += `0${s}`
  } else {
    str += s
  }
  return str
}

export function getUserDouyinId(item) {
  return item.author.unique_id || item.author.short_id
}