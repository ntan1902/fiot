import { RuleChainApi } from '../api/ruleChain'

const getAll = async () => {
  const data = await RuleChainApi.getRuleChains()
  return data.ruleChains || []
}

const getRuleNodes = async (ruleChainId) => {
  const { ruleNodes, relations, firstRuleNodeIndex } =
    await RuleChainApi.getRuleNodes(ruleChainId)
  return { ruleNodes, relations, firstRuleNodeIndex }
}

const getRuleNodeDescriptors = async () => {
  try {
    const { ruleNodeDescriptors } = await RuleChainApi.getRuleNodeDescriptors()
    return ruleNodeDescriptors
  } catch (err) {
    console.log('Error occurred', err)
    return null
  }
}

const createRuleChain = async (values) => {
  values.root = false
  const data = await RuleChainApi.createRuleChain(values)
  return data.ruleChain || null
}

const createRuleNodes = (values) => {
  return RuleChainApi.createRuleNodes(values)
}

const deleteRuleChain = async (ruleChainId) => {
  try {
    await RuleChainApi.deleteRuleChain(ruleChainId)
  } catch (err) {
    console.log('Error occurred', err)
  }
}

export default {
  getAll,
  createRuleChain,
  getRuleNodes,
  createRuleNodes,
  getRuleNodeDescriptors,
  deleteRuleChain,
}
