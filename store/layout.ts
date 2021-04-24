import {MutationTree, ActionTree} from "vuex"
import {BaseObject} from "~/store/base";

class State extends BaseObject {
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
