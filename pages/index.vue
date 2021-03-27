<template>
    <div class="w-full flex-grow flex flex-col">
        <!-- TODO: extract to standalone component -->
        <div class="
            flex items-center justify-center
            bg-indigo-400
            z-[420]
            ">
            <div class="
                flex flex-row relative mr-5 ml-2 w-36 justify-end
            " :class="{
                '-bottom-0' : this.isCollapsed,
                '-bottom-8 -mt-5' : !this.isCollapsed,
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
                >
                    <img src="../assets/covid.svg" alt="" width="40">
                </button>
                <button
                    class="
                        border-green-300 bg-green-50
                        rounded-r-full p-3 pr-4
                        border-r-4 border-t-4 border-b-4 border-green-300
                    "
                    :class="{
                        'border-green-300 bg-green-50': $store.state.places.showVaccination,
                        'border-gray-500 bg-gray-300': !$store.state.places.showVaccination,
                    }"
                    @click="$store.commit('places/showVaccination', !$store.state.places.showVaccination)"
                >
                    <img src="../assets/syringe.svg" alt="" width="40">
                </button>
            </div>
            <label
                class="flex-grow-0 flex-auto relative transition-all duration-300 max-w-full"
                :class="{
                        'my-20 lg:my-36 -bottom-0' : this.isCollapsed,
                        'my-18 -bottom-8 -mt-5' : !this.isCollapsed,
                    }"

                for="searchInput"
            >
                <input
                    class="
                    text-2xl p-4 pl-5 rounded-full justify-self-center
                    focus-within:shadow-xl transition-all duration-300
                    border-4 border-green-300 focus:border-green-500
                    text-gray-700
                    w-11/12 block mx-auto
                    bg-green-50
                    "
                    :class="[
                        this.isCollapsed ? '' : ''
                    ]"
                    v-model="searchInput"
                    type="text" id="searchInput"
                >
                <span class="
                        absolute top-1/4 text-2xl pl-10
                    "><client-only><vue-typer
                    v-if="isCollapsed"
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
                    flex flex-row relative ml-5 mr-2 w-36 justify-start
                "
                :class="{
                    '-bottom-0' : this.isCollapsed,
                    '-bottom-8 -mt-5' : !this.isCollapsed,
            }">
                <button
                    @click="locateByPosition"
                    class="
                        border-green-300 bg-green-50
                        rounded-full p-3
                        border-4 border-green-300
                        disabled:border-gray-500 disabled:bg-gray-300
                    "
                    :disabled="!$geolocation.supported"
                    title="..."
                >
                    <img src="../assets/location.svg" alt="" width="40">
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
import Geolocation = GeolocationPlugin.Geolocation;

@Component({})
export default class IndexPage extends Vue {
    searchInputRaw: string = ''

    proposalPlaces: string[] = ['Brno', 'Olomouc', 'Praha', 'Liberec', 'České Budějovice', 'Červená Lhota']

    get searchInput(): string {
        return this.searchInputRaw
    }

    set searchInput(v: string) {
        this.searchInputRaw = v || ''
        this.$store.commit('layout/setHeadingExpanded', v.length == 0)
    }

    get isCollapsed() {
        return this.$store.state.layout.headingExpanded && !this.$store.state.places.placeInDetail
    }

    async fetch() {
        return Promise.all([
            this.$store.dispatch('places/loadTestingPlaces'),
            this.$store.dispatch('places/loadVaccinationPlaces'),
        ]);
    }

    async locateByPosition() {
        console.log(await this.$geolocation.getCurrentPosition())
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
