<template>
    <div class="w-full">
            <!-- TODO: extract to standalone component -->
            <div class="
                flex justify-around items-center
                from-indigo-400 to-indigo-300 bg-gradient-to-b
                shadow
                ">
                <label
                    class="flex-grow-0 flex-auto relative transition-all  duration-300 max-w-full"
                    :class="{
                        'my-20 lg:my-36 -bottom-0' : this.isSearchEmpty,
                        'my-18 -bottom-8 -mt-5' : !this.isSearchEmpty,
                    }"

                    for="searchInput"
                >
                    <input
                        v-model="searchInput"
                        :class="[
                        this.isSearchEmpty ? '' : ''
                    ]"
                        class="
                    text-2xl p-4 pl-5 rounded-full shadow
                    focus-within:shadow-2xl transition-all duration-300
                    border-4 border-green-300 focus:border-green-500
                    text-gray-700
                    w-11/12 block mx-auto
                    bg-green-50
                    "
                        type="text" id="searchInput"
                    >
                    <span class="
                        absolute top-1/4 text-2xl pl-10
                    "><client-only><vue-typer
                        v-if="isSearchEmpty"
                        :text="proposalPlaces"
                        :repeat="Infinity"
                        initial-action="typing"
                        :pre-type-delay="70"
                        :type-delay="70"
                        :pre-erase-delay="3000"
                        :erase-delay="70"
                        erase-style="backspace"
                        caret-animation="smooth"
                        @typed="onTyped"
                    /></client-only></span>
                </label>
            </div>

        <div class="container max-w-screen-sm mx-auto">
            <ul class="pt-12" v-show="!this.isSearchEmpty">
                <li
                    v-for="place in testingPlaces"
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

    proposalPlaces: string[] = ['Brno', 'Olomouc', 'Praha', 'Liberec', 'České Budějovice', 'Červená Lhota']

    get searchInput(): string {
        return this.searchInputRaw
    }

    set searchInput(v: string) {
        this.searchInputRaw = v || ''
        this.$nuxt.$emit('expandChange', v.length == 0)
    }

    get isSearchEmpty(): boolean {
        return this.searchInputRaw.length == 0
    }

    async fetch() {
        await this.$store.dispatch('places/loadTestingPlaces');
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

    onTyped() {
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
