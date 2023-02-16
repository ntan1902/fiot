import React, {useEffect, useRef, useState} from "react"
import ReactFlow, {
    addEdge,
    Background,
    ReactFlowProvider,
    removeElements,
} from "react-flow-renderer"
import "../react-flow/DragNDrop.css"
import SideBarReactFlow from "../react-flow/SideBarReactFlow"
import {RuleChainService} from "../../services"
import {useSelector} from "react-redux"
import CreateRuleNodeModal from "./CreateRuleNodeModal"
import InfoRelationModal from "./InfoRelationModal"
import _ from "lodash"
import {Fab} from "react-tiny-fab"
import {Icon, message, Modal} from "antd"
import {findIndex} from "lodash/array"

const {confirm} = Modal

const styleButton = {
    style: {borderRadius: "5px"},
    size: "large",
}

const edgeStyle = {
    className: "normal-edge",
    arrowHeadType: "arrow",

    labelStyle: {fill: "#0D257F", fontWeight: 700},
    labelBgPadding: [8, 4],
    labelBgBorderRadius: 6,
    labelBgStyle: {fill: "white", border: "2px solid #0D257F"},

    style: {
        strokeWidth: "3.5",
    },
}

const convertToReactFlow = (ruleNode, index) => {
    return {
        id: index.toString(),
        data: {
            id: ruleNode.id,
            label: ruleNode.name,
            config: ruleNode.config,
            clazz: ruleNode.clazz,
            configClazz: ruleNode.configClazz
        },
        type: "default",
        position: JSON.parse(ruleNode.additionalInfo),
        targetPosition: "left",
        sourcePosition: "right",
    }
}

const convertToRuleNode = (reactFlowNode) => {
    const ruleNode = {
        name: reactFlowNode.data.label,
        additionalInfo: JSON.stringify(reactFlowNode.position),
        config: reactFlowNode.data.config,
        clazz: reactFlowNode.data.clazz,
        configClazz: reactFlowNode.data.configClazz
    }
    if (reactFlowNode.data.id) {
        ruleNode.id = reactFlowNode.data.id
    }

    return ruleNode
}

const convertToRelation = (reactFlowConnection, reactFlowNodes) => {
    const sourceIndex = reactFlowNodes
        .map((reactFlowNode) => reactFlowNode.id)
        .indexOf(reactFlowConnection.source)
    const targetIndex = reactFlowNodes
        .map((reactFlowNode) => reactFlowNode.id)
        .indexOf(reactFlowConnection.target)
    let arrMultiLabelsRelation = []
    if (reactFlowConnection.label && reactFlowConnection.label.includes("/")) {
        arrMultiLabelsRelation = reactFlowConnection.label.split("/")
    }

    if (!_.isEmpty(arrMultiLabelsRelation)) {
        return  arrMultiLabelsRelation.map((label) => {
            return {
                fromIndex: parseInt(sourceIndex),
                toIndex: parseInt(targetIndex),
                name: label,
            }
        })
    }

    return {
        fromIndex: parseInt(sourceIndex),
        toIndex: parseInt(targetIndex),
        name: reactFlowConnection.label,
    }
}

const convertToReactFlowConnection = (relation) => {
    return {
        id: `${relation.fromIndex.toString()}-${relation.toIndex.toString()}`,
        source: relation.fromIndex.toString(),
        target: relation.toIndex.toString(),
        label: relation.name,
        ...edgeStyle,
    }
}

const getId = () => window.crypto.getRandomValues(new Uint32Array(1))[0].toString(16)

const inputElement = {
    id: "inputId",
    type: "input",
    data: {label: "Input"},
    position: {x: 30, y: 110},
    sourcePosition: "right",
}

const initConnection = {
    id: getId(),
    source: "inputId",
    ...edgeStyle,
}

const RuleNodes = () => {
    const {openRuleNodes} = useSelector((state) => state.ruleChains)
    const {ruleChain} = openRuleNodes

    const reactFlowWrapper = useRef(null)

    const [reactFlowInstance, setReactFlowInstance] = useState(null)

    const [inputConnection, setInputConnection] = useState(initConnection)

    const [elements, setElements] = useState([])
    const [prevElements, setPrevElements] = useState([])

    const [firstElementIndex, setFirstElementIndex] = useState(-1)
    const [prevFirstElementIndex, setPrevFirstElementIndex] = useState(-1)

    const [connections, setConnections] = useState([])
    const [prevConnections, setPrevConnections] = useState([])

    const [newNode, setNewNode] = useState({
        id: "",
        data: {
            label: "",
            config: "",
            clazz: "",
            configClazz: ""
        },
        type: "default",
        position: "",
        targetPosition: "left",
        sourcePosition: "right",
    })
    const [ruleNodeDescriptor, setRuleNodeDescriptor] = useState(null)

    const [openCreateRuleNode, setOpenCreateRuleNode] = useState(false)
    const [isChanged, setIsChanged] = useState(false)
    const [backgroundColorButton, setBackgroundColorButton] = useState("#666")

    const [openInfoRelation, setOpenInfoRelation] = useState(false)
    const [curSelectedRelation, setCurSelectedRelation] = useState(null)
    const [curSelectedNode, setCurSelectedNode] = useState(null)
    const [isEdit, setIsEdit] = useState(false)

    const getId = () => window.crypto.getRandomValues(new Uint32Array(1))[0].toString(16)

    useEffect(() => {
        const loadRuleNodes = async () => {
            const {ruleNodes, relations, firstRuleNodeIndex} = await RuleChainService.getRuleNodes(
                ruleChain.id
            )

            if (firstRuleNodeIndex !== null && firstRuleNodeIndex !== -1) {
                setFirstElementIndex(firstRuleNodeIndex)
                setPrevFirstElementIndex(firstRuleNodeIndex)
            }

            if (ruleNodes !== null) {
                let newElements = ruleNodes.map((ruleNode, index) => {
                    return convertToReactFlow(ruleNode, index)
                })

                setElements((es) => es.concat(newElements))
                setPrevElements(_.cloneDeep(newElements))
            }

            if (relations !== null) {
                let newConnections = relations.map((relation) => {
                    return convertToReactFlowConnection(relation)
                })
                const processedConnections = []
                const groupByIdNewConnections = _.groupBy(newConnections, "id")

                for (const [key, value] of Object.entries(groupByIdNewConnections)) {
                    const joinedLabels = value.map((i) => i.label).join("/")
                    const connection = {
                        ...value[0],
                        label: joinedLabels,
                    }
                    processedConnections.push(connection)
                }

                setConnections((es) => es.concat(processedConnections))
                setPrevConnections(_.cloneDeep(processedConnections))
            }
        }
        loadRuleNodes()
    }, [])

    useEffect(() => {
        if (isChanged) {
            if (isEdit) {
              const newElements = elements.map((e) => {
                if (curSelectedNode.id === e.id) {
                  const editedNode = {
                    ...e,
                    data: {
                      ...e.data,
                      label: newNode.data.label,
                      config: newNode.data.config
                    }
                  }

                  return editedNode
                }

                return e
              })

              setElements(newElements)
              setIsEdit(false)
            }
            else {
              setElements((es) => es.concat(_.cloneDeep(newNode)))
            }
        }
    }, [newNode.data])

    useEffect(() => {
        if (firstElementIndex !== -1) {
            setInputConnection({
                ...inputConnection,
                target:
                    elements.length !== 0
                        ? elements[firstElementIndex]?.id
                        : `${firstElementIndex}`,
            })
        }
    }, [firstElementIndex])

    const onConnect = (params) => {
        setPrevConnections(_.cloneDeep(connections))
        if (params.source === "inputId") {
            setPrevFirstElementIndex(firstElementIndex)
            setFirstElementIndex(elements.map((el) => el.id).indexOf(params.target))
        } else {
            setConnections((els) => addEdge({...params, ...edgeStyle}, els))
        }
        handleChange(true)
    }

    const onElementsRemove = (elementsToRemove) => {
        const removedElementIndex = elements.map((e) => e.id).indexOf(elementsToRemove[0].id)

        setPrevFirstElementIndex(firstElementIndex)

        if (removedElementIndex === firstElementIndex) {
            setFirstElementIndex(-1)
        }

        if (firstElementIndex > removedElementIndex) {
            setFirstElementIndex(firstElementIndex - 1)
        }

        setElements((els) => removeElements(elementsToRemove, els))
        const newConnections = connections.filter(
            (connection) =>
                connection.source !== elementsToRemove[0].id &&
                connection.target !== elementsToRemove[0].id
        )
        setPrevConnections(_.cloneDeep(connections))
        setConnections(newConnections)
        handleChange(true)
    }

    const onRelationRemove = (relationToRemove) => {
      const newConnections = connections.filter((c) => c.id !== relationToRemove.id)
      setConnections(newConnections)
    }

    const onLoad = (_reactFlowInstance) => {
        setReactFlowInstance(_reactFlowInstance)
    }

    const onDragOver = (event) => {
        event.preventDefault()
        event.dataTransfer.dropEffect = "move"
    }

    const onDrop = (event) => {
        event.preventDefault()

        handleChange(true)

        const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect()
        const type = event.dataTransfer.getData("application/type")

        const ruleNodeDescriptorString = event.dataTransfer.getData(
            "application/ruleNodeDescriptor"
        )
        setRuleNodeDescriptor(JSON.parse(ruleNodeDescriptorString))

        const position = reactFlowInstance.project({
            x: event.clientX - reactFlowBounds.left,
            y: event.clientY - reactFlowBounds.top,
        })

        newNode.id = getId()
        newNode.type = type
        newNode.position = position
        setIsEdit(false)
        setNewNode(newNode)

        setOpenCreateRuleNode(true)
    }

    function onNodeDragStop(event, node) {
        const index = findIndex(elements, (element) => element && element.id === node.id)
        if (index !== -1) {
            elements[index] = node
            setElements(elements)
        }
        //console.log("onNodeDragStop", node)
        setCurSelectedNode(node)
        handleChange(true)
    }

    const onPaneClick = () => {
        //console.log("click outside")
        setCurSelectedNode(null)
        setCurSelectedRelation(null)
    }

    const onElementClick = (event, element) => {
        const isRelation = element.source || element.target
        const isNode = element.data || element.position

        if (isRelation) {
            setCurSelectedNode(null)
            const selectedRelations = _.find(connections, {id: element.id})
            const sourceNode = _.find(elements, {id: element.source})
            if (sourceNode) {
                selectedRelations.clazz = _.get(sourceNode, "data.clazz", "")
                setCurSelectedRelation(selectedRelations)
                setOpenInfoRelation(true)
            }
        }

        if (isNode) {
            setCurSelectedRelation(null)
            setCurSelectedNode(element)
        }
    }

    const handleChange = (change) => {
        setIsChanged(change)
        setBackgroundColorButton(change ? "red" : "#666")
    }

    const handleCreateRuleNodes = () => {
        const ruleNodes = elements.map((ruleNode) => convertToRuleNode(ruleNode))

        const relations = _.flattenDeep(
            connections.map((connection) => convertToRelation(connection, elements))
        )

        RuleChainService.createRuleNodes({
            ruleChainId: ruleChain.id,
            ruleNodes,
            relations,
            firstRuleNodeIndex: firstElementIndex,
        })
            .then((r) => message.success("Save successfully"))
            .catch((err) => {
                message.error("Save unsuccessfully")
            })
    }

    const handleButtonCheck = () => {
        if (isChanged) {
            handleChange(false)
            handleCreateRuleNodes()

            // update previous node and connections
            setPrevElements(_.cloneDeep(elements))
            setPrevConnections(_.cloneDeep(connections))
            setPrevFirstElementIndex(_.cloneDeep(firstElementIndex))
        }
    }

    const handleButtonClose = () => {
        if (isChanged) {
            handleChange(false)

            // revert to previous node and connections
            setElements(_.cloneDeep(prevElements))
            setConnections(_.cloneDeep(prevConnections))
            setFirstElementIndex(_.cloneDeep(prevFirstElementIndex))
        }
    }

    const handleButtonRemove = () => {
        if (curSelectedNode) {
            confirm({
                title: "Are you sure to remove node?",
                centered: true,

                okText: "Yes",
                okButtonProps: {
                    ...styleButton,
                    icon: "check",
                },
                onOk() {
                    onElementsRemove([curSelectedNode])
                    setCurSelectedNode(null)
                },

                cancelButtonProps: styleButton,
                onCancel() {},
            })
        }

        if (curSelectedRelation) {
          confirm({
            title: "Are you sure to remove relation?",
            centered: true,

            okText: "Yes",
            okButtonProps: {
                ...styleButton,
                icon: "check",
            },
            onOk() {
                onRelationRemove(curSelectedRelation)
                setCurSelectedRelation(null)
            },

            cancelButtonProps: styleButton,
            onCancel(){},
          })
        }
    }

    const onNodeDoubleClick = (event, element) => {
      setCurSelectedNode(element)
      setRuleNodeDescriptor(element.data)
      setIsEdit(true)
      handleChange(true)
      setOpenCreateRuleNode(true)
    }

    return (
        <div style={{marginTop: "8px"}}>
            <CreateRuleNodeModal
                openCreateRuleNode={openCreateRuleNode}
                setOpenCreateRuleNode={setOpenCreateRuleNode}
                newNode={newNode}
                setNewNode={setNewNode}
                ruleNodeDescriptor={ruleNodeDescriptor}
            />
            {curSelectedRelation && (
                <InfoRelationModal
                    openInfoRelation={openInfoRelation}
                    setOpenInfoRelation={setOpenInfoRelation}
                    curSelectedRelation={curSelectedRelation}
                    handleChange={handleChange}
                />
            )}
            <div className={"drag-n-drop"} style={{height: "100vh"}}>
                <SideBarReactFlow />
                <ReactFlowProvider>
                    <div className="reactflow-wrapper" ref={reactFlowWrapper}>
                        <ReactFlow
                            elements={elements.concat([
                                inputElement,
                                inputConnection,
                                ...connections,
                            ])}
                            onElementClick={onElementClick}
                            onElementsRemove={onElementsRemove}
                            onConnect={onConnect}
                            onLoad={onLoad}
                            onDrop={onDrop}
                            onNodeDoubleClick={onNodeDoubleClick}
                            onDragOver={onDragOver}
                            onNodeDragStop={onNodeDragStop}
                            onPaneClick={onPaneClick}
                            snapToGrid={true}
                            key="edges"
                            style={{position: "fixed"}}
                        >
                            <Background />
                        </ReactFlow>
                        {(curSelectedNode || curSelectedRelation) && (
                            <Fab
                                icon={<Icon type="delete" />}
                                style={{right: 160, bottom: 0}}
                                event={"click"}
                                onClick={handleButtonRemove}
                                mainButtonStyles={{backgroundColor: "red"}}
                            />
                        )}
                        <Fab
                            icon={<Icon type="check" />}
                            style={{right: 80, bottom: 0}}
                            event={"click"}
                            onClick={handleButtonCheck}
                            mainButtonStyles={{
                                backgroundColor: backgroundColorButton,
                            }}
                        />
                        <Fab
                            icon={<Icon type="close" />}
                            style={{right: 0, bottom: 0}}
                            event={"click"}
                            onClick={handleButtonClose}
                            mainButtonStyles={{
                                backgroundColor: backgroundColorButton,
                            }}
                        />
                    </div>
                </ReactFlowProvider>
            </div>
        </div>
    )
}
export default RuleNodes
