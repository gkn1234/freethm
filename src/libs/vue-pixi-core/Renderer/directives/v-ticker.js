/*
 * @Descripttion: 
 * @version: 
 * @Author: Guo Kainan
 * @Date: 2021-02-09 10:45:08
 * @LastEditors: Guo Kainan
 * @LastEditTime: 2021-03-09 16:24:09
 */
export default function vTicker (game) {
  let ticker = game.$app.ticker
  // 缓存每一个节点的触发器
  let cache = new WeakMap()

  return {
    mounted (el, binding) {
      console.log('ticker-mounted', el, binding, ticker)

      const handlerObj = cache.get(el)
      // 避免对同一个对象多次重复绑定
      if (!handlerObj) {
        const handler = (time) => {
          if (typeof binding.value === 'function') {
            binding.value(time, { 
              el, ticker, 
              stop: removeHandler 
            })
          }
          else {
            console.error('The ticker handler must be a function!')
          }
        }

        function removeHandler () {
          ticker.remove(handler)
          cache.delete(el)
        }

        cache.set(el, { handler, removeHandler })
        ticker.add(handler)
      }
    },
    beforeUnmount (el, binding) {
      console.log('ticker-beforeUnmount', el, binding, ticker)

      const handlerObj = cache.get(el)
      if (handlerObj) {
        handlerObj.removeHandler()
      }
    }
  }
}