<template>
  <section class="comments-container">
    <h2 class="display-1 mt-4">Обсуждение серии</h2>
    <v-progress-linear :indeterminate="true" v-if="layout.loading"></v-progress-linear>
    <template v-else>
      <div class="mt-4 mb-2" v-if="topic && comments.items.length">
        <template v-for="comment in comments.items">
          <v-layout
            row
            :key="comment.id"
            class="mb-3 pt-3 comment-container"
            :id="'comment-' + comment.id"
          >
            <v-list-tile-avatar>
              <img :src="comment.user.avatar" />
            </v-list-tile-avatar>

            <v-list-tile-content>
              <v-list-tile-title>
                <strong>
                  <a
                    :href="'https://shikimori.one/' + comment.user.nickname"
                  >@{{ comment.user.nickname }}</a>
                </strong>
                <a
                  class="text-lg-right grey--text text--lighten-1 ml-2"
                  :href="'https://shikimori.one/comments/' + comment.id"
                >{{comment.created_at_relative}}</a>
              </v-list-tile-title>
              <div class="w-100 comment-body" v-html="comment.html_body"></div>
            </v-list-tile-content>
          </v-layout>
          <v-divider></v-divider>
        </template>

        <v-btn
          v-if="comments.items.length < topic.comments_count"
          @click="loadComments"
          :loading="layout.moreComments.loading"
          flat
          block
          class="mt-3"
        >Загрузить ещё</v-btn>
      </div>

      <p v-else class="pl-0 blockquote">Ещё никто не оставил отзыв о серии</p>

      <v-form v-if="user" @submit.prevent="createComment" class="mt-3">
        <v-textarea
          box
          name="input-7-4"
          label="Напишите ваши впечатления от серии"
          v-model="newCommentText"
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

      <div v-else class="text-xs-center mt-4">
        <v-btn class="pl-3" @click="updateAuth" large>
          <v-icon class="mr-2">sync</v-icon>Оставить отзыв
        </v-btn>
      </div>
    </template>
  </section>
</template>


<script>
import Vue from "vue";
import {
  shikimoriAPI,
  updateAuth,
  getAuth,
  push as message
} from "../../helpers";

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

    anime() {
      return this.$store.state.shikimori.anime;
    },

    currentEpisode() {
      return this.$store.getters["player/selectedEpisode"];
    },

    currentEpisodeID() {
      return this.$store.state.player.currentEpisodeID;
    }
  },

  methods: {
    updateAuth() {
      return updateAuth();
    },

    async init() {
      if (!this.currentEpisode || !this.anime) return;
      this.layout.loading = true;

      const topics = await shikimoriAPI(
        `/animes/${this.anime.id}/topics?kind=episode&episode=${this.currentEpisode.episodeInt}`
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
      }

      this.layout.moreComments.loading = false;
    },

    async createComment() {
      if (!this.user || !this.anime) {
        return;
      }

      this.layout.newComment.loading = true;

      let auth = await getAuth();
      if (!auth || !auth.access_token) {
        this.layout.newComment.loading = false;
        return;
      }

      if (1000 * (auth.created_at + auth.expires_in) <= Date.now()) {
        auth = await updateAuth();
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
                anime_id: this.anime.id,
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
      }
    }
  },

  created() {
    this.init();
  },

  mounted() {
    this.$el.addEventListener("click", event => {
      if (event.target.matches('.comment-body a[href*="/comments/"]')) {
        event.preventDefault();
        const commentId = event.target.href.match(/comments\/(\d+)/)[1];

        location.hash = `comment-${commentId}`;
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
    currentEpisodeID() {
      this.init();
    }
  }
};
</script>


<style >
.w-100 {
  width: 100%;
}
.comments-container {
  font-size: 1rem;
}
.comment-body {
  line-height: 1.65;
  word-break: break-word;
}

.comment-body img {
  max-width: 100%;
}
.smiley {
  vertical-align: middle;
  height: 32px;
}

.b-replies {
  text-align: right;
}

.b-replies:before {
  content: attr(data-text-ru);
}

.bubbled img {
  border-radius: 9999px;
  margin-right: 4px;
  vertical-align: middle;
}

.b-image .marker {
  display: none;
}

.comment-container:target {
  animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}

.b-spoiler {
  display: inline;
}

.b-spoiler label,
.b-spoiler .content .before,
.b-spoiler .content .after {
  /* color: #176093; */
  cursor: pointer;
  border-bottom: 1px dashed;
  display: inline;
  color: #1976d2 !important;
  caret-color: #1976d2 !important;
}

.b-spoiler .content {
  display: inline;
}
.b-spoiler .content .before::before {
  content: "[spoiler] ";
}

.b-spoiler .content .after::after {
  content: " [/spoiler]";
}

.b-spoiler:not(.open) .content {
  display: none;
}

.b-spoiler.open label {
  display: none;
}

.b-spoiler .content .inner,
.b-spoiler .content .inner-prgrph {
  border-bottom: 1px dashed;
  display: inline;
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
</style>
