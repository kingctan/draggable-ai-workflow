import React, { useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import WorkflowOperator from '../workflow/WorkflowOperator';
import WorkflowStage from '../workflow/WorkflowStage';
import WorkflowConf from '../workflow/WorkflowConf';
import { useDispatch, useMappedState } from 'redux-react-hook';
import { UPDATE_NODE_PARAM, CLEAR_NODES } from '../workflow/workflowReducer';
import { FlowNodesProps } from '../workflow/WorkflowProps';

type Props = {

};

const WorkflowDetail: React.FC<Props> = (props) => {
  // const { } = props;

  const { projectId } = (props as any).match.params;

  const [selectedNodeId, setSelectedNodeId] = useState<string>('');

  const nodes: FlowNodesProps = useMappedState(state => state.workflowReducer);
  const dispatch = useDispatch();

  const handleSelectNode = (nodeId: string) => setSelectedNodeId(nodeId);

  const handelChangeParam = (nodeId: string, paramKey: string, paramValue: string | number) => {

    const dataType = nodes[nodeId].model.params[paramKey].type;
    // There's a bug in Ant Design: when the value of the InputNumber component is 0, the form value will be ''
    if (dataType && (dataType === 'int' || dataType === 'float') && paramValue === "") {
      paramValue = 0;
    }
    dispatch({
      type: UPDATE_NODE_PARAM,
      nodeId,
      paramKey,
      paramValue,
    });
  };



  useEffect(() => {
    return () => {
      dispatch({ type: CLEAR_NODES });
    }
  }, []);

  return (
    <div className="workflow">
      <DndProvider backend={HTML5Backend}>
        <WorkflowOperator />
        <WorkflowStage
          selectedNodeId={selectedNodeId}
          onSelectNode={handleSelectNode}
          projectId={projectId ? Number(projectId) : null}
        />
        {
          //@ts-ignore
          <WorkflowConf
            selectedNodeId={selectedNodeId}
            onChangeParam={handelChangeParam}
          />
        }
      </DndProvider>
    </div>
  );
};

export default WorkflowDetail;