// import {Author} from '@/classes/Authors';
//
//
// export interface TranslationContext {
//   id: number;
//   addedDateTime: string;
//   activeDateTime: string;
//   authorsList: string[];
//   fansubsTranslationId: number;
//   isActive: number;
//   priority: number;
//   qualityType: string;
//   type: string;
//   typeKind: string;
//   typeLang: string;
//   updatedDateTime: string;
//   title: string;
//   seriesId: number;
//   episodeId: number;
//   countViews: number;
//   url: string;
//   embedUrl: string;
//   authorsSummary: string;
//   duration: string;
//   width: number;
//   height: number;
// }
//
//
//
// class Translation {
//   public readonly id: TranslationContext['id'];
//   public readonly isActive: boolean;
//   public readonly priority: TranslationContext['priority'];
//   public readonly qualityType: TranslationContext['qualityType'];
//   public readonly typeKind: TranslationContext['typeKind'];
//   public readonly typeLang: TranslationContext['typeLang'];
//   public readonly episodeId: TranslationContext['episodeId'];
//   public readonly author: Author;
//
//
//
//   constructor(context: TranslationContext) {
//     this.id = context.id;
//     this.isActive = !!context.isActive;
//     this.priority = context.priority;
//     this.qualityType = context.qualityType;
//     this.typeKind = context.typeKind;
//     this.typeLang = context.typeLang;
//     this.episodeId = context.episodeId;
//     this.author = new Author(context);
//
//     Object.freeze(this);
//   }
//
//
//
//   get type() {
//     return this.typeLang + this.typeKind;
//   }
// }
