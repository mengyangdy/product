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
