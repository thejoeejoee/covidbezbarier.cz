<template>
    <div>
        <div class="flex flex-col min-h-screen">
            <div class="bg-indigo-400">
                <h1 class="
                    font-black pt-8 pb-2 text-center font-mono
                    text-4xl sm:text-5xl lg:text-6xl xl:text-7xl
                    text-gray-50 uppercase
                    ">
                    <!-- TODO: brand logo? -->
                    Covid bez bariér
                </h1>
                <h2 class="
                    sm:text-xl lg:text-xl xl:text-2xl
                    text-center
                    font-sans transform transition-all duration-300
                    px-4
            "
                    :class="{'opacity-1 h-auto': expanded, 'opacity-0 h-0 scale-y-0': !expanded}"
                >
                    <span class="
                        inline-block mx-auto
                        p-2 px-3 lg:p-3 lg:px-6
                        text-gray-50
                        max-w-md
                    ">
                    interaktivní mapa bezbariérových míst pro&nbsp;testování a vakcinaci
                        </span>
                </h2>
            </div>

            <Nuxt/>
        </div>
        <div class="
                h-10 shadow-xl text-center
                leading-loose
        ">
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
export default class DefaultLayout extends Vue {
    get expanded() {
        return this.$store.state.layout.headingExpanded
    }
}
</script>

<style>

</style>
