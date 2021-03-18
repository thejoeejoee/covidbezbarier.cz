<template>
    <div class="w-full">
        <div class="w-full">
            <h1 class="
                font-black py-8 text-center font-mono
                from-blue-500 to-indigo-400 bg-gradient-to-b
                text-4xl sm:text-5xl lg:text-6xl xl:text-7xl
                ">
                Covid bez bariér
            </h1>

            <!-- TODO: extract to standalone component -->
            <div class="
                flex justify-around items-center
                from-indigo-400 to-indigo-300 bg-gradient-to-b
                shadow
                ">
                <label
                    :class="{
                    'my-20 lg:my-36 -bottom-0' : this.isSearchEmpty,
                    'my-18 -bottom-8' : !this.isSearchEmpty,
                }"
                    class="flex-grow-0 flex-auto relative transition-all max-w-full"
                >
                    <input
                        v-model="searchInput"
                        :class="[
                        this.isSearchEmpty ? '' : ''
                    ]"
                        class="
                    text-2xl p-4 pl-5 rounded-full shadow
                    focus-within:shadow-2xl transition-all
                    border-4 border-indigo-300 text-gray-600
                    focus:border-indigo-700 w-11/12 block mx-auto
                    "
                        type="text"
                    >
                </label>
            </div>
        </div>

        <div class="container max-w-screen-sm mx-auto">
            <ul class="pt-12" v-show="!this.isSearchEmpty">
                <li
                    v-for="place in testingPlaces"
                    class=""
                >
                    {{ place.odberove_misto_nazev }}
                </li>
            </ul>
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

@Component({})
export default class IndexPage extends Vue {
    searchInputRaw: string = ''

    get searchInput(): string {
        return this.searchInputRaw
    }

    set searchInput(v: string) {
        this.searchInputRaw = v || ''
    }

    get isSearchEmpty(): boolean {
        return this.searchInputRaw.length == 0
    }

    get testingPlaces(): TestingPlace[] {
        // TODO: distance filtering
        const s = this.searchInput.toLowerCase();
        return _.slice(
            _.filter(
                this.$store.state.places.testingPlaces,
                (place: TestingPlace) => !this.searchInput.length || place.odberove_misto_nazev.toLowerCase().includes(s)
            ),
            0,
            20,
        )

    }

    async created() {
        await this.$store.dispatch('places/loadTestingPlaces');
    }
}
</script>

<style>
</style>
