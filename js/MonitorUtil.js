/**
 * @description һ�����׵�ԭ�����ܼ���������, �������ܼ���������ϱ�
 * */ 
function createMonitor() {
    const monitor = {
        url: '', // �����ϴ���ַ
        performance: {}, // ������Ϣ
        resources: {}, // ��Դ��Ϣ
        errors: [], // ������Ϣ
        user: { // �û���Ϣ
            screen: screen.width, // ��Ļ���
            height: screen.height, // ��Ļ�߶�
            platform: navigator.platform, // �����ƽ̨
            userAgent: navigator.userAgent, // ��������û�������Ϣ
            language: navigator.language, // ������û����������
        },
        // �ֶ���Ӵ���
        addError(error) {
            const obj = {}
            const { type, msg, url, row, col } = error
            if (type) obj.type = type
            if (msg) obj.msg = msg
            if (url) obj.url = url
            if (row) obj.row = row
            if (col) obj.col = col
            obj.time = new Date().getTime()
            monitor.errors.push(obj)
        },
        // ���� monitor ����
        reset() {
            window.performance && window.performance.clearResourceTimings()
            monitor.performance = getPerformance()
            monitor.resources = getResources()
            monitor.errors = []
        },
        // ��� error ��Ϣ
        clearError() {
            monitor.errors = []
        },
        // �ϴ��������
        upload() {
            // TODO: �Զ����ϴ�
            /*
                axios.post({
                    url: monitor.url,
                    data: {
                        performance,
                        resources,
                        errors,
                        user,
                    }
                })
            */
        },
        // ���������ϴ���ַ
        setURL(url) {
            monitor.url = url
        },
    }

    // ��ȡ������Ϣ
    const getPerformance = () => {
        if (!window.performance) return
        const timing = window.performance.timing
        const performance = {
            // �ض����ʱ
            redirect: timing.redirectEnd - timing.redirectStart,
            // ����ʱ��
            whiteScreen: whiteScreen,
            // DOM ��Ⱦ��ʱ
            dom: timing.domComplete - timing.domLoading,
            // ҳ����غ�ʱ
            load: timing.loadEventEnd - timing.navigationStart,
            // ҳ��ж�غ�ʱ
            unload: timing.unloadEventEnd - timing.unloadEventStart,
            // �����ʱ
            request: timing.responseEnd - timing.requestStart,
            // ��ȡ������Ϣʱ��ǰʱ��
            time: new Date().getTime(),
        }

        return performance
    }

    // ��ȡ��Դ��Ϣ
    const getResources = () => {
        if (!window.performance) return
        const data = window.performance.getEntriesByType('resource')
        const resource = {
            xmlhttprequest: [],
            css: [],
            other: [],
            script: [],
            img: [],
            link: [],
            fetch: [],
            // ��ȡ��Դ��Ϣʱ��ǰʱ��
            time: new Date().getTime(),
        }

        data.forEach(item => {
            const arry = resource[item.initiatorType]
            arry && arry.push({
                // ��Դ������
                name: item.name,
                // ��Դ���غ�ʱ
                duration: item.duration.toFixed(2),
                // ��Դ��С
                size: item.transferSize,
                // ��Դ����Э��
                protocol: item.nextHopProtocol,
            })
        })

        return resource
    }

    window.onload = () => {
        // �����������ʱ���ȡ���ܼ���Դ��Ϣ https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestIdleCallback
        if (window.requestIdleCallback) {
            window.requestIdleCallback(() => {
                monitor.performance = getPerformance()
                monitor.resources = getResources()

                console.log('ҳ��������Ϣ',monitor.performance)
                console.log('ҳ����Դ��Ϣ', monitor.resources)
            })
        } else {
            setTimeout(() => {
                monitor.performance = getPerformance()
                monitor.resources = getResources()

                console.log('ҳ��������Ϣ',monitor.performance)
                console.log('ҳ����Դ��Ϣ', monitor.resources)
            }, 0)
        }
    }

    // ������Դ����ʧ�ܴ��� js css img...
    addEventListener('error', e => {
        const target = e.target
        if (target != window) {
            monitor.errors.push({
                type: target.localName,
                url: target.src || target.href,
                msg: (target.src || target.href) + ' is load error',
                // ��������ʱ��
                time: new Date().getTime(),
            })
            console.error('���еĴ�����Ϣ', monitor.errors)
        }
    }, true)

    // ���� js ����
    window.onerror = function(msg, url, row, col, error) {
        monitor.errors.push({
            type: 'javascript', // ��������
            row: row, // ��������ʱ�Ĵ�������
            col: col, // ��������ʱ�Ĵ�������
            msg: error && error.stack? error.stack : msg, // ������Ϣ
            url: url, // �����ļ�
            time: new Date().getTime(), // ��������ʱ��
        })
        console.error('���еĴ�����Ϣ', monitor.errors)
    }

    // ���� promise ���� ȱ���ǻ�ȡ������������
    addEventListener('unhandledrejection', e => {
        monitor.errors.push({
            type: 'promise',
            msg: (e.reason && e.reason.msg) || e.reason || '',
            // ��������ʱ��
            time: new Date().getTime(),
        })
        console.error('���еĴ�����Ϣ', monitor.errors)
    })

    return monitor
}

const monitor = createMonitor()


// ����:
// һ����δ�����Ի�ȡ��ҳ��İ�������ʱ��, ����ŵ� head ��ǩ֮ǰ
var whiteScreen = new Date() - performance.timing.navigationStart
// ͨ�� domLoading �� navigationStart Ҳ����
var whiteScreen = performance.timing.domLoading - performance.timing.navigationStart



// ͬ����һ�����ܼ����, ��ʹ�õ�API�Ƚ���
const base = {
    log() {},
    logPackage() {},
    getLoadTime() {},
    getTimeoutRes() {},
    bindEvent() {},
    init() {}
}
const pm = (function() {
    // ��ǰ����
    if (!window.performance) return base
    const pMonitor = { ...base }
    let config = {}
    const SEC = 1000
    const TIMEOUT = 10 * SEC
    const setTime = (limit = TIMEOUT) => time => time >= limit
    const getLoadTime = ({ startTime, responseEnd }) => responseEnd - startTime
    const getName = ({ name }) => name
    // ���ɱ�����
    const convert2FormData = (data = {}) =>
        Object.entries(data).reduce((last, [key, value]) => {
            if (Array.isArray(value)) {
                return value.reduce((lastResult, item) => {
                    lastResult.append(`${key}[]`, item)
                    return lastResult
                }, last)
            }
            last.append(key, value)
            return last
        }, new FormData()
    )
    // ƴ�� GET ʱ��url
    const makeItStr = (data = {}) => Object.entries(data).map(([k, v]) => `${k}=${v}`).join('&')
    pMonitor.getLoadTime = () => {
        const [{ domComplete }] = performance.getEntriesByType('navigation')
        return domComplete
    }
    pMonitor.getTimeoutRes = (limit = TIMEOUT) => {
        const isTimeout = setTime(limit)
        const resourceTimes = performance.getEntriesByType('resource')
        return resourceTimes
            .filter(item => isTimeout(getLoadTime(item)))
            .map(getName)
    }
    // �ϱ�����
    pMonitor.log = (url, data = {}, type = 'POST') => {
        const method = type.toLowerCase()
        const urlToUse = method === 'get' ? `${url}?${makeItStr(data)}` : url
        const body = method === 'get' ? {} : { body: convert2FormData(data) }
        const init = {
            method,
            ...body
        }
        fetch(urlToUse, init).catch(e => console.log(e))
    }
    // ��װһ���ϱ�����������ݵķ���
    pMonitor.logPackage = () => {
        const { url, timeoutUrl, method } = config
        const domComplete = pMonitor.getLoadTime()
        const timeoutRes = pMonitor.getTimeoutRes(config.timeout)
        // �ϱ�ҳ�����ʱ��
        pMonitor.log(url, { domComplete }, method)
        if (timeoutRes.length) {
            pMonitor.log(
                timeoutUrl,
                {
                    timeoutRes
                },
                method
            )
        }
    }
    // �¼���
    pMonitor.bindEvent = () => {
      const oldOnload = window.onload
      window.onload = e => {
        if (oldOnload && typeof oldOnload === 'function') {
            oldOnload(e)
        }
        // ������Ӱ��ҳ�����߳�
        if (window.requestIdleCallback) {
            window.requestIdleCallback(pMonitor.logPackage)
        } else {
            setTimeout(pMonitor.logPackage)
        }
      }
    }
  
    /**
     * @param {object} option
     * @param {string} option.url ҳ��������ݵ��ϱ���ַ
     * @param {string} option.timeoutUrl ҳ����Դ��ʱ���ϱ���ַ
     * @param {string=} [option.method='POST'] ����ʽ
     * @param {number=} [option.timeout=10000]
     */
    pMonitor.init = option => {
        const { url, timeoutUrl, method = 'POST', timeout = 10000 } = option
        config = {
            url,
            timeoutUrl,
            method,
            timeout
        }
        // ���¼� ���ڴ����ϱ�����
        pMonitor.bindEvent()
    }
  
    return pMonitor
})()