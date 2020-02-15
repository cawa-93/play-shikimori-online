import {Series, SeriesTypes} from '@/interfaces/Series';
import {Title} from '@/interfaces/Title';



export class Anime365Series implements Series {



  public static isType(t: string): t is SeriesTypes {
    return Object.values(SeriesTypes).includes(t as SeriesTypes) !== undefined;
  }




  public readonly id: number;
  public readonly title: Title;
  public readonly type: SeriesTypes;



  constructor(context: anime356API.Series) {
    this.id = context.id;

    if (Anime365Series.isType(context.type)) {
      this.type = SeriesTypes[context.type];
    } else {
      throw new Error(`Unexpected series type: ${context.type}. Allowed values: ${Object.values(SeriesTypes)}`);
    }

    this.title = {
      full: context.titles.ru || context.titles.en || context.titles.ja || context.titles.short,
      short: context.titles.short,
    };

    Object.freeze(this);
  }

}

