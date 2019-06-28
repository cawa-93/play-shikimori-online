/**
 * 
 * @param {anime365.Translation} translation 
 */
export function buildIframeURL(translation) {
  const url = new URL(translation.embedUrl);

  url.searchParams.append("extension-id", chrome.runtime.id);
  url.searchParams.append("play-shikimori[seriesId]", translation.seriesId);
  url.searchParams.append("play-shikimori[episodeId]", translation.episodeId);
  url.searchParams.append("play-shikimori[id]", translation.id);

  return url
}