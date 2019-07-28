import Vue from "vue";

/**
 * Сохраняет данные аниме
 * @param {vuex.Shikimori} state 
 * @param {shikimori.Anime} anime 
 */
export function setAnime(state, anime) {
  state.anime = anime
}

export function setNextSeason(state, nextSeason) {
  state.nextSeason = nextSeason
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

export function saveCredentials(state, credentials) {
  state.credentials = credentials
}

export function logout(state) {
  state.user = null
  if (!state.credentials || !state.credentials.access_token) return
  state.credentials.access_token = null
}


export function loadCredentialsFromServer(state, credentials) {
  state.credentials = credentials
}