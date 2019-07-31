import React, { useEffect } from 'react';
import WorkflowBrick from '../workflow/WorkflowBrick';
import WorkflowStage from '../workflow/WorkflowStage';
import WorkflowConf from '../workflow/WorkflowConf';

type Props = {

};

const ProjectDetail: React.FC<Props> = (props) => {
  const { } = props;

  useEffect(() => {

  }, []);

  return (
    <div className="workflow">
      <WorkflowBrick />
      {
        //@ts-ignore
        <WorkflowStage />
      }
      <WorkflowConf />
    </div>
  );
};

export default ProjectDetail;