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
            absolute h-48 md:h-[33vh] bottom-0 left-0 right-0
            pointer-events-none z-[430]
        ">
            <div v-if="placeInDetail" class="
            rounded-xl bg-white
            p-4 m-5
            z-[430] pointer-events-auto

            max-w-full
            left-0 right-0


            flex flex-col justify-between
            transition-opacity duration-300 opacity-1
        ">
                <div class="flex justify-between">
                    <h2 class="text-md font-bold">{{ placeInDetail.name }}</h2>
                    <button @click="placeInDetail = null">&cross;</button>
                </div>
                {{ placeInDetail.address }}
                <button class="
                bg-indigo-700 text-white
                uppercase rounded-md
                p-2 self-end px-4
            ">přejít na web</button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {Component, Vue} from "nuxt-property-decorator";
import ResizeObserver from 'resize-observer-polyfill'
import * as _ from 'lodash'
import {TestingPlace, VaccinationPlace} from "~/store/places";
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

    get map() : any {
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
        const {latlng} : {latlng: any} = $event;

        this.map.mapObject.setView({
            lat: latlng.lat - 0.001,
            lng: latlng.lng,
        }, 15, { animation: true });
    }

    set placeInDetail(place: TestingPlace | VaccinationPlace | null) {
        this.$store.commit('places/setPlaceInDetail', place)
    }

    get placeInDetail(): TestingPlace | VaccinationPlace | null {
        return this.$store.state.places.placeInDetail
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
