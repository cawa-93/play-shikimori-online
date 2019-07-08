import { shikimoriAPI, getAuth, updateAuth, anime365API } from "../../../../helpers";

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
 * Загружает данные о следующем сезоне во франшизе
 * @param {{state: vuex.Shikimori, commit: Function}} param0 
 */
export async function loadNextSeason({ state, commit }) {
  if (!state.anime || state.franchise) {
    return
  }

  /** @type {{links: shikimori.FranchiseLink[], nodes: shikimori.FranchiseNode[]}} */
  const franchise = await shikimoriAPI(`/animes/${state.anime.id}/franchise`)
  const sequelLink = franchise.links.find(l => l.source_id === state.anime.id && l.relation === 'sequel')

  if (!sequelLink) {
    return
  }

  const sequelNode = franchise.nodes.find(n => n.id === sequelLink.target_id)

  if (!sequelNode) {
    return
  }


  /** @type {[anime365.api.SeriesCollection, shikimori.Anime]} */
  const [{ data: [series] }, anime] = await Promise.all([
    await anime365API(`/series/?myAnimeListId=${sequelNode.id}`),

    (async () => {
      const headers = {}

      let auth = await getAuth()
      if (auth && auth.access_token) {
        if (1000 * (auth.created_at + auth.expires_in) <= Date.now()) {
          auth = await updateAuth()
        }

        headers.Authorization = `${auth.token_type} ${auth.access_token}`
      }

      /** @type {shikimori.Anime} */
      return await shikimoriAPI(`/animes/${sequelNode.id}`, { headers })
    })()

  ])

  if (!series.episodes || !series.episodes.length) {
    return
  }

  const episodeType = series.episodes[0].episodeType
  if (series.episodes.every(e => e.episodeType === episodeType)) {
    series.type = episodeType
  } else {
    series.episodes = series.episodes
      .filter(e =>
        e.isActive
        && parseFloat(e.episodeInt) <= series.numberOfEpisodes
        && e.episodeType === series.type
      )
  }

  if (!series.episodes || !series.episodes.length) {
    return
  }

  sequelNode.series = series.id

  if (anime.user_rate) {
    sequelNode.episodeInt = anime.user_rate.episodes
  }

  commit('setNextSeason', sequelNode)
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
    return updateAuth()
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

  let newUserRate = Object.assign(
    {},
    {
      target_type: 'Anime',
      target_id: anime.id,
      user_id: user.id,
      status: anime.user_rate ? anime.user_rate.status : 'watching'
    },
    user_rate)


  /** @type {shikimori.UserRate} */
  newUserRate = await shikimoriAPI('/v2/user_rates', {
    method: 'POST',
    body: JSON.stringify({
      user_rate: newUserRate
    }),
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