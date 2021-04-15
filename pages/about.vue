<template>
    <div>
        <h2 class="bg-indigo-500 text-center text-green-300 mb-5 pt-2 pb-1 font-black font-mono uppercase">
            <nuxt-link :to="localePath('/')">{{ $t("map") }}</nuxt-link>
            &centerdot;
            <LocaleSwitchLink />
        </h2>
        <div class="mx-auto max-w-xl px-2">
            <div class="pt-3 pb-2 font-sans text-sm xl:text-md">
                <p>
                    <strong>{{ $t('headline') }}</strong>
                    <span v-html="$t('description')"></span>
                </p>
            </div>
            <h2 class="
            font-black pt-4 md:pt-8 pb-2 text-center font-mono
            sm:text-xl xl:text-2xl
            text-indigo-500 uppercase
        ">
                {{ $t("development") }}
            </h2>
            <div class="
            pt-3 pb-2 font-sans
            text-sm xl:text-md
        ">
                <div class="pb-1">
                    Josef Kolář,
                    <a class="text-green-500" href="https://josefkolar.cz">
                        josefkolar.cz
                    </a>
                </div>
                <div class="pb-1">
                    Peter Uhrín,
                    <client-only><a class="text-green-500" href="mailto:xuhrin02@stud.fit.vutbr.cz">
                        xuhrin02@stud.fit.vutbr.cz
                    </a></client-only>
                </div>
                <div class="pb-1">
                    {{ $t('development-repository') }} <a class="text-green-500" href="https://github.com/thejoeejoee/covidbezbarier.cz">thejoeejoee/covidbezbarier.cz</a>.
                </div>
                <div class="pb-1">
                    {{ $t('version') }} <a
                    class="text-green-500 font-bold"
                    :href="`https://github.com/thejoeejoee/covidbezbarier.cz/releases/tag/${$config.appVersion}`">v{{ $config.appVersion }}</a>
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
            pt-3 pb-2 font-sans
            text-sm xl:text-md
        ">
                <div class="pb-1">
                    {{ $t("sources.text") }}
                    <a class="text-green-500" href="https://onemocneni-aktualne.mzcr.cz/api/v2/covid-19" target="_blank"
                       rel="noopener">
                        {{ $t("sources.here") }}
                    </a>
                </div>
                <div class="pb-1" v-if="$store.state.places.vaccinationPlacesModified">
                    {{ $t("sources.updated.vaccinationPlaces") }}
                    <i>{{
                        $store.state.places.vaccinationPlacesModified.toLocaleString(
                            $t("sources.updated.localeFormat"),
                            {
                                year: "numeric", month: "long", day: "numeric",
                                hour: "numeric", minute: "numeric", second: "numeric"
                            }
                        )
                    }}</i>
                </div>
                <div class="pb-1" v-if="$store.state.places.vaccinationPlacesModified">
                    {{ $t("sources.updated.testingPlaces") }}
                    <i>{{
                        $store.state.places.vaccinationPlacesModified.toLocaleString(
                            $t("sources.updated.localeFormat"),
                            {
                                year: "numeric", month: "long", day: "numeric",
                                hour: "numeric", minute: "numeric", second: "numeric"
                            }
                        )
                    }}</i>
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
            pt-3 pb-2 font-sans
            text-sm xl:text-md
        ">
                <div class="pb-1">
                    {{ $t("external.waitingStats") }}
                    <a class="text-green-500" href="https://ockovani.opendatalab.cz" target="_blank" rel="noopener">
                        ockovani.opendatalab.cz
                    </a>
                </div>
                <div class="pb-1">
                    {{ $t("external.placesDetails") }}
                    <a class="text-green-500" href="https://cfa.uzis.cz" target="_blank" rel="noopener">
                        cfa.uzis.cz
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<i18n>
{
    "cs": {
        "map": "Zpět na mapu",
        "version": "Verze",
        "headline": "Covid bez bariér",
        "description": "je projekt webové stránky pro hledání vakcinačních a testovacích míst s&nbsp;bezbariérovým přístupem na interaktivní mapě. Zobrazuje veřejně dostupná data o těchto místech od MZČR na mapovém podkladu s možností vyhledávání dle adresy či aktuální lokace uživatele. Pro každé z míst je též dostupný detail s popisem, adresou a specifikací dostupných služeb.",
        "development": "Vývoj",
        "development-repository": "Zdrojový kód je veřejně dostupný na",
        "sources": {
            "label": "Zdroj dat",
            "text": "Veřejně dostupná data Ministerstva zdravotnictví ve verzi 2.0 dostupná",
            "here": "zde",
            "updated": {
                "vaccinationPlaces": "Poslední aktualizace očkovacích míst:",
                "testingPlaces": "Poslední aktualizace testovacích míst:",
                "localeFormat": "cs-cz"
            }
        },
        "external": {
            "label": "Externí služby",
            "waitingStats": "Statistiky o testovacích a očkovacích místech:",
            "placesDetails": "Detaily testovacích a očkovacích míst:"
        }
    },
    "en": {
        "map": "Back to map",
        "version": "Version",
        "headline": "Covid without barriers",
        "description": "is a website project for searching vaccination and testing places with barrier-free access on an interactive map. Displays public data about these places from the MZČR on a map base with the tool to search by address or current location of the user. For each of the places, a detail with a description, address and specification of available services is also available. ",
        "development": "Developed by",
        "development-repository": "Repository is public on",
        "sources": {
            "label": "Data source",
            "text": "Publicly available data of the Ministry of Health in version 2.0 available",
            "here": "here",
            "updated": {
                "vaccinationPlaces": "Vaccination centers data updated:",
                "testingPlaces": "Testing centers data updated:",
                "localeFormat": "en-us"
            }
        },
        "external": {
            "label": "External services",
            "waitingStats": "Statistics about testing and vaccination centers:",
            "placesDetails": "Details of testing and vaccination centers:"
        }
    }
}
</i18n>
