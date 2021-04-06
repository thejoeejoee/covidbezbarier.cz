<template>
    <div>
        <h2 class="bg-indigo-500 text-center text-green-300 mb-5 pt-4 pb-2 font-black font-mono uppercase">
            <nuxt-link :to="localePath('/')">{{ $t("map") }}</nuxt-link>
        </h2>
        <h2 class="
            font-black pt-4 md:pt-8 pb-2 text-center font-mono
            sm:text-xl xl:text-2xl
            text-indigo-500 uppercase
        ">
            {{ $t("development") }}
        </h2>
        <div class="
            pt-3 pb-2 text-center font-sans
            text-sm xl:text-md
        ">
            <div class="pb-1">
                Josef Kolář,
                <a class="text-green-500" href="mailto:xkolar71@stud.fit.vutbr.cz">
                    xkolar71@stud.fit.vutbr.cz
                </a>
            </div>
            <div class="pb-1">
                Peter Uhrín,
                <a class="text-green-500" href="mailto:xuhrin02@stud.fit.vutbr.cz">
                    xuhrin02@stud.fit.vutbr.cz
                </a>
            </div>
        </div>


        <h2 class="
            font-black pt-4 md:pt-8 pb-2 text-center font-mono
            sm:text-xl xl:text-2xl
            text-indigo-500 uppercase
        ">
            {{ $t("sources.label") }}
        </h2>
        <div class="
            pt-3 pb-2 text-center font-sans
            text-sm xl:text-md
        ">
            <div class="pb-1">
                {{ $t("sources.text") }}
                <a class="text-green-500" href="https://onemocneni-aktualne.mzcr.cz/api/v2/covid-19">
                    {{ $t("sources.here") }}
                </a>
            </div>
            <div class="pb-1">
                {{ $t("sources.updated.vaccinationPlaces") }}
                {{ $store.state.places.vaccinationPlacesModified.toLocaleString(
                    $t("sources.updated.localeFormat"),
                    {
                        year: "numeric", month: "long", day: "numeric",
                        hour: "numeric", minute: "numeric", second: "numeric"
                    }
                ) }}
            </div>
            <div class="pb-1">
                {{ $t("sources.updated.testingPlaces") }}
                {{ $store.state.places.testingPlacesModified.toLocaleString(
                    $t("sources.updated.localeFormat"),
                    {
                        year: "numeric", month: "long", day: "numeric",
                        hour: "numeric", minute: "numeric", second: "numeric"
                    }
                ) }}
            </div>
        </div>


        <h2 class="
            font-black pt-4 md:pt-8 pb-2 text-center font-mono
            sm:text-xl xl:text-2xl
            text-indigo-500 uppercase
        ">
            {{ $t("external.label") }}
        </h2>
        <div class="
            pt-3 pb-2 text-center font-sans
            text-sm xl:text-md
        ">
            <div class="pb-1">
                {{ $t("external.waitingStats") }}
                <a class="text-green-500" href="https://ockovani.opendatalab.cz">
                    ockovani.opendatalab.cz
                </a>
            </div>
            <div class="pb-1">
                {{ $t("external.placesDetails") }}
                <a class="text-green-500" href="https://cfa.uzis.cz">
                    cfa.uzis.cz
                </a>
            </div>
        </div>
    </div>
</template>

<i18n>
{
    "cs": {
        "map": "Zpět na mapu",
        "development": "Vývoj:",
        "sources": {
            "label": "Zdroj dat:",
            "text": "Věřejně dostupná data Ministerstva zdravotnictví ve verzi 2.0 dostupná",
            "here": "zde",
            "updated": {
                "vaccinationPlaces": "Poslední aktualizace očkovacích míst:",
                "testingPlaces": "Poslední aktualizace testovacích míst:",
                "localeFormat": "cs-cz"
            }
        },
        "external": {
            "label": "Externí služby:",
            "waitingStats": "Statistiky o testovacích a očkovacích místech:",
            "placesDetails": "Detaily testovacích a očkovacích míst:"
        }
    },
    "en": {
        "map": "Back to map",
        "development": "Developed by:",
        "sources": {
            "label": "Data source:",
            "text": "Publicly available data of the Ministry of Health in version 2.0 available",
            "here": "here",
            "updated": {
                "vaccinationPlaces": "Vaccination centers data updated:",
                "testingPlaces": "Testing centers data updated:",
                "localeFormat": "en-us"
            }
        },
        "external": {
            "label": "External services:",
            "waitingStats": "Statistics about testing and vaccination centers:",
            "placesDetails": "Details of testing and vaccination centers:"
        }
    }
}
</i18n>