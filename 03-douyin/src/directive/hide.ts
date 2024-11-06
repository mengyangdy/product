const Hide = {
  // 在元素被插入到 DOM 前调用
  beforeMount(el, binding) {
    if (binding.value) {
      el.style.opacity = 0
    } else {
      el.style.opacity = 1
    }
  },
  // 在绑定元素的父组件
  // 及他自己的所有子节点都更新后调用
  updated(el, binding) {
    if (binding.value) {
      el.style.opacity = 0
    } else {
      el.style.opacity = 1
    }
  }
}

export default Hide
