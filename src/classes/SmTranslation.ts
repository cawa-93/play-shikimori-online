import type {Translation} from '@/interfaces/Translation';
import {SmTranslationResponse} from '@/interfaces/smotret-anime-api';



export class SmTranslation implements Translation {
  public readonly id: number;



  constructor(props: SmTranslationResponse) {
    this.id = props.id;
  }


}
