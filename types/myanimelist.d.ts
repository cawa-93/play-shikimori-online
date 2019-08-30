declare namespace myanimelist {

    interface VideoUrl {
    }

    interface Episode {
        episode_id: number;
        title: string;
        title_japanese: string;
        title_romanji: string;
        aired: Date;
        filler: boolean;
        recap: boolean;
        video_url: VideoUrl;
        forum_url: string;
    }

    namespace api {
        interface EpisodeCollection {
            request_hash: string;
            request_cached: boolean;
            request_cache_expiry: number;
            episodes_last_page: number;
            episodes: Episode[];
        }
    }

}
