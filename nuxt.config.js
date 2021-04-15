const baseUrl = (
    process.env.VERCEL_URL ||
    process.env.PUBLIC_URL ||
    'https://covidbezbarier.cz/'
).replace(/\/$/, '') + '/'

const title = 'Covid bez bariér'
const description = 'Covid bez bariér – interaktivní mapa bezbariérových míst na testování a očkování proti Covid-19'

const fs = require('fs')

const appVersion = JSON.parse(fs.readFileSync('./package.json')).version || 0

export default {
    target: 'static',

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
            {
                rel: "preconnect",
                href: "https://a.tile.osm.org/",
                crossorigin: true
            },
            {
                rel: "preconnect",
                href: "https://b.tile.osm.org/",
                crossorigin: true
            },
            {
                rel: "preconnect",
                href: "https://c.tile.osm.org/",
                crossorigin: true
            },
            {
                rel: "preconnect",
                href: "https://vitals.vercel-analytics.com/",
                crossorigin: true
            },
        ]
    },

    css: [],

    plugins: [
        {src: '~/plugins/vue-typer.client.ts'},
        {src: '~/plugins/leaflet-markercluster.client.ts'},
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
        ['nuxt-i18n', {}],
        '@nuxtjs/gtm',
        '@nuxtjs/proxy',
        ["nuxt-rfg-icon", {
            masterPicture: "static/favicon.svg",
            rfg: {
                "iconsPath": "/",
                "design": {
                    "ios": {
                        "pictureAspect": "backgroundAndMargin",
                        "backgroundColor": "#ffffff",
                        "margin": "14%",
                        "assets": {
                            "ios6AndPriorIcons": false,
                            "ios7AndLaterIcons": false,
                            "precomposedIcons": false,
                            "declareOnlyDefaultIcon": true
                        }
                    },
                    "desktopBrowser": {
                        "design": "background",
                        "backgroundColor": "#ffffff",
                        "backgroundRadius": 1,
                        "imageScale": 0.8
                    },
                    "windows": {
                        "pictureAspect": "whiteSilhouette",
                        "backgroundColor": "#2d89ef",
                        "onConflict": "override",
                        "assets": {
                            "windows80Ie10Tile": false,
                            "windows10Ie11EdgeTiles": {
                                "small": false,
                                "medium": true,
                                "big": false,
                                "rectangle": false
                            }
                        }
                    },
                    "androidChrome": {
                        "pictureAspect": "shadow",
                        "themeColor": "#ffffff",
                        "manifest": {
                            "name": "Covid bez bariér",
                            "display": "standalone",
                            "orientation": "notSet",
                            "onConflict": "override",
                            "declared": true
                        },
                        "assets": {
                            "legacyIcon": false,
                            "lowResolutionIcons": false
                        }
                    },
                    "safariPinnedTab": {
                        "pictureAspect": "silhouette",
                        "themeColor": "#6366f1"
                    }
                },
                "settings": {
                    "scalingAlgorithm": "Mitchell",
                    "errorOnImageTooSmall": false,
                    "readmeFile": false,
                    "htmlCodeFile": false,
                    "usePathAsIs": false
                }
            }
        }],
        "@nuxtjs/manifest",
    ],

    publicRuntimeConfig: {
        baseUrl,
        appVersion,
    },

    axios: {
        proxy: true,
    },

    proxy: {
        '/nominatim': {target: 'https://nominatim.openstreetmap.org/search', changeOrigin: true},
        '/covid': {
            target: 'https://onemocneni-aktualne.mzcr.cz',
            changeOrigin: true,
            pathRewrite: {'^/covid/': '/api/v2/covid-19/'}
        },
    },


    build: {},

    sentry: {
        dsn: process.env.SENTRY_DSN || '',
        config: {},
    },

    tailwindcss: {
        jit: true
    },

    gtm: {
        id: process.env.GTM_ID || ''
    },

    i18n: {
        locales: ['cs', 'en'],
        defaultLocale: 'cs',
        vueI18nLoader: true,
    }
}
