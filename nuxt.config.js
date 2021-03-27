const baseUrl = (
    process.env.VERCEL_URL ||
    process.env.PUBLIC_URL ||
    'https://covidbezbarier.cz/'
).replace(/\/$/, '') + '/'

const title = 'Covid bez bariér'
const description = 'Covid bez bariér – interaktivní mapa bezbariérových míst na testování a očkování proti Covid-19'

export default {
    target: 'universal',

    head: {
        title: 'Covid bez bariér',
        htmlAttrs: {
            lang: 'cs'
        },
        meta: [
            {charset: 'utf-8'},
            {name: 'viewport', content: 'width=device-width, initial-scale=1'},
            {
                hid: 'author',
                name: 'author',
                content: 'Josef Kolář & Peter Uhrín; https://github.com/thejoeejoee/covidbezbarier.cz'
            },
            {
                hid: 'description',
                name: 'description',
                content: description
            },

            {hid: 'og:type', name: 'og:type', content: 'website'},
            {hid: 'og:url', name: 'og:url', content: baseUrl},
            {hid: 'og:title', name: 'og:title', content: title},
            {hid: 'og:description', name: 'og:description', content: description},

            {hid: 'twitter:card', name: 'twitter:card', content: 'summary_large_image'},
            {hid: 'twitter:url', name: 'twitter:url', content: baseUrl},
            {hid: 'twitter:title', name: 'twitter:title', content: title},
            {hid: 'twitter:description', name: 'twitter:description', content: description},
        ],
        link: [
            {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'},
        ]
    },

    css: [],

    plugins: [
        {src: '~/plugins/vue-typer.client.ts', mode: 'client'},
        {src: '~/plugins/axios-accessor.ts'},
    ],

    components: true,

    buildModules: [
        '@nuxt/typescript-build',
        '@nuxtjs/tailwindcss',
    ],

    modules: [
        '@nuxtjs/axios',
        '@nuxtjs/sentry',
        ['nuxt-leaflet', {}],
        'vue-geolocation-api/nuxt',
    ],

    publicRuntimeConfig: {
        baseUrl,
    },

    axios: {},

    build: {},

    sentry: {
        dsn: process.env.SENTRY_DSN || '',
        config: {},
    },

    tailwindcss: {
        jit: true
    }
}
