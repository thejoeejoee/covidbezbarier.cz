import * as _ from "lodash"
import { $axios } from '~/utils/api'
import {GetterTree, MutationTree, ActionTree} from "vuex"

interface TestingPlacesResponse {
    modified: string
    source: string
    data: any[]
}

export class TestingPlace {
    readonly odberove_misto_id!: string//"a81a99e2-90bd-494c-ae42-7090f93115ca",
    readonly odberove_misto_nazev!: string//"#NaŽádanku.cz – Odběrové centrum Praha 15 (H. Měcholupy)",
    readonly okres_nuts_kod!: string//"CZ0100",
    readonly operacni_status!: boolean //true,
    readonly odberove_misto_adresa!: string//"Park na křižovatce ulic Ravennská a Milánská, Praha 15, 109 00",
    readonly latitude: number//"50.0444517",
    readonly longitude: number//"14.5585581",
    readonly testovaci_kapacita!: bigint
    readonly nasofaryngealni_odber!: boolean //
    readonly orofaryngealni_odber!: boolean //
    readonly antigenni_odber!: boolean //
    readonly drive_in!: boolean //

    constructor(raw: any) {
        _.assign(
            this,
            _.pick(
                raw,
                [
                    'odberove_misto_id',
                    'odberove_misto_nazev',
                    'okres_nuts_kod',
                    'odberove_misto_adresa',
                    'operacni_status',
                    'testovaci_kapacita',
                    'nasofaryngealni_odber',
                    'orofaryngealni_odber',
                    'antigenni_odber',
                    'drive_in',
                ]
            )
        )
        this.latitude = Number(raw.latitude)
        this.longitude = Number(raw.longitude)
    }
}

class State {
    testingPlaces: TestingPlace[] = [];
    modified!: Date;
}

export const state = () => new State;

export const mutations = <MutationTree<State>>{
    setTestingPlacesResponse(state: State, response: TestingPlacesResponse) {
        state.testingPlaces = _.map(
            _.filter(
                response.data,
                {'drive_in': true}
            ),
            (raw: any) => new TestingPlace(raw)
        )
        state.modified = new Date(response.modified)
    }
}

export const actions = <ActionTree<State, any>>{
    async loadTestingPlaces({state, commit}) {
        // TODO: to config
        const response = await $axios.$get(
            'https://onemocneni-aktualne.mzcr.cz/api/v2/covid-19/prehled-odberovych-mist.json'
        )
        commit(
            'setTestingPlacesResponse',
            response
        )
    }
}
