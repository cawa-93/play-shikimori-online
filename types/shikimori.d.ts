// tslint:disable-next-line:no-namespace
declare namespace shikimori {

    interface Image {
        original: string;
        preview: string;
        x96: string;
        x48: string;
    }

    interface RatesScoresStat {
        name: number;
        value: number;
    }

    interface RatesStatusesStat {
        name: string;
        value: number;
    }

    interface Genre {
        id: number;
        name: string;
        russian: string;
        kind: string;
    }

    interface Studio {
        id: number;
        name: string;
        filtered_name: string;
        real: boolean;
        image?: any;
    }

    interface Video {
        id: number;
        url: string;
        image_url: string;
        player_url: string;
        name: string;
        kind: string;
        hosting: string;
    }

    interface Screenshot {
        original: string;
        preview: string;
    }

    interface UserRate {
        id?: number;
        score?: number;
        status?: string;
        text?: any;
        episodes?: number;
        chapters?: any;
        volumes?: any;
        text_html?: any;
        rewatches?: number;
    }

    interface Anime {
        id: number;
        name: string;
        russian: string;
        image: Image;
        url: string;
        kind: string;
        status: string;
        episodes: number;
        episodes_aired: number;
        aired_on: string;
        released_on: string;
        rating: string;
        english: string[];
        japanese: string[];
        synonyms: string[];
        license_name_ru?: any;
        duration: number;
        score: string;
        description: string;
        description_html: string;
        description_source?: any;
        franchise: string;
        favoured: boolean;
        anons: boolean;
        ongoing: boolean;
        thread_id: number;
        topic_id: number;
        myanimelist_id: number;
        rates_scores_stats: RatesScoresStat[];
        rates_statuses_stats: RatesStatusesStat[];
        updated_at: Date;
        next_episode_at: Date;
        genres: Genre[];
        studios: Studio[];
        videos: Video[];
        screenshots: Screenshot[];
        user_rate?: UserRate;
    }

    interface Avatar {
        x160?: string;
        x148?: string;
        x80?: string;
        x64?: string;
        x48?: string;
        x32?: string;
        x16?: string;
    }

    interface User {
        id: number;
        nickname: string;
        avatar?: string;
        image?: Avatar;
        last_online_at: Date;
        name?: string;
        sex?: string;
        website?: string;
        birth_on?: any;
        locale: string;
    }

    interface FranchiseLink {
        id: number;
        source_id: number;
        target_id: number;
        source: number;
        target: number;
        weight: number;
        relation: string;
    }

    interface FranchiseNode {
        id: number;
        date: number;
        name: string;
        image_url: string;
        url: string;
        year: number;
        kind: string;
        weight: number;
        series?: number;
        episodeInt?: number;
    }

    interface Oauth {
        access_token?: string;
        refresh_token: string;
        token_type: 'Bearer';
        created_at: number;
        expires_in: number;
    }

    interface Comment {
        id: number;
        user_id: number;
        commentable_id: number;
        commentable_type: string;
        body: string;
        html_body: string;
        created_at: string;
        created_at_relative?: string;
        updated_at: Date;
        is_offtopic: boolean;
        is_summary: boolean;
        can_be_edited: boolean;
        user: User;
    }

    interface Franchise {
        links: FranchiseLink[];
        nodes: FranchiseNode[];
    }


    export interface Forum {
        id: number;
        position: number;
        name: string;
        permalink: string;
        url: string;
    }

    export interface Linked {
        id: number;
        name: string;
        russian?: any;
        image: Image;
        url: string;
        kind: string;
        status: string;
        episodes: number;
        episodes_aired: number;
        aired_on?: any;
        released_on?: any;
    }

    export interface Topic {
        id: number;
        topic_title: string;
        body?: string;
        html_body?: string;
        html_footer?: string;
        created_at: Date;
        comments_count: number;
        forum: Forum;
        user: User;
        type: string;
        linked_id: number;
        linked_type: string;
        linked: Linked;
        viewed: boolean;
        last_comment_viewed?: any;
        event?: string;
        episode?: number;
    }

    export interface EpisodeNotification {
        id: number;
        anime_id: number;
        episode: number;
        is_raw: boolean;
        is_subtitles: boolean;
        is_fandub: boolean;
        is_anime365: boolean;
        topic_id: number;
    }

}
