import { shikimoriAPI, getAuth, updateAuth } from "../../../../helpers";

/**
 * Загружает данный об аниме
 * @param {vuex.Context} context 
 */
export async function loadAnime({ commit }) {
  const headers = {}

  let auth = await getAuth()
  if (auth && auth.access_token) {
    if (1000 * (auth.created_at + auth.expires_in) <= Date.now()) {
      auth = await updateAuth()
    }

    headers.Authorization = `${auth.token_type} ${auth.access_token}`
  }

  const animeId = (new URL(location.href)).searchParams.get('anime')

  /** @type {shikimori.Anime} */
  const anime = await shikimoriAPI(`/animes/${animeId}`, { headers })
  commit('setAnime', anime)
}


/**
 * Загружает данный о текущем пользователе
 * @param {vuex.Context} context 
 */
export async function loadUser({ commit }) {
  const auth = await getAuth()
  if (!auth || !auth.access_token) {
    return
  }

  if (1000 * (auth.created_at + auth.expires_in) <= Date.now()) {
    return await updateAuth()
  }

  /** @type {shikimori.User} */
  const user = await shikimoriAPI(`/users/whoami`, {
    headers: {
      Authorization: `${auth.token_type} ${auth.access_token}`
    }
  })

  if (user) {
    commit('setUser', user)
  }
}

/**
 * Отправляет оценку пользователя на Шикимори
 * @param {{state: vuex.Shikimori, commit: Function}} context
 * @param {shikimori.UserRate} user_rate 
 */
export async function saveUserRate({ commit, state: { anime, user } }, user_rate) {
  if (!anime || !user) {
    return null
  }

  if (anime.user_rate) {
    commit('setUserRate', Object.assign({}, anime.user_rate, user_rate))
  }

  let auth = await getAuth()
  if (!auth || !auth.access_token) {
    return
  }

  if (1000 * (auth.created_at + auth.expires_in) <= Date.now()) {
    auth = await updateAuth()
  }

  /** @type {shikimori.UserRate} */
  const newUserRate = await shikimoriAPI('/v2/user_rates', {
    method: 'POST',
    body: JSON.stringify(
      {
        user_rate: Object.assign(
          {},
          {
            target_type: 'Anime',
            target_id: anime.id,
            user_id: user.id
          },
          user_rate)
      }
    ),
    headers: {
      Authorization: `${auth.token_type} ${auth.access_token}`
    }
  })

  commit('setUserRate', newUserRate)

  return newUserRate
}


/**
 * Сохраняет текущую серию как просмотренную
 * @param {{rootGetters: {'player/selectedEpisode' : anime365.Episode },dispatch: Function }}
 */
export function markAsWatched({ rootGetters, dispatch }) {
  return dispatch('saveUserRate', {
    episodes: rootGetters['player/selectedEpisode'].episodeInt
  })
}