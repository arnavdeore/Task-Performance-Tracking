// Slate: Indian holidays and bank closures used by the Dashboard calendar.
//
// Two tables on purpose:
//   HOL_FIXED  - same calendar date every year (national days, Christmas, bank annual closing).
//   HOL_BY_YEAR - festivals that move each year. Only the years listed here are known;
//                 a year that is missing simply shows no festival holidays, which is
//                 better than showing last year's dates. ADD A NEW YEAR EVERY DECEMBER.
//
// Source for 2026: RBI / bank holiday lists cross-checked against the India Post and
// central government holiday lists (October 2026). State holidays differ, so this is the
// nationally relevant set plus Maharashtra-relevant days. Confirm against your own
// state's list before relying on it.
//
// Banks are also closed on every Sunday and on the SECOND and FOURTH Saturday of each
// month - that is computed, not listed, by isBankSaturday() below.

export const HOL_FIXED = {
  '01-01': 'New Year, banks closed',
  '01-14': 'Makar Sankranti',
  '01-26': 'Republic Day',
  '04-01': 'Bank annual closing',
  '04-14': 'Dr Ambedkar Jayanti',
  '05-01': 'Maharashtra Day, May Day and Buddha Purnima',
  '08-15': 'Independence Day',
  '10-02': 'Gandhi Jayanti',
  '12-25': 'Christmas'
};

export const HOL_BY_YEAR = {
  2026: {
    '2026-01-23': 'Vasant Panchami',
    '2026-02-15': 'Maha Shivaratri',
    '2026-03-03': 'Holi',
    '2026-03-20': 'Gudi Padwa and Ugadi',
    '2026-03-21': 'Id-ul-Fitr',
    '2026-03-27': 'Ram Navami',
    '2026-03-31': 'Mahavir Jayanti',
    '2026-04-03': 'Good Friday',
    '2026-05-27': 'Bakrid',
    '2026-06-26': 'Muharram',
    '2026-08-25': 'Eid-e-Milad',
    '2026-08-28': 'Raksha Bandhan',
    '2026-09-04': 'Janmashtami',
    '2026-09-15': 'Ganesh Chaturthi',
    '2026-10-19': 'Maha Ashtami',
    '2026-10-20': 'Maha Navami',
    '2026-10-21': 'Vijaya Dashami',
    '2026-10-26': 'Valmiki Jayanti',
    '2026-11-08': 'Diwali',
    '2026-11-09': 'Diwali holiday',
    '2026-11-11': 'Bhai Dooj',
    '2026-11-15': 'Chhath Puja',
    '2026-11-24': 'Guru Nanak Jayanti'
  }
};

/** iso: 'YYYY-MM-DD'. Returns the holiday name, or '' when it is an ordinary day. */
export function holidayName(iso) {
  const year = Number(iso.slice(0, 4));
  const movable = HOL_BY_YEAR[year] || {};
  return movable[iso] || HOL_FIXED[iso.slice(5)] || '';
}

/** True when banks are shut for the second or fourth Saturday of the month. */
export function isBankSaturday(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  if (new Date(y, m - 1, d).getDay() !== 6) return false;
  const nth = Math.ceil(d / 7);
  return nth === 2 || nth === 4;
}

/** 'second' | 'fourth' | '' - for the wording in the calendar note. */
export function bankSaturdayWhich(iso) {
  if (!isBankSaturday(iso)) return '';
  return Math.ceil(Number(iso.slice(8)) / 7) === 2 ? 'second' : 'fourth';
}

/** Every holiday in one month, for the chips under the calendar grid. */
export function holidaysInMonth(year, monthIndex) {
  const days = new Date(year, monthIndex + 1, 0).getDate();
  const out = [];
  for (let d = 1; d <= days; d++) {
    const iso = year + '-' + String(monthIndex + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0');
    const name = holidayName(iso);
    if (name) out.push({ date: iso, day: d, name });
  }
  return out;
}
