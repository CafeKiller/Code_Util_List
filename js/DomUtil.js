/**
 * ����һ����Ƶ���Ź������
 * @param {string} BGDomID ��ѡ��, ���ڲ��ű������ֵ� audio ��ǩID, Ĭ��audioBg
 * @param {string} BGBtn ��ѡ��, ���ڿ��������Ƿ񲥷ŵ� class ��ǩ, Ĭ��.music-btn
 * @returns ����/��Ч���ƶ���
 * */ 
function createBGMusic(BGDomID = 'audioBg', BGBtn = ".music-btn" ) {
    // �Զ�����
    let isAudioInit = false;
    let bgAudio = document.getElementById(BGDomID);
    if (bgAudio) {
        const _play = function () {
            if (!isAudioInit) {
                bgAudio.play();
                isAudioInit = true;
            };
            document.removeEventListener('click', _play, false);
        }
        document.addEventListener('click', _play, false);
        const ready = function () {
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
            document.addEventListener('WeixinJSBridgeReady', ready, false);
        } else {
            ready();
        }
    }

    let _musicBTN = document.querySelector(BGBtn);
    let isBgAudioPlaying = true;
    if (_musicBTN) {
        // ����ҳ���Ƿ�����̨
        document.addEventListener("visibilitychange", function () {
            if (document.hidden) {
                bgAudio.pause();
            } else {
                if (isBgAudioPlaying) toggleBgAudio(true);
            }
        });
        // ���ֿ���
        function toggleBgAudio(isplay) {
            if (isplay) {
                bgAudio.play();
                _musicBTN && (_musicBTN.classList.remove('off'));
            } else {
                bgAudio.pause();
                _musicBTN && (_musicBTN.classList.add('off'));
            }
            isBgAudioPlaying = isplay;
        }
        _musicBTN.addEventListener('click', function () {
            toggleBgAudio(!isBgAudioPlaying);
        });
    }

    // ��Ч
    let isPlaying = false;
    const playSoundEffect = function(id, force = true, fn) {
        if (isBgAudioPlaying) {
            if (force || !isPlaying) {
                let snd = document.createElement('audio');
                snd.src = id;
                snd.onended = function() {
                    isPlaying = false;
                    fn && fn();
                };
                snd.play();
                isPlaying = true;
            }
        }
    }

    return {
        muted: () => isBgAudioPlaying = !isBgAudioPlaying,
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



/**
 * ��Ļ����Ӧ���䴦��; ע��! �ǿ��伴��, ��Ҫ����ʵ��������е���;
 * ����֧�� zoom ���Ե��������: chrome ����ֱ��ʹ�� zoom ���д���
 * ���ڲ�֧�� zoom ���Ե��������: firefox ����ʹ�� scale ����
 * */ 
var adaptViewport = (function () {
    function detectIE() {
        var ua = window.navigator.userAgent;
        var msie = ua.match(/MSIE (\d+)/g);
        if (msie != null) {
        return parseInt(msie[0].match(/\d+/g)[0]);
        }
        // IE 11
        var trident = ua.indexOf("Trident/");
        if (trident > 0) {
        var rv = ua.indexOf("rv:");
        return parseInt(ua.substring(rv + 3, ua.indexOf(".", rv)),
        10);
        }
        return false;
    }

    var minWidth = 800;         // ��С���
    var designWidth = 1920;     // ��Ƹ���
    var isFirefox = navigator.userAgent.indexOf("Firefox") != -1;
    var ieVersion = detectIE(); // IE �汾
    var zoom = 1;               // ���ű���

    // ��Ļ�ߴ�仯ʱ������
    function resize() {
        // doc.clientWidth���������������
        var ww = document.documentElement.clientWidth || window.innerWidth;
        var realWid = Math.max(ww, minWidth);   // ��ǰʵ��ҳ����
        zoom = realWid / designWidth;           // ��ǰʵ�����ű���
        if (ieVersion && ieVersion < 9) return;

        // firefox��֧��zoom. ie9, 10, 11 zoom���Բ�֧��/����©��
        if (isFirefox || ieVersion >= 9) {
            if (zoom !== 1) {
                const transformOrigin = "0% 0%";
                // TODO [1]�˴����ò�֧�� zoom ���Ե���ʽ����, ����ʹ�� scale ����
            }
        } else {
            // TODO [2]�˴�����֧�� zoom ���Ե���ʽ����
        }
        // TODO [3]�˴��ɷ���һЩͨ�õ���ʽ����
    }
    resize();
    window.onresize = resize;
})();