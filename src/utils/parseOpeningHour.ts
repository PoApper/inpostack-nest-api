import * as moment from 'moment';
import 'moment-timezone';

export function parseOpeningHour(openingJSON: object, currTime: Date) {
  const moment_ = moment(currTime).tz('Asia/Seoul');
  const dayOfWeek: string = moment_.locale('ko').format('ddd'); // 월, 화, ...
  const hourAndMinute: string = moment_.format('HH:MM');

  // determine target key
  let targetKey;
  const keys = Object.keys(openingJSON);

  if (keys.includes('매일')) {
    targetKey = '매일';
  } else if (keys.includes(dayOfWeek)) {
    targetKey = dayOfWeek;
  } else {
    // 전체 키를 순회
    for (const key of keys) {
      if (key.includes(dayOfWeek)) {
        targetKey = key;
      }
    }
  }

  const openingHourArr = openingJSON[targetKey];

  for (const openingHour of openingHourArr) {
    const startTime: string = openingHour['startTime'];
    const endTime: string = openingHour['endTime'];

    // 운영 시간에 포함되는지 체크
    if (startTime <= hourAndMinute && hourAndMinute <= endTime) {
      return 'open';
    }
  }
  return 'close';
}
