<template>
    <div class="w-full min-h-screen relative overflow-x-hidden">
        <div class="
                from-blue-500 to-indigo-400 bg-gradient-to-b
            ">
            <h1 class="
                font-black pt-8 pb-4 text-center font-mono
                text-4xl sm:text-5xl lg:text-6xl xl:text-7xl
                text-gray-50
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
                :class="{'opacity-1 h-auto': expanded, 'opacity-0 h-0': !expanded}"
            >
                <span class="
                    bg-gray-100 inline-block rounded-full mx-auto
                    p-2 px-3 lg:p-3 lg:px-6 max-w-xl
                    shadow-xl text-gray-700
                    max-w-md
                ">
                interaktivní mapa bezbariérových míst pro zvládání Covid-19
                    </span>
            </h2>
        </div>

        <Nuxt/>

        <div class="
                from-gray-600 to-gray-500 bg-gradient-to-b
                h-10 shadow-xl absolute bottom-0 left-0 right-0 text-center
                leading-loose
        ">
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
    data() {
        return {expanded: true}
    },
    created() {
        this.$nuxt.$on('expandChange', (v: boolean) => {
            this.expanded = v;
        })
    }
})
</script>

<style>

</style>
