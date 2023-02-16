import {
    CREATE_RULE_CHAIN,
    LOAD_RULE_CHAINS,
    LOAD_RULE_NODE_DESCRIPTORS,
    OPEN_RULE_NODES, REMOVE_RULE_CHAIN
} from "../actions/types";

const initialState = {
    ruleChains: [],
    openRuleNodes: {
        isOpen: false,
        ruleChain: {}
    },
    ruleNodeDescriptors: []
};

export default function (state = initialState, action) {
    const {type, payload} = action;

    switch (type) {
        case LOAD_RULE_CHAINS:
            return {
                ...state,
                ruleChains: payload,
            };
        case LOAD_RULE_NODE_DESCRIPTORS:
            return {
                ...state,
                ruleNodeDescriptors: payload,
            };
        case CREATE_RULE_CHAIN:
            return {
                ...state,
                ruleChains: [...state.ruleChains, payload],
            };
        case OPEN_RULE_NODES:
            return {
                ...state,
                openRuleNodes: payload,
            };
        case REMOVE_RULE_CHAIN:
            return {
                ...state,
                ruleChains: state.ruleChains.filter(ruleChain => ruleChain.id !== payload)
            }
        default:
            return state;
    }
}
