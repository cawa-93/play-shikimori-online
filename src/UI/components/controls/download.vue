<template>
    <v-menu v-if="download.length">
        <template v-slot:activator="{ on }">
            <v-btn
                aria-label="Скачать"
                class="flex-parent download-video"
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
</template>

<script lang="ts">
    import {Anime365Provider} from '@/helpers/API/Anime365Provider';
    import playerStore from '@/UI/store/player';
    import {Component, Prop, Vue, Watch} from 'vue-property-decorator';


    @Component({
        name: 'download-video',
    })
    export default class DownloadVideo extends Vue {
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
        }
    }
</script>
