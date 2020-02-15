// export interface EpisodeContext {
//   id: number;
//   episodeFull: string;
//   episodeInt: string;
//   episodeTitle: string;
//   episodeType: string;
//   firstUploadedDateTime: string;
//   isActive: number;
//   seriesId: number;
// }
//
//
//
// class Episode {
//
//   public readonly id: EpisodeContext['id'];
//   public readonly isActive: boolean;
//   public readonly int: number;
//   public readonly type: EpisodeContext['episodeType'];
//   public readonly title: EpisodeContext['episodeTitle'];
//   public readonly firstUploadedDateTime: EpisodeContext['firstUploadedDateTime'];
//   public readonly seriesId: EpisodeContext['seriesId'];
//
//
//
//   constructor(context: EpisodeContext) {
//     this.id = context.id;
//     this.isActive = !!context.isActive;
//     this.type = context.episodeType;
//
//     this.int = Number(context.episodeInt);
//     this.title = context.episodeTitle;
//     this.firstUploadedDateTime = context.firstUploadedDateTime;
//     this.seriesId = context.seriesId;
//
//     Object.freeze(this);
//   }
// }
