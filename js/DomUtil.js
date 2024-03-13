/**
 * ����һ����Ƶ���Ź������
 * @param {string} [BGDomID='audioBg'] ���ڲ��ű������ֵ� audio ��ǩID
 * @param {string} [BGBtn=".music-btn"] ���ڿ��������Ƿ񲥷ŵ� class ��ǩ
 * */ 
function createBGMusic(BGDomID = 'audioBg', BGBtn = ".music-btn" ) {
    // �Զ�����
    var isAudioInit = false;
    var bgAudio = document.getElementById(BGDomID);
  
    var _play = function () {
        if (!isAudioInit) {
            bgAudio.play();
            isAudioInit = true;
        };
        document.removeEventListener('click', _play, false);
    }
  
    document.addEventListener('click', _play, false);
  
    var ready = function () {
        WeixinJSBridge.on('onPageStateChange', function (res) {
            if (res.active == 'false') {
                bgAudio.pause();
            } else {
                if (isBgAudioPlaying) {
                    toggleBgAudio(true);
                }
            }
        })
        _play();
    }
    // ����΢�����
    if (!window.WeixinJSBridge || !WeixinJSBridge.invoke) {
        document.addEventListener('WeixinJSBridgeReady', ready, false)
    } else {
        ready()
    }
  
    // ����ҳ���Ƿ�����̨
    document.addEventListener("visibilitychange", function () {
        if (document.hidden) {
            bgAudio.pause();
        } else {
            if (isBgAudioPlaying) toggleBgAudio(true);
        }
    });
  
    // ���ֿ���
    var _musicBTN = document.querySelector(BGBtn)
    var isBgAudioPlaying = true
    function toggleBgAudio(isplay) {
        if (isplay) {
            bgAudio.play()
            _musicBTN && (_musicBTN.classList.remove('off'))
        } else {
            bgAudio.pause()
            _musicBTN && (_musicBTN.classList.add('off'))
        }
        isBgAudioPlaying = isplay
    }
    if (_musicBTN) {
        _musicBTN.addEventListener('click', function () {
            toggleBgAudio(!isBgAudioPlaying)
        })
    }
  
    // ��Ч
    var isPlaying = false
    function playSoundEffect(id, force = true, fn) {
        if (isBgAudioPlaying) {
            if (force || !isPlaying) {
                var snd = document.createElement('audio')
                snd.src = id
                snd.onended = function() {
                    isPlaying = false
                    fn && fn()
                };
                snd.play()
                isPlaying = true
            }
        }
    }
  
    return {
        muted: () => !isBgAudioPlaying,
        playSoundEffect,
    }
}



/**
 * @description �ж�Ԫ����û����Ԫ�� 
 * @param {HTMLElement} e 
 * @returns true���� | false������
*/
function hasChildren(e){
    let children = e.childNodes,
        len = children.length;

    for (let i = 0; i < len; i++) {
        if (children[i].nodeType === 1) {
          return true;
        }
    }
    return false;
}



/**
 * @description ʵ��ҳ��Ԫ�ص��ٲ���, ��ǰֻ����px��λ
*/
class Waterfall {
    constructor(options) {
        this.$el = null;             // ������
        this.count = 4;              // ����
        this.gap = 10;               // ���
        Object.assign(this, options);
        this.width = 0;              // �еĿ��
        this.items = [];             // ��Ԫ�ؼ���
        this.H = [];                 // �洢ÿ�еĸ߶ȷ������
        this.flag = null;            // ����ڵ㼯��
        this.init();
    }
    init() {
        this.items = Array.from(this.$el.children);
        this.reset();
        this.render();
    }
    reset() {
        this.flag = document.createDocumentFragment();
        this.width = this.$el.clientWidth / this.count;
        this.H = new Array(this.count).fill(0);
        this.$el.innerHTML = "";
    }

    render() {
        const { width, items,flag,H,gap } = this;
        items.forEach(item => {
            item.style.width = width + "px";
            item.style.position = "absolute";
            let img = item.querySelector("img");
            if(img.complete){
                let tag = H.indexOf(Math.min(...H)); 
                item.style.left = tag * (width + gap) + "px";
                item.style.top = H[tag] + "px";                  
                H[tag] += img.height*width/ img.width + gap;
                flag.appendChild(item);
            }
            else{
                img.addEventListener("load", () => {
                    let tag = H.indexOf(Math.min(...H)); 
                    item.style.left = tag * (width + gap) + "px";
                    item.style.top = H[tag] + "px";                  
                    H[tag] += img.height*width/ img.width + gap;
                    flag.appendChild(item);
                    this.$el.append(flag);
                })
            }
        })
        this.$el.append(flag);
    }
}

// ʹ��ʾ��
window.onload = new Waterfall({
    $el: document.querySelector(".wrapper"),
    count: 4,
    gap: 10
})


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
            if (!win.addEventListener) { return }
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
                adaptVP({ uWidth: 750 })
            }
            win.addEventListener("resize", setFont, false);
            setFont()
        } else {
            if (mode == "rem") {
                var docEl = doc.documentElement,
                    resizeEvt = "orientationchange" in window ? "orientationchange" : "resize",
                    recalc = function () {
                        var clientWidth = docEl.clientWidth;
                        if (!clientWidth) { return }
                        docEl.style.fontSize = 100 * (clientWidth / std) + "px"
                    };
                if (!doc.addEventListener) { return }
                recalc();
                win.addEventListener(resizeEvt, recalc, false);
                doc.addEventListener("DOMContentLoaded", recalc, false)
            }
        }
    }
  })(window, document, "px");