!(function (e) {
  'use strict';
  let t = 20,
    i = '0'.repeat(t + 1),
    r = 'degrees',
    o = e.Base;
  const s =
      '2.3025850929940456840179914546843642076011014886287729760333279009675726096773524802359972050895982983419677840422862486334095254650828067566662873690987816894829072083255546808437998948262331985283935053089653777326288461633662222876982198867465436674744042432743651550489343149393914796194044002221051017141748003688084012647080685567743216228355220114804663715659121373450747856947683463616792101806445070648000277502684916746550586856935673420670581136429224554405758925724208241314695689016758940256776311356919292033376587141660230105703089634572075440370847469940168269282808481184289314848524948644871927809676271275775397027668605952496716674183485704422507197965004714951050492214776567636938662976979522110718264549734772662425709429322582798502585509785265383207606726317164309505995087807523710333101197857547331541421808427543863591778117054309827482385045648019095610299291824318237525357709750539565187697510374970888692180205189339507238539205144634197265287286965110862571492198849978748873771345686209167058',
    u =
      '0.6931471805599453094172321214581765680755001343602552541206800094933936219696947156058633269964186875420014810205706857336855202357581305570326707516350759619307275708283714351903070386238916734711233501153644979552391204751726815749320651555247341395258829504530070953263666426541042391578149520437404303855008019441706416715186447128399681717845469570262716310645461502572074024816377733896385506952606683411372738737229289564935470257626520988596932019650585547647033067936544325476327449512504060694381471046899465062201677204245245296126879465461931651746813926725041038025462596568691441928716082938031727143677826548775664850856740776484514644399404614226031930967354025744460703080960850474866385231381816767514386674766478908814371419854942315199735488037516586127535291661000710535582498794147295092931138971559982056543928717000721808576102523688921324497138932037843935308877482597017155910708823683627589842589185353024363421436706118923678919237231467232172053401649256872747782344535347648114941864238677677440',
    c =
      '3.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679821480865132823066470938446095505822317253594081284811174502841027019385211055596446229489549303819644288109756659334461284756482337867831652712019091456485669234603486104543266482133936072602491412737245870066063155881748815209209628292540917153643678925903600113305305488204665213841469519415116094330572703657595919530921861173819326117931051185480744623799627495673518857527248912279381830119491298336733624406566430860213949463952247371907021798609437027705392171762931767523846748184676694051320005681271452635608277857713427577896091736371787214684409012249534301465495853710507922796892589235420199561121290219608640344181598136297747713099605187072113499999983729780499510597317328160963185950244594553469083026425223082533446850352619311881710100031378387528865875332083814206171776691473035982534904287554687311595628638823537875937519577818577805321712268066130019278766111959092164201989380952572010654858632788',
    l = '0123456789abcdefghijklmnopqrstuvwxyz',
    f =
      '11111111111111111111111011111111100000111000000110101100100101000111000000100011101001111001111001000000000000000000000000000000',
    a =
      '11111111111111111111111111111111111111111111111111111011101011101000110110000001011001010011000011110011101000100011110110111111010111000000010111011000010110101101010111000110010010111000000100000110001100110001010011010001000111111010100001110110010011000110111011100100110110001010001110000001010000100111001101111001101000100110000100010000101000000100001100001000101111011100111010111111000110011101000101001100111001011110011001010000111101010010100100110111101101110110010101101110010010001100111101101010010010001101101001111110000111010011010000101111010110000001100011010001000100100000001010110001101000101010101100100011110101100111011110110100011001000111011110001110001011000100110100011010011011111001100111111101011' +
      '0'.repeat(293),
    d = (n, e) => {
      throw 'error [BaseNumber.js] in ' + n + ': ' + e;
    },
    g = (n) => {
      for (
        'NaN' !==
          (n = String(n)
            .split(',')
            .join('.')
            .split('_')
            .join('')
            .split(' ')
            .join('')) &&
          -1 === n.indexOf('Infinity') &&
          (n = n.toLowerCase()),
          n.indexOf('.') + 1 == n.length && (n = n.substring(0, n.length - 1));
        '+' === n[0] || '-' === n[0];

      ) {
        for (; '+' === n[0]; ) n = n.slice(1);
        if ('-' === n[0])
          if ('-' === n[1]) n = n.slice(2);
          else {
            if ('+' !== n[1]) break;
            n = '-' + n.slice(2);
          }
      }
      return n;
    },
    m = (n) => {
      const e = '-' === n[0];
      let t;
      if (
        (e && (n = n.slice(1)),
        (n.indexOf('e+') >= 0 && (t = 'e+')) ||
          (n.indexOf('e-') >= 0 && (t = 'e-')))
      ) {
        (n = n.split(t))[0] = n[0].split('');
        let e = n[0].indexOf('.');
        e >= 0 ? n[0].splice(e, 1) : (e = n[0].length);
        const i = parseInt(n[1], 10);
        isNaN(i) && d("'constructor'", 'invalid exponent');
        try {
          'e+' === t
            ? i + e < n[0].length
              ? n[0].splice(i + e, 0, '.')
              : i + e > n[0].length &&
                n[0].push('0'.repeat(i + e - n[0].length))
            : e - i > 0
            ? n[0].splice(e - i, 0, '.')
            : e - i <= 0 && n[0].unshift('0.' + '0'.repeat(Math.abs(e - i))),
            (n = n[0].join(''));
        } catch (n) {
          d("'constructor'", 'max number length exceded');
        }
      }
      for (n = n.split(''); '0' === n[0] && '.' !== n[1]; ) n.shift();
      for (
        '.' === n[0] && n.unshift('0');
        n.indexOf('.') >= 0 &&
        ('0' === n[n.length - 1] || '.' === n[n.length - 1]);

      )
        n.pop();
      return (e ? '-' : '') + (n.length ? n.join('') : '0');
    },
    b = (n, e, t) => {
      let i = n
        .replace('NaN', '0')
        .replace('Infinity', '0')
        .replace('e+', '')
        .replace('e-', '')
        .split('');
      ('' === n ||
        i.reduce((n, e) => ('.' == e ? ++n : n), 0) > 1 ||
        i.reduce((n, e) => ('-' == e ? ++n : n), 0) > 1 ||
        i.some(
          (n) =>
            isNaN(n) &&
            (S.getNumber(n) < 10 || S.getNumber(n) > 36) &&
            '.' != n &&
            '-' != n
        )) &&
        d(t, 'invalid number ' + n),
        i.some((n) => S.getNumber(n) >= e) &&
          d(t, "number '" + n + "' doesn't match base " + e),
        isNaN(e) && d(t, 'target base is Not A Number'),
        (e < 2 || e > 36) &&
          d(t, 'base argument should be an integer between 2 and 36');
    };
  function p(n, e) {
    let t = '',
      i = '';
    return (
      '-' === n[0] && (t = '0') && (n = n.slice(1)),
      '-' === e[0] && (i = '0') && (e = e.slice(1)),
      n.indexOf('Infinity') + 1
        ? n === e
          ? t < i
          : t
          ? -1
          : 1
        : e.indexOf('Infinity') + 1
        ? n === e
          ? t > i
          : i
          ? 1
          : -1
        : ((n += n.indexOf('.') < 0 ? '.0' : ''),
          (e += e.indexOf('.') < 0 ? '.0' : ''),
          (n =
            n.split('.')[0].padStart(e.indexOf('.'), '0') +
            '.' +
            n.split('.')[1]),
          (e =
            e.split('.')[0].padStart(n.indexOf('.'), '0') +
            '.' +
            e.split('.')[1]),
          (n = t + n.padEnd(e.length, '0')) >
            (e = i + e.padEnd(n.length, '0')) || -(n < e))
    );
  }
  const B = (n, e, r) => {
    if (
      (((n = n.split('.').concat(''))[1] = n[1].slice(0, t)),
      (n = n[0] + (n[1].length ? '.' + n[1] : '')),
      ((e = e.split('.').concat(''))[1] = e[1].slice(0, t)),
      (e = e[0] + (e[1].length ? '.' + e[1] : '')),
      'pow' === r)
    )
      return m(c(n, e));
    if ('root' === r) return m(c(n, B('1', e, 'd')));
    (n += n.indexOf('.') < 0 ? '.' : ''),
      (e += e.indexOf('.') < 0 ? '.' : ''),
      (n = n.padEnd(n.indexOf('.') + e.length - e.indexOf('.'), '0')),
      (e = e.padEnd(e.indexOf('.') + n.length - n.indexOf('.'), '0'));
    const o = n.indexOf('.');
    (n = n.replace('.', '')), (e = e.replace('.', ''));
    const s = Math.abs(o - n.length);
    function u(n, e) {
      const t = '-' === n[0] ? '-' : '';
      return (
        t && (n = n.slice(1)),
        t +
          (n = n.padStart(e, '0')).slice(0, n.length - e) +
          '.' +
          n.slice(n.length - e)
      );
    }
    if ('a' === r) return m(u(String(BigInt(n) + BigInt(e)), s));
    if ('s' === r) return m(u(String(BigInt(n) - BigInt(e)), s));
    if ('m' === r) return m(u(String(BigInt(n) * BigInt(e)), 2 * s));
    if ('d' === r) return m(u(String(BigInt(n + i) / BigInt(e)), t + 1));
    if ('mod' === r) return m(u(String(BigInt(n) % BigInt(e)), s));
    function c(e, i) {
      if ('0' === e) return n;
      if (-1 == i.indexOf('.') && -1 == e.indexOf('.')) {
        let n = 0;
        for (; '0' === e[e.length - 1]; n++) e = e.slice(0, -1);
        return (
          String(BigInt(e) ** BigInt(i)) + (n ? '0'.repeat(n).repeat(i) : '')
        );
      }
      {
        const n = t,
          r = Math.floor(1.3 * i * Math.log10(e));
        t + r > 1042 &&
          d("'pow()'", 'arguments are too big to reach the precision required'),
          S.setDecimals(t + r);
        const o = w(B(i, h(e), 'm'));
        return S.setDecimals(n), o;
      }
    }
  };
  function h(n) {
    let e = '0',
      i = n.replace('.', ''),
      r = (n.indexOf('.') + 1 || n.length + 1) - 2;
    if (1 != p(n, '0.9')) for (; '0' === i[0]; r--) i = i.slice(1);
    if (p((i = i[0] + '.' + i.slice(1)), '1.1') > -1) {
      let n = Math.floor(i / 2) - 1;
      n < 1 && (n = 1);
      const t = String(2 ** n);
      e = B(h(B(i, t, 'd')), B(String(n), u, 'm'), 'a');
    } else {
      let n = B(B(i, '1', 's'), B(i, '1', 'a'), 'd'),
        r = n,
        o = B(n, n, 'm'),
        s = 'x',
        u = 0;
      for (let n = 1; u <= t; n += 2)
        for (
          s = e, e = B(e, B(r, String(n), 'd'), 'a'), r = B(r, o, 'm');
          s[u] === e[u] && u <= t;
          u++
        );
      e = B(e, '2', 'm');
    }
    return B(e, B(String(r), s, 'm'), 'a');
  }
  function w(n) {
    if (1 == p(n, u)) {
      let e = B(n, u, 'd');
      if (e.indexOf('.') + 1 && '-' === (e = e.split('.')[0])[0]) {
        let n = e.length - 1;
        for (; '0' === e[n]; n--) e[n] = '9';
        e[n] = String(e[n] - 1);
      }
      const i = t + e / 3.25;
      i > 1042 &&
        d(
          "'exp()'",
          "argument '" + n + "' is too big to reach the precision required"
        );
      const r = t;
      S.setDecimals(i);
      const o = B(
        w(B(n, B(e, u, 'm'), 's')),
        String(BigInt(2) ** BigInt(e)),
        'm'
      );
      return S.setDecimals(r), o;
    }
    {
      let e = B('1', n, 'a'),
        t = 'x',
        i = 0,
        r = '1',
        o = B(n, n, 'm');
      for (let s = 2; i < e.length; s++)
        for (
          t = e,
            r = B(r, String(s), 'm'),
            e = B(e, B(o, r, 'd'), 'a'),
            o = B(o, n, 'm');
          i < e.length && t[i] === e[i];
          i++
        );
      return e;
    }
  }
  function N(n) {
    let e = '1',
      i = 'x',
      r = 0,
      o = '1',
      s = B(n, n, 'm'),
      u = s;
    for (let n = 2; r <= t; n += 2)
      for (
        i = e,
          o = B(o, B(String(n - 1), String(n), 'm'), 'm'),
          e = B(e, B(s, o, 'd'), n % 4 ? 's' : 'a'),
          s = B(s, u, 'm');
        i[r] === e[r] && r <= t;
        r++
      );
    return e;
  }
  function x(n) {
    let e = n,
      i = 'x',
      r = 0,
      o = '1',
      s = B(n, n, 'm'),
      u = B(s, n, 'm');
    for (let n = 3; r <= t; n += 2)
      for (
        i = e,
          o = B(o, B(String(n - 1), String(n), 'm'), 'm'),
          e = B(e, B(u, o, 'd'), (n - 1) % 4 ? 's' : 'a'),
          u = B(u, s, 'm');
        i[r] === e[r] && r <= t;
        r++
      );
    return e;
  }
  function I(n) {
    if (1 == p(n, '0.5'))
      return B(
        '2',
        I(B(n, B('1', B(B('1', B(n, n, 'm'), 'a'), '2', 'root'), 'a'), 'd')),
        'm'
      );
    {
      let e = n,
        i = 'x',
        r = 0,
        o = B(n, n, 'm'),
        s = n;
      for (let n = 3; r <= t; n += 2)
        for (
          i = e,
            s = B(s, o, 'm'),
            e = B(e, B(s, String(n), 'd'), (n - 1) % 4 ? 's' : 'a');
          i[r] === e[r] && r <= t;
          r++
        );
      return e;
    }
  }
  function S(n, e = 10) {
    if (!(this instanceof S)) return new S(n, e);
    if (n instanceof S) return n.clone();
    (n = g(n)), (e = parseInt(e)), b(n, e, "'constructor()'"), (n = m(n));
    const i = this;
    (i.n = n),
      (i.b = e),
      (i.f = n.indexOf('.') + 1),
      (i.s = '-' === n[0]),
      (i.round = function (n = 1, e = !1) {
        const r = (n) => {
            '.' == u[n]
              ? r(n - 1)
              : S.getNumber(u[n]) + 1 == s
              ? ((u[n] = '0'), n > 0 ? r(n - 1) : u.unshift('1'))
              : (u[n] = l[S.getNumber(u[n]) + 1]);
          },
          o = i.s ? '-' : '',
          s = i.b;
        let u = i.n.split('');
        if (('-' === o && u.shift(), !i.isFinite())) return i.clone();
        ((n = Math.min(n, t)) < 0 || isNaN(n)) &&
          d(
            "'round()'",
            'precision argument should be a number higher than -1'
          );
        const c = u.indexOf('.');
        return void 0 !== u[c + 1 + n] && i.f
          ? (s - !!e - S.getNumber(u[c + 1 + n]) <= (s - !!e) / 2 && r(c + n),
            u.splice(u.indexOf('.') + 1 + n),
            !n && u.splice(-1),
            new S(o + u.join(''), i.b))
          : i.clone();
      }),
      (i.toFixed = function (n = i.n.split('.').concat('')[1].length, e = !1) {
        if (!i.isFinite()) return i.n;
        ((n = Math.min(n, t)) < 0 || isNaN(n)) &&
          d(
            "'toFixed()'",
            'precision argument should be a number higher than -1'
          );
        const r = i.round(n, e),
          [o, s] = r.n.split('.').concat('');
        return o + '.' + s.padEnd(n, '0');
      }),
      (i.trunc = function () {
        return new S(i.n.split('.')[0], i.b);
      }),
      (i.toPrecision = function (n = i.abs().n.length - (i.f ? 1 : 0), e = !1) {
        if (!i.isFinite()) return i.n;
        ((n = Math.min(n, i.abs().trunc().n.length + t)) < 1 || isNaN(n)) &&
          d(
            "'toPrecision()'",
            'precision argument should be a number higher than 0'
          );
        let r = i.abs().n,
          o = r.indexOf('.') + 1;
        return (
          o ? o-- : (o = r.length),
          (r =
            (r = new S('0.' + r.replace('.', ''), i.b)
              .round(n, e)
              .n.slice(2)
              .padEnd(o > n ? o : n, '0')).substring(0, o) +
            '.' +
            r.slice(o)),
          (o > n ? o : n > r.length - 1)
            ? new S((i.s ? '-' : '') + r, i.b).toExp()
            : ('.' === r[r.length - 1] && (r = r.substring(0, r.length - 1)),
              (i.s ? '-' : '') + r)
        );
      }),
      (i.toSignificantDigits = i.toSD = function (
        n = i.abs().n.length - (i.f ? 1 : 0),
        e = !1
      ) {
        if (!i.isFinite()) return i.n;
        ((n = Math.min(n, i.abs().trunc().n.length + t)) < 1 || isNaN(n)) &&
          d(
            "'toSignificantDigits()'",
            'precision argument should be a number higher than 0'
          );
        let r = i.abs().n,
          o = r.indexOf('.') + 1;
        return (
          o ? o-- : (o = r.length),
          (r = new S('0.' + r.replace('.', ''), i.b)
            .round(n, e)
            .n.slice(2)
            .padEnd(o, '0')),
          m((i.s ? '-' : '') + r.substring(0, o) + '.' + r.slice(o))
        );
      }),
      (i.higherThan = function (n, e = 10) {
        return 1 == p(i.round(t).toB().n, new S(n, e).round(t).toB().n);
      }),
      (i.lowerThan = function (n, e = 10) {
        return -1 == p(i.round(t).toB().n, new S(n, e).round(t).toB().n);
      }),
      (i.equalTo = function (n, e = 10) {
        return !p(i.round(t).toB().n, new S(n, e).round(t).toB().n);
      }),
      (i.newValue = function (n, e = i.b) {
        return (
          (n = new S(n, e)),
          Object.getOwnPropertyNames(n).forEach((e) => (i[e] = n[e])),
          i
        );
      }),
      (i.add = function (n, e = 10) {
        return (
          (n = new S(n, e).toB()),
          S.someZero(i, n) || S.someInf(i, n)
            ? new S(i.toB() + n, i.b)
            : new S(B(i.toB().n, n.n, 'a')).toB(i.b).round(t)
        );
      }),
      (i.subtract = function (n, e = 10) {
        return (
          (n = new S(n, e).toB()),
          S.someZero(i, n) || S.someInf(i, n)
            ? new S(i.toB() - n, i.b)
            : new S(B(i.toB().n, n.n, 's')).toB(i.b).round(t)
        );
      }),
      (i.multiply = function (n, e = 10) {
        return (
          (n = new S(n, e).toB()),
          S.someZero(i, n) || S.someInf(i, n)
            ? new S(i.toB() * n, i.b)
            : new S(B(i.toB().n, n.n, 'm')).toB(i.b).round(t)
        );
      }),
      (i.divide = function (n, e = 10) {
        return (
          (n = new S(n, e).toB()),
          S.someZero(i, n) || S.someInf(i, n)
            ? new S(i.toB() / n, i.b)
            : new S(B(i.toB().n, n.n, 'd')).toB(i.b).round(t)
        );
      }),
      (i.module = function (n, e = 10) {
        return (
          (n = new S(n, e).toB()),
          S.someZero(i, n) || S.someInf(i, n)
            ? new S(i.toB() % n, i.b)
            : new S(B(i.toB().n, n.n, 'mod')).toB(i.b).round(t)
        );
      }),
      (i.pow = function (n, e = 10) {
        return (
          (n = new S(n, e).toB()),
          S.someZero(i, n) || S.someInf(i, n)
            ? new S(Math.pow(i.toB(), n), i.b)
            : new S(B(i.toB().n, n.n, 'pow')).toB(i.b).round(t)
        );
      }),
      (i.root = function (n, e = 10) {
        if (((n = new S(n, e).toB()), S.someZero(i, n) || S.someInf(i, n)))
          return new S(Math.pow(i.toB(), 1 / n), i.b);
        if (i.s) return new S('NaN', i.b);
        const r = (n = n.n).indexOf('.') + 1 || n.length,
          o = n.length - r;
        n = n.replace('.', '');
        const s = t;
        S.setDecimals(t + (Math.floor((1 * t) / 100) || 2));
        let u = B(i.n, n, 'root');
        const c = new S(
          (u = B(u, '1' + '0'.repeat(o >= 0 ? o : 0), 'pow'))
        ).toB(i.b);
        return S.setDecimals(s), c.round(t);
      }),
      (i.sqrt = function () {
        return i.root(2);
      }),
      (i.cbrt = function () {
        return i.root(3);
      }),
      (i.fact = function () {
        if (!i.isFinite()) return i.clone();
        return new S(
          (function (n) {
            let e = '1';
            for (let t = '2'; p(t, n) < 1; t = String(BigInt(t) + BigInt('1')))
              e = String(BigInt(e) * BigInt(t));
            return e;
          })(i.toB().trunc().n)
        ).toB(i.b);
      }),
      (i.toDec = function () {
        return i.toB();
      }),
      (i.toHex = function () {
        return i.toB(16);
      }),
      (i.toBin = function () {
        return i.toB(2);
      }),
      (i.toOct = function () {
        return i.toB(8);
      }),
      (i.valueOf = function () {
        return i.n;
      }),
      (i.toString = function () {
        return i.isZero() ? i.abs().n : i.n;
      }),
      (i.base = function () {
        return i.b;
      }),
      (i.sign = function () {
        return i.isZero() || i.isNaN() ? +i : i.s ? -1 : 1;
      }),
      (i.toIEEE754 = function (n = !1) {
        let e = i.toB(2).n,
          t = '0';
        const r = n ? 52 : 23,
          o = n ? 11 : 8;
        if (('-' === e[0] && (t = '1') && (e = e.slice(1)), i.isNaN()))
          return {
            sign: '1',
            exponent: '1'.repeat(o),
            mantissa: '1'.repeat(r),
          };
        if (1 == p(e, n ? a : f))
          return { sign: t, exponent: '1'.repeat(o), mantissa: '0'.repeat(r) };
        const s = i.f ? e.indexOf('.') : e.length,
          u = (e = e.replace('.', '')).indexOf('1');
        let c = new S(u >= 0 ? s - u - 1 + (n ? 1023 : 127) : 0);
        if (c.isNeg()) (c = '0'), (e = '0');
        else {
          for (c = c.toB(2).n; e.indexOf('1') > 0; ) e = e.slice(1);
          e = e.slice(1);
        }
        return {
          sign: t,
          exponent: c.padStart(o, '0').slice(0, o),
          mantissa: e.padEnd(r, '0').slice(0, r),
        };
      }),
      (i.clone = function () {
        return new S(i.n, i.b);
      }),
      (i.toNumber = function () {
        return +i.toB();
      }),
      (i.abs = function () {
        return new S(i.s ? i.n.slice(1) : i.n, i.b);
      }),
      (i.floor = function () {
        return i.s ? i.abs().ceil().neg() : new S(i.n.split('.')[0], i.b);
      }),
      (i.ceil = function () {
        return i.f
          ? i.s
            ? i.abs().floor().neg()
            : new S(
                String(
                  BigInt(new S(i.n.split('.')[0], i.b).toB().n) + BigInt('1')
                )
              ).toB(i.b)
          : i.clone();
      }),
      (i.clamp = function (n, e) {
        return S.min(S.max(i, n), e);
      }),
      (i.neg = function () {
        return new S(i.s ? i.n.slice(1) : '-' + i.n, i.b);
      }),
      (i.isNeg = function () {
        return i.s;
      }),
      (i.isPos = function () {
        return !i.s;
      }),
      (i.isInt = function () {
        return !i.f;
      }),
      (i.isFloat = function () {
        return i.f;
      }),
      (i.isBase = function (n = 10) {
        return i.b === parseInt(n);
      }),
      (i.isZero = function () {
        return '0' === i.abs().n;
      }),
      (i.isFinite = function () {
        return 'Infinity' !== i.abs().n && !i.isNaN();
      }),
      (i.isNaN = function () {
        return 'NaN' === i.n;
      }),
      (i.toExponential = i.toExp = function (n = -1) {
        if (!i.isFinite()) return i.n;
        let e = i.abs().n,
          t = (i.f ? e.indexOf('.') : e.length) - 1;
        for (e = e.replace('.', ''); '0' === e[0] && 1 !== e.length; )
          (e = e.slice(1)) && t--;
        return (
          (n = Math.floor(n)) < 0 ? (n = e.length) : n++,
          (e = e.padEnd(n, '0')),
          (i.s ? '-' : '') +
            e[0] +
            '.' +
            e.slice(1, n) +
            ' e' +
            (t > -1 ? '+' + t : t)
        );
      }),
      (i.ln = function () {
        if (i.isZero()) return new S('-Infinity', i.b);
        if (i.s) return new S('NaN', i.b);
        if (!i.isFinite()) return i.clone();
        const n = t;
        S.setDecimals(t + (Math.floor((1 * t) / 100) || 2));
        const e = new S(h(i.toB().n)).toB(i.b);
        return S.setDecimals(n), e.round(t);
      }),
      (i.log = function (n = 10) {
        if (1 != p(i.n, '0')) return new S('NaN', i.b);
        if (!i.isFinite()) return i.clone();
        const e = t;
        S.setDecimals(t + (Math.floor((1 * t) / 100) || 2));
        const r = new S(B(h(i.toB().n), h(String(n)), 'd')).toB(i.b);
        return S.setDecimals(e), r.round(t);
      }),
      (i.exp = function () {
        if (!i.isFinite()) return i.clone();
        const n = t;
        S.setDecimals(t + (Math.floor((1 * t) / 100) || 2));
        const e = new S(w(i.toB().n)).toB(i.b);
        return S.setDecimals(n), e.round(t);
      }),
      (i.cosine = i.cos = function () {
        if (i.isZero()) return new S('1', i.b);
        if (!i.isFinite()) return new S('NaN', i.b);
        const n = t,
          e = i.toB().n;
        S.setDecimals(t + (Math.floor((1 * t) / 100) || 2));
        const o = new S(
          N(r ? B(B(B(e, c, 'm'), '180', 'd'), '180', 'mod') : B(e, c, 'mod'))
        ).toB(i.b);
        return S.setDecimals(n), o.round(t);
      }),
      (i.sine = i.sin = function () {
        if (i.isZero()) return i.clone();
        if (!i.isFinite()) return new S('NaN', i.b);
        const n = t,
          e = i.toB().n;
        S.setDecimals(t + (Math.floor((1 * t) / 100) || 2));
        const o = new S(
          x(r ? B(B(B(e, c, 'm'), '180', 'd'), '180', 'mod') : B(e, c, 'mod'))
        ).toB(i.b);
        return S.setDecimals(n), o.round(t);
      }),
      (i.tangent = i.tan = function () {
        if (i.isZero()) return i.clone();
        if (!i.isFinite()) return new S('NaN', i.b);
        const n = t,
          e = i.toB().n;
        S.setDecimals(t + (Math.floor((1 * t) / 100) || 2));
        const o = r
          ? B(B(B(e, c, 'm'), '180', 'd'), '180', 'mod')
          : B(e, c, 'mod');
        let s = N(o),
          [u, l] = s.split('.').concat('x');
        for (l = l.slice(0, n); '0' === l[l.length - 1]; ) l = l.slice(0, -1);
        if (!l) {
          if ('0' === u) return new S('Infinity', i.b);
          if ('-0' === u) return new S('-Infinity', i.b);
        }
        const f = new S(B(x(o), s, 'd')).toB(i.b);
        return S.setDecimals(n), f.round(t);
      }),
      (i.inverseCosine = i.acos = function () {
        if (i.isNaN() || i.isZero()) return i.clone();
        if (1 == p(i.abs().n, '1')) return new S('NaN', i.b);
        const n = t,
          e = i.toB().n;
        S.setDecimals(t + (Math.floor((3 * t) / 100) || 2));
        const o = B(
            B('0.5', c, 'm'),
            B(
              '2',
              I(
                B(
                  e,
                  B('1', B(B('1', B(e, e, 'm'), 's'), '2', 'root'), 'a'),
                  'd'
                )
              ),
              'm'
            ),
            's'
          ),
          s = new S(r ? B(B('180', o, 'm'), c, 'd') : o).toB(i.b);
        return S.setDecimals(n), s.round(t);
      }),
      (i.inverseSine = i.asin = function () {
        if (i.isNaN() || i.isZero()) return i.clone();
        if (1 == p(i.abs().n, '1')) return new S('NaN', i.b);
        const n = t,
          e = i.toB().n;
        S.setDecimals(t + (Math.floor((3 * t) / 100) || 3));
        const o = B(
            '2',
            I(
              B(e, B('1', B(B('1', B(e, e, 'm'), 's'), '2', 'root'), 'a'), 'd')
            ),
            'm'
          ),
          s = new S(r ? B(B('180', o, 'm'), c, 'd') : o).toB(i.b);
        return S.setDecimals(n), s.round(t);
      }),
      (i.inverseTangent = i.atan = function () {
        if (i.isNaN() || i.isZero()) return i.clone();
        if (!i.isFinite()) return new S(B(c, '2', 'd'), i.b);
        const n = t,
          e = i.toB().n;
        S.setDecimals(t + (Math.floor((3 * t) / 100) || 3));
        const o = I(e),
          s = new S(r ? B(B('180', o, 'm'), c, 'd') : o).toB(i.b);
        return S.setDecimals(n), s.round(t);
      }),
      (i.toBase = i.toB = function (n = 10) {
        if (((n = parseInt(n)), i.b === n || !i.isFinite())) return i.clone();
        const e = i.abs().n;
        b('0', n, "'parseBase()'");
        const r = t;
        S.setDecimals(t + (Math.floor((1 * t) / 100) || 2));
        let o = '1',
          s =
            10 === i.b
              ? e.split('.')[0]
              : e
                  .split('.')[0]
                  .split('')
                  .reverse()
                  .reduce((n, e) => {
                    const t = String(
                      BigInt(n) + BigInt(S.getNumber(e)) * BigInt(o)
                    );
                    return (o = String(BigInt(o) * BigInt(i.b))), t;
                  }, 0),
          u = [];
        for (; p(s, String(n)) > -1; ) {
          const e = String(BigInt(s) % BigInt(n));
          u.unshift(l[e]), (s = String(BigInt(s) / BigInt(n)));
        }
        u.unshift(l[s]), (o = String(i.b));
        let c = i.f
            ? 10 === i.b
              ? '0.' + e.split('.')[1]
              : e
                  .split('.')[1]
                  .split('')
                  .reduce((n, e) => {
                    const t = B(n, B(String(S.getNumber(e)), o, 'd'), 'a');
                    return (o = String(BigInt(o) * BigInt(i.b))), t;
                  }, '0')
            : '0',
          f = t + 1,
          a = '',
          d = '1',
          g = c.split('.').concat('')[1].length;
        for (c = c.replace('.', ''); f && d && '0' !== c; )
          (d =
            (c = String(BigInt(c.slice(-g)) * BigInt(n))).slice(0, -g) || '0'),
            (a += l[d]),
            f--;
        const m = new S((i.s ? '-' : '') + u.join('') + '.' + a, n);
        return S.setDecimals(r), m.round(t);
      });
  }
  (S.setDecimals = (n) => {
    i = '0'.repeat((t = n) + 1);
  }),
    (S.setAngle = (n = 1) => {
      'degrees' !== (n = n.toLowerCase()) &&
        'radians' !== n &&
        d("'setAngle()'", 'Invalid unit ' + n),
        (r = 'degrees' === n);
    }),
    (S.getNumber = (n) => l.indexOf(n)),
    (S.someNan = (...n) => n.some((n) => n.isNaN())),
    (S.someInf = (...n) => n.some((n) => !n.isFinite())),
    (S.someZero = (...n) => n.some((n) => n.isZero())),
    (S.allInf = (...n) => n.every((n) => !n.isFinite())),
    (S.allZero = (...n) => n.every((n) => n.isZero())),
    (S.difSign = (n, e) => n.s !== e.s),
    (S.max = (...n) => {
      return n
        .map((n) => new S(n.n || n, n.b || 10).toB())
        .reduce((n, e) => (1 == p(e.n, n.n) ? e : n), new S('-Infinity'));
    }),
    (S.min = (...n) => {
      return n
        .map((n) => new S(n.n || n, n.b || 10).toB())
        .reduce((n, e) => (-1 == p(e.n, n.n) ? e : n), new S('Infinity'));
    }),
    (S.radians = (e, t = e.b || 10) => (
      (n = new S(e, t).toB().n), new S(B(B(n, c, 'm'), '180', 'd')).toB(t)
    )),
    (S.Ln10 = new S(s)),
    (S.Ln2 = new S(u)),
    (S.Pi = new S(c)),
    (S.e = new S(
      '2.7182818284590452353602874713526624977572470936999595749669676277240766303535475945713821785251664274274663919320030599218174135966290435729003342952605956307381323286279434907632338298807531952510190115738341879307021540891499348841675092447614606680822648001684774118537423454424371075390777449920695517027618386062613313845830007520449338265602976067371132007093287091274437470472306969772093101416928368190255151086574637721112523897844250569536967707854499699679468644549059879316368892300987931277361782154249992295763514822082698951936680331825288693984964651058209392398294887933203625094431173012381970684161403970198376793206832823764648042953118023287825098194558153017567173613320698112509961818815930416903515988885193458072738667385894228792284998920868058257492796104841984443634632449684875602336248270419786232090021609902353043699418491463140934317381436405462531520961836908887070167683964243781405927145635490613031072085103837505101157477041718986106873969655212671546889570350354021234078498193343210681'
    )),
    'function' == typeof define && define.amd
      ? define(function () {
          return S;
        })
      : 'undefined' != typeof module && module.exports
      ? ('function' == typeof Symbol &&
          'symbol' == typeof Symbol.iterator &&
          ((P[Symbol.for('nodejs.util.inspect.custom')] = P.toString),
          (P[Symbol.toStringTag] = 'Base')),
        (module.exports = S))
      : (e ||
          (e =
            'undefined' != typeof self && self && self.self == self
              ? self
              : window),
        (S.noConflict = () => ((e.Base = o), S)),
        (e.Base = S));
})(this);
