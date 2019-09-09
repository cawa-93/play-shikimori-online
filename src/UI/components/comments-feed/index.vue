<template>
    <section class="comments-container" v-if="allowComments">
        <div class="display-1 my-2 d-flex topic-title">
            <h2 @click="scrollTo($refs['comments-feed'])"
                class="display-1">
                Обсуждение {{currentEpisode.episodeInt}} серии
            </h2>
            <v-tooltip right transition="slide-x-transition">
                <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        :href="`https://shikimori.one${topic.forum.url}/${topic.linked_type.toLowerCase()}-${topic.linked.id}/${topic.id}`"
                        aria-label="Открыть обсуждение на Шикимори"
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

                <comment :comment="comment"
                         :key="comment.id"
                         @answer="answer"
                         v-for="comment in comments.items"></comment>

                <div class="d-flex my-4 justify-center">
                    <load-more :loading="layout.moreComments.loading"
                               @loadAll="loadAllComments"
                               @loadMore="loadComments"
                               v-if="comments.items.length < topic.comments_count"></load-more>
                </div>
            </div>

            <p class="pl-0 blockquote"
               ref="comments-feed"
               v-else>
                Ты можешь написать комментарий первым, если поторопишься 😁
            </p>

            <comment-form :loading="layout.newComment.loading"
                          :text.sync="layout.newComment.text"
                          @submit="createComment"
                          ref="commentField"></comment-form>
        </template>
    </section>
</template>


<script lang="ts">
    import {ShikimoriProvider} from '@/helpers/API/ShikimoriProvider';
    import CommentForm from '@/UI/components/comments-feed/comment-form.vue';
    import Comment from '@/UI/components/comments-feed/comment.vue';
    import LoadMore from '@/UI/components/comments-feed/load-more.vue';
    import playerStore from '@/UI/store/player';
    import profileStore from '@/UI/store/profile';
    import {Component, Ref, Vue, Watch} from 'vue-property-decorator';


    @Component({
        name: 'comments-feed',
        components: {CommentForm, Comment, LoadMore},
    })
    export default class Comments extends Vue {
        public layout = {
            loading: true,
            moreComments: {
                loading: false,
            },
            newComment: {
                loading: false,
                text: '',
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

        @Ref() public readonly commentField!: CommentForm;

        get user() {
            return profileStore.user;
        }

        get currentEpisode() {
            return playerStore.currentEpisode;
        }

        get allowComments() {
            return this.currentEpisode && this.currentEpisode.episodeInt % 1 === 0;
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
                    {errorMessage: 'Невозможно найти топик с обсуждением серии'},
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
                }

                this.comments.items.push(...comments.map((c) => this.processComment(c)));
                this.comments.page += 1;
            } catch (e) {
                console.error(e);
                e.alert().track();
            }

            this.layout.moreComments.loading = false;
        }


        public async createComment() {
            if (!this.user || !this.currentEpisode || !this.layout.newComment.text || this.layout.newComment.loading) {
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
                        {
                            errorMessage: 'Невозможно найти созданный топик с обсуждением серии',
                        },
                    );
                } catch (e) {
                    console.error(e);
                    e.alert().track();
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
                            body: this.layout.newComment.text,
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

                this.layout.newComment.loading = false;

                this.layout.newComment.text = '';
                this.topic.comments_count = (this.topic.comments_count || 0) + 1;
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
            this.layout.newComment.text += `[comment=${comment.id}]${comment.user.nickname}[/comment], `;
            // @see https://github.com/kaorun343/vue-property-decorator/issues/257
            // @ts-ignore
            this.commentField.focus();
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