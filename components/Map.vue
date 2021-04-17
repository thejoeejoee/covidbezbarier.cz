<template>
    <div class="flex-grow relative text-center" ref="root">
        <l-map :zoom=8 :min-zoom=7
               :center="[49.8, 15]"
               :max-bounds="maxBounds" ref="map"
               class="absolute bottom-0 top-0 left-0 right-0">
            <l-tile-layer
                url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
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
                        :options="{title: place.name}"
                    >
                        <l-icon
                            v-bind="markerAttrs"
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
                        :options="{title: place.name}"
                    >
                        <l-icon
                            v-bind="markerAttrs"
                            :icon-url="require('../assets/covid-marker.svg')"
                        />
                    </l-marker>
                </template>
            </l-marker-cluster>
        </l-map>
        <div class="
            flex justify-center
            absolute bottom-0 left-0 right-0

            pointer-events-none z-[430] overflow-y-hidden
        ">
            <PlaceDetail
                :place="placeInDetail"
                @close="placeInDetail = null"
            />
        </div>
    </div>
</template>

<script lang="ts">
import {Component, Vue, Watch} from "nuxt-property-decorator";
import ResizeObserver from 'resize-observer-polyfill'
import * as _ from 'lodash'
import {PlaceType, TestingPlace, VaccinationPlace} from "~/store/places";
import {Location} from "~/store/map";
import {LatLngBounds} from "leaflet";

const loadNutsGeoJson = () => import('~/assets/nuts.json').then(m => m.default || m)

@Component({})
export default class Map extends Vue {
    maxBounds: LatLngBounds | null = null

    markerAttrs = {
        iconSize: [48, 48],
        iconAnchor: [24, 48],
    }

    nutsGeoJson: any | null = null;

    nutsStyleFunction: Function = () => {
        return {
            weight: 2,
            color: "rgb(129, 140, 248)",
            opacity: .8,
            fillOpacity: 0
        };
    };
    private onResize!: CallableFunction;

    get map(): any {
        return this.$refs.map
    }

    async mounted() {
        this.onResize = _.debounce(() => {
            this.$nextTick(() => {
                if (this.$refs.map)
                    (this.$refs.map as any).mapObject.invalidateSize();
            })
        }, 500)

        const obs = new ResizeObserver(this.onResize as any)
        obs.observe(this.$refs.root as Element)
        window.addEventListener("resize", this.onResize as any);

        this.maxBounds = this.$L.latLngBounds(
            this.$L.latLng(51.2, 12),
            this.$L.latLng(48.5, 19),
        );

        this.nutsGeoJson = await loadNutsGeoJson();

        const hash: string = this.$route.hash.slice(1)
        if (hash) {
            const [type, ...id] = hash.split('-')
            const places = {
                [PlaceType.VACCINATION]: this.$store.state.places.vaccinationPlaces,
                [PlaceType.TESTING]: this.$store.state.places.testingPlaces,
            }[type] || [];

            const place = _.find<VaccinationPlace | TestingPlace>(places, {id: id.join('-')});
            if (place)
                await this.selectPlace(
                    {latlng: {lat: place.latitude, lng: place.longitude}},
                    place
                )
            else
                await this.$router.push({hash: '#'})
        }
    }

    async selectPlace($event: any, place: TestingPlace | VaccinationPlace | null) {
        this.placeInDetail = place
        const {latlng}: { latlng: any } = $event;

        this.map.mapObject.setView({
                lat: latlng.lat - 0.001,
                lng: latlng.lng,
            },
            15, // TODO: base detail zoom on starting zoom
            {animation: true});

        if (place)
            await this.$router.push({hash: `${place.type}-${place.id}`})
    }

    set placeInDetail(place: TestingPlace | VaccinationPlace | null) {
        this.$store.commit('places/setPlaceInDetail', place)
        if (!place) this.$router.push({hash: '#'})
    }

    get placeInDetail(): TestingPlace | VaccinationPlace | null {
        return this.$store.state.places.placeInDetail
    }

    @Watch('$store.state.map.targetLocation', {deep: true})
    onTargetLocationUpdate(location: Location) {
        this.map.mapObject.setView({
                lat: location.lat,
                lng: location.lng,
            },
            12,
            {animation: true}
        );
    }

    beforeDestroy() {
        window.removeEventListener("resize", this.onResize as any);
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
