<template>
    <div class="flex-grow" ref="root">
        <client-only>
            <l-map :zoom=11 :center="[50.08, 14.5]" ref="map">
                <!-- <l-tile-layer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"></l-tile-layer> -->
                <l-tile-layer url="https://mapserver.mapy.cz/turist-m/{z}-{x}-{y}"></l-tile-layer>
                <l-marker
                    v-for="place in $store.state.places.testingPlaces"
                    :key="place.odberove_misto_id"
                    :lat-lng="[place.latitude, place.longitude]"
                >
                    <l-popup>
                        <div>
                            {{ place.odberove_misto_nazev  }}
                        </div>
                    </l-popup>
                </l-marker>
            </l-map>
        </client-only>
    </div>
</template>

<script lang="ts">
import {Component, Vue} from "nuxt-property-decorator";
import ResizeObserver from 'resize-observer-polyfill'
import * as _ from 'lodash'

@Component({})
export default class Map extends Vue {
    mounted() {
        const obs = new ResizeObserver(_.debounce(() => {
            (this.$refs.map as any).mapObject.invalidateSize();
        }, 500))
        obs.observe(this.$refs.root as Element)
    }
}
</script>

<style scoped>

</style>
