import * as _ from "lodash"
import { $axios } from '~/utils/api'
import {GetterTree, MutationTree, ActionTree} from "vuex"
import {BaseState} from "~/store/base";

interface PlacesRawResponse {
    modified: string
    source: string
    data: any[]
}

export enum PlaceType {
    TESTING = 'T',
    VACCINATION = 'V',
}

export abstract class BasePlace {
    readonly abstract type : PlaceType;
    readonly latitude : number;
    readonly longitude : number;

    protected constructor(
        readonly id: string,
        readonly name: string,
        readonly address: string,
        lat: string,
        long: string
    ) {
        this.latitude = Number(lat)
        this.longitude = Number(long)
    }
}

export class TestingPlace extends BasePlace {
    type = PlaceType.TESTING

    readonly okres_nuts_kod!: string//"CZ0100",
    readonly operacni_status!: boolean //true,
    readonly testovaci_kapacita!: bigint
    readonly nasofaryngealni_odber!: boolean //
    readonly orofaryngealni_odber!: boolean //
    readonly antigenni_odber!: boolean //
    readonly drive_in!: boolean //

    constructor(raw: any) {
        super(
            raw.odberove_misto_id,
            raw.odberove_misto_nazev,
            raw.odberove_misto_adresa,
            raw.latitude,
            raw.longitude,
        )
        _.assign(
            this,
            _.pick(
                raw,
                [
                    'okres_nuts_kod',
                    'operacni_status',
                    'testovaci_kapacita',
                    'nasofaryngealni_odber',
                    'orofaryngealni_odber',
                    'antigenni_odber',
                    'drive_in',
                ]
            )
        )
    }

    get icon() : any {
        return require('../assets/covid.svg')
    }
}

export class VaccinationPlace extends BasePlace {
    type = PlaceType.VACCINATION

    readonly okres_nuts_kod!: string
    readonly nrpzs_kod!: string
    readonly operacni_status!: boolean
    readonly minimalni_kapacita!: bigint
    readonly bezbarierovy_pristup!: boolean

    constructor(raw: any) {
        super(
            raw.ockovaci_misto_id,
            raw.ockovaci_misto_nazev,
            raw.ockovaci_misto_adresa,
            raw.latitude,
            raw.longitude,
        )
        _.assign(
            this,
            _.pick(
                raw,
                [
                    'okres_nuts_kod',
                    'operacni_status',
                    'nrpzs_kod',
                    'minimalni_kapacita',
                    'bezbarierovy_pristup',
                ]
            )
        )
    }

    get icon() : any {
        return require('../assets/syringe.svg')
    }
}

class State extends BaseState {
    testingPlaces: TestingPlace[] = [];
    vaccinationPlaces: VaccinationPlace[] = [];

    testingPlacesModified!: Date;
    vaccinationPlacesModified!: Date;

    placeInDetail: TestingPlace | VaccinationPlace | null = null;

    showTesting: boolean = true;
    showVaccination: boolean = true;
}

export const state = () => new State;

export const getters = <GetterTree<State, any>>{

}

export const mutations = <MutationTree<State>>{
    setTestingPlacesResponse(state: State, response: PlacesRawResponse) {
        state.testingPlaces = _.map(
            _.filter(
                response.data,
                {'drive_in': true}
            ),
            (raw: any) => new TestingPlace(raw)
        )
        state.testingPlacesModified = new Date(response.modified)
    },
    setVaccinationPlacesResponse(state: State, response: PlacesRawResponse) {
        state.vaccinationPlaces = _.map(
            _.filter(
                response.data,
                {'bezbarierovy_pristup': true}
            ),
            (raw: any) => new VaccinationPlace(raw)
        )
        state.vaccinationPlacesModified = new Date(response.modified)
    },
    setPlaceInDetail(state: State, place: VaccinationPlace | TestingPlace) {
        state.placeInDetail = place
    },
    showTesting(state: State, v: boolean) {
        if (!v && !state.showVaccination) state.showVaccination = true;
        state.showTesting = v
    },
    showVaccination(state: State, v: boolean) {
        if (!v && !state.showTesting) state.showTesting = true;
        state.showVaccination = v
    },
}

export const actions = <ActionTree<State, any>>{
    async loadTestingPlaces({state, commit}) {
        // URL si routed by nuxt/vercel
        const response = await $axios.$get('/covid/prehled-odberovych-mist.json')
        commit('setTestingPlacesResponse', response)
    },
    async loadVaccinationPlaces({state, commit}) {
        // URL si routed by nuxt/vercel
        const response = await $axios.$get('/covid/prehled-ockovacich-mist.json')
        commit('setVaccinationPlacesResponse', response)
    }
}
