<template>
    <div class="flex-grow relative text-center" ref="root">
        <client-only>
            <l-map :zoom=8 :min-zoom=7
                   :center="[49.8, 15]"
                   :max-bounds="maxBounds" ref="map"
                   class="absolute bottom-0 top-0 left-0 right-0">
                <l-tile-layer
                    url="https://a.tile.osm.org/{z}/{x}/{y}.png"
                ></l-tile-layer>

                <l-geo-json
                    v-if="nutsGeoJson != null"
                    :geojson="nutsGeoJson"
                    :options-style="nutsStyleFunction"
                ></l-geo-json>

                <!--<l-tile-layer url="https://mapserver.mapy.cz/turist-m/{z}-{x}-{y}"></l-tile-layer>-->


                <l-marker-cluster
                    :options="{
                        showCoverageOnHover: false,
                        spiderfyOnMaxZoom: false,
                        disableClusteringAtZoom: 12
                    }"
                >
                    <template
                        v-if="$store.state.places.showVaccination"
                    >
                        <l-marker
                            v-for="place in $store.state.places.vaccinationPlaces"
                            :key="place.id"
                            :lat-lng="[place.latitude, place.longitude]"
                            @click="selectPlace($event, place)"
                        >
                            <l-icon
                                :icon-size="[32, 32]"
                                :icon-anchor="[16, 32]"
                                :icon-url="require('../assets/syringe-marker.svg')"
                            />
                        </l-marker>
                    </template>
                    <template
                        v-if="$store.state.places.showTesting"
                    >
                        <l-marker
                            v-for="place in $store.state.places.testingPlaces"
                            :key="place.id"
                            :lat-lng="[place.latitude, place.longitude]"
                            @click="selectPlace($event, place)"
                            :name="place.name"
                        >
                            <l-icon
                                :icon-size="[32, 32]"
                                :icon-anchor="[16, 32]"
                                :icon-url="require('../assets/covid-marker.svg')"
                            />
                        </l-marker>
                    </template>
                </l-marker-cluster>
            </l-map>
        </client-only>

        <div class="
            flex justify-center
            absolute bottom-0 left-0 right-0

            pointer-events-none z-[430]
        ">
            <div v-if="placeInDetail" class="
            rounded-xl bg-white
            p-4 m-5
            z-[430] pointer-events-auto

            max-w-full border-t-4 border-indigo-700
            left-0 right-0 shadow-xl

            flex flex-col justify-between
            transition-opacity duration-300 opacity-1
        ">
                <div class="flex justify-between mb-2 items-start">
                    <h2
                        class="text-md font-bold whitespace-pre-line text-left"
                        v-text="placeInDetail.name.split(',').join('\n')"
                    ></h2>
                    <!-- TODO: nah, ugly close icon, replace by better -->
                    <button class="ml-4" @click="placeInDetail = null">&cross;</button>
                </div>
                <div class="flex flex-row justify-between items-start gap-x-2">
                    <a
                        class="
                        align-top rounded-md bg-gray-100
                        p-2 block
                        md:flex md:flex-row md:items-center md:gap-2

                    "
                        :href="`http://maps.google.com/maps?q=${encodeURIComponent(placeInDetail.address)}`"
                        target="_blank" rel="noopener"
                    >
                        <div class="hidden md:block select-none">
                            <img src="../assets/location.svg" alt="" width="40" height="40">
                        </div>
                        <address
                            class="whitespace-pre-line text-left pr-2 font-mono not-italic"
                            v-text="placeInDetail.address.split(',').join('\n')"
                        ></address>
                    </a>

                    <div class="flex flex-col gap-y-1">
                        <template v-if="isVaccinationInDetail">
                            <span
                                class="
                                    bg-gray-300 rounded-full text-xs p-1 px-2 text-gray-800
                            ">vakcinační místo</span>
                        </template>
                        <template v-else>
                            <span
                                v-if="placeInDetail.nasofaryngealni_odber"
                                class="
                                bg-gray-300 rounded-full text-xs p-1 px-2 text-gray-800
                            ">nasofaryngeální odběr</span>
                            <span
                                v-if="placeInDetail.orofaryngealni_odber"
                                class="
                                bg-gray-300 rounded-full text-xs p-1 px-2 text-gray-800
                            "
                            >orofaryngeální odběr</span>
                            <span
                                v-if="placeInDetail.antigenni_odber"
                                class="
                                bg-gray-300 rounded-full text-xs p-1 px-2 text-gray-800
                            "
                            >antigenní odběr</span>
                        </template>
                    </div>
                </div>

                <div v-if="isVaccinationInDetail" class="mt-2">
                    <div
                        v-if="!placeInDetail.operacni_status"
                        class="
                            my-2 p-2 px-4 bg-yellow-200 text-red-600 rounded-md
                            shadow
                        "
                    >
                        místo momentálně nepřijímá rezervace
                    </div>
                    <!-- TODO: show external icon -->
                    <!-- TODO: don't forget to mention opendatalab in `about` page -->
                    <a
                        :href="`https://ockovani.opendatalab.cz/misto/${placeInDetail.id}`"
                        target="_blank" rel="noopener"
                        class="
                            bg-indigo-700 text-white
                            uppercase rounded-md block
                            p-2 px-4 text-xs mb-1 shadow
                    ">statistiky čekací doby</a>
                    <a
                        :href="`https://cfa.uzis.cz/vaccination-centers/${placeInDetail.id}`"
                        target="_blank" rel="noopener"
                        class="
                            bg-indigo-700 text-white
                            uppercase rounded-md block
                            p-2 px-4 text-xs shadow
                    ">oficiální stránka na MZČR</a>
                </div>
                <div v-else class="mt-2">
                    <div
                        v-if="!placeInDetail.operacni_status"
                        class="
                            mb-2 p-2 px-4 bg-yellow-200 text-red-600 rounded-md
                            shadow
                        "
                    >
                        místo je momentálně mimo provoz
                    </div>
                    <!-- TODO: show external icon -->
                    <a
                        :href="`https://cfa.uzis.cz/sampling-points/${placeInDetail.id}`"
                        target="_blank" rel="noopener"
                        class="
                            bg-indigo-700 text-white
                            uppercase rounded-md block
                            p-2 px-4 text-xs mt-2 shadow
                    ">oficiální stránka na MZČR</a>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {Component, Vue} from "nuxt-property-decorator";
import ResizeObserver from 'resize-observer-polyfill'
import * as _ from 'lodash'
import {PlaceType, TestingPlace, VaccinationPlace} from "~/store/places";
import {LatLngBounds} from "leaflet";

const loadNutsGeoJson = () => import('~/assets/nuts.json').then(m => m.default || m)

@Component({})
export default class Map extends Vue {
    maxBounds: LatLngBounds | null = null

    nutsGeoJson: any | null = null;

    nutsStyleFunction: Function = () => {
        return {
            weight: 2,
            color: "rgb(129, 140, 248)",
            opacity: .8,
            fillOpacity: 0
        };
    };

    get map(): any {
        return this.$refs.map
    }

    async mounted() {
        const obs = new ResizeObserver(_.debounce(() => {
            this.$nextTick(() => {
                if (this.$refs.map)
                    (this.$refs.map as any).mapObject.invalidateSize();
            })
        }, 500))
        obs.observe(this.$refs.root as Element)

        this.maxBounds = this.$L.latLngBounds(
            this.$L.latLng(51.2, 12),
            this.$L.latLng(48.5, 19),
        );

        this.nutsGeoJson = await loadNutsGeoJson();
    }

    selectPlace($event: any, place: TestingPlace | VaccinationPlace | null) {
        this.placeInDetail = place
        console.log($event)
        const {latlng}: { latlng: any } = $event;

        this.map.mapObject.setView({
                lat: latlng.lat - 0.001,
                lng: latlng.lng,
            },
            15, // TODO: base detail zoom on starting zoon
            {animation: true});
        if (!place) return;

        this.$router.push({hash: `${place.type}-${place.id}`})
    }

    set placeInDetail(place: TestingPlace | VaccinationPlace | null) {
        this.$store.commit('places/setPlaceInDetail', place)
    }

    get placeInDetail(): TestingPlace | VaccinationPlace | null {
        return this.$store.state.places.placeInDetail
    }

    get isVaccinationInDetail() {
        return this.placeInDetail?.type == PlaceType.VACCINATION
    }
}
</script>

<style lang="scss">
@import "leaflet.markercluster/dist/MarkerCluster.css";
@import "leaflet.markercluster/dist/MarkerCluster.Default.css";

.marker-cluster-small, .marker-cluster-medium, .marker-cluster-large {
    @apply bg-opacity-60;
    @apply bg-indigo-400;
    div {
        @apply bg-opacity-60;
        @apply bg-indigo-600;
        @apply text-gray-100;
    }
}
</style>
