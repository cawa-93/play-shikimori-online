/**
 * Выбирает нужную форму существительного в зависимости от количества
 * @param {number} n 
 * @param {[string, string, string]} titles
 * @returns {string}
 * 
 * @see https://gist.github.com/realmyst/1262561#gistcomment-2299442
 * @see http://docs.translatehouse.org/projects/localization-guide/en/latest/l10n/pluralforms.html?id=l10n/pluralforms
 * 
 */
export function pluralize(n, titles) {
  return titles[(n % 10 === 1 && n % 100 !== 11) ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2]
}