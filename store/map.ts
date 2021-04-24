import {MutationTree, ActionTree} from "vuex"
import {BaseObject} from "~/store/base";

export interface Location {
    lat: number
    lng: number
    acc: number | null
}

class State extends BaseObject {
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
