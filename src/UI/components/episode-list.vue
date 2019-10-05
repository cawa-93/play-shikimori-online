<template>
    <div>
        <section class="episode-list" v-if="readyToShow">
            <template class="mdc-select">
                <v-select
                    :items="episodes"
                    :label="label"
                    :menu-props="{
                    maxHeight: 585,
                    transition: 'slide-y-transition'
                }"
                    filled
                    hide-details
                    item-text="episodeFull"
                    item-value="id"
                    no-data-text="Пока нет ни одной серии"
                    v-model="selectedEpisode"
                >
                    <template v-slot:item="{item}">
                        <v-list-item-action @click.prevent.stop="markAsWatched(item)" v-if="user">
                            <v-checkbox :input-value="item.episodeInt <= watchedEpisodes" @click.prevent></v-checkbox>
                        </v-list-item-action>

                        <v-list-item-content class="inset">
                            <v-list-item-title>{{item.episodeFull}}</v-list-item-title>
                        </v-list-item-content>
                    </template>

                    <template v-slot:selection="{item}">
                        <div class="v-select__selection v-select__selection--comma">
                            <span>{{item.episodeFull}}</span>
                            <span class="ml-1" v-if="item.episodeInt <= watchedEpisodes">— просмотрено</span>
                        </div>
                    </template>

                    <template v-slot:append-item>
                        <v-divider class="mb-2"></v-divider>

                        <v-list-item href="https://smotret-anime-365.ru/translations/create">
                            <v-list-item-action>
                                <v-icon>mdi-plus-box</v-icon>
                            </v-list-item-action>

                            <v-list-item-content>
                                <v-list-item-title>Добавить серию</v-list-item-title>
                            </v-list-item-content>

                            <v-list-item-action>
                                <v-icon>mdi-open-in-new</v-icon>
                            </v-list-item-action>
                        </v-list-item>
                    </template>
                </v-select>
            </template>
        </section>

        <v-skeleton-loader max-height="57px" type="image" v-else></v-skeleton-loader>

    </div>

</template>


<script lang="ts">
import Boilerplate from '@/UI/mixins/boilerplate';
import playerStore from '@/UI/store/player';
import profileStore from '@/UI/store/profile';
import shikimoriStore from '@/UI/store/shikimori';
import {mixins} from 'vue-class-component';
import {Component, Watch} from 'vue-property-decorator';

@Component({
    name: 'episode-list',
})
export default class EpisodeList extends mixins(Boilerplate) {

    get user() {
        return profileStore.user;
    }


    get episodes() {
        return playerStore.episodes;
    }

    get selectedEpisode() {
        return playerStore.currentEpisode
               ? playerStore.currentEpisode.id
               : 0;
    }

    set selectedEpisode(id: number) {
        const targetEpisode = this.episodes.find((e) => e.id === id);
        if (targetEpisode) {
            playerStore.selectEpisode(targetEpisode);
        }
    }

    get watchedEpisodes() {
        return shikimoriStore.anime && shikimoriStore.anime.user_rate
               ? shikimoriStore.anime.user_rate.episodes
               : 0;
    }

    get label() {
        return shikimoriStore.anime && (shikimoriStore.anime.russian || shikimoriStore.anime.name)
               ? shikimoriStore.anime.russian || shikimoriStore.anime.name
               : 'Серия';
    }

    public markAsWatched(episode: anime365.Episode) {
        let episodes = episode.episodeInt;

        if (this.watchedEpisodes !== undefined && episodes <= this.watchedEpisodes) {
            episodes--;
        }

        shikimoriStore.saveUserRate({episodes});
    }

    @Watch('episodes', {deep: false})
    public episodesOnChange() {
        this.readyToShow = true;
    }

}
</script>
