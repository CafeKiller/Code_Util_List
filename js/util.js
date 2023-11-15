// ---------------------\\
// JavaScript���߼���	\\
// Author: CoffeeKiller	\\
// Date: 2023_10_28		\\
// ---------------------\\


/**
  * @description: ��������
  * @param: {Function} fn: �ص�����
  * @param: {number} delay: ��ʱ
  * @param: {boolean} immediate: �Ƿ���������
  */
function debounce(fn, delay, immediate = false) {
    let timer = null
    let isInvoke = false

    const _debounce = function(...args) {
        return new Promise((resolve, reject) => {
            if (timer) clearTimeout(timer)

            if (immediate && !isInvoke) {
                const result = fn.apply(this, args)
                resolve(result)
                isInvoke = true
            } else {
                timer = setTimeout(() => {
                const result = fn.apply(this, args)
                resolve(result)
                isInvoke = false
                timer = null
                }, delay)
            }
        })
    }

    _debounce.cancel = function() {
        if (timer) clearTimeout(timer)
        timer = null
        isInvoke = false
    }

    return _debounce
}

/**
  * @description: ��������
  * @param: {Function} fn: �ص�����
  * @param: {number} interval: ʱ����
  * @param: {object} options: ��ѡ���� { leading�״δ���, trailing��󴥷� }
  */
function throttle(fn, interval, options = { leading: true, trailing: false }) {
    const { leading, trailing, resultCallback } = options
    let lastTime = 0
    let timer = null
  
    const _throttle = function(...args) {
      return new Promise((resolve, reject) => {
        const nowTime = new Date().getTime()
        if (!lastTime && !leading) lastTime = nowTime
  
        const remainTime = interval - (nowTime - lastTime)
        if (remainTime <= 0) {
          if (timer) {
            clearTimeout(timer)
            timer = null
          }
  
          const result = fn.apply(this, args)
          resolve(result)
          lastTime = nowTime
          return
        }
  
        if (trailing && !timer) {
          timer = setTimeout(() => {
            timer = null
            lastTime = !leading ? 0: new Date().getTime()
            const result = fn.apply(this, args)
            resolve(result)
          }, remainTime)
        }
      })
    }
  
    _throttle.cancel = function() {
      if(timer) clearTimeout(timer)
      timer = null
      lastTime = 0
    }
    return _throttle
}
  
/**
  * @description: ��ȡURL����
  * @param: {string} name: ��������
  */
function getQueryString(name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  var reg_rewrite = new RegExp('(^|/)' + name + '/([^/]*)(/|$)', 'i')
  var r = window.location.search.substr(1).match(reg)
  var q = window.location.pathname.substr(1).match(reg_rewrite)
  if (r != null) {
    return unescape(r[2])
  } else if (q != null) {
    return unescape(q[2])
  } else {
    return ''
  }
}

/**
  * @description: �޸�URL����
  * @param: {URL} url: URL����
  * @param: {string} arg: ��Ҫ�޸ĵĲ�����
  * @param: {Object} arg_val: ��������
  */
function changeURLArg(url, arg, arg_val) {
  var pattern = arg + '=([^&]*)';
  var replaceText = arg + '=' + arg_val;
  if (url.match(pattern)) {
    var tmp = '/(' + arg + '=)([^&]*)/gi';
    tmp = url.replace(eval(tmp), replaceText);
    return tmp;
  } else {
    if (url.match('[\?]')) {
      return url + '&' + replaceText;
    } else {
      return url + '?' + replaceText;
    }
  }
}