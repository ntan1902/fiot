import {
    API_RULE_CHAIN,
    API_RULE_CHAINS,
    API_RULE_ENGINE_SERVICE,
    API_RULE_NODE_DESCRIPTORS,
    API_RULE_NODES
} from "../config/setting";
import AxiosApi from "./axios/axiosApi";

export const RuleChainApi = {
    getRuleChains: () => {
        return AxiosApi.get(`${API_RULE_ENGINE_SERVICE}/${API_RULE_CHAINS}`)
    },

    getRuleChain: (ruleChainId) => {
        return AxiosApi.get(`${API_RULE_ENGINE_SERVICE}/${API_RULE_CHAIN}/${ruleChainId}` )
    },

    createRuleChain: (data) => {
        return AxiosApi.post(`${API_RULE_ENGINE_SERVICE}/${API_RULE_CHAIN}`, data)
    },

    createRuleNodes: (data) => {
        return AxiosApi.post(`${API_RULE_ENGINE_SERVICE}/${API_RULE_CHAIN}/${API_RULE_NODES}`, data)
    },

    getRuleNodes: (ruleChainId) => {
        return AxiosApi.get(`${API_RULE_ENGINE_SERVICE}/${API_RULE_CHAIN}/${ruleChainId}/${API_RULE_NODES}` )
    },

    getRuleNodeDescriptors: () => {
        return AxiosApi.get(`${API_RULE_ENGINE_SERVICE}/${API_RULE_NODE_DESCRIPTORS}` )
    },

    deleteRuleChain: (ruleChainId) => {
        return AxiosApi.delete(`${API_RULE_ENGINE_SERVICE}/${API_RULE_CHAIN}/${ruleChainId}` )
    },
};
