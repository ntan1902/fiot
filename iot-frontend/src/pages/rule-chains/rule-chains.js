import React, {useEffect} from "react"
import RuleChains from "../../components/rule-chain/RuleChains"
import LayoutEntity from "../../components/layout/LayoutEntity"
import {useDispatch} from "react-redux"
import {
  loadRuleChains,
  loadRuleNodeDescriptors,
  openRuleNodes
} from "../../actions/ruleChains"

const RuleChainsPage = () => {
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(loadRuleChains())
        dispatch(loadRuleNodeDescriptors())
        dispatch(openRuleNodes({isOpen: false}))
    }, [])
    
    return (
        <LayoutEntity>
            <RuleChains />
        </LayoutEntity>
    )
}

export default RuleChainsPage
