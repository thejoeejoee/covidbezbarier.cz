<template>
    <div v-if="place"
         class="
            rounded-xl bg-white
            p-4 m-5
            z-[430] pointer-events-auto

            max-w-full border-t-4 border-indigo-700
            left-0 right-0 shadow-xl

            flex flex-col justify-between gap-y-3 lg:gap-y-5
            transition-opacity duration-300 opacity-1
        ">
        <div class="flex justify-between items-start">
            <h2
                class="md:text-md lg:text-xl font-bold whitespace-pre-line text-left"
                v-text="place.name.split(',').join('\n')"
            ></h2>
            <!-- TODO: nah, ugly close icon, replace by better -->
            <button class="ml-4" @click="$emit('close')">&cross;</button>
        </div>
        <div
            v-if="!place.operacni_status"
            class="
                p-2 px-4 bg-yellow-200 text-red-600 rounded-md
                shadow lg:text-lg
            "
        >
            <template v-if="isVaccinationInDetail">
                místo momentálně nepřijímá rezervace
            </template>
            <template v-else>
                místo je momentálně mimo provoz
            </template>
        </div>
        <div class="flex flex-row justify-between items-start gap-x-2">
            <a
                class="
                    align-top rounded-md bg-gray-100
                    p-2 block
                    md:flex md:flex-row md:items-center md:gap-2
                "
                :href="`http://maps.google.com/maps?q=${encodeURIComponent(place.address)}`"
                target="_blank" rel="noopener"
            >
                <div class="hidden md:block select-none">
                    <img src="../assets/location.svg" alt="" width="40" height="40">
                </div>
                <address
                    class="whitespace-pre-line text-left pr-2 font-mono not-italic lg:text-lg"
                    v-text="place.address.split(/[,;]/).join('\n')"
                ></address>
            </a>

            <div class="flex flex-col gap-y-2">
                <template v-if="isVaccinationInDetail">
                    <span
                        v-if="place.bezbarierovy_pristup"
                        class="
                            bg-green-200 rounded-full text-xs p-1 px-2 text-green-900
                            lg:text-lg
                    ">bezbariérový přístup</span>
                    <span
                        class="
                            bg-gray-300 rounded-full text-xs p-1 px-2 text-gray-900
                            lg:text-lg
                    ">vakcinační místo</span>
                </template>
                <template v-else>
                    <span
                        v-if="place.drive_in"
                        class="
                            bg-green-200 rounded-full text-xs p-1 px-2 text-green-900
                            lg:text-lg
                    ">drive in</span>
                    <span
                        v-if="place.antigenni_odber"
                        class="
                            bg-gray-300 rounded-full text-xs p-1 px-2 text-gray-900
                            lg:text-lg
                        "
                    >antigenní odběr</span>
                    <span
                        v-if="place.nasofaryngealni_odber"
                        class="
                            bg-gray-300 rounded-full text-xs p-1 px-2 text-gray-900
                            lg:text-lg
                    ">nasofaryngeální odběr</span>
                    <span
                        v-if="place.orofaryngealni_odber"
                        class="
                            bg-gray-300 rounded-full text-xs p-1 px-2 text-gray-900
                            lg:text-lg
                        "
                    >orofaryngeální odběr</span>
                </template>
            </div>
        </div>

        <template v-if="isVaccinationInDetail">
            <!-- TODO: show external icon -->
            <!-- TODO: don't forget to mention opendatalab in `about` page -->
            <a
                :href="`https://ockovani.opendatalab.cz/misto/${place.id}`"
                target="_blank" rel="noopener"
                class="
                    bg-indigo-700 text-white
                    uppercase rounded-md block
                    p-2 px-4 shadow
                    lg:text-lg
                ">statistiky čekací doby</a>
            <a
                :href="`https://cfa.uzis.cz/vaccination-centers/${place.id}`"
                target="_blank" rel="noopener"
                class="
                    bg-indigo-700 text-white
                    uppercase rounded-md block
                    p-2 px-4 shadow
                    lg:text-lg
                ">oficiální stránka na MZČR</a>
        </template>
        <template v-else>
            <!-- TODO: show external icon -->
            <a
                :href="`https://cfa.uzis.cz/sampling-points/${place.id}`"
                target="_blank" rel="noopener"
                class="
                    bg-indigo-700 text-white
                    uppercase rounded-md block
                    p-2 px-4 shadow
                    lg:text-lg
                ">oficiální stránka na MZČR</a>
        </template>
    </div>
</template>
<script lang="ts">
import {PlaceType, TestingPlace, VaccinationPlace} from "~/store/places";
import {Component, Prop, Vue} from "nuxt-property-decorator";

@Component({})
export default class DefaultLayout extends Vue {
    @Prop()
    place: VaccinationPlace | TestingPlace | null = null;

    get isVaccinationInDetail() {
        return this.place?.type == PlaceType.VACCINATION
    }

}
</script>
