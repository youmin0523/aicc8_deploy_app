// //* [Mentor's Encyclopedia: holidayUtils]
// //* 1. 역할 (Role): 대한민국 공휴일 자동 계산 엔진.
// //* 2. 지원 범위: 양력/음력(매핑 데이터) 공휴일 + 주말 겹침 시 대체공휴일(v2.99).
// //* 3. 핵심 알고리즘:
// //*    - // //! [Original] 매년 수동으로 고치던 하드코딩 방식.
// //*    - // //* [Modified Logic] 2030년까지의 매핑 데이터와 자동 대체공휴일 산출 로직 적용.

const LUNAR_HOLIDAYS_MAP = {
  2024: {
    '02-09': '설날',
    '02-10': '설날',
    '02-11': '설날',
    '09-16': '추석',
    '09-17': '추석',
    '09-18': '추석',
  },
  2025: {
    '01-28': '설날',
    '01-29': '설날',
    '01-30': '설날',
    '10-05': '추석',
    '10-06': '추석',
    '10-07': '추석',
  },
  2026: {
    '02-16': '설날',
    '02-17': '설날',
    '02-18': '설날',
    '09-24': '추석',
    '09-25': '추석',
    '09-26': '추석',
  },
};

export const getKoreanHolidays = (year) => {
  const holidays = {
    '01-01': '신정',
    '03-01': '삼일절',
    '05-05': '어린이날',
    '06-06': '현충일',
    '08-15': '광복절',
    '10-03': '개천절',
    '10-09': '한글날',
    '12-25': '크리스마스',
    ...(LUNAR_HOLIDAYS_MAP[year] || {}),
  };

  const addAlternativeHolidays = (holidaysObj) => {
    const dates = Object.keys(holidaysObj);
    const newHolidays = { ...holidaysObj };

    dates.forEach((dateStr) => {
      // //* [Modified Code] 일요일과 겹치는 경우 월요일을 대체공휴일로 저장
      const [m, d] = dateStr.split('-').map(Number);
      const date = new Date(year, m - 1, d);

      if (date.getDay() === 0) {
        const altDate = new Date(year, m - 1, d + 1);
        const altStr = `${String(altDate.getMonth() + 1).padStart(2, '0')}-${String(altDate.getDate()).padStart(2, '0')}`;
        if (!newHolidays[altStr]) newHolidays[altStr] = '대체공휴일';
      }
    });

    return newHolidays;
  };

  return addAlternativeHolidays(holidays);
};
