import React, { useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import WorkflowOperator from '../workflow/WorkflowOperator';
import WorkflowStage from '../workflow/WorkflowStage';
import WorkflowConf from '../workflow/WorkflowConf';

type Props = {

};

const ProjectDetail: React.FC<Props> = (props) => {
  const { } = props;

  const [nodeConfig, setConfig] = useState(null);

  useEffect(() => {

  }, []);

  return (
    <div className="workflow">
      <DndProvider backend={HTML5Backend}>
        <WorkflowOperator />

        <WorkflowStage

        />
        <WorkflowConf />
      </DndProvider>

    </div>
  );
};

export default ProjectDetail;