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

/**
  * @description: �ƶ���ҳ������ ��λת�� ,֧��px��rem
  * @param: {win} Window
  * @param: {doc} Document
  * @param: {mode} string: ��λģʽ, �ṩpx��rem��ѡ
  */
(function (win, doc, mode) {
  var std = 750;
  if (/(iPhone|iPad|iPod|iOS|Android|Windows Phone|BlackBerry|SymbianOS)/i.test(navigator.userAgent)) {
	var h = document.getElementsByTagName("head")[0];
	h.insertAdjacentHTML("beforeEnd", '<meta name="apple-mobile-web-app-capable" content="yes">');
	h.insertAdjacentHTML("beforeEnd", '<meta name="apple-mobile-web-app-status-bar-style" content="black">');
	h.insertAdjacentHTML("beforeEnd", '<meta name="format-detection" content="telephone=no">');
	h.insertAdjacentHTML("beforeEnd",
	  '<meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no,minimal-ui" />'
	  );
	if (mode == "px") {
	  if (!win.addEventListener) {
		return
	  }
	  var html = document.documentElement;

	  function setFont() {
		function adaptVP(a) {
		  function c() {
			var c, d;
			return b.uWidth = a.uWidth ? a.uWidth : 750, b.dWidth = a.dWidth ? a.dWidth : window.screen.width ||
			  window.screen.availWidth, b.ratio = window.devicePixelRatio ? window.devicePixelRatio : 1, b
			  .userAgent = navigator.userAgent, b.bConsole = a.bConsole ? a.bConsole : !1, a.mode ? (b.mode = a
				.mode, void 0) : (c = b.userAgent.match(/Android/i), c && (b.mode = "android-2.2", d = b.userAgent
				.match(/Android\s(\d+.\d+)/i), d && (d = parseFloat(d[1])), 2.2 == d || 2.3 == d ? b.mode =
				"android-2.2" : 4.4 > d ? b.mode = "android-dpi" : d >= 4.4 && (b.mode = b.dWidth > b.uWidth ?
				  "android-dpi" : "android-scale")), void 0)
		  }

		  function d() {
			var e, f, g, h, c = "",
			  d = !1;
			switch (b.mode) {
			  case "apple":
				f = (window.screen.availWidth * b.ratio / b.uWidth) / b.ratio;
				c = "width=" + b.uWidth + ",initial-scale=" + f + ",minimum-scale=" + f + ",maximum-scale=" + f +
				  ",user-scalable=no";
				break;
			  case "android-2.2":
				a.dWidth || (b.dWidth = 2 == b.ratio ? 720 : 1.5 == b.ratio ? 480 : 1 == b.ratio ? 375 : 0.75 == b
					.ratio ? 240 : 480), e = window.screen.width || window.screen.availWidth, 375 == e ? b
				  .dWidth = b.ratio * e : 750 > e && (b.dWidth = e), b.mode = "android-dpi", d = !0;
			  case "android-dpi":
				f = 160 * b.uWidth / b.dWidth * b.ratio, c = "target-densitydpi=" + f + ", width=" + b.uWidth +
				  ", user-scalable=no", d && (b.mode = "android-2.2");
				break;
			  case "android-scale":
				c = "width=" + b.uWidth + ", user-scalable=no"
			}
			g = document.querySelector("meta[name='viewport']") || document.createElement("meta"), g.name =
			  "viewport", g.content = c, h = document.getElementsByTagName("head"), h.length > 0 && h[0]
			  .appendChild(g)
		  }

		  function e() {
			var a = "";
			for (key in b) {
			  a += key + ": " + b[key] + "; "
			}
			alert(a)
		  }
		  if (a) {
			var b = {
			  uWidth: 0,
			  dWidth: 0,
			  ratio: 1,
			  mode: "apple",
			  userAgent: null,
			  bConsole: !1
			};
			c(), d(), b.bConsole && e()
		  }
		}
		adaptVP({
		  uWidth: 750
		})
	  }
	  win.addEventListener("resize", setFont, false);
	  setFont()
	} else {
	  if (mode == "rem") {
		var docEl = doc.documentElement,
		  resizeEvt = "orientationchange" in window ? "orientationchange" : "resize",
		  recalc = function () {
			var clientWidth = docEl.clientWidth;
			if (!clientWidth) {
			  return
			}
			docEl.style.fontSize = 100 * (clientWidth / std) + "px"
		  };
		if (!doc.addEventListener) {
		  return
		}
		recalc();
		win.addEventListener(resizeEvt, recalc, false);
		doc.addEventListener("DOMContentLoaded", recalc, false)
	  }
	}
  }
})(window, document, "px");