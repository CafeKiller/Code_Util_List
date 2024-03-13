// ---------------------\\
// ʱ����صĹ��߼���	\\
// Author: CoffeeKiller	\\
// Date: 2023_10_17		\\
// ---------------------\\


/**
 * @descr ��ȡ������ʱ��
 * @return {Date} d
 */
function getSeverDateTime() {
  let xhr = window.ActiveXObject ? new ActiveXObject('Microsoft.XMLHTTP') : new XMLHttpRequest();
  xhr.open('HEAD', window.location.href, false);
  xhr.send();
  let d = new Date(xhr.getResponseHeader('Date'));
  let nowyear = d.getFullYear();
  let locationDate = new Date().getFullYear();
  if (nowyear < locationDate) {
    d = new Date();
  }
  return d;
}

/**
 * @descr �ַ���תDate
 * @param {String} responseDate
 * @return {Date}
 */
function convertFromStringToDate(responseDate) {
  if (responseDate.indexOf('T') !== -1 
		&& responseDate.indexOf('-') !== -1 
		&& responseDate.indexOf(':') !== -1) {

    let dateComponents = responseDate.split('T'),
      datePieces = dateComponents[0].split('-'),
      timePieces = dateComponents[1].split(':');
    return new Date(datePieces[0], datePieces[1] - 1, datePieces[2], timePieces[0], timePieces[1]);
  }
}

/**
 * @descr �Ƿ�Ϊ����date
 * @param {Date} date
 * @return {boolean}
 */
function isValidDate(date) {
  return date instanceof Date && !isNaN(date.getTime());
}


/**
 * @description ʱ��ԱȺ���������ʱ�䣬��ѯʱ���Ƿ��ѹ�
 * @param {string} start ��ʼʱ��
 * @param {string | Data} serverTime [��ѡ]������ʱ��
 * @returns {boolean}
*/
function timeContrast(startTime, serverTime="") {
  // ���ݴ���: ����iOS���ʹ���ʱ���ʽ��ͬ
  startTime = serverTime.replace(/\-/g, "/");
  let curren = serverTime ? new Date(serverTime).getTime() : new Date().getTime(),
    start = new Date(startTime).getTime();
  return curren >= start;
}
