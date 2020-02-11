export interface AuthorContext {
  authorsList: string[];
  authorsSummary: string;
}



export class Author {



  get id() {
    return this.list.map(Author.clearName).join('');
  }



  public static clearName(name: string) {
    return name.trim().toLowerCase();
  }


  public readonly list: string[];
  public readonly summary: string;



  constructor(context: AuthorContext) {
    this.list = context.authorsList;
    this.summary = context.authorsSummary;

    Object.freeze(this);
  }

}
