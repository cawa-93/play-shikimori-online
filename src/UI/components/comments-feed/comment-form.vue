<template>
    <section>
        <v-form @submit.prevent="onSubmit" class="create-comment-form" v-if="user" v-model="valid">
            <v-text-field
                :disabled="loading"
                :loading="loading"
                :rules="rules"
                :value="text"
                @click:append-outer="onSubmit"
                @input="onChange"
                filled
                label="Опиши свои впечатления от серии"
                ref="textField"
                required
            >
                <v-avatar slot="prepend">
                    <img :alt="user.nickname" :src="user.avatar" v-if="user.avatar"/>
                    <v-icon v-else>mdi-account-circle</v-icon>

                </v-avatar>

                <v-btn
                    :disabled="!valid || loading"
                    :loading="loading"
                    icon
                    large
                    slot="append-outer"
                    type="submit"
                >
                    <v-icon>mdi-send</v-icon>
                </v-btn>
            </v-text-field>
        </v-form>

        <div class="text-center" v-else>
            <v-btn @click="logIn" class="pl-4" large outlined>
                <v-icon class="mr-2">mdi-sync</v-icon>
                Чтобы оставить отзыв необходимо включить синхронизацию
            </v-btn>
        </div>
    </section>
</template>

<script lang="ts">
    import {hasAbusiveWord} from '@/helpers/abusiveWords';
    import profileStore from '@/UI/store/profile';
    import {Component, Ref, Vue} from 'vue-property-decorator';

    @Component({
        name: 'comment-form',
        props: {
            loading: {
                type: Boolean,
                default: false,
            },

            text: {
                type: String,
                default: '',
            },
        },
    })
    export default class CommentForm extends Vue {
        public valid = false;

        @Ref() public readonly textField!: Vue;

        public rules: Array<(v: string) => boolean | string> = [
            (v) => !!v.trim() || 'Текст не может быть пустым',
            (v) => !hasAbusiveWord(v) || 'Вероятно в тексте содержатся матерные слова. <a href="https://shikimori.one/forum/site/79042">Мат запрещен правилами Шикимори</a>',
        ];

        get user() {
            return profileStore.user;
        }

        public logIn() {
            return profileStore.getValidCredentials(true);
        }

        public onChange(value: string) {
            if (!this.valid) {
                return;
            }
            this.$emit('update:text', value);
        }

        public onSubmit(event: Event) {
            if (!this.valid) {
                return;
            }

            this.$emit('submit', event);
        }

        public focus() {
            // @see https://github.com/kaorun343/vue-property-decorator/issues/257
            // @ts-ignore
            this.textField.focus();
        }

    }
</script>

<style scoped>

</style>
