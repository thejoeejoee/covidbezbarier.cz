import * as _ from "lodash"
import { $axios } from '~/utils/api'
import {GetterTree, MutationTree, ActionTree} from "vuex"

class State {
    headingExpanded: boolean = true;
}

export const state = () => new State;

export const mutations = <MutationTree<State>>{
    setHeadingExpanded(state: State, expanded: boolean) {
        state.headingExpanded = expanded
    },
}

export const actions = <ActionTree<State, any>>{
}
