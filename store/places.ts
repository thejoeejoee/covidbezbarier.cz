import * as _ from "lodash"
import {$axios} from '~/utils/api'
import {ActionTree, GetterTree, MutationTree} from "vuex"
import {BaseState} from "~/store/base";
import {TestingPlace, VaccinationPlace} from "~/store/types";

interface PlacesRawResponse {
    modified: string
    source: string
    data: any[]
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
