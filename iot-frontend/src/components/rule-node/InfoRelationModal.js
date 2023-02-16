import React, {useEffect, useState} from "react"
import {Form, message, Modal, TreeSelect} from "antd"
import {find, get, isEmpty} from "lodash"
import {useSelector} from "react-redux"

const convertStringToArray = (string) => {
    if (!string) return []
    const arr_str = string.replace(/[\[\]']+/g, "") // remove '[' and ']'
    return arr_str.split(", ")
}

const styleButton = {
    style: {borderRadius: "5px"},
    size: "large",
}

const InfoRelationModal = (props) => {
    const {openInfoRelation, curSelectedRelation, setOpenInfoRelation, handleChange} = props
    const {ruleNodeDescriptors} = useSelector((state) => state.ruleChains)

    const {confirm} = Modal

    const [isInfoChanged, setIsInfoChanged] = useState(false)
    const descriptors = find(ruleNodeDescriptors, {
        clazz: curSelectedRelation.clazz,
    })
    const relationNames = get(descriptors, "relationNames", "")

    const arrRelations = convertStringToArray(relationNames)
    const [treeValue, setTreeValue] = useState([])

    const treeData = arrRelations.map((r, idx) => {
        return {
            title: r,
            value: r,
            key: idx,
        }
    })
    const relationLabels = curSelectedRelation.label ? curSelectedRelation.label.split("/") : []

    useEffect(() => {
        setTreeValue(relationLabels)
    }, [curSelectedRelation])

    const handleUpdateRelationSubmit = async (e) => {
        e.preventDefault()
        confirm({
            title: "Are you sure to save Relation information?",
            centered: true,

            okText: "Yes",
            okButtonProps: {
                ...styleButton,
                icon: "check",
            },
            onOk() {
                props.form.validateFields(["name"], async (err, values) => {
                    if (!err) {
                        console.log("Received values of form: ", values)
                        try {
                            const relationsLabel = treeValue.join("/")
                            curSelectedRelation.label = relationsLabel
                            handleChange(true)
                        } catch (e) {
                            message.error("Can't edit relation information.")
                            return
                        }
                        setOpenInfoRelation(false)
                    }
                })
            },

            cancelButtonProps: styleButton,
            onCancel() {},
        })
    }

    const onChange = (value) => {
        setTreeValue(value)
        if (!isEmpty(value)) {
            setIsInfoChanged(true)
        } else {
            setIsInfoChanged(false)
        }
    }

    const treeProps = {
        treeData,
        value: treeValue,
        onChange: onChange,
        searchPlaceholder: "Please select",
        style: {
            width: "100%",
        },
        dropdownStyle: {maxHeight: 220, overflow: "auto"},
        allowClear: true,
        multiple: true,
        size: "large",
    }

    return (
        <Modal
            title={<h2>Relation Information</h2>}
            visible={openInfoRelation}
            onOk={handleUpdateRelationSubmit}
            okText={"Save"}
            onCancel={() => setOpenInfoRelation(false)}
            cancelButtonProps={styleButton}
            centered={true}
            okButtonProps={{disabled: !isInfoChanged, ...styleButton}}
            destroyOnClose={true}
        >
            <TreeSelect {...treeProps} />
        </Modal>
    )
}

export default Form.create({name: "info_relation_form"})(InfoRelationModal)
