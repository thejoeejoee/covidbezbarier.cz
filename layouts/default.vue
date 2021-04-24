<template>
    <div>
        <div class="flex flex-col min-h-screen">
            <div class="bg-indigo-500">
                <h1 class="
                    font-black pt-4 md:pt-8 pb-2 text-center font-mono
                    text-2xl sm:text-4xl lg:text-6xl xl:text-7xl
                    text-gray-50 uppercase
                    ">
                    {{ $t('headline') }}
                </h1>
                <h2 class="
                    sm:text-xl lg:text-xl xl:text-2xl
                    text-center
                    font-sans transform transition-all duration-300
                    px-4
            "
                    :class="{'opacity-1 h-auto': expanded, 'opacity-0 h-0 scale-y-0': !expanded}"
                >
                    <span class="
                        inline-block mx-auto
                        p-2 px-3 lg:p-3 lg:px-6
                        text-gray-50
                        max-w-md
                    ">
                        {{ $t('description') }}
                    </span>
                </h2>
            </div>

            <Nuxt keep-alive/>
        </div>
    </div>
</template>

<script lang="ts">
import {createNamespacedHelpers} from 'vuex'
import * as _ from 'lodash'
import {
    Component,
    Inject,
    Model,
    Prop,
    Provide,
    Vue,
    Watch,
    VuexAction,
    VuexModule
} from "nuxt-property-decorator"


@Component({})
export default class DefaultLayout extends Vue {
    async fetch() {
        await Promise.all([
            this.$store.dispatch('places/loadTestingPlaces'),
            this.$store.dispatch('places/loadVaccinationPlaces'),
        ]);
    }

    get expanded() {
        return this.$store.state.layout.headingExpanded && !this.$store.state.places.placeInDetail && !this.$store.state.map.targetLocation
    }

    head() {
        return {
            ...this.$nuxtI18nHead({addSeoAttributes: true}),
            title: this.$t('headline'),
            description: this.$t('description'),
            meta: [
                {
                    hid: 'description',
                    name: 'description',
                    content: this.$t('long')
                },
                {
                    hid: 'og:description',
                    property: 'og:description',
                    content: this.$t('long')
                },
                {
                    hid: 'twitter:description',
                    name: 'twitter:description',
                    content: this.$t('long')
                },
                {
                    hid: 'og:title',
                    property: 'og:title',
                    content: this.$t('headline')
                },
                {
                    hid: 'twitter:title',
                    name: 'twitter:title',
                    content: this.$t('headline')
                },
            ]
        }
    }
}
</script>

<style>

</style>

<i18n>
{
    "cs": {
        "headline": "Covid bez bariér",
        "description": "interaktivní mapa bezbariérových míst pro testování a vakcinaci",
        "long": "Covid bez bariér – interaktivní mapa bezbariérových míst na testování a očkování proti Covid-19"
    },
    "en": {
        "headline": "Covid without barriers",
        "description": "map with places with wheelchair access for testing and vaccination",
        "long": "Covid without Barriers – an interactive map of barrier-free sites for testing and vaccination against Covid-19"
    }
}
</i18n>
