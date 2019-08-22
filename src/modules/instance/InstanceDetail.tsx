import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { useDispatch, useMappedState } from 'redux-react-hook';
import { FlowNodesProps, ProgressProps } from '../workflow/WorkflowProps';
import WorkflowConf from '../workflow/WorkflowConf';
import { Tabs, Form, message, Drawer, Descriptions, Button, Tag, Badge } from 'antd';
import WorkflowStageForLog from '../workflow/WorkflowStageForLog';
import { statusTextMap, statusColorMap } from './InstanceList';
import { formatDate } from '../../utils/formatHelper';

type Props = {};

const InstanceDetail: React.FC<Props> = (props) => {
  // const { } = props;

  const { jobId } = (props as any).match.params;

  const [selectedNodeId, setSelectedNodeId] = useState<string>('');
  const [jobName, setJobName] = useState<string>('');
  const [log, setLog] = useState<string>('');
  const [progress, setProgress] = useState<ProgressProps>({});
  const [isVisibleForLog, setIsVisibleForLog] = useState<boolean>(false);

  const nodes: FlowNodesProps = useMappedState(state => state.workflowReducer);
  const dispatch = useDispatch();

  const getLog = (nodeId: string) => {
    axios.get(`${process.env.REACT_APP_GO_WORKFLOW_SERVER}/workflow/logs`, {
      params: {
        workflowName: jobName,
        tail: 100,
        nodeName: nodeId,
      },
      withCredentials: true
    }).then((res) => {
      if (res.data.code === 200) {
        if (res.data.data) {
          setLog(res.data.data.log || '');
        }
      } else {
        setLog('');
      }
    }).catch((err) => {
      console.error(err);
      message.error('获取日志失败');
    });
  };

  const handleSelectNode = (nodeId: string) => {
    setSelectedNodeId(nodeId);
    getLog(nodeId);
  };

  const handleChangeTab = () => {

  };

  const getJobInfo = () => {
    axios.get(`${process.env.REACT_APP_GO_WORKFLOW_SERVER}/job/get?jobID=${jobId}`, {
      withCredentials: true
    }).then((res) => {
      if (res.data.code === 200) {
        setJobName(res.data.data.jobName);
        setProgress(res.data.data.progress.components);
      }
    }).catch((err) => {
      console.error(err);
    });
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
        <Tabs.TabPane tab="运行信息" key="1">
          <div style={{ padding: 10 }}>
            {
              selectedNodeId ?
                <Descriptions title={nodes[selectedNodeId].label} size="middle" bordered column={1}>
                  <Descriptions.Item label="状态">
                    <Badge
                      color={statusColorMap[progress[selectedNodeId].status]}
                      text={statusTextMap[progress[selectedNodeId].status]}
                    />
                  </Descriptions.Item>
                  <Descriptions.Item label="开始时间">
                    <span>
                      {formatDate(new Date(progress[selectedNodeId].startedAt), 'MM/dd/yyyy, hh:mm:ss')}
                    </span>
                  </Descriptions.Item>
                  <Descriptions.Item label="结束时间">
                    <span>
                      {formatDate(new Date(progress[selectedNodeId].finishedAt), 'MM/dd/yyyy, hh:mm:ss')}
                    </span>
                  </Descriptions.Item>
                  <Descriptions.Item label="日志">
                    <Button type="primary" onClick={() => setIsVisibleForLog(true)}>查看日志</Button>
                  </Descriptions.Item>
                </Descriptions> : '未选择节点'
            }
            <Drawer
              title={`${selectedNodeId && nodes[selectedNodeId].label}（${selectedNodeId}）`}
              width="60%"
              placement="right"
              closable={false}
              onClose={() => setIsVisibleForLog(false)}
              visible={isVisibleForLog}
            >
              <pre className="drawer-log">
                <code>
                  {log}
                </code>
              </pre>
            </Drawer>
          </div>
        </Tabs.TabPane>
        <Tabs.TabPane tab="可调参数" key="2">
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
      </Tabs>
    </div>
  );
};

export default InstanceDetail;