<template>
  <section class="comments-container">
    <h2 class="display-1 mt-4">Обсуждение серии</h2>
    <v-progress-linear :indeterminate="true" v-if="layout.loading"></v-progress-linear>
    <template v-else>
      <div class="mt-4 mb-2" v-if="topic && comments.length">
        <template v-for="comment in comments">
          <v-layout row :key="comment.id" class="mb-3" :id="'comment-' + comment.id">
            <v-list-tile-avatar>
              <img :src="comment.user.avatar">
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
          <v-divider class="mb-3"></v-divider>
        </template>

        <v-btn
          v-if="comments.length < topic.comments_count"
          @click="loadComments"
          :loading="layout.moreComments.loading"
          flat
          block
          class="mt-3"
        >Загрузить ещё</v-btn>
      </div>

      <p v-else>Ещё никто не оставил отзыв о серии</p>

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

      <v-btn v-else class="pl-2" @click="updateAuth">
        <v-icon class="mr-1">sync</v-icon>Включить возможность комментирования
      </v-btn>
    </template>
  </section>
</template>


<script>
import Vue from "vue";
import { shikimoriAPI, updateAuth, getAuth } from "../../helpers";

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
      comments: [],
      newCommentText: "",
      commentsPerPage: 20
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
      return this.$store.getters["player/currentEpisode"];
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
        `/animes/${this.anime.id}/topics?kind=episode&episode=${
          this.currentEpisode.episodeInt
        }`
      );

      this.topic = topics[0];
      this.comments = [];

      await this.loadComments();

      this.layout.loading = false;
    },

    proccessComment(comment) {
      comment.html_body = comment.html_body
        .replace(/(href|src)="\//gimu, '$1="https://shikimori.one/')
        .replace("b-quote", "blockquote");

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
          `/comments/?desc=0&commentable_id=${
            this.topic.id
          }&commentable_type=Topic&limit=${this.commentsPerPage}&page=${this
            .comments.length /
            this.commentsPerPage +
            1}`
        );

        if (comments.length > this.commentsPerPage) {
          comments.pop();
        }

        this.comments.push(...comments.map(c => this.proccessComment(c)));
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
        Authorization: `Bearer ${auth.access_token}`
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

      this.comments.push(this.proccessComment(newComment));

      this.newCommentText = "";
      this.layout.newComment.loading = false;
    }
  },

  created() {
    this.init();
  },

  mounted() {
    this.$el.addEventListener("click", event => {
      if (!event.target.matches('.comment-body a[href*="/comments/"]')) {
        return;
      }

      event.preventDefault();
      const commentId = event.target.href.match(/comments\/(\d+)/)[1];

      const targetElement = this.$el.querySelector(`#comment-${commentId}`);
      if (targetElement) targetElement.scrollIntoView();
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

.b-image .marker {
  display: none;
}
</style>
