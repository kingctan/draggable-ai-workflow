import React, { useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import axios from 'axios';
import HTML5Backend from 'react-dnd-html5-backend';
import WorkflowOperator from '../workflow/WorkflowOperator';
import WorkflowStage from '../workflow/WorkflowStage';
import WorkflowConf from '../workflow/WorkflowConf';

type Props = {

};

const WorkflowDetail: React.FC<Props> = (props) => {
  const { } = props;

  const { projectId } = (props as any).match.params;

  const [nodeConfig, setConfig] = useState(null);

  useEffect(() => {
  }, []);

  return (
    <div className="workflow">
      <DndProvider backend={HTML5Backend}>
        <WorkflowOperator />

        <WorkflowStage projectId={projectId ? Number(projectId) : null} />
        <WorkflowConf />
      </DndProvider>

    </div>
  );
};

export default WorkflowDetail;