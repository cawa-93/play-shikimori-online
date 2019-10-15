<template>
    <section class="translation-list">
        <v-select
            :items="groupedTranslations"
            :label="label"
            :loading="translations.length === 0"
            :menu-props="{
                maxHeight: 585,
                transition: 'slide-y-transition'
            }"
            filled
            hide-details
            item-text="authorsSummary"
            item-value="id"
            no-data-text="Пока нет ни одного перевода"
            v-model="currentTranslation"
        >
            <template v-slot:item="{item}">
                <template v-if="item.label">
                    <v-subheader>{{item.label}}</v-subheader>
                </template>
                <template v-else>
                    <v-list-item-action>
                        <v-icon v-if="item.qualityType === 'uncensored'">mdi-explicit</v-icon>
                        <v-icon v-else-if="item.qualityType !== 'tv' ">mdi-quality-high</v-icon>
                    </v-list-item-action>

                    <v-list-item-content>
                        <v-list-item-title>{{item.authorsSummary}}</v-list-item-title>
                    </v-list-item-content>

                    <v-list-item-action v-if="item.height >= 1080">
                        {{item.height}}p
                    </v-list-item-action>
                </template>
            </template>

            <template v-slot:append-item>
                <v-list-item class="mt-2" href="https://smotret-anime.online/translations/create">
                    <v-list-item-action>
                        <v-icon>mdi-plus-box</v-icon>
                    </v-list-item-action>

                    <v-list-item-content>
                        <v-list-item-title>Добавить перевод</v-list-item-title>
                    </v-list-item-content>

                    <v-list-item-action>
                        <v-icon>mdi-open-in-new</v-icon>
                    </v-list-item-action>
                </v-list-item>
            </template>
        </v-select>
    </section>
</template>

<script lang="ts">
    import {sync} from '@/helpers/chrome-storage';
    import playerStore from '@/UI/store/player';
    // @ts-ignore
    import {SelectedTranslation} from 'types/UI';
    import {Component, Vue} from 'vue-property-decorator';

    @Component({
        name: 'translation-list',
    })
    export default class TranslationList extends Vue {
        public filters = {
            type: {
                value: 'voiceRu',
                options: [],
            },
        };

        get translations() {
            return playerStore.currentEpisode && playerStore.currentEpisode.translations
                   ? playerStore.currentEpisode.translations
                   : [];
        }


        get groupedTranslations() {
            interface Divider {
                divider: true;
                disabled: true;
            }

            interface Label {
                label: string;
                disabled: true;
            }

            const items: Array<anime365.Translation | Divider | Label> = [];

            if (!this.translations || !this.translations.length) {
                return items;
            }
            const groups = [
                {type: 'voiceRu', label: 'Озвучка'},
                {type: 'voiceEn', label: 'Английская Озвучка'},
                {type: 'subRu', label: 'Русские Субтитры'},
                {type: 'subEn', label: 'Английские Субтитры'},
                {type: 'subJa', label: 'Японские Субтитры'},
                {type: 'raw', label: 'Оригинал'},
            ];

            groups.forEach(({type, label}) => {
                const translations = this.translations
                    .filter((t) => t.type === type)
                    .map((translation) => {
                        if (!translation.authorsSummary) {
                            translation.authorsSummary = 'Неизвестный';
                        }

                        return translation;
                    });

                if (translations.length) {
                    items.push({
                        label,
                        disabled: true,
                    });

                    items.push(...translations);

                    items.push({
                        divider: true,
                        disabled: true,
                    });
                }
            });

            return items;
        }


        get currentTranslation() {
            return playerStore.currentTranslation ? playerStore.currentTranslation.id : 0;
        }


        set currentTranslation(id) {
            const translation = this.translations.find((t) => t.id === id);

            if (translation) {
                playerStore.setCurrentTranslation(translation);

                this.$nextTick(async () => {
                    const dataToSave: SelectedTranslation = {
                        tId: translation.id,
                        id: translation.seriesId,
                        eId: translation.episodeId,
                        type: translation.type,
                        author: translation.authorsSummary,
                        priority: translation.priority,
                    };

                    await sync.unshift('selectedTranslations', dataToSave);
                });
            }
        }

        get label() {
            if (!playerStore.currentTranslation) {
                return this.translations.length ? 'Выберите перевод' : 'Загрузка...';
            }
            switch (playerStore.currentTranslation.type) {
                case 'voiceRu':
                    return 'Озвучка';
                case 'voiceEn':
                    return 'Английская Озвучка';
                case 'subRu':
                    return 'Русские Субтитры';
                case 'subEn':
                    return 'Английские Субтитры';
                case 'subJa':
                    return 'Японские Субтитры';
                case 'raw':
                    return 'Оригинал';
                default:
                    return 'Перевод';
            }
        }

    }
</script>


<style>
    .qualityType {
        text-align: center;
        flex: 1;
    }
</style>
