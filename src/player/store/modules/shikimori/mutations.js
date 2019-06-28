import Vue from "vue";

/**
 * Сохраняет данные аниме
 * @param {vuex.Shikimori} state 
 * @param {shikimori.Anime} anime 
 */
export function setAnime(state, anime) {
  state.anime = anime
}

/**
 * Обновляет текущую оценку
 * @param {vuex.Shikimori} state 
 * @param {shikimori.UserRate} userRate 
 */
export function setUserRate(state, userRate) {
  Vue.set(state.anime, 'user_rate', userRate)
}

/**
 * Сохраняет данные пользователя
 * @param {vuex.Shikimori} state 
 * @param {shikimori.User} user 
 */
export function setUser(state, user) {
  state.user = user
}