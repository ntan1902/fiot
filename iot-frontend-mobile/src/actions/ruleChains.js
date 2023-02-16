import { RuleChainService } from '../services'
import {
  CREATE_RULE_CHAIN,
  LOAD_RULE_CHAINS,
  LOAD_RULE_NODE_DESCRIPTORS,
  OPEN_RULE_NODES,
  REMOVE_RULE_CHAIN,
  REMOVE_WIDGETS_BUNDLE,
} from './types'

export const loadRuleChains = () => async (dispatch) => {
  const data = await RuleChainService.getAll()
  if (data) {
    dispatch({
      type: LOAD_RULE_CHAINS,
      payload: data,
    })
  }
  return data
}

export const createRuleChain = (ruleChain) => async (dispatch) => {
  const data = await RuleChainService.createRuleChain(ruleChain)
  if (data) {
    dispatch({
      type: CREATE_RULE_CHAIN,
      payload: data,
    })
  }
  return data
}

export const openRuleNodes =
  ({ isOpen, ruleChain }) =>
  async (dispatch) => {
    dispatch({
      type: OPEN_RULE_NODES,
      payload: {
        isOpen,
        ruleChain,
      },
    })
  }

export const loadRuleNodeDescriptors = () => async (dispatch) => {
  const data = await RuleChainService.getRuleNodeDescriptors()
  if (data) {
    dispatch({
      type: LOAD_RULE_NODE_DESCRIPTORS,
      payload: data,
    })
  }
  return data
}

export const removeRuleChain = (ruleChainId) => (dispatch) => {
  dispatch({
    type: REMOVE_RULE_CHAIN,
    payload: ruleChainId,
  })
}
