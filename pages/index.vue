<template>
    <div class="w-full flex-grow flex flex-col">
        <!-- TODO: extract to standalone component -->
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
                    aria-label="Testovací místa"
                >
                    <img src="../assets/covid.svg" alt="" width="40" height="40">
                </button><button
                    class="
                        bg-green-50
                        rounded-r-full p-3 pr-4
                        border-r-4 border-t-4 border-b-4 border-green-300
                    "
                    :class="{
                        'border-green-300 bg-green-50': $store.state.places.showVaccination,
                        'border-gray-500 bg-gray-300': !$store.state.places.showVaccination,
                    }"
                    @click="$store.commit('places/showVaccination', !$store.state.places.showVaccination)"
                    aria-label="Vakcinační místa"
                >
                    <img src="../assets/syringe.svg" alt="" width="40" height="40">
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
                        'my-3 md:my-20 lg:my-32 -bottom-0' : this.isExpanded,
                        'my-18 -bottom-6 md:-bottom-8 -mt-5' : !this.isExpanded,
                    }"

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
                    :class="{'bg-green-50': !loading, 'bg-red-50': loading}"
                ><!-- TODO loading state -->
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
                    :disabled="!$geolocation.supported || geoDisabled"
                    title="..."
                >
                    <img src="../assets/location.svg" alt="" width="40" height="40">
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

    proposalPlaces: string[] = ['Brno', 'Olomouc', 'Praha', 'Liberec', 'České Budějovice', 'Červená Lhota']

    get searchInput(): string {
        return this.searchInputRaw
    }

    set searchInput(v: string) {
        this.searchInputRaw = v || '';
        this.$store.commit('layout/setHeadingExpanded', v.length == 0);
        this.loadSearchResults && this.loadSearchResults()
    }

    get isExpanded() {
        return this.$store.state.layout.headingExpanded && !this.$store.state.places.placeInDetail
    }

    async fetch() {
        await Promise.all([
            this.$store.dispatch('places/loadTestingPlaces'),
            this.$store.dispatch('places/loadVaccinationPlaces'),
        ]);
    }

    async locateByPosition() {
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
        this.loading = true;
        const BASE_URL = process.env.NODE_ENV === 'production' ?  '/nominatim' : 'https://nominatim.openstreetmap.org/search';
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
            else;
                // TODO: signalize no results
            this.loading = false;
        } catch (e) {this.loading = false; throw e;}
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
}
</i18n>
