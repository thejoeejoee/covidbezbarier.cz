<template>
    <div
         class="
            rounded-xl bg-white
            p-4 m-5
            z-[430] pointer-events-auto

            max-w-full border-t-4 border-indigo-700
            left-0 right-0 shadow-xl

            flex flex-col justify-between gap-y-3 lg:gap-y-5
            transition-transform duration-300 transition-opacity transform
        " :class="{'translate-y-0 opacity-1': place, 'translate-y-[130%] opacity-0': !place}">
        <template v-if="place">
            <div class="flex justify-between items-start">
                <h2
                    class="md:text-md lg:text-xl font-bold whitespace-pre-line text-left"
                    v-text="place.name.split(',').join('\n')"
                ></h2>
                <button class="ml-4" @click="$emit('close')" :title="$t('close')">
                    <svg
                        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" class="w-6 h-6">
                        <path fill="currentColor" d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"/>
                    </svg>
                </button>
            </div>
            <div
                v-if="!place.operacni_status"
                class="
                    p-2 px-4 bg-yellow-200 text-red-600 rounded-md
                    shadow lg:text-lg
                "
            >
                <template v-if="isVaccinationInDetail">
                    {{ $t("vaccinationPlace.statusClosed") }}
                </template>
                <template v-else>
                    {{ $t("testingPlace.statusClosed") }}
                </template>
            </div>
            <div class="flex flex-row justify-between items-start gap-x-2">
                <a
                    class="
                        align-top rounded-md bg-gray-100
                        p-2 block
                        md:flex md:flex-row md:items-center md:gap-2
                    "
                    :href="`https://maps.google.com/maps?q=${encodeURIComponent(place.address)}`"
                    target="_blank" rel="noopener"
                >
                    <div class="hidden md:block select-none">
                        <img src="../assets/location.svg" alt="" width="40" height="40">
                    </div>
                    <address
                        class="whitespace-pre-line text-left pr-2 font-mono not-italic lg:text-lg"
                        v-text="place.address.split(/[,;]/).map(s => s.trim()).join('\n')"
                    ></address>
                </a>

                <div class="flex flex-col gap-y-2">
                    <template v-if="isVaccinationInDetail">
                        <span
                            v-if="place.bezbarierovy_pristup"
                            class="
                                bg-green-200 rounded-full text-xs p-1 px-2 text-green-900
                                lg:text-lg
                        ">{{ $t("vaccinationPlace.wheelchairAccess") }}</span>
                        <span
                            class="
                                bg-gray-300 rounded-full text-xs p-1 px-2 text-gray-900
                                lg:text-lg
                        ">{{ $t("vaccinationPlace.vaccinationPlace") }}</span>
                    </template>
                    <template v-else>
                        <span
                            v-if="place.drive_in"
                            class="
                                bg-green-200 rounded-full text-xs p-1 px-2 text-green-900
                                lg:text-lg
                        ">Drive in</span>
                        <span
                            v-if="place.antigenni_odber"
                            class="
                                bg-gray-300 rounded-full text-xs p-1 px-2 text-gray-900
                                lg:text-lg
                            "
                        >{{ $t("testingPlace.antigen") }}</span>
                        <span
                            v-if="place.nasofaryngealni_odber"
                            class="
                                bg-gray-300 rounded-full text-xs p-1 px-2 text-gray-900
                                lg:text-lg
                        ">{{ $t("testingPlace.nasopharynx") }}</span>
                        <span
                            v-if="place.orofaryngealni_odber"
                            class="
                                bg-gray-300 rounded-full text-xs p-1 px-2 text-gray-900
                                lg:text-lg
                            "
                        >{{ $t("testingPlace.oropharynx") }}</span>
                    </template>
                </div>
            </div>

            <template v-if="isVaccinationInDetail">
                <a
                    :href="`https://ockovani.opendatalab.cz/misto/${place.id}`"
                    target="_blank" rel="noopener"
                    class="
                        bg-indigo-700 text-white
                        uppercase rounded-md block
                        p-2 px-4 shadow relative
                        lg:text-lg
                        pr-8 md:pr-0
                    ">
                    {{ $t("waitingStats") }}
                    <svg xmlns="http://www.w3.org/2000/svg" class="absolute right-0 mr-2 top-1/2 -mt-3 w-6 h-6" viewBox="0 0 30 30" fill="currentColor">
                        <path d="M 25.980469 2.9902344 A 1.0001 1.0001 0 0 0 25.869141 3 L 20 3 A 1.0001 1.0001 0 1 0 20 5 L 23.585938 5 L 13.292969 15.292969 A 1.0001 1.0001 0 1 0 14.707031 16.707031 L 25 6.4140625 L 25 10 A 1.0001 1.0001 0 1 0 27 10 L 27 4.1269531 A 1.0001 1.0001 0 0 0 25.980469 2.9902344 z M 6 7 C 4.9069372 7 4 7.9069372 4 9 L 4 24 C 4 25.093063 4.9069372 26 6 26 L 21 26 C 22.093063 26 23 25.093063 23 24 L 23 14 L 23 11.421875 L 21 13.421875 L 21 16 L 21 24 L 6 24 L 6 9 L 14 9 L 16 9 L 16.578125 9 L 18.578125 7 L 16 7 L 14 7 L 6 7 z"></path>
                    </svg>
                </a>
                <a
                    v-if="place.operacni_status"
                    :href="`https://cfa.uzis.cz/vaccination-centers/${place.id}`"
                    target="_blank" rel="noopener"
                    class="
                        bg-indigo-700 text-white
                        uppercase rounded-md block
                        p-2 px-4 shadow
                        lg:text-lg relative
                        pr-8 md:pr-0
                    ">
                    {{ $t("MZCRSite") }}
                    <svg xmlns="http://www.w3.org/2000/svg" class="absolute right-0 mr-2 top-1/2 -mt-3 w-6 h-6" viewBox="0 0 30 30" fill="currentColor">
                        <path d="M 25.980469 2.9902344 A 1.0001 1.0001 0 0 0 25.869141 3 L 20 3 A 1.0001 1.0001 0 1 0 20 5 L 23.585938 5 L 13.292969 15.292969 A 1.0001 1.0001 0 1 0 14.707031 16.707031 L 25 6.4140625 L 25 10 A 1.0001 1.0001 0 1 0 27 10 L 27 4.1269531 A 1.0001 1.0001 0 0 0 25.980469 2.9902344 z M 6 7 C 4.9069372 7 4 7.9069372 4 9 L 4 24 C 4 25.093063 4.9069372 26 6 26 L 21 26 C 22.093063 26 23 25.093063 23 24 L 23 14 L 23 11.421875 L 21 13.421875 L 21 16 L 21 24 L 6 24 L 6 9 L 14 9 L 16 9 L 16.578125 9 L 18.578125 7 L 16 7 L 14 7 L 6 7 z"></path>
                    </svg>
                </a>
            </template>
            <template v-else>
                <a
                    :href="`https://cfa.uzis.cz/sampling-points/${place.id}`"
                    target="_blank" rel="noopener"
                    class="
                        bg-indigo-700 text-white
                        uppercase rounded-md block
                        p-2 px-4 shadow
                        lg:text-lg relative
                        pr-8 md:pr-0
                    ">
                    {{ $t("MZCRSite") }}
                    <svg xmlns="http://www.w3.org/2000/svg" class="absolute right-0 mr-2 top-1/2 -mt-3 w-6 h-6" viewBox="0 0 30 30" fill="currentColor">
                        <path d="M 25.980469 2.9902344 A 1.0001 1.0001 0 0 0 25.869141 3 L 20 3 A 1.0001 1.0001 0 1 0 20 5 L 23.585938 5 L 13.292969 15.292969 A 1.0001 1.0001 0 1 0 14.707031 16.707031 L 25 6.4140625 L 25 10 A 1.0001 1.0001 0 1 0 27 10 L 27 4.1269531 A 1.0001 1.0001 0 0 0 25.980469 2.9902344 z M 6 7 C 4.9069372 7 4 7.9069372 4 9 L 4 24 C 4 25.093063 4.9069372 26 6 26 L 21 26 C 22.093063 26 23 25.093063 23 24 L 23 14 L 23 11.421875 L 21 13.421875 L 21 16 L 21 24 L 6 24 L 6 9 L 14 9 L 16 9 L 16.578125 9 L 18.578125 7 L 16 7 L 14 7 L 6 7 z"></path>
                    </svg>
                </a>
            </template>
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
<i18n>
{
    "cs": {
        "close": "Zavřít",
        "MZCRSite": "Oficiální stránka na MZČR",
        "waitingStats": "Statistiky čekací doby",
        "testingPlace": {
            "antigen": "Antigenní odběr",
            "oropharynx": "Orofaryngeální odběr",
            "nasopharynx": "Nasofaryngeální odběr",
            "statusClosed": "Místo je momentálně mimo provoz."
        },
        "vaccinationPlace": {
            "wheelchairAccess": "Bezbariérový přístup",
            "vaccinationPlace": "Vakcinační místo",
            "statusClosed": "Místo momentálně nepřijímá rezervace."
        }
    },
    "en": {
        "close": "Close",
        "MZCRSite": "Official site of MZČR",
        "waitingStats": "Waiting time statistics",
        "testingPlace": {
            "antigen": "Antigen testing",
            "oropharynx": "Oropharyngeal testing",
            "nasopharynx": "Nasopharyngeal testing",
            "statusClosed": "Currently out of order"
        },
        "vaccinationPlace": {
            "wheelchairAccess": "Wheelchair access",
            "vaccinationPlace": "Vaccination place",
            "statusClosed": "Not currently accepting reservations"
        }
    }
}
</i18n>
