import React from 'react';
import Sider from "antd/es/layout/Sider";
import {useSelector} from "react-redux";

const SideBarReactFlow = () => {
    const {ruleNodeDescriptors} = useSelector((state) => state.ruleChains);

    const onDragStart = (event, nodeType, ruleNodeDescriptor) => {
        event.dataTransfer.setData('application/type', nodeType);
        event.dataTransfer.setData('application/ruleNodeDescriptor', JSON.stringify(ruleNodeDescriptor));
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <Sider style={{background: "#FFFFFF"}} className="d-flex justify-content-center">
            {/*<div className="react-flow__node-input m-b-10" onDragStart={(event) => onDragStart(event, 'input')} draggable>*/}
            {/*    Input Node*/}
            {/*</div>*/}
            {/*<div className="react-flow__node-default m-b-10" onDragStart={(event) => onDragStart(event, 'default')} draggable>*/}
            {/*    Default Node*/}
            {/*</div>*/}
            {/*<div className="react-flow__node-output m-b-10" onDragStart={(event) => onDragStart(event, 'output')} draggable>*/}
            {/*    Output Node*/}
            {/*</div>*/}

            {
                ruleNodeDescriptors.map(ruleNodeDescriptor => {
                    return (
                        <div key={ruleNodeDescriptor.id}
                             className="react-flow__node-default m-b-10"
                             onDragStart={(event) => onDragStart(event, 'default', ruleNodeDescriptor)}
                             draggable>
                            {ruleNodeDescriptor.name}
                        </div>
                    )
                })
            }

        </Sider>
    );
};

export default SideBarReactFlow;