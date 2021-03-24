<template>
    <div class="flex-grow relative text-center" ref="root">
        <client-only>
            <l-map :zoom=8 :center="[49.8, 15]" ref="map"
                   class="absolute bottom-0 top-0 left-0 right-0">
                <l-tile-layer
                    url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"

                ></l-tile-layer>
                <!--<l-tile-layer url="https://mapserver.mapy.cz/turist-m/{z}-{x}-{y}"></l-tile-layer>-->
                <l-marker
                    v-for="place in $store.state.places.testingPlaces"
                    :key="place.id"
                    :lat-lng="[place.latitude, place.longitude]"
                    @click="selectPlace($event, place)"
                    :name="place.name"
                >
                    <l-icon
                        :icon-size="[42, 42]"
                        :icon-anchor="[21, 42]"
                        :icon-url="require('../assets/covid-marker.svg')"

                    />
                </l-marker>

                <l-marker
                    v-for="place in $store.state.places.vaccinationPlaces"
                    :key="place.id"
                    :lat-lng="[place.latitude, place.longitude]"
                    @click="selectPlace($event, place)"
                >
                    <l-icon
                        :icon-size="[42, 42]"
                        :icon-anchor="[21, 42]"
                        :icon-url="require('../assets/syringe-marker.svg')"
                    />
                </l-marker>
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

@Component({})
export default class Map extends Vue {
    get map() : any {
        return this.$refs.map
    }

    mounted() {
        const obs = new ResizeObserver(_.debounce(() => {
            (this.$refs.map as any).mapObject.invalidateSize();
        }, 500))
        obs.observe(this.$refs.root as Element)
    }

    selectPlace($event: any, place: TestingPlace | VaccinationPlace | null) {
        this.placeInDetail = place
        console.log($event)
        const {latlng} : {latlng: any} = $event;

        this.map.mapObject.setView({
            lat: latlng.lat - 0.001,
            lng: latlng.lng,
        }, 17, { animation: true });
    }

    set placeInDetail(place: TestingPlace | VaccinationPlace | null) {
        this.$store.commit('places/setPlaceInDetail', place)
    }

    get placeInDetail(): TestingPlace | VaccinationPlace | null {
        return this.$store.state.places.placeInDetail
    }
}
</script>

<style>
    .grayscale {
        filter: grayscale(50%);
    }
</style>
