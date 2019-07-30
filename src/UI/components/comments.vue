<template>
  <section class="comments-container">
    <div class="display-1 mt-6 mb-4 d-flex topic-title">
      <h2 class="display-1">Обсуждение {{currentEpisode.episodeInt}} серии</h2>
      <v-tooltip right>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            icon
            small
            class="ml-3"
            v-if="topic"
            v-on="on"
            v-bind="attrs"
            :href="`https://shikimori.one${topic.forum.url}/${topic.linked_type.toLowerCase()}-${topic.linked.id}/${topic.id}`"
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
        class="mt-6 mb-2"
        v-if="topic && comments.items.length"
        role="feed"
        :aria-busy="layout.moreComments.loading ? 'true' : 'false'"
      >
        <template v-for="comment in comments.items">
          <v-layout
            :key="comment.id"
            class="comment-container"
            :id="'comment-' + comment.id"
            tag="article"
          >
            <v-list-item-avatar>
              <img :src="comment.user.avatar" />
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>
                <strong>
                  <a
                    role="author"
                    :href="'https://shikimori.one/' + comment.user.nickname"
                  >@{{ comment.user.nickname }}</a>
                </strong>
                <time :datetime="comment.created_at" :title="comment.created_at">
                  <a
                    class="text-lg-right grey--text text--lighten-1 ml-2"
                    :href="'https://shikimori.one/comments/' + comment.id"
                  >{{comment.created_at_relative}}</a>
                </time>
              </v-list-item-title>
              <div class="w-100 comment-body" v-html="comment.html_body"></div>
            </v-list-item-content>
          </v-layout>
        </template>

        <div class="text-center mt-7">
          <v-tooltip top>
            <template v-slot:activator="{on, attrs}">
              <v-btn
                v-on="on"
                v-bind="attrs"
                v-if="comments.items.length < topic.comments_count"
                @click="loadComments"
                :loading="layout.moreComments.loading"
                icon
              >
                <v-icon large>mdi-chevron-down</v-icon>
              </v-btn>
            </template>
            <span>Загрузить ещё</span>
          </v-tooltip>
        </div>
      </div>

      <p v-else class="pl-0 blockquote">Ещё никто не оставил отзыв о серии</p>

      <v-form v-if="user" @submit.prevent="createComment" class="mt-7">
        <v-textarea
          filled
          name="input-7-4"
          label="Напишите ваши впечатления от серии"
          v-model.trim="newCommentText"
          required
          :disabled="layout.newComment.loading"
        ></v-textarea>
        <v-btn
          :disabled="!newCommentText || layout.newComment.loading"
          block
          type="submit"
          :loading="layout.newComment.loading"
        >Отправить</v-btn>
      </v-form>

      <div v-else class="text-center mt-6">
        <v-btn class="pl-4" @click="logIn" large>
          <v-icon class="mr-2">mdi-sync</v-icon>Оставить отзыв
        </v-btn>
      </div>
    </template>
  </section>
</template>


<script>
import Vue from "vue";
import { shikimoriAPI, push as message } from "../../helpers";

export default {
  name: "comments",

  data() {
    return {
      layout: {
        loading: true,
        moreComments: {
          loading: false
        },
        newComment: {
          loading: false
        }
      },
      topic: null,
      comments: {
        items: [],
        page: 1,
        perPage: 20
      },
      newCommentText: ""
    };
  },

  computed: {
    user() {
      return this.$store.state.shikimori.user;
    },

    currentEpisode() {
      return this.$store.state.player.currentEpisode;
    }
  },

  methods: {
    logIn() {
      return this.$store.dispatch("shikimori/getValidCredentials", true);
    },

    async init() {
      if (!this.currentEpisode) return;
      this.layout.loading = true;

      const topics = await shikimoriAPI(
        `/animes/${this.currentEpisode.myAnimelist}/topics?kind=episode&episode=${this.currentEpisode.episodeInt}`
      );

      this.topic = topics[0];
      this.comments.items = [];
      this.comments.page = 1;

      await this.loadComments();

      this.layout.loading = false;
    },

    proccessComment(comment) {
      comment.html_body = comment.html_body
        .replace(/(href|src)="\//gimu, '$1="https://shikimori.one/')
        .replace(/b-quote/gi, "blockquote");

      comment.created_at_relative = this.getCreatedAtRelative(
        comment.created_at
      );

      return comment;
    },

    getCreatedAtRelative(iso) {
      const date = new Date(iso);
      const now = new Date();
      const diff = date - now;
      const formatter = new Intl.RelativeTimeFormat();

      const msPerMinute = 60 * 1000;
      const msPerHour = msPerMinute * 60;
      const msPerDay = msPerHour * 24;
      const msPerMonth = msPerDay * 30;
      const msPerYear = msPerDay * 365;

      if (Math.abs(diff) < msPerMinute)
        return formatter.format(Math.round(diff / 1000), "seconds");
      if (Math.abs(diff) < msPerHour)
        return formatter.format(Math.round(diff / msPerMinute), "minutes");
      if (Math.abs(diff) < msPerDay)
        return formatter.format(Math.round(diff / msPerHour), "hour");
      if (Math.abs(diff) < msPerMonth)
        return formatter.format(Math.round(diff / msPerDay), "day");
      if (Math.abs(diff) < msPerYear)
        return formatter.format(Math.round(diff / msPerMonth), "month");
      return formatter.format(Math.round(diff / msPerYear), "year");
    },

    async loadComments() {
      if (!this.topic) {
        return;
      }

      this.layout.moreComments.loading = true;

      try {
        const comments = await shikimoriAPI(
          `/comments/?desc=0&commentable_id=${this.topic.id}&commentable_type=Topic&limit=${this.comments.perPage}&page=${this.comments.page}`
        );

        if (comments.length > this.comments.perPage) {
          comments.pop();
        } else if (this.comments.page !== 1) {
          this.$ga.event(
            "comments-actions",
            "load-all-comments",
            this.comments.page
          );
        }

        this.comments.items.push(...comments.map(c => this.proccessComment(c)));
        this.comments.page += 1;
      } catch (error) {
        const exception = error.message || error;
        this.$ga.exception(exception);
        console.error(error);
      }

      this.layout.moreComments.loading = false;
    },

    async createComment() {
      if (!this.user || !this.currentEpisode) {
        return;
      }

      this.layout.newComment.loading = true;

      let auth = await this.$store.dispatch("shikimori/getValidCredentials");
      if (!auth) {
        this.layout.newComment.loading = false;
        return;
      }

      const headers = {
        Authorization: `${auth.token_type} ${auth.access_token}`
      };

      if (!this.topic) {
        let is_fandub = false;
        let is_raw = false;
        let is_subtitles = false;

        for (const translation of this.currentEpisode.translations) {
          switch (translation.typeKind) {
            case "raw":
              is_raw = true;
              break;

            case "sub":
              is_subtitles = true;
              break;

            case "voice":
              is_fandub = true;
              break;
          }

          if (is_fandub && is_raw && is_subtitles) {
            break;
          }
        }

        const episode_notifications = await shikimoriAPI(
          "/v2/episode_notifications",
          {
            method: "POST",
            headers,
            body: JSON.stringify({
              episode_notification: {
                aired_at: new Date(
                  this.currentEpisode.firstUploadedDateTime
                ).toISOString(),
                anime_id: this.currentEpisode.myAnimelist,
                episode: this.currentEpisode.episodeInt,
                is_anime365: true,
                is_fandub,
                is_raw,
                is_subtitles
              },
              token: process.env.SHIKIMORI_SYSTEM_TOKEN
            })
          }
        );

        if (!episode_notifications.topic_id) {
          this.layout.newComment.loading = false;
          return;
        }

        const topic = await shikimoriAPI(
          `/topics/${episode_notifications.topic_id}`
        );

        this.topic = topic;
      }

      try {
        const newComment = await shikimoriAPI(`/comments`, {
          method: "POST",
          headers,
          body: JSON.stringify({
            comment: {
              body: this.newCommentText,
              commentable_id: this.topic.id,
              commentable_type: "Topic",
              is_offtopic: false,
              is_summary: false
            },
            frontend: false
          })
        });

        if (!newComment.id) {
          this.layout.newComment.loading = false;
          return;
        }

        this.comments.items.push(this.proccessComment(newComment));

        this.newCommentText = "";
        this.layout.newComment.loading = false;

        this.$ga.event("comments-actions", "post-comment");
      } catch (error) {
        this.$ga.exception(
          `New Comment Error: ${error.message || error}`,
          true
        );

        console.error("Не удалось создать комментарий", { error });
        message({
          color: "error",
          html:
            "Не удалось создать комментарий.\nОткройте консоль для информации об ошибке"
        });

        this.layout.newComment.loading = false;
      }
    }
  },

  mounted() {
    this.init();
    this.$el.addEventListener("click", event => {
      if (event.target.matches('.comment-body a[href*="/comments/"]')) {
        event.preventDefault();
        const commentId = event.target.href.match(/comments\/(\d+)/)[1];

        /** @type {HTMLElement} */
        const element = document.querySelector(`#comment-${commentId}`);
        if (element) {
          element.classList.add("shake");
          this.$vuetify.goTo(element, { duration: 300 });
          setTimeout(() => {
            element.classList.remove("shake");
          }, 1000);
        }
        return;
      }

      if (
        event.target.matches(
          ".comment-body .b-spoiler label, .comment-body .b-spoiler .before, .comment-body .b-spoiler .after "
        )
      ) {
        event.preventDefault();
        event.target.closest(".b-spoiler").classList.toggle("open");
        return;
      }
    });
  },

  watch: {
    currentEpisode(newEpisode, oldEpisode) {
      if (newEpisode.id !== oldEpisode.id) {
        this.init();
      }
    }
  }
};
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

.comment-container .v-list-item__content {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
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

.comment-container .b-image img {
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
  animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
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

.comment-container .ban [class*="b-user"] {
  display: inline-block;
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
</style>
