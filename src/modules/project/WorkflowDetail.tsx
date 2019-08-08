import React, { useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import axios from 'axios';
import HTML5Backend from 'react-dnd-html5-backend';
import WorkflowOperator from '../workflow/WorkflowOperator';
import WorkflowStage from '../workflow/WorkflowStage';
import WorkflowConf from '../workflow/WorkflowConf';
import { FlowNodeProps } from '../workflow/WorkflowProps';

type Props = {

};

const WorkflowDetail: React.FC<Props> = (props) => {
  const { } = props;

  const { projectId } = (props as any).match.params;

  const [selectedNodeInfo, setSelectedNodeInfo] = useState<FlowNodeProps | undefined>(undefined);

  const changeNodeConfig = (nodeInfo: FlowNodeProps) => setSelectedNodeInfo(nodeInfo);

  useEffect(() => {
  }, []);

  return (
    <div className="workflow">
      <DndProvider backend={HTML5Backend}>
        <WorkflowOperator />
        <WorkflowStage
          changeNodeConfig={changeNodeConfig}
          projectId={projectId ? Number(projectId) : null}
        />
        {
          //@ts-ignore
          <WorkflowConf
            nodeInfo={selectedNodeInfo}
          />
        }

      </DndProvider>

    </div>
  );
};

export default WorkflowDetail;