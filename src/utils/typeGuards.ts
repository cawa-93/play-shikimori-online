import {SeriesTypes} from '@/interfaces/Series';



export function isType(t: string): t is SeriesTypes {
  return Object.values(SeriesTypes).includes(t as SeriesTypes) !== undefined;
}
