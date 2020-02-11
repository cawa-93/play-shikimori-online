export interface Anime365Context {
  id: number;
  isActive: boolean | number;
}



export class Anime365Item {
  public readonly id: Anime365Context['id'];
  public readonly isActive: boolean;



  constructor(context: Anime365Context) {
    this.id = context.id;
    this.isActive = !!context.isActive;
  }
}
