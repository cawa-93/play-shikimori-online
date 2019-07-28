export default {
  name: 'theme',

  data() {
    const mq = window.matchMedia('(prefers-color-scheme: light)')

    mq.addEventListener('change', (e) => {
      this.theme.dark = !e.matches
      document.querySelector('html').style.background = e.matches ? '#fff' : '#303030';
    })

    document.querySelector('html').style.background = mq.matches ? '#fff' : '#303030';

    return {
      theme: {
        dark: !mq.matches
      }
    }

  }
}