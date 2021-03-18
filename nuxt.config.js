export default {
  target: 'static',

  head: {
    title: 'Covid bez bariér – interaktivní mapa bezbariérových míst pro testování a očkování',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { hid: 'author', name: 'author', content: 'Josef Kolář & Peter Uhrín; https://github.com/thejoeejoee/covidbezbarier.cz' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    ]
  },

  css: [
  ],

  plugins: [
  ],

  components: true,

  buildModules: [
    '@nuxt/typescript-build',
  ],

  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/sentry',
  ],

  axios: {},

  build: {
  },

  sentry: {
    dsn: process.env.SENTRY_DSN || '',
    config: {},
  }
}
