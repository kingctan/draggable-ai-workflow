type FormatDateKey = 'yyyy' | 'yy' | 'M' | 'MM' | 'd' | 'dd' | 'H' | 'HH' | 'h' | 'hh' | 'm' | 'mm' | 's' | 'ss' | 'w';

type FormatDateMap = {
  [key in FormatDateKey]: string | number;
}

/**
 * @param {t} Date, e.g., new Date(timestamp * 1000)
 * @param {str} string, e.g, 'M/d/yyyy, HH:mm'
 */
export const formatDate = (t: Date, str: string) => {
  const obj: FormatDateMap & any = {
    yyyy: t.getFullYear(),
    yy: (`${t.getFullYear()}`).slice(-2),

    M: t.getMonth() + 1,
    MM: (`0${t.getMonth() + 1}`).slice(-2),

    d: t.getDate(),
    dd: (`0${t.getDate()}`).slice(-2),

    H: t.getHours(),
    HH: (`0${t.getHours()}`).slice(-2),

    h: t.getHours() % 12,
    hh: (`0${t.getHours()}`).slice(-2),

    m: t.getMinutes(),
    mm: (`0${t.getMinutes()}`).slice(-2),

    s: t.getSeconds(),
    ss: (`0${t.getSeconds()}`).slice(-2),

    w: ['日', '一', '二', '三', '四', '五', '六'][t.getDay()],
  };

  return str.replace(/([a-z]+)/ig, ($1) => { return obj[$1]; });
};

// format file size
export const formatFileSize = (fileSizeInBytes: number) => {
  let i = -1;
  const byteUnits = [' KB', ' MB', ' GB', ' TB', 'PB', 'EB', 'ZB', 'YB'];
  do {
    fileSizeInBytes /= 1024;
    i += 1;
  } while (fileSizeInBytes > 1024);
  return Math.max(fileSizeInBytes, 0.1).toFixed(1) + byteUnits[i];
};

// format duration
export const formatDuration = (duration: number) => {
  let result = '';
  duration /= 1000;
  const elapsedDay = Math.floor(duration / (24 * 60 * 60));
  if (elapsedDay > 0) {
    result += `${elapsedDay}d `;
  }
  const elapsedHour = Math.floor((duration % (24 * 60 * 60)) / (60 * 60));
  if (result !== '' || (result === '' && elapsedHour > 0)) {
    result += `${elapsedHour}h `;
  }
  const elapsedMinute = Math.floor((duration % (60 * 60)) / 60);
  if (result !== '' || (result === '' && elapsedMinute > 0)) {
    result += `${elapsedMinute}m `;
  }
  const elapsedSecond = Math.floor(duration % 60);
  result += `${elapsedSecond}s`;
  return result;
};

export default {};