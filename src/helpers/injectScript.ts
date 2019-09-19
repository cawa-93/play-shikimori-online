/**
 * Вставляет скрипт на страницу
 * @param {string} src URL script
 * @param {boolean} async attribute
 * @param {HTMLElement} parent container
 */
export function injectScript(src: string, async = true, parent = document.head) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.async = async;
        script.src = src;

        const res = () => {
            resolve();
            clear();
        };

        const rej = () => {
            reject('Error loading script');
            clear();
        };

        const clear = () => {
            script.removeEventListener('load', res);
            script.removeEventListener('error', rej);
            script.removeEventListener('abort', rej);
        };

        script.addEventListener('load', res, {once: true});
        script.addEventListener('error', rej, {once: true});
        script.addEventListener('abort', rej, {once: true});
        parent.appendChild(script);
    });
}
