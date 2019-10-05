<template>
    <div class="flex-parent download-video">
        <v-menu v-if="readyToShow">
            <template v-slot:activator="{ on }">
                <v-btn
                    :disabled="!download.length"
                    aria-label="Скачать"
                    text
                    v-on="on"
                >
                    <v-icon>mdi-download</v-icon>
                    <span class="long-and-truncated  ml-2" v-if="!compact">Скачать</span>
                </v-btn>
            </template>

            <v-list>
                <v-list-item
                    :href="item.url"
                    :key="index"
                    download
                    target="_self"
                    v-for="(item, index) in download"
                >
                    <v-list-item-title>{{ item.height }}p</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>
        <v-skeleton-loader type="button" v-else></v-skeleton-loader>
    </div>
</template>

<script lang="ts">
    import {Anime365Provider} from '@/helpers/API/Anime365Provider';
    import Boilerplate from '@/UI/mixins/boilerplate';
    import playerStore from '@/UI/store/player';
    import {mixins} from 'vue-class-component';
    import {Component, Prop, Watch} from 'vue-property-decorator';


    @Component({
        name: 'download-video',
    })
    export default class DownloadVideo extends mixins(Boilerplate) {
        @Prop() public readonly compact!: boolean;

        public download: anime365.DownloadItem[] = [];

        get currentTranslation() {
            return playerStore.currentTranslation;
        }

        @Watch('currentTranslation.id', {immediate: true})
        public async transactionChange(translationId?: number) {
            if (!translationId) {
                this.download = [];
                return;
            }

            const {data} = await Anime365Provider.fetch<anime365.api.TranslationEmbed>(
                `/translations/embed/${translationId}`,
                {
                    credentials: 'include',
                    errorMessage: 'Не удалось найти ссылки для скачивания',
                },
            );

            if (data && data.download) {
                this.download = data.download;
            } else {
                this.download = [];
            }

            this.readyToShow = true;
        }
    }
</script>
