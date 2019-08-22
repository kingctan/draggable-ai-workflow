import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SplitPane from 'react-split-pane';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { useDispatch, useMappedState } from 'redux-react-hook';
import { FlowNodesProps } from '../workflow/WorkflowProps';
import WorkflowConf from '../workflow/WorkflowConf';
import { Tabs, Form, message } from 'antd';
import WorkflowStageForLog from '../workflow/WorkflowStageForLog';

type Props = {};

const Log: React.FC<{
  content: string
}> = ({ content }) => {

  return (
    <div style={{ background: '#000', color: '#fff', height: 400, overflowY: 'scroll' }}>
      <pre style={{ wordBreak: 'break-all', whiteSpace: 'pre-wrap', padding: 10 }}>
        <code>
          {content}
        </code>
      </pre>
    </div>
  );
};

const InstanceDetail: React.FC<Props> = (props) => {
  // const { } = props;

  const { jobId } = (props as any).match.params;

  const [selectedNodeId, setSelectedNodeId] = useState<string>('');
  const [jobName, setJobName] = useState<string>('');
  const [log, setLog] = useState<string>('');

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
      <SplitPane
        split="vertical"
        minSize={400}
        maxSize={1000}
        defaultSize={Math.trunc((window.innerWidth - 220) * 0.7)}
      >
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
                  <Form.Item>
                    <h3>{nodes[selectedNodeId].label || ''}</h3>
                  </Form.Item>
                  : '未选择节点'
              }
              {
                log &&
                <Form.Item label="日志">
                  <Log content={log} />
                </Form.Item>
              }
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane tab="节点配置" key="2">
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
      </SplitPane>
    </div>
  );
};

export default InstanceDetail;