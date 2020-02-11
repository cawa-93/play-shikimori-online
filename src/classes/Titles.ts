export interface TitlesContext {
  ru?: string;
  en?: string;
  ja?: string;
  short?: string;
}



export class Titles {
  private readonly ru?: TitlesContext['ru'];
  private readonly en?: TitlesContext['en'];
  private readonly ja?: TitlesContext['ja'];
  private readonly short?: TitlesContext['short'];



  constructor(context: TitlesContext) {
    this.ru = context.ru;
    this.en = context.en;
    this.ja = context.ja;
    this.short = context.short;

    Object.freeze(this);
  }



  get title() {
    return this.ru || this.en || this.ja || this.short || '';
  }



  get shortTitle() {
    return this.short || '';
  }
}
