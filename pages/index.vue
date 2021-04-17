<template>
    <div class="w-full flex-grow flex flex-col">
        <h2 class="bg-indigo-500 text-center text-green-300 pt-2 pb-1 font-black font-mono uppercase">
            <nuxt-link :to="localePath('/about')">{{ $t("about") }}</nuxt-link>
            &centerdot;
            <LocaleSwitchLink />
        </h2>
        <div class="
            flex items-center
            bg-indigo-500
            flex-row
            justify-center
            flex-wrap content-start
            z-[420]
            ">
            <div class="
                w-1/2 relative
                md:w-36 md:mr-5 md:ml-2 md:flex-1 md:pl-0
                pl-2 min-w-[9rem]

                self-start  md:self-center
                order-1 md:order-none
                md:text-right
            " :class="{
                '-bottom-0' : this.isExpanded,
                '-bottom-8 -mt-5 md:block hidden' : !this.isExpanded,
            }">
                <button
                    class="
                        rounded-l-full p-3 pl-4
                        border-l-4 border-t-4 border-b-4
                    "
                    :class="{
                        'border-green-300 bg-green-50': $store.state.places.showTesting,
                        'border-gray-500 bg-gray-300': !$store.state.places.showTesting,
                    }"
                    @click="$store.commit('places/showTesting', !$store.state.places.showTesting)"
                    :aria-label="$store.state.places.showTesting ? $t('filter.testingHide') : $t('filter.testingShow')"
                    :title="$store.state.places.showTesting ? $t('filter.testingHide') : $t('filter.testingShow')"
                >
                    <img src="../assets/covid.svg" :alt="$t('testingPlaces')"  width="40" height="40">
                </button><!--
                --><button
                    class="
                        rounded-r-full p-3 pr-4
                        border-r-4 border-t-4 border-b-4 border-green-300
                    "
                    :class="{
                        'border-green-300 bg-green-50': $store.state.places.showVaccination,
                        'border-gray-500 bg-gray-300': !$store.state.places.showVaccination,
                    }"
                    @click="$store.commit('places/showVaccination', !$store.state.places.showVaccination)"
                    :aria-label="$store.state.places.showVaccination ? $t('filter.vaccinationHide') : $t('filter.vaccinationShow')"
                    :title="$store.state.places.showVaccination ? $t('filter.vaccinationHide') : $t('filter.vaccinationShow')"
                >
                    <img src="../assets/syringe.svg" :alt="$t('vaccinationPlaces')" width="40" height="40">
                </button>
            </div>
            <label
                class="
                    md:flex-grow-0 md:flex-auto
                    relative transition-all
                    duration-300 max-w-full

                    order-3 md:order-none
                    mx-2 md:mx-0
                "
                :class="{
                        'my-3 md:my-14 lg:my-20 -bottom-0' : this.isExpanded,
                        'my-18 -bottom-6 md:-bottom-8 -mt-5' : !this.isExpanded,
                    }"
                :title="$t('searchByInput')"
                for="searchInput"
            >
                <input
                    class="
                    text-xl md:text-2xl p-2 md:p-4 pl-4 md:pl-5 rounded-full
                    focus-within:shadow-xl transition-all duration-300
                    border-4 border-green-300 focus:border-green-500
                    text-gray-700
                    block mx-auto w-full
                    bg-green-50
                    "
                    v-model="searchInput"
                    type="text" id="searchInput"
                >
                <span class="
                        absolute top-1/4 text-xl md:text-2xl pl-4 md:pl-5
                    "><client-only><vue-typer
                    v-if="!searchInput.length"
                    :text="proposalPlaces"
                    :repeat="Infinity"
                    initial-action="typing"
                    :pre-type-delay="70"
                    :type-delay="70"
                    :pre-erase-delay="3000"
                    :erase-delay="70"
                    erase-style="backspace"
                    caret-animation="smooth"
                /></client-only></span>
                <svg
                    class="animate-spin absolute right-0 h-10 w-10 top-1/2 -mt-5 text-green-500 mr-4 transition-opacity delay-75"
                    :class="{'opacity-0': !loading, 'opacity-1': loading}"
                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                >
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                <svg
                    class="absolute right-0 h-10 w-10 top-1/2 -mt-5 text-red-300 mr-4 transition-opacity"
                    :class="{'opacity-0': !notFound, 'opacity-1': notFound}"
                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18">
                    <path fill="currentColor" class="opacity-75" d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"/>
                </svg>
            </label>

            <div
                class="
                    flex justify-end
                    md:flex-1
                    relative
                    md:w-36 md:ml-5 md:mr-2
                    pr-2 md:pr-0

                    self-end md:self-center
                    w-auto
                    md:justify-start
                    order-2 md:order-none
                "
                :class="{
                    '-bottom-0' : this.isExpanded,
                    '-bottom-8 -mt-5 md:block hidden' : !this.isExpanded,
            }">
                <button
                    @click="locateByPosition"
                    class="
                        border-green-300 bg-green-50
                        rounded-full p-3
                        border-4 border-green-300
                        disabled:border-gray-500 disabled:bg-gray-300
                    "
                    :disabled="!$geolocation.checkSupport() || geoDisabled"
                    :title="$t('locateByPosition')"
                >
                    <img src="../assets/location.svg" :alt="$t('locateByPosition')" width="40" height="40">
                </button>
            </div>
        </div>

        <div class="bg-gray-50 flex-grow flex">
            <Map></Map>
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
import {TestingPlace} from "~/store/places";
import {GeolocationPlugin} from "vue-geolocation-api";
import debounce from "debounce-async";
import Geolocation = GeolocationPlugin.Geolocation;
import Position = GeolocationPlugin.Position;

@Component({fetchOnServer: false})
export default class IndexPage extends Vue {
    searchInputRaw: string = ''
    geoDisabled = false
    loading = false;
    notFound = false;

    proposalPlaces: string[] = ['Brno', 'Olomouc', 'Praha', 'Ostrava', 'Liberec', 'České Budějovice']

    get searchInput(): string {
        return this.searchInputRaw
    }

    set searchInput(v: string) {
        this.searchInputRaw = v || '';
        this.$store.commit('layout/setHeadingExpanded', v.length == 0);
        this.loadSearchResults && this.loadSearchResults()
        this.notFound = false
    }

    get isExpanded() {
        return this.$store.state.layout.headingExpanded && !this.$store.state.places.placeInDetail && !this.$store.state.map.targetLocation
    }

    async locateByPosition() {
        this.$gtm.push({event: 'locateByPosition'})
        try {
            this.loading = true;
            const loc: Position = await this.$geolocation.getCurrentPosition();
            this.$store.commit('map/setTargetLocation', {
                lat: loc.coords.latitude,
                lng: loc.coords.longitude,
                acc: loc.coords.accuracy,
            })
        } catch (e) {
            this.geoDisabled = true
        }
        this.loading = false;
    }

    async loadSearchResults() {
        if (!this.searchInputRaw.length) return;
        this.$gtm.push({event: 'search', input: this.searchInputRaw})
        this.loading = true;
        const BASE_URL = process.env.NODE_ENV === 'production' ? '/nominatim' : 'https://nominatim.openstreetmap.org/search';
        try {
            const {data} = await this.$axios.get(
                `${BASE_URL}?format=json&polygon=0&addressdetails=0&countrycodes=cz&limit=1&q=${encodeURIComponent(this.searchInputRaw)}`
            )

            if (data.length)
                this.$store.commit('map/setTargetLocation', {
                    lat: Number(data[0].lat),
                    lng: Number(data[0].lon),
                    acc: 0,
                })
            else {
                this.notFound = true
            }

            this.loading = false;
        } catch (e) {
            this.loading = false;
            this.notFound = true;
            throw e;
        }
    }

    async fetch() {
        await Promise.all([
            this.$store.dispatch('places/loadTestingPlaces'),
            this.$store.dispatch('places/loadVaccinationPlaces'),
        ]);
    }

    created() {
        this.loadSearchResults = debounce(this.loadSearchResults, 750)
    }
}
</script>

<style lang="scss">
.vue-typer {
    .caret {
        display: none;
    }

    .custom.char.typed {
        @apply text-gray-500;
    }
}
</style>
<i18n>
{
    "cs": {
        "about": "O projektu",
        "searchByInput": "Hledat dle adresy",
        "locateByPosition": "Lokalizovat dle vaší polohy",
        "testingPlaces": "Testovací místa",
        "vaccinationPlaces": "Vakcinační místa",
        "filter": {
            "testingHide": "Skrýt testovací místa",
            "vaccinationHide": "Skrýt vakcinační místa",
            "testingShow": "Zobrazit testovací místa",
            "vaccinationShow": "Zobrazit vackinační místa"
        }
    },
    "en": {
        "about": "About us",
        "searchByInput": "Search by address",
        "locateByPosition": "Locate by your position",
        "testingPlaces": "Testing sites",
        "vaccinationPlaces": "Vaccination sites",
        "filter": {
            "testingHide": "Hide testing sites",
            "vaccinationHide": "Hide vaccination sites",
            "testingShow": "Show testing sites",
            "vaccinationShow": "Show vaccination sites"
        }
    }
}
</i18n>
