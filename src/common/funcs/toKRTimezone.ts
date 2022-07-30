import { tz } from 'moment-timezone';

export function toKRTimeZone(time: Date): string {
  const time1 = tz(time.toISOString(), 'Asia/Seoul');
  //console.log(time1);
  return time1.format();
}
