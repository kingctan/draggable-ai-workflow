import React, { useState, useEffect } from 'react';
import WorkflowStage from '../workflow/WorkflowStage';
import { useDispatch, useMappedState } from 'redux-react-hook';
import { FlowNodesProps } from '../workflow/WorkflowProps';
import WorkflowConf from '../workflow/WorkflowConf';
import { Tabs } from 'antd';
import WorkflowStageForLog from '../workflow/WorkflowStageForLog';

type Props = {};

const InstanceDetail: React.FC<Props> = (props) => {
  // const { } = props;

  const { jobId } = (props as any).match.params;

  const [selectedNodeId, setSelectedNodeId] = useState<string>('');

  const nodes: FlowNodesProps = useMappedState(state => state.workflowReducer);
  const dispatch = useDispatch();

  const handleSelectNode = (nodeId: string) => setSelectedNodeId(nodeId);

  const handleChangeTab = () => {

  };

  const getJobInfo = () => {

  };

  useEffect(() => {
    if (jobId) {
      getJobInfo();
    }
  }, []);

  return (
    <div className="workflow">
      <WorkflowStageForLog
        selectedNodeId={selectedNodeId}
        onSelectNode={handleSelectNode}
        jobId={jobId}
      />
      <Tabs className="workflow-log" defaultActiveKey="1" onChange={handleChangeTab}>
        <Tabs.TabPane tab="节点配置" key="1">
          {
            selectedNodeId ?
              //@ts-ignore
              <WorkflowConf
                editMode
                selectedNodeId={selectedNodeId}
              /> :
              <div style={{ padding: 10 }}>未选择节点</div>
          }
        </Tabs.TabPane>
        <Tabs.TabPane tab="运行日志" key="2">
          <div style={{ padding: 10 }}>

          </div>
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default InstanceDetail;