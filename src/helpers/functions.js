import { addDays } from 'date-fns';
import format from 'date-fns/format';
import ptBR from 'date-fns/locale/pt-BR';

export const contrast = (rgb1, rgb2) => {
  const luminance = (r, g, b) => {
    const a = [r, g, b].map((v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  };
  const lum1 = luminance(rgb1[0], rgb1[1], rgb1[2]);
  const lum2 = luminance(rgb2[0], rgb2[1], rgb2[2]);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
};

export const hexAToRGBA = (h) => {
  if (h) {
    let [r, g, b, a] = h.match(/\w\w/g).map((x) => parseInt(x, 16));
    a = +(a / 255).toFixed(3);

    return { r, g, b, a };
  }
};

export const RGBAToHexA = (r, g, b, a) => {
  r = r.toString(16);
  g = g.toString(16);
  b = b.toString(16);
  a = Math.round(a * 255).toString(16);

  if (r.length == 1) r = '0' + r;
  if (g.length == 1) g = '0' + g;
  if (b.length == 1) b = '0' + b;
  if (a.length == 1) a = '0' + a;

  return '#' + r + g + b + a;
};

export function reverseFormatNumber(val, locale = 'pt-BR') {
  if (!isNaN(val)) return val;

  var group = new Intl.NumberFormat(locale).format(1111).replace(/1/g, '');
  var decimal = new Intl.NumberFormat(locale).format(1.1).replace(/1/g, '');
  // try {
  var reversedVal = val
    .replace(new RegExp('\\' + group, 'g'), '')
    .replace(new RegExp('\\' + decimal, 'g'), '.')
    .replace(/[^0-9.]/g, '');
  // } catch (error) {
  //   console.log(error);
  // }

  return Number.isNaN(reversedVal) ? 0 : Number(reversedVal);
}

export function ISODateFormat(d) {
  d = new Date(d);
  const pad = (n) => (n < 10 ? '0' + n : n);
  //prettier-ignore
  return (new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
    // d.getUTCFullYear()+'-'+pad(d.getUTCMonth()+1)+'-'+pad(d.getUTCDate())+'T'+pad(d.getUTCHours())+':'+pad(d.getUTCMinutes())+':'+pad(d.getUTCSeconds())+'Z'
  );
}

export const getOperatingSystemName = (window) => {
  {
    var unknown = '-';

    // screen
    var screenSize = '';
    if (screen.width) {
      var width = screen.width ? screen.width : '';
      var height = screen.height ? screen.height : '';
      screenSize += '' + width + ' x ' + height;
    }

    // browser
    var nVer = navigator.appVersion;
    var nAgt = navigator.userAgent;
    var browser = navigator.appName;
    var version = '' + parseFloat(navigator.appVersion);
    var majorVersion = parseInt(navigator.appVersion, 10);
    var nameOffset, verOffset, ix;

    // Opera
    if ((verOffset = nAgt.indexOf('Opera')) != -1) {
      browser = 'Opera';
      version = nAgt.substring(verOffset + 6);
      if ((verOffset = nAgt.indexOf('Version')) != -1) {
        version = nAgt.substring(verOffset + 8);
      }
    }
    // Opera Next
    if ((verOffset = nAgt.indexOf('OPR')) != -1) {
      browser = 'Opera';
      version = nAgt.substring(verOffset + 4);
    }
    // Legacy Edge
    else if ((verOffset = nAgt.indexOf('Edge')) != -1) {
      browser = 'Microsoft Legacy Edge';
      version = nAgt.substring(verOffset + 5);
    }
    // Edge (Chromium)
    else if ((verOffset = nAgt.indexOf('Edg')) != -1) {
      browser = 'Microsoft Edge';
      version = nAgt.substring(verOffset + 4);
    }
    // MSIE
    else if ((verOffset = nAgt.indexOf('MSIE')) != -1) {
      browser = 'Microsoft Internet Explorer';
      version = nAgt.substring(verOffset + 5);
    }
    // Chrome
    else if ((verOffset = nAgt.indexOf('Chrome')) != -1) {
      browser = 'Chrome';
      version = nAgt.substring(verOffset + 7);
    }
    // Safari
    else if ((verOffset = nAgt.indexOf('Safari')) != -1) {
      browser = 'Safari';
      version = nAgt.substring(verOffset + 7);
      if ((verOffset = nAgt.indexOf('Version')) != -1) {
        version = nAgt.substring(verOffset + 8);
      }
    }
    // Firefox
    else if ((verOffset = nAgt.indexOf('Firefox')) != -1) {
      browser = 'Firefox';
      version = nAgt.substring(verOffset + 8);
    }
    // MSIE 11+
    else if (nAgt.indexOf('Trident/') != -1) {
      browser = 'Microsoft Internet Explorer';
      version = nAgt.substring(nAgt.indexOf('rv:') + 3);
    }
    // Other browsers
    else if (
      (nameOffset = nAgt.lastIndexOf(' ') + 1) <
      (verOffset = nAgt.lastIndexOf('/'))
    ) {
      browser = nAgt.substring(nameOffset, verOffset);
      version = nAgt.substring(verOffset + 1);
      if (browser.toLowerCase() == browser.toUpperCase()) {
        browser = navigator.appName;
      }
    }
    // trim the version string
    if ((ix = version.indexOf(';')) != -1) version = version.substring(0, ix);
    if ((ix = version.indexOf(' ')) != -1) version = version.substring(0, ix);
    if ((ix = version.indexOf(')')) != -1) version = version.substring(0, ix);

    majorVersion = parseInt('' + version, 10);
    if (isNaN(majorVersion)) {
      version = '' + parseFloat(navigator.appVersion);
      majorVersion = parseInt(navigator.appVersion, 10);
    }
    //Check architecture type

    var architecture = nAgt.indexOf('x64') != -1 ? 'x64' : 'x86';
    // mobile version
    var mobile = false;
    (function (a) {
      if (
        /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
          a
        ) ||
        /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
          a.substr(0, 4)
        )
      )
        mobile = true;
    })(navigator.userAgent || navigator.vendor || window.opera);

    // cookie
    var cookieEnabled = navigator.cookieEnabled ? true : false;

    if (typeof navigator.cookieEnabled == 'undefined' && !cookieEnabled) {
      document.cookie = 'testcookie';
      cookieEnabled =
        document.cookie.indexOf('testcookie') != -1 ? true : false;
    }

    // system
    var os = unknown;
    var clientStrings = [
      { s: 'Windows 10', r: /(Windows 10.0|Windows NT 10.0)/ },
      { s: 'Windows 8.1', r: /(Windows 8.1|Windows NT 6.3)/ },
      { s: 'Windows 8', r: /(Windows 8|Windows NT 6.2)/ },
      { s: 'Windows 7', r: /(Windows 7|Windows NT 6.1)/ },
      { s: 'Windows Vista', r: /Windows NT 6.0/ },
      { s: 'Windows Server 2003', r: /Windows NT 5.2/ },
      { s: 'Windows XP', r: /(Windows NT 5.1|Windows XP)/ },
      { s: 'Windows 2000', r: /(Windows NT 5.0|Windows 2000)/ },
      { s: 'Windows ME', r: /(Win 9x 4.90|Windows ME)/ },
      { s: 'Windows 98', r: /(Windows 98|Win98)/ },
      { s: 'Windows 95', r: /(Windows 95|Win95|Windows_95)/ },
      {
        s: 'Windows NT 4.0',
        r: /(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/,
      },
      { s: 'Windows CE', r: /Windows CE/ },
      { s: 'Windows 3.11', r: /Win16/ },
      { s: 'Android', r: /Android/ },
      { s: 'Open BSD', r: /OpenBSD/ },
      { s: 'Sun OS', r: /SunOS/ },
      { s: 'Chrome OS', r: /CrOS/ },
      { s: 'Linux', r: /(Linux|X11(?!.*CrOS))/ },
      { s: 'iOS', r: /(iPhone|iPad|iPod)/ },
      { s: 'Mac OS X', r: /Mac OS X/ },
      { s: 'Mac OS', r: /(Mac OS|MacPPC|MacIntel|Mac_PowerPC|Macintosh)/ },
      { s: 'QNX', r: /QNX/ },
      { s: 'UNIX', r: /UNIX/ },
      { s: 'BeOS', r: /BeOS/ },
      { s: 'OS/2', r: /OS\/2/ },
      {
        s: 'Search Bot',
        r: /(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/,
      },
    ];
    for (var id in clientStrings) {
      var cs = clientStrings[id];
      if (cs.r.test(nAgt)) {
        os = cs.s;
        break;
      }
    }

    var osVersion = unknown;

    if (/Windows/.test(os)) {
      osVersion = /Windows (.*)/.exec(os)[1];
      os = 'Windows';
    }

    switch (os) {
      case 'Mac OS':
      case 'Mac OS X':
      case 'Android':
        osVersion = /(?:Android|Mac OS|Mac OS X|MacPPC|MacIntel|Mac_PowerPC|Macintosh) ([\.\_\d]+)/.exec(
          nAgt
        )[1];
        break;

      case 'iOS':
        osVersion = /OS (\d+)_(\d+)_?(\d+)?/.exec(nVer);
        osVersion =
          osVersion[1] + '.' + osVersion[2] + '.' + (osVersion[3] | 0);
        break;
    }

    // // flash (you'll need to include swfobject)
    // /* script src="//ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js" */
    // var flashVersion = 'no check';
    // if (typeof swfobject != 'undefined') {
    //   var fv = swfobject.getFlashPlayerVersion();
    //   if (fv.major > 0) {
    //     flashVersion = fv.major + '.' + fv.minor + ' r' + fv.release;
    //   } else {
    //     flashVersion = unknown;
    //   }
    // }
  }

  return {
    screen: screenSize,
    browser: browser,
    browserVersion: version,
    browserMajorVersion: majorVersion,
    mobile: mobile,
    os: os,
    osVersion: osVersion,
    cookies: cookieEnabled,
    arch: architecture,
  };
};

export function urlBase64ToUint8Array(base64String) {
  var padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  var base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');

  var rawData = window.atob(base64);
  var outputArray = new Uint8Array(rawData.length);

  for (var i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function createDateString(dateStr) {
  //  Take a Date value, and turn it into a "2005-05-26T11:37:42" string
  const tzoffset = new Date().getTimezoneOffset() * 60000; //offset in milliseconds
  const currentDate = new Date(dateStr);
  const withTimezone = new Date(currentDate.getTime() - tzoffset);
  const localISOTime = withTimezone.toISOString().slice(0, 19).replace('Z', '');
  return localISOTime;
}

export function currencyFormat(label, currency = 'BRL') {
  let formatCurrency = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  });
  return formatCurrency.format(Number(label));
}

export function percentageFormat(label, digits = 10) {
  let formatPercentage = new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    // maximumFractionDigits: 2,
    minimumFractionDigits: digits,
  });
  return formatPercentage.format(label);
}

export function decimalFormat(label, digits = 4) {
  let formatPercentage = new Intl.NumberFormat('pt-BR', {
    style: 'decimal',
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  });
  return formatPercentage.format(label);
}

export function rainbowStop(h) {
  let f = (n, k = (n + h * 12) % 12) =>
    0.5 - 0.5 * Math.max(Math.min(k - 3, 9 - k, 1), -1);
  let rgb2hex = (r, g, b) =>
    '#' +
    [r, g, b]
      .map((x) =>
        Math.round(x * 255)
          .toString(16)
          .padStart(2, 0)
      )
      .join('');
  return rgb2hex(f(0), f(8), f(4));
}

export function generateRandomColors(n) {
  const m = 1 / n;
  let percentage = 0;
  const colors = [];
  for (let i = 0; i < n; i++) {
    percentage += m;
    colors.push(rainbowStop(percentage));
  }
  return colors;
}

export const getDataForTheInvestmentProjectChart = (
  initialAmount,
  monthlyInflow,
  lenghtOfMonths,
  rate
) => {
  const calculateMonthlyIcomes = (item) => {
    const array = [];
    let amount = initialAmount;
    [...Array(item).keys()].forEach((element) => {
      if (element > 0) {
        amount += monthlyInflow + array[element - 1];
      }
      array.push((amount * rate) / 100);
    });
    array.unshift(0);
    return array;
  };
  const months = [...Array(lenghtOfMonths + 1).keys()];
  return months.reduce(
    (obj, item) => [
      ...obj,
      {
        deposites: initialAmount + monthlyInflow * item,
        monthlyIncome: calculateMonthlyIcomes(item)[item],
        totalMonthlyIncome: calculateMonthlyIcomes(item).reduce(
          (acc, curr) => acc + curr,
          0
        ),
        accruedValue:
          initialAmount +
          monthlyInflow * item +
          calculateMonthlyIcomes(item).reduce((acc, curr) => acc + curr, 0),
      },
    ],
    []
  );
};

export const getDataForTotalTaxes = (income, exchanges, defaultCurrency) => {
  let dates = [];
  const incomesarray = [];
  income.forEach((data) => {
    dates = dates.concat([
      ...data.incomes
        .filter((key) => Object.values(key)[0].type === 'income')
        .map((key) => Object.keys(key)[0]),
    ]);
    console.log(data.broker);
    incomesarray.push(
      ...data.incomes.map((value) => [
        ...Object.entries(value)[0],
        data.broker?.currency,
      ])
    );
  });
  let datesSet = new Set(dates);
  datesSet = [...datesSet].sort();
  datesSet = datesSet.map((date) =>
    incomesarray.filter((e) => e[0].includes(date))
  );
  const labels = [];
  const taxes = [];
  datesSet.forEach((el) => {
    labels.push(
      ...new Set(
        el.map((date) => date[0].replace('income', '').replace('fund', ''))
      )
    );
    taxes.push(
      el
        .map((value) => ({
          tax: value[1].tax,
          currency: value[2],
        }))
        .reduce(
          (acc, curr) =>
            acc + curr.tax * exchanges[`${curr.currency}_${defaultCurrency}`],
          0
        )
    );
  });
  return [labels, taxes];
};

export const getGlobalAverageReturn = (investments, dateInput) => {
  // if (dateInput === '-01') {
  //   console.log(dateInput);
  //   return NaN;
  // }

  const currentAmounts =
    // Number(
    investments
      .map((investment) => {
        return {
          ...investment,
          incomes: investment.incomes.filter(
            (income) => Object.values(income)[0].type === 'income'
          ),
        };
      })
      .filter(
        (investment) =>
          new Date(investment.investment_date).getTime() <=
          new Date(dateInput).getTime()
      )
      .map(
        (investment) =>
          investment.initial_amount +
          investment.incomes
            .filter((income) => Object.values(income)[0].type === 'income')
            .filter((income) => {
              return (
                new Date(Object.keys(income)[0].replace('income', '')) ===
                dateInput
              );
            })
            .map(
              (income) =>
                Object.values(income)[0].value - Object.values(income)[0].tax
            )
            .reduce((acc, curr) => acc + curr, 0)
      );

  currentAmounts.push(
    investments
      .map((investment) => {
        return {
          ...investment,
          incomes: investment.incomes.filter(
            (income) => Object.values(income)[0].type === 'income'
          ),
        };
      })
      .map((inv) =>
        inv.incomes.filter(
          (income) =>
            new Date(Object.keys(income)[0].replace('income', '')).getTime() +
              1 <=
            new Date(dateInput).getTime()
        )
      )
      .filter((value) => value !== undefined)
      .map((value) =>
        value.map(
          (obj) => Object.values(obj)[0].value - Object.values(obj)[0].tax
        )
      )
      .flat()
  );

  const incomes = investments
    .filter(
      (investment) =>
        new Date(investment.investment_date).getTime() <=
        new Date(dateInput).getTime()
    )
    .map((investment) =>
      investment.incomes.find((income) => {
        return Object.keys(income)[0].replace('income', '') === dateInput;
      })
    )
    .filter((value) => value !== undefined)
    .map(
      (value) => Object.values(value)[0].value - Object.values(value)[0].tax
    );

  return currentAmounts.flat().length
    ? incomes.reduce((acc, curr) => acc + curr, 0) /
        currentAmounts.flat().reduce((acc, curr) => acc + curr, 0)
    : 0;
};

export const geometricMeanReturnInvestments = (investments) => {
  let dates = [];
  const incomesarray = [];

  investments.forEach((data) => {
    dates = dates.concat([
      ...data.incomes
        .filter((key) => Object.values(key)[0].type === 'income')
        .map((key) =>
          Object.keys(key)[0].replace('income', '').replace('fund', '')
        ),
    ]);
    incomesarray.push(...data.incomes.map((value) => Object.entries(value)[0]));
  });

  let datesSet = new Set(dates);
  datesSet = [...datesSet].sort();
  const returns = [];

  for (const data of datesSet) {
    returns.push(getGlobalAverageReturn(investments, data));
  }

  // for (const i of datesSet.keys()) {
  //   const array = investments
  //     .map((invest) => ({
  //       initial_amount: invest.initial_amount,
  //       incomes: invest.incomes.filter(
  //         (date) =>
  //           new Date(Object.keys(date)[0].replace('income', '')) <=
  //           new Date(datesSet[i])
  //       ),
  //     }))
  //     .filter((entry) => Object.entries(entry)[1][1].length !== 0)
  //     .map((rate) => ({
  //       current_amount:
  //         rate.initial_amount +
  //         rate.incomes.reduce(
  //           (acc, curr) => acc + Object.values(curr)[0].value,
  //           0
  //         ),
  //       rate:
  //         Object.values(rate.incomes[rate.incomes.length - 1])[0].value /
  //         (rate.initial_amount +
  //           rate.incomes.reduce(
  //             (acc, curr) => acc + Object.values(curr)[0].value,
  //             0
  //           )),
  //     }));

  // returns.push(array);
  return returns.length
    ? returns.map((ret) => ret + 1).reduce((acc, curr) => acc * curr, 1) **
        (1 / returns.length) -
        1
    : 0;
};

//prettier-ignore
export const getHowMuchMoneyToFinancialFreedom = (value, investments, currency, exchangeRates, accounts) => {
  if (accounts) {
    return value - (investments.length !== 0 ? investments.filter(inv => {
        return inv.isArchived === false
      }).map((investment) => (investment.initial_amount + investment.accrued_income) * exchangeRates[`${investment.broker.currency}_${currency}`])
      .reduce((acc, curr) => acc + curr, 0) :
      0) - accounts.reduce((acc, curr) => acc + (curr.initialAmmount + curr.balance) * exchangeRates[`${curr.currency}_${currency}`], 0)
  }
};

export const getDataForTheFirstChart = (
  income,
  firstPeriod = undefined,
  lastPeriod = undefined,
  exchangeRates,
  currency
) => {
  // var isInitialUndefined = false;
  let dates = [];
  const incomesarray = [];
  income.forEach((data) => {
    dates = dates.concat([
      ...data.incomes
        .filter((key) => Object.values(key)[0].type === 'income')
        .map((key) => Object.keys(key)[0]),
    ]);
    incomesarray.push(
      ...data.incomes.map((value) => [
        ...Object.entries(value)[0],
        data.broker.currency,
      ])
    );
  });

  let datesSet = new Set(dates);
  datesSet = [...datesSet].sort();
  if (firstPeriod === undefined) {
    // isInitialUndefined = true;
    firstPeriod = datesSet[0];
  }
  if (lastPeriod === undefined) {
    lastPeriod = datesSet[datesSet.length - 1];
  }

  // const initialSlice = // isInitialUndefined
  //   // ?
  //   datesSet.indexOf(firstPeriod);
  // //  : datesSet.indexOf(firstPeriod);
  // const finalSlice =
  //   datesSet //.sort()
  //     .indexOf(lastPeriod) + 1;

  datesSet = datesSet.map((date) =>
    incomesarray.filter((e) => e[0].includes(date))
  );
  let labels = [];
  let values = [];

  datesSet.forEach((el) => {
    labels.push(
      ...new Set(
        el.map((date) =>
          format(
            ISODateFormat(date[0].replace('income', '').replace('fund', '')),
            'MMM/yyyy'
          )
        )
      )
    );

    //prettier-ignore
    values.push(el.map((value) => Number(((value[1].value - value[1].tax) *
        exchangeRates[`${value[2]}_${currency}`]).toFixed(2))
      )
      .reduce((acc, curr) => acc + curr, 0)
    );
  });

  // labels = labels.slice(initialSlice, finalSlice);
  // values = values.slice(initialSlice, finalSlice);

  return [values, labels];
};

export const handleSlicesOfInvestments = (
  investments,
  initialDate,
  finalDate
) => {
  const initialSlice =
    investments[1].indexOf(
      format(
        new Date(initialDate),
        'MMM/yyyy'
        // {
        //   locale: ptBR,
        // }
      )
    ) === -1
      ? 0
      : investments[1].indexOf(
          format(
            new Date(initialDate),
            'MMM/yyyy'
            // {
            //   locale: ptBR,
            // }
          )
        );
  const finalSlice =
    investments[1].indexOf(
      format(
        new Date(finalDate),
        'MMM/yyyy'
        // {
        //   locale: ptBR,
        // }
      )
    ) + 1;

  return initialSlice !== -2 && finalSlice !== 0
    ? [
        investments[0].slice(initialSlice, finalSlice),
        investments[1].slice(initialSlice, finalSlice),
      ]
    : investments;
};

export const getDataForTheAverageYearlyBasisInflation = (
  inflation,
  firstPeriod = undefined,
  lastPeriod = undefined
) => {
  if (firstPeriod === undefined || firstPeriod === '-01') {
    firstPeriod = inflation[0].data;
  }
  if (lastPeriod === undefined || lastPeriod === '-01') {
    lastPeriod = inflation[inflation.length - 1].data;
  }

  let inflations = inflation.slice(
    Math.max(inflation.map((e) => e.data).indexOf(firstPeriod) - 11, 0),
    inflation.map((e) => e.data).indexOf(lastPeriod) + 1
  );

  inflations = getSimpleMovingAverageGeometricMean(inflations).slice(
    Math.min(inflation.map((e) => e.data).indexOf(firstPeriod), 11)
  );

  const labels = [];
  const values = [];
  inflations.forEach((e) => {
    labels.push(
      format(
        addDays(new Date(e.data), 1),
        'MMM/yyyy'
        // {
        //   locale: ptBR,
        // }
      )
    );
    values.push(e.valor);
  });
  return [values, labels];
};

export const getDataForTheInflationChart = (
  inflation,
  firstPeriod = undefined,
  lastPeriod = undefined
) => {
  if (firstPeriod === undefined || firstPeriod === '-01') {
    firstPeriod = inflation[0].data;
  }
  if (lastPeriod === undefined || lastPeriod === '-01') {
    lastPeriod = inflation[inflation.length - 1].data;
  }

  let inflations = inflation.slice(
    Math.max(inflation.map((e) => e.data).indexOf(firstPeriod) - 11, 0),
    inflation.map((e) => e.data).indexOf(lastPeriod) + 1
  );

  inflations = getSimpleMovingAverage(inflations);
  inflations = inflations.slice(
    Math.min(inflation.map((e) => e.data).indexOf(firstPeriod), 11)
  );
  const labels = [];
  const values = [];
  inflations.forEach((e) => {
    labels.push(
      format(
        addDays(new Date(e.data), 1),
        'MMM/yyyy'
        // {
        //   locale: ptBR,
        // }
      )
    );
    values.push(e.valor);
  });
  return [values, labels];
};

const handleBigNumber = (array, index) => {
  let N = 1;
  array = array.slice(0, index + 1);

  array.forEach((element) => {
    N *= element;
  });
  return N ** (1 / (index + 1)) - 1;
};

/** 
const handleBigNumber = (array, index) => {
  const power = (base, exponent) => {
    let result = BigInt(1);
    for (let count = 0; count < exponent; count++) {
      console.log(result);
      result *= base;
    }
    return result;
  };
  function iroot(base, root) {
    if (typeof base !== 'bigint' || typeof root !== 'bigint')
      throw new Error('Arguments must be bigints.');

    let s = base + 1n;
    let k1 = root - 1n;
    console.log(s, k1);
    let u = base;
    while (u < s) {
      s = u;
      u = u * k1;
      (u * k1 + base / power(u, k1)) / root;
    }
    return s;
  }
  const countDecimals = function (value) {
    if (value % 1 != 0) {
      return value.toString().split('.')[1].length;
    }
    return 0;
  };
  let N = BigInt(1);
  array = array.slice(0, index + 1);
  var sumOfDecimals = BigInt(0);
  array.forEach((element) => {
    const currentCount = countDecimals(element);
    sumOfDecimals += BigInt(currentCount);
    element = BigInt(element * 10 ** currentCount);
    N *= element;
  });
  console.log(N, sumOfDecimals);
  return iroot(BigInt(index + 1), N) / iroot(BigInt(index + 1), sumOfDecimals);
};
*
*/

export const getDataForTheAverageInflationAllThePeriod = (
  inflation,
  firstPeriod = undefined,
  lastPeriod = undefined
) => {
  console.log(inflation, 'this is inflation');
  if (firstPeriod === undefined || firstPeriod === '-01') {
    firstPeriod = inflation[0].data;
  }
  if (lastPeriod === undefined || lastPeriod === '-01') {
    lastPeriod = inflation[inflation.length - 1].data;
  }
  let inflations = inflation.slice(
    inflation.map((e) => e.data).indexOf(firstPeriod),
    inflation.map((e) => e.data).indexOf(lastPeriod) + 1
  );
  const cumulativeProduct = ((product) => (value) => (product *= value))(1);
  //prettier-ignore
  inflations = inflations.map((inf, index) => ({
    data: inf.data,
    valor: cumulativeProduct(inf.valor) }))
      .map((value, index, array) =>({
        data:value.data,
       valor: handleBigNumber(array.map(arr=> arr.valor), index)
      }));

  // ** (1 / (index + 1)) - 1

  const labels = [];
  const values = [];
  inflations.forEach((e) => {
    labels.push(
      format(
        addDays(new Date(e.data), 1),
        'MMM/yyyy'
        // {
        //   locale: ptBR,
        // }
      )
    );
    values.push(e.valor);
  });
  return [values, labels];
};

export const getDataForTheInflationChartTotalPeriod = (
  inflation,
  firstPeriod = undefined,
  lastPeriod = undefined
) => {
  if (firstPeriod === undefined || firstPeriod === '-01') {
    firstPeriod = inflation[0].data;
  }
  if (lastPeriod === undefined || lastPeriod === '-01') {
    lastPeriod = inflation[inflation.length - 1].data;
  }

  let inflations = inflation.slice(
    inflation.map((e) => e.data).indexOf(firstPeriod),
    inflation.map((e) => e.data).indexOf(lastPeriod) + 1
  );
  const cumulativeProduct = ((product) => (value) => (product *= value))(1);

  inflations = inflations.map((inf) => {
    return {
      data: inf.data,
      valor: cumulativeProduct(inf.valor) - 1,
    };
  });

  const labels = [];
  const values = [];
  inflations.forEach((e) => {
    labels.push(
      format(
        addDays(new Date(e.data), 1),
        'MMM/yyyy'
        //  {
        //   locale: ptBR,
        // }
      )
    );
    values.push(e.valor);
  });
  return [values, labels];
};

export const getTopInvestmentsByLocation = (investments) => {
  const countries = [
    ...new Set(investments.map((investment) => investment.broker.country)),
  ];
  const currenciesperCountries = [];
  for (const country of countries) {
    const currenciesPerCountry = [
      ...new Set(
        investments
          .filter((investment) => investment.broker.country === country)
          .map((investment) => investment.broker.currency)
      ),
    ];
    currenciesperCountries.push([country, currenciesPerCountry]);
  }
  const result = [];
  for (const country of currenciesperCountries) {
    for (const currency of country[1]) {
      const globalTopInvestments = investments
        .filter((investment) => investment.broker.currency === currency)
        .reduce(
          (acc, curr) => acc + curr.initial_amount + curr.accrued_income,
          0
        );
      result.push([country[0], currency, globalTopInvestments]);
    }
  }

  return result;
};

//prettier-ignore
export const getSimpleMovingAverage = (inflations) => {

  const initialPeriodInflations = inflations.slice(0, 11).map((infl, index, array) =>
    ({
      data: infl.data,
      valor: array.slice(0, index + 1).reduce((acc, curr) => acc * curr.valor, 1)
    })).map((infl) => ({
    data: infl.data,
    valor: (infl.valor - 1)
  }));
  const remainingInflations = inflations
    .map((inf, index, array) =>
      ({
        data: inf.data,
        valor: array.slice(index - 12 + 1, index + 1).reduce((acc, curr) => acc * curr.valor, 1)
      })).map((infl) => ({
      data: infl.data,
      valor: (infl.valor - 1)
    }));
  // console.log([...initialPeriodInflations, ...remainingInflations.slice(11)])
  return [...initialPeriodInflations, ...remainingInflations.slice(11)]
};

export const getSimpleMovingAverageGeometricMean = (inflations) => {
  // console.log(inflations, getSimpleMovingAverage(inflations));
  const initialPeriodInflations = getSimpleMovingAverage(inflations)
    .map((value) => ({
      data: value.data,
      valor: value.valor + 1,
    }))
    .slice(0, 11)
    .map((infl, index, array) => ({
      data: infl.data,
      valor: array
        .slice(0, index + 1)
        .reduce((acc, curr) => acc * curr.valor, 1),
    }))
    .map((infl, index) => ({
      data: infl.data,
      valor: infl.valor ** (1 / (index + 1)) - 1,
    }));
  const remainingInflations = getSimpleMovingAverage(inflations)
    .map((value) => ({
      data: value.data,
      valor: value.valor + 1,
    }))
    .map((inf, index, array) => ({
      data: inf.data,
      valor: array
        .slice(index - 12 + 1, index + 1)
        .reduce((acc, curr) => acc * curr.valor, 1),
    }))
    .map((infl, index) => ({
      data: infl.data,
      valor: infl.valor ** (1 / 12) - 1,
    }));

  return [...initialPeriodInflations, ...remainingInflations.slice(11)];
};

export const getDataForTheTopInvestmentsTable = (
  investments,
  currentMonth = '2021-07-01'
) => {
  currentMonth = currentMonth.length < 10 ? currentMonth + '-01' : currentMonth;

  let incomes = investments.map((investment) => [
    investment.name,
    investment.incomes
      .filter((key) => Object.values(key)[0].type === 'income')
      .filter(
        (date) =>
          Object.entries(date)[0][0]
            .replace('income', '')
            .replace('fund', '') === currentMonth
      ),
  ]);

  const indexes = [];
  for (let i = 0; i < incomes.length; i++) {
    incomes[i][1].length !== 0 && indexes.push(i);
  }

  incomes = incomes.filter((e) => e[1].length !== 0);

  const filteredInvestments = (investments = investments.filter((e, index) =>
    indexes.includes(index)
  ));
  const returns = [];
  for (let i = 0; i < filteredInvestments.length; i++) {
    const accrued_income = filteredInvestments.map((inv) =>
      inv.incomes
        .map((income) => {
          let object = {};
          //prettier-ignore
          object[Object.keys(income)[0].replace('income', '').replace('fund', '')] = Object.values(income)[0];
          return object;
        })
        .filter(
          (date) => new Date(Object.keys(date)[0]) <= new Date(currentMonth)
        )
        .reduce((acc, curr) => acc + Object.values(curr)[0].value, 0)
    );
    returns.push([
      filteredInvestments[i]._id,
      filteredInvestments[i].name,
      (Object.values(incomes[i][1][0])[0].value -
        Object.values(incomes[i][1][0])[0].tax) /
        (filteredInvestments[i].initial_amount +
          accrued_income[i] -
          Object.values(incomes[i][1][0])[0].value -
          Object.values(incomes[i][1][0])[0].tax),
      filteredInvestments[i].initial_amount + accrued_income[i],
      filteredInvestments[i].broker.currency,
      Object.values(incomes[i][1][0])[0].value -
        Object.values(incomes[i][1][0])[0].tax,
    ]);
  }
  return returns.sort((a, b) => b[2] - a[2]).slice(0, 7);
};
// Codigo usado para representar numero como percentuais
// .toLocaleString('pt-br', { style: 'percent', minimumFractionDigits: 2 }

export function setDataAccountsSpendingCategories(
  accounts,
  transactions,
  firstMonth = undefined,
  lastMonth = undefined
) {
  if (firstMonth) {
    const [year, month] = firstMonth.split('-');
    console.log(new Date(Number(year), Number(month) - 1, 0));
    transactions = transactions.filter(
      (trnsct) =>
        new Date(trnsct.date) > new Date(Number(year), Number(month) - 1, 0)
    );
  }

  if (lastMonth) {
    const [year, month] = lastMonth.split('-');
    transactions = transactions.filter(
      (trnsct) =>
        new Date(trnsct.date) <=
        new Date(
          new Date(Number(year), Number(month), 0).setUTCHours(23, 59, 59, 999)
        )
    );
  }

  console.log(transactions);

  const groupBy = function (xs, key) {
    return xs.reduce(function (rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };
  const expenses = transactions
    .filter(
      (transact) =>
        transact.type === 'Expense' && transact.category.name !== 'Investimento'
    )
    .filter((transact) => transact.dueToAccount._id === accounts._id)
    .map((transact) => ({ ...transact, category: transact.category.name }));

  let data = Object.entries(groupBy(expenses, 'category'))
    .map((dat) => [
      dat[0],
      Number(dat[1].reduce((acc, curr) => acc + curr.ammount, 0).toFixed(2)),
    ])
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const labels = data.map((dat) => dat[0]);

  data = data.map((dat) => dat[1]);

  return [data, labels];
}

export function setDataAccountsTotalExpensesAndRevenues(
  accounts,
  transactions
) {
  transactions = transactions.filter(
    (transact) =>
      transact.dueToAccount._id === accounts._id &&
      transact.category.name !== 'Investimento'
  );
  const setGroups = (data) => {
    const groups = data.reduce((groups, transaction) => {
      const date = transaction.date.slice(0, 7);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(transaction);
      return groups;
    }, {});

    const groupArrays = Object.keys(groups).map((date) => {
      return {
        date,
        transactions: groups[date],
      };
    });
    return groupArrays;
  };
  const revenue = setGroups(
    transactions.filter((transact) => transact.type === 'Revenue')
  ).map((dat) => ({
    ...dat,
    transactions: Number(
      dat.transactions.reduce((acc, curr) => acc + curr.ammount, 0).toFixed(2)
    ),
  }));

  const expense = setGroups(
    transactions.filter(
      (transact) =>
        transact.type === 'Expense' && transact.category.name !== 'Investimento'
    )
  ).map((dat) => ({
    ...dat,
    transactions: Number(
      dat.transactions.reduce((acc, curr) => acc + curr.ammount, 0).toFixed(2)
    ),
  }));

  const dates = setGroups(transactions).map((transact) => transact.date);

  const revenuesArray = [];
  const expensesArray = [];

  for (const date of dates) {
    let found = false;
    for (const iterator of revenue) {
      if (iterator.date === date) {
        revenuesArray.push({
          date: iterator.date,
          transactions: iterator.transactions,
        });
        found = true;
        break;
      }
    }
    if (!found) {
      revenuesArray.push({
        date: date,
        transactions: 0,
      });
    }
    found = false;
    for (const iterator of expense) {
      if (iterator.date === date) {
        expensesArray.push({
          date: iterator.date,
          transactions: iterator.transactions,
        });
        found = true;
        break;
      }
    }
    if (!found) {
      expensesArray.push({
        date: date,
        transactions: 0,
      });
    }
  }

  const balance = setGroups(
    transactions.filter(
      (transact) =>
        transact.type !== 'Transfer' &&
        transact.category.name !== 'Investimento'
    )
  ).map((trans) => ({
    ...trans,
    transactions: Number(
      (
        trans.transactions
          .filter((elm) => elm.type === 'Revenue')
          .reduce((acc, curr) => acc + curr.ammount, 0) -
        trans.transactions
          .filter((elm) => elm.type === 'Expense')
          .reduce((acc, curr) => acc + curr.ammount, 0)
      ).toFixed(2)
    ),
  }));

  const returns = (data) => {
    return [data.map((dat) => dat.transactions), data.map((dat) => dat.date)];
  };
  return [returns(expensesArray), returns(revenuesArray), returns(balance)];
}

export function setDataAccountsSumExpesesGroupedByMonth(
  accounts,
  transactions
) {
  transactions = transactions.filter(
    (transact) =>
      transact.dueToAccount._id === accounts._id &&
      transact.category.name !== 'Investimento' &&
      transact.type !== 'Transfer' &&
      transact.type !== 'Revenue'
  );

  const set = new Set();
  for (const iterator of transactions) {
    set.add(iterator.date.slice(0, 7));
  }
  const dates = [...set];

  const setGroups = (data) => {
    const groups = data.reduce((groups, transaction) => {
      const category = transaction.category.name;
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(transaction);
      return groups;
    }, {});

    const groupArrays = Object.keys(groups).map((category) => {
      return {
        category,
        transactions: groups[category],
      };
    });
    return groupArrays;
  };
  const setGroupsDate = (data) => {
    const groups = data.reduce((groups, transaction) => {
      const date = transaction.date.slice(0, 7);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(transaction);
      return groups;
    }, {});

    const groupArrays = Object.keys(groups).map((date) => {
      return {
        date,
        transactions: groups[date],
      };
    });
    return groupArrays;
  };

  const setTransactions = (transactions) => {
    const array = [];
    for (const date of dates) {
      let found = false;
      for (const iterator of transactions) {
        if (iterator.date === date) {
          array.push(
            Number(
              iterator.transactions
                .reduce((acc, curr) => acc + curr.ammount, 0)
                .toFixed(2)
            )
          );
          found = true;
          break;
        }
      }
      if (!found) {
        array.push(null);
      }
    }
    return array;
  };

  return [
    dates,
    setGroups(transactions).map((el) => ({
      ...el,
      transactions: setTransactions(setGroupsDate(el.transactions)),
    })),
  ];
}

export function setDataForModalMonthlyPermformanceInvestments(
  investments,
  dateInput
) {
  let dates = new Set();
  investments = investments
    .map((investment) => ({
      ...investment,
      incomes: investment.incomes.filter(
        (income) => Object.values(income)[0].type === 'income'
      ),
    }))
    .map((incom, idx) => ({ ...incom }));

  investments.forEach((investment) => {
    investment.incomes.forEach((income) => {
      dates.add(Object.keys(income)[0].replace('income', ''));
    });
  });
  dates = [...dates].sort();

  const incomes = [];
  investments.forEach((investment) => {
    investment.incomes.forEach((income) => {
      if (Object.keys(income)[0].replace('income', '') === dateInput) {
        incomes.push([investment, Object.values(income)].flat());
      }
    });
  });
  return incomes;
}
