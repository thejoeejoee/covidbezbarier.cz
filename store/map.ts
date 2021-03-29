import * as _ from "lodash"
import { $axios } from '~/utils/api'
import {GetterTree, MutationTree, ActionTree} from "vuex"
import {BaseState} from "~/store/base";

export interface Location {
    lat: number
    lng: number
    acc: number | null
}

class State extends BaseState {
    targetLocation: Location | null = null
}

export const state = () => new State;

export const mutations = <MutationTree<State>>{
    setTargetLocation(state: State, location: Location | null) {
        state.targetLocation = location
    },
}

export const actions = <ActionTree<State, any>>{
}
