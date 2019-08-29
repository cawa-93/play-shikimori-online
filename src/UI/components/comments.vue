<template>
    <section class="comments-container" v-if="allowComments">
        <div class="display-1 mt-6 mb-4 d-flex topic-title">
            <h2 @click="scrollTo($refs['comments-feed'])"
                class="display-1">
                Обсуждение {{currentEpisode.episodeInt}} серии
            </h2>
            <v-tooltip right transition="slide-x-transition">
                <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        :href="`https://shikimori.one${topic.forum.url}/${topic.linked_type.toLowerCase()}-${topic.linked.id}/${topic.id}`"
                        class="ml-3"
                        icon
                        v-bind="attrs"
                        v-if="topic"
                        v-on="on"
                    >
                        <v-icon>mdi-link</v-icon>
                    </v-btn>
                </template>
                <span>Открыть обсуждение на Шикимори</span>
            </v-tooltip>
        </div>


        <v-progress-linear :indeterminate="true" v-if="layout.loading"></v-progress-linear>
        <template v-else>
            <div
                :aria-busy="layout.moreComments.loading ? 'true' : 'false'"
                class="mt-6 mb-2"
                ref="comments-feed"
                role="feed"
                v-if="topic && comments.items.length"
            >
                <template v-for="comment in comments.items">
                    <v-layout
                        :id="'comment-' + comment.id"
                        :key="comment.id"
                        class="comment-container"
                        tag="article"
                    >
                        <v-list-item-avatar>
                            <img :alt="'Аватар пользователя ' + comment.user.nickname"
                                 :src="comment.user.avatar"
                                 height="40px"
                                 loading="lazy"
                                 width="40px"/>
                        </v-list-item-avatar>

                        <v-list-item-content>
                            <v-list-item-title class="d-flex">
                                <strong>
                                    <a
                                        :href="'https://shikimori.one/' + comment.user.nickname"
                                        role="author"
                                    >@{{ comment.user.nickname }}</a>
                                </strong>
                                <time :datetime="comment.created_at"
                                      :title="comment.created_at"
                                      class="ml-auto"
                                >
                                    <a
                                        :href="'https://shikimori.one/comments/' + comment.id"
                                        @click.prevent="answer(comment)"
                                        class="caption grey--text"
                                    >{{comment.created_at_relative}}</a>
                                </time>
                            </v-list-item-title>
                            <div class="w-100 comment-body" v-html="comment.html_body"></div>
                        </v-list-item-content>
                    </v-layout>
                </template>

                <div class="text-center mt-7">
                    <v-tooltip left nudge-left="36" transition="slide-x-reverse-transition">
                        <template v-slot:activator="{on: left}">
                            <v-tooltip right transition="slide-x-transition">
                                <template v-slot:activator="{on: right, attrs}">
                                    <v-btn
                                        :loading="layout.moreComments.loading"
                                        @click.exact="loadComments"
                                        @click.shift.exact="loadAllComments"
                                        icon
                                        v-bind="attrs"
                                        v-if="comments.items.length < topic.comments_count"
                                        v-on="{
                                            mouseenter: () => {left.mouseenter(); right.mouseenter()},
                                            mouseleave: () => {left.mouseleave(); right.mouseleave()},
                                        }"
                                    >
                                        <v-icon large>mdi-chevron-down</v-icon>
                                    </v-btn>
                                </template>
                                <span>+ Shift — Загрузить все</span>
                            </v-tooltip>
                        </template>
                        <span>Загрузить больше</span>

                    </v-tooltip>

                </div>
            </div>

            <p class="pl-0 blockquote"
               ref="comments-feed"
               v-else>Ты можешь написать комментарий первым, если поторопишься 😁</p>

            <v-form @submit.prevent="createComment" class="mt-7 create-comment-form" v-if="user">
                <v-text-field
                    :disabled="layout.newComment.loading"
                    :loading="layout.newComment.loading"
                    @click:append-outer="createComment"
                    filled
                    label="Опиши свои впечатления от серии"
                    ref="create-comment-field"
                    required
                    v-model.trim="newCommentText"
                >
                    <v-avatar slot="prepend">
                        <img :alt="user.nickname" :src="user.image.x80"/>
                    </v-avatar>

                    <v-btn
                        :disabled="!newCommentText || layout.newComment.loading"
                        :loading="layout.newComment.loading"
                        icon
                        large
                        slot="append-outer"
                        type="submit"
                    >
                        <v-icon>mdi-send</v-icon>
                    </v-btn>
                </v-text-field>
            </v-form>

            <div class="text-center mt-6" v-else>
                <v-btn @click="logIn" class="pl-4" large outlined>
                    <v-icon class="mr-2">mdi-sync</v-icon>
                    Чтобы оставить отзыв необходимо включить синхронизацию
                </v-btn>
            </div>
        </template>
    </section>
</template>


<script lang="ts">
    import {ShikimoriProvider} from '@/helpers/API/ShikimoriProvider';
    import playerStore from '@/UI/store/player';
    import profileStore from '@/UI/store/profile';
    import {Component, Vue, Watch} from 'vue-property-decorator';

    @Component({
        name: 'comments',
    })
    export default class Comments extends Vue {
        public layout = {
            loading: true,
            moreComments: {
                loading: false,
            },
            newComment: {
                loading: false,
            },
        };

        public topic: shikimori.Topic | null = null;

        public comments: {
            items: shikimori.Comment[];
            page: number;
            perPage: number;
        } = {
            items: [],
            page: 1,
            perPage: 20,
        };

        public newCommentText = '';


        get user() {
            return profileStore.user;
        }

        get currentEpisode() {
            return playerStore.currentEpisode;
        }

        get allowComments() {
            return this.currentEpisode && this.currentEpisode.episodeInt % 1 === 0;
        }

        public logIn() {
            return profileStore.getValidCredentials(true);
        }


        public async init() {
            if (!this.currentEpisode) {
                return;
            }

            this.topic = null;
            this.comments.items = [];
            this.comments.page = 1;

            if (!this.allowComments) {
                return;
            }


            this.layout.loading = true;


            try {
                const topics = await ShikimoriProvider.fetch<shikimori.Topic[]>(
                    `/api/animes/${this.currentEpisode.myAnimelist}/topics?kind=episode&episode=${this.currentEpisode.episodeInt}`,
                );

                this.topic = topics[0];
                this.comments.items = [];
                this.comments.page = 1;
            } catch (e) {
                console.error(e);
                e.alert().track();
            }

            await this.loadComments();

            this.layout.loading = false;
        }


        public processComment(comment: shikimori.Comment) {
            comment.html_body = comment.html_body
                .replace(/(href|src)="\//gimu, '$1="https://shikimori.one/')
                .replace(/<img/gimu, '<img loading="lazy" ')
                .replace(/b-quote/gi, 'blockquote primary elevation-2" role="blockquote')
                .replace(/class="smiley"/gi, 'class="smiley" height="32px"')
                .replace(/class="ban"/gi, 'class="ban error elevation-2"')
                .replace(/(b-image|b-img|video-link)/gi, '$1 v-card d-inline-block')
            ;

            comment.created_at_relative = this.getCreatedAtRelative(comment.created_at);

            return comment;
        }


        public getCreatedAtRelative(iso: string) {
            const date = new Date(iso);
            const now = new Date();
            const diff = date.getTime() - now.getTime();

            const msPerMinute = 60 * 1000;
            const msPerHour = msPerMinute * 60;
            const msPerDay = msPerHour * 24;
            const msPerMonth = msPerDay * 30;
            const msPerYear = msPerDay * 365;

            // @ts-ignore
            if (!Intl || !Intl.RelativeTimeFormat || diff / msPerMonth < -1) {
                // @ts-ignore
                return date.toLocaleString([], {dateStyle: 'medium', timeStyle: 'short'});
            }

            // @ts-ignore
            const formatter = new Intl.RelativeTimeFormat();

            if (Math.abs(diff) < msPerMinute) {
                return formatter.format(Math.round(diff / 1000), 'seconds');
            }
            if (Math.abs(diff) < msPerHour) {
                return formatter.format(Math.round(diff / msPerMinute), 'minutes');
            }
            if (Math.abs(diff) < msPerDay) {
                return formatter.format(Math.round(diff / msPerHour), 'hour');
            }
            if (Math.abs(diff) < msPerMonth) {
                return formatter.format(Math.round(diff / msPerDay), 'day');
            }
            if (Math.abs(diff) < msPerYear) {
                return formatter.format(Math.round(diff / msPerMonth), 'month');
            }
            return formatter.format(Math.round(diff / msPerYear), 'year');
        }


        public async loadComments() {
            if (!this.topic) {
                return;
            }

            this.layout.moreComments.loading = true;

            try {
                const comments = await ShikimoriProvider.fetch<shikimori.Comment[]>(
                    `/api/comments/?desc=0&commentable_id=${this.topic.id}&commentable_type=Topic&limit=${this.comments.perPage}&page=${this.comments.page}`,
                    {
                        errorMessage: 'Невозможно загрузить комментарии',
                    },
                );

                if (comments.length > this.comments.perPage) {
                    comments.pop();
                } else if (this.comments.page !== 1) {
                    // this.$ga.event(
                    //     'comments-actions',
                    //     'load-all-comments',
                    //     this.comments.page,
                    // );
                }

                this.comments.items.push(...comments.map((c) => this.processComment(c)));
                this.comments.page += 1;
            } catch (e) {
                console.error(e);
            }

            this.layout.moreComments.loading = false;
        }


        public async createComment() {
            if (!this.user || !this.currentEpisode || !this.newCommentText || this.layout.newComment.loading) {
                return;
            }

            this.layout.newComment.loading = true;


            const auth = await profileStore.getValidCredentials();
            if (!auth) {
                this.layout.newComment.loading = false;
                return;
            }

            const headers = {
                Authorization: `${auth.token_type} ${auth.access_token}`,
            };

            if (!this.topic) {
                let isFandub = false;
                let isRaw = false;
                let isSubtitles = false;

                for (const translation of this.currentEpisode.translations || []) {
                    switch (translation.typeKind) {
                        case 'raw':
                            isRaw = true;
                            break;

                        case 'sub':
                            isSubtitles = true;
                            break;

                        case 'voice':
                            isFandub = true;
                            break;
                    }

                    if (isFandub && isRaw && isSubtitles) {
                        break;
                    }
                }

                try {
                    const episodeNotification = await ShikimoriProvider.fetch<shikimori.EpisodeNotification>(
                        '/api/v2/episode_notifications',
                        {
                            errorMessage: 'Невозможно создать топик обсуждения',
                            method: 'POST',
                            headers,
                            body: JSON.stringify({
                                episode_notification: {
                                    aired_at: new Date(
                                        this.currentEpisode.firstUploadedDateTime,
                                    ).toISOString(),
                                    anime_id: this.currentEpisode.myAnimelist,
                                    episode: this.currentEpisode.episodeInt,
                                    is_anime365: true,
                                    is_fandub: isFandub,
                                    is_raw: isRaw,
                                    is_subtitles: isSubtitles,
                                },
                                token: process.env.VUE_APP_SHIKIMORI_SYSTEM_TOKEN,
                            }),
                        },
                    );

                    if (!episodeNotification || !episodeNotification.topic_id) {
                        this.layout.newComment.loading = false;
                        return;
                    }

                    this.topic = await ShikimoriProvider.fetch<shikimori.Topic>(
                        `/api/topics/${episodeNotification.topic_id}`,
                    );
                } catch (e) {
                    console.error(e);
                }
            }

            if (!this.topic) {
                this.layout.newComment.loading = false;
                return;
            }

            try {
                const newComment = await ShikimoriProvider.fetch<shikimori.Comment>(`/api/comments`, {
                    errorMessage: 'Невозможно создать комментарий',
                    method: 'POST',
                    headers,
                    body: JSON.stringify({
                        comment: {
                            body: this.newCommentText,
                            commentable_id: this.topic.id,
                            commentable_type: 'Topic',
                            is_offtopic: false,
                            is_summary: false,
                        },
                        frontend: false,
                    }),
                });

                if (!newComment || !newComment.id) {
                    this.layout.newComment.loading = false;
                    return;
                }

                this.comments.items.push(this.processComment(newComment));

                this.newCommentText = '';
                this.layout.newComment.loading = false;

                this.topic.comments_count = (this.topic.comments_count || 0) + 1;

                // this.$ga.event('comments-actions', 'post-comment');
            } catch (e) {
                console.error(e);
                e.alert().track();
                this.layout.newComment.loading = false;
            }
        }


        public async loadAllComments(): Promise<void> {
            if (this.topic && this.comments.items.length < this.topic.comments_count) {
                await this.loadComments();
                return this.loadAllComments();
            }
        }


        public answer(comment: shikimori.Comment) {
            this.newCommentText += `[comment=${comment.id}]${comment.user.nickname}[/comment], `;
            return (this.$refs['create-comment-field'] as HTMLInputElement).focus();
        }

        public scrollTo(top: number | HTMLElement) {
            if (typeof top !== 'number') {
                top = top.offsetTop;
            }

            scroll({top, behavior: 'smooth'});
        }


        public mounted() {
            this.init();
            this.$el.addEventListener('click', (event) => {
                const target = event.target as HTMLAnchorElement | null;
                if (target
                    && target.matches('.comment-body a[href*="/comments/"], .comment-body a[href*="/comments/"] *')
                ) {
                    event.preventDefault();
                    const link = target.closest('a[href*="/comments/"]') as HTMLAnchorElement | null;
                    if (!link || !link.href) {
                        return;
                    }

                    const match = link.href.match(/comments\/(\d+)/);
                    if (!match || !match[1]) {
                        return;
                    }

                    const commentId = match[1];

                    const element: HTMLDivElement | null = document.querySelector(`#comment-${commentId}`);
                    if (element) {
                        element.classList.add('shake');
                        this.scrollTo(element);
                        setTimeout(() => element.classList.remove('shake'), 1000);
                    }

                    return;
                }

                if (target && target.matches(
                    '.comment-body .b-spoiler label, .comment-body .b-spoiler .before, .comment-body .b-spoiler .after')
                ) {
                    event.preventDefault();

                    const spoiler = target.closest('.b-spoiler');
                    if (!spoiler) {
                        return;
                    }

                    spoiler.classList.toggle('open');
                }
            });
        }


        @Watch('currentEpisode')
        public currentEpisodeOnChange(newEpisode: anime365.Episode, oldEpisode: anime365.Episode) {
            if (newEpisode.id !== oldEpisode.id) {
                this.init();
            }
        }
    }
</script>


<style>
    .comments-container {
        font-size: 1rem;
    }

    .comment-container .v-avatar {
        align-self: flex-start;
        margin-top: 15px;
    }

    .comment-container .comment-body {
        line-height: 1.65;
        word-break: break-word;
    }

    .comment-container .comment-body .blockquote, .comment-container .comment-body .ban {
        border-radius: 4px;
        position: relative;
        border-left: 8px solid;
        background-color: inherit !important;
        margin: 10px 0;
        padding-right: 16px;
    }

    .comment-container .comment-body .blockquote:after {
        display: inline-block;
        font: normal normal normal 24px/1 "Material Design Icons";
        text-rendering: auto;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        content: "\F27E";
        top: 16px;
        position: absolute;
        right: 16px;
        opacity: 0.3;
        font-size: 1.8em;
    }

    .comment-container .v-list-item__title {
        overflow: visible;
    }

    .comment-container .v-list-item__content {
        border-bottom: 1px solid rgba(0, 0, 0, 0.12);
        overflow: visible;
    }

    .theme--dark .comment-container .v-list-item__content {
        border-color: rgba(255, 255, 255, 0.12);
    }

    .comment-container .comment-body img {
        max-width: 100%;
    }

    .comment-container .smiley {
        vertical-align: middle;
        height: 32px;
    }

    .theme--dark .comment-container .smiley {
        filter: invert(0.8);
    }

    .comment-container .b-replies {
        text-align: right;
        float: right;
    }

    .comment-container .b-replies:before {
        content: attr(data-text-ru);
    }

    .comment-container .bubbled img {
        border-radius: 9999px;
        margin-right: 4px;
        vertical-align: middle;
    }

    .comment-container .b-image {
        display: inline-block;
        position: relative;
    }

    .comment-container .v-card.d-inline-block > img {
        display: block;
    }

    .comment-container .marker {
        background: #e0e0e0;
        color: rgba(0, 0, 0, 0.87);
        position: absolute;
        right: 5px;
        bottom: 5px;
        border-radius: 16px;
        font-size: 14px;
        height: 32px;

        align-items: center;
        display: inline-flex;
        line-height: 20px;
        outline: none;
        padding: 0 12px;
        text-decoration: none;
        transition-duration: 0.28s;
        transition-property: box-shadow, opacity;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        vertical-align: middle;
        opacity: 0.7;
    }

    .comment-container :hover > .marker,
    .comment-container :focus > .marker {
        opacity: 1;
    }

    .theme--dark .comment-container .marker {
        color: #ffffff;
        background: #555;
    }

    .comment-container.shake {
        animation: shake 1s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    }

    .comment-container .b-spoiler {
        display: inline;
    }

    .comment-container .b-spoiler label,
    .comment-container .b-spoiler .content .before,
    .comment-container .b-spoiler .content .after {
        /* color: #176093; */
        cursor: pointer;
        border-bottom: 1px dashed;
        display: inline;
        color: #1976d2 !important;
        caret-color: #1976d2 !important;
    }

    .comment-container .b-spoiler .content {
        display: inline;
    }

    .comment-container .b-spoiler .content .before::before {
        content: "[spoiler] ";
    }

    .comment-container .b-spoiler .content .after::after {
        content: " [/spoiler]";
    }

    .comment-container .b-spoiler:not(.open) .content {
        display: none;
    }

    .comment-container .b-spoiler.open label {
        display: none;
    }

    .comment-container .b-spoiler .content .inner,
    .comment-container .b-spoiler .content .inner-prgrph {
        border-bottom: 1px dashed;
        display: inline;
    }

    .comment-container .comment-body .ban {
        padding: 5px 10px;
        display: flex;
        margin-top: 0;
    }


    .comment-container .comment-body .ban [class*="b-user"] > a {
        display: flex;
        align-items: center;
    }

    .comment-container .comment-body .ban [class*="b-user"] img {
        border-radius: 20px;
        margin-right: 0.2em;
    }

    .comment-container .comment-body .ban .resolution {
        margin-left: 0.2em;
    }

    @keyframes shake {
        10%,
        90% {
            transform: translate3d(-1px, 0, 0);
        }

        20%,
        80% {
            transform: translate3d(2px, 0, 0);
        }

        30%,
        50%,
        70% {
            transform: translate3d(-4px, 0, 0);
        }

        40%,
        60% {
            transform: translate3d(4px, 0, 0);
        }
    }

    .topic-title .v-btn,
    .topic-title > h2 {
        flex-grow: 0 !important;
    }

    .topic-title:not(:hover) .v-btn:not(:focus) {
        opacity: 0;
    }


    .create-comment-form .v-text-field.v-text-field--enclosed .v-input__prepend-outer {
        margin: 4px 15px 0 0;
    }

    .create-comment-form .v-text-field.v-text-field--enclosed .v-input__append-outer {
        margin: 6px 0 0 10px;
    }
</style>
