<template>
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
                        @click.prevent="$emit('answer', comment)"
                        class="caption grey--text"
                    >{{comment.created_at_relative}}</a>
                </time>
            </v-list-item-title>
            <div class="w-100 comment-body" v-html="comment.html_body"></div>
        </v-list-item-content>
    </v-layout>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';

    @Component
    export default class Comment extends Vue {
        @Prop() public readonly comment!: shikimori.Comment;


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
</style>
