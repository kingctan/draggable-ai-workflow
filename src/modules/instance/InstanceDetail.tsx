import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { v4 } from 'uuid';
import SyntaxHighlighter from 'react-syntax-highlighter';
//@ts-ignore
import { xt256 } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { useDispatch, useMappedState } from 'redux-react-hook';
import { FlowNodesProps, ProgressProps, FlowConnectionProps, FlowNodeProps } from '../workflow/WorkflowProps';
import WorkflowConf from '../workflow/WorkflowConf';
import { Tabs, message, Drawer, Descriptions, Button, Badge } from 'antd';
import WorkflowStageForLog from '../workflow/WorkflowStageForLog';
import { statusTextMap, statusColorMap } from './InstanceList';
import { formatDate } from '../../utils/formatHelper';
import { ADD_NODE } from '../workflow/workflowReducer';
import { generateConnectionId } from '../../components/JSPlumb/util';

type Props = {};

const MY_GRAPH_ID = 'simpleDiagram';

const InstanceDetail: React.FC<Props> = (props) => {
  // const { } = props;

  const { jobId } = (props as any).match.params;

  const interValTimerSetForJob: any = {};
  const interValTimerSetForLog: any = {};

  const [selectedNodeId, setSelectedNodeId] = useState<string>('');
  const [log, setLog] = useState<string>('');
  const [progress, setProgress] = useState<ProgressProps>({});
  const [isVisibleForLog, setIsVisibleForLog] = useState<boolean>(false);
  const [connections, setConnections] = useState<FlowConnectionProps[]>([]);

  const nodes: FlowNodesProps = useMappedState(state => state.workflowReducer);
  const dispatch = useDispatch();

  const getLog = (nodeId: string) => {
    axios.get(`${process.env.REACT_APP_GO_WORKFLOW_SERVER}/workflow/logs`, {
      params: {
        jobID: jobId,
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
      // message.error('获取日志失败');
    });
  };

  const handleSelectNode = (nodeId: string) => {
    setSelectedNodeId(nodeId);
    getLog(nodeId);
  };

  const handleChangeTab = () => {

  };

  const generateNodeType = (node: FlowNodeProps) => {
    let type: 'both' | 'source' | 'target' = 'both';
    if (node.model) {
      if (!(node.model.inputs && Object.keys(node.model.inputs).length > 0)) {
        type = 'source';
      } else if (!(node.model.outputs && Object.keys(node.model.outputs).length > 0)) {
        type = 'target';
      }
    }
    return type;
  };

  const getJobInfo = () => {
    axios.get(`${process.env.REACT_APP_GO_WORKFLOW_SERVER}/job/get?jobID=${jobId}`, {
      withCredentials: true
    }).then((res) => {
      if (res.data.code === 200) {
        const graph = res.data.data.graph.graph;
        const tmpConnections: FlowConnectionProps[] = [];
        graph.forEach((item: any) => {
          if (item.deps) {
            item.deps.forEach((depNodeId: string) => {
              tmpConnections.push({
                id: generateConnectionId(MY_GRAPH_ID, v4()),
                source: depNodeId,
                target: item.id,
              });
            });
          }
          dispatch({
            type: ADD_NODE,
            nodeId: item.id,
            nodeInfo: {
              id: item.id,
              label: item.name,
              icon: 'icon-code1',
              type: generateNodeType(item),
              model: item.model,
              deps: item.deps,
              style: {
                left: item.fe.left || 0,
                top: item.fe.top || 0,
              },
              outputRuntime: item.outputs,
              inputRuntime: item.inputs,
            }
          });
        });
        setConnections(tmpConnections);
        setProgress(res.data.data.progress.components || {});
      }
    }).catch((err) => {
      console.error(err);
    });
  };

  const getProgress = () => {
    axios.get(`${process.env.REACT_APP_GO_WORKFLOW_SERVER}/job/get?jobID=${jobId}`, {
      withCredentials: true
    }).then((res) => {
      if (res.data.code === 200) {
        setProgress(res.data.data.progress.components);
        if (res.data.data.progress.status === 'Succeeded') {
          return Object.keys(interValTimerSetForJob).forEach((key) => {
            clearInterval(interValTimerSetForJob[key]);
          });
        }
      }
    }).catch((err) => {
      console.error(err);
    });
  };

  useEffect(() => {
    if (isVisibleForLog) {
      setTimeout(() => {
        const ele: any = document.querySelector('.drawer-log');
        ele.scrollTop = ele.scrollHeight;
      }, 0);
      interValTimerSetForLog[v4()] = setInterval(() => getLog(selectedNodeId), 1000);
    }
    return () => {
      Object.keys(interValTimerSetForLog).forEach((key) => {
        clearInterval(interValTimerSetForLog[key]);
      });
    }
  }, [isVisibleForLog]);

  useEffect(() => {
    if (jobId) {
      getJobInfo();
      interValTimerSetForJob[v4()] = setInterval(getProgress, 3000);
    }
    return () => {
      Object.keys({ ...interValTimerSetForJob, ...interValTimerSetForLog }).forEach((key) => {
        clearInterval(interValTimerSetForJob[key]);
      });
    };
  }, []);

  return (
    <div className="workflow">
      <WorkflowStageForLog
        graphId={MY_GRAPH_ID}
        selectedNodeId={selectedNodeId}
        connections={connections}
        progress={progress}
        onSelectNode={handleSelectNode}
      />
      <Tabs className="workflow-log" defaultActiveKey="1" onChange={handleChangeTab}>
        <Tabs.TabPane tab="运行信息" key="1">
          <div style={{ padding: 10 }}>
            {
              selectedNodeId ?
                <Descriptions title={nodes[selectedNodeId].label} size="middle" bordered column={1}>
                  <Descriptions.Item label="状态">
                    <Badge
                      color={progress[selectedNodeId] ? statusColorMap[progress[selectedNodeId].status] : '#ccc'}
                      text={progress[selectedNodeId] ? statusTextMap[progress[selectedNodeId].status] : '未开始'}
                    />
                  </Descriptions.Item>
                  <Descriptions.Item label="节点 ID">
                    <span>{selectedNodeId}</span>
                  </Descriptions.Item>
                  <Descriptions.Item label="开始时间">
                    <span>
                      {
                        progress[selectedNodeId] ?
                          formatDate(new Date(progress[selectedNodeId].startedAt), 'MM/dd/yyyy, hh:mm:ss') : ''
                      }
                    </span>
                  </Descriptions.Item>
                  <Descriptions.Item label="结束时间">
                    <span>
                      {
                        progress[selectedNodeId] && progress[selectedNodeId].finishedAt ?
                          formatDate(new Date(progress[selectedNodeId].finishedAt), 'MM/dd/yyyy, hh:mm:ss') : ''
                      }
                    </span>
                  </Descriptions.Item>
                  <Descriptions.Item label="日志">
                    <Button type="primary" disabled={!progress[selectedNodeId]} onClick={() => setIsVisibleForLog(true)}>查看日志</Button>
                  </Descriptions.Item>
                </Descriptions> : '未选择节点'
            }
            <Drawer
              title={`${selectedNodeId && nodes[selectedNodeId].label}（${selectedNodeId}）`}
              width="65%"
              placement="right"
              onClose={() => setIsVisibleForLog(false)}
              visible={isVisibleForLog}
            >
              <SyntaxHighlighter className="drawer-log" language="bash" style={xt256} wrapLines={true}>
                {log}
              </SyntaxHighlighter>
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