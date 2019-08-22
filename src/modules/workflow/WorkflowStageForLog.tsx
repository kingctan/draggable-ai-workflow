import React, { useState, useEffect } from 'react';
import { AutoSizer } from 'react-virtualized';
import { debounce } from 'lodash';
import { v4 } from 'uuid';
import axios from 'axios';
import { Graph, Node } from '../../components/JSPlumb';
import { FlowNodeProps, FlowNodesProps, FlowConnectionProps, ConnectionConfigProps, ProgressProps } from './WorkflowProps';
import { useMappedState, useDispatch } from 'redux-react-hook';
import { Spin } from 'antd';
import { generateConnectionId } from '../../components/JSPlumb/util';
import { ADD_NODE, CLEAR_NODES } from './workflowReducer';
import ModalConnections from '../../components/ModalConnections';

type Props = {
  jobId: number | null
  selectedNodeId: string
  onSelectNode: (nodeId: string) => void
};

const MAX_SCALE = 2;
const MIN_SCALE = 0.5;
const MY_GRAPH_ID = 'simpleDiagram';


const WorkflowStageForLog: React.FC<Props> = (props) => {
  const { jobId, selectedNodeId, onSelectNode } = props;

  const interValTimerSet: any = {}; // 轮询的timer集

  const [visibilityOfModal, setVisibilityOfModal] = useState(false);
  const [modalContentDisabled, setModelContentDisabled] = useState(false);
  const [connectionConfig, setConnectionConfig] = useState<ConnectionConfigProps | null>(null);

  const [progress, setProgress] = useState<ProgressProps>({});
  const [scale, setScale] = useState<number>(1);
  const [width, setWidth] = useState<number>(500);
  const [height, setHeight] = useState<number>(500);
  const [xOffset, setXOffset] = useState<number>(0.0);
  const [yOffset, setYOffset] = useState<number>(0.0);
  const [connections, setConnections] = useState<FlowConnectionProps[]>([]);

  const nodes: FlowNodesProps = useMappedState(state => state.workflowReducer);
  const dispatch = useDispatch();

  const handleResize = debounce(
    ({ height, width }: { height: number, width: number }) => {
      setHeight(height);
      setWidth(width);
    },
    400,
    { trailing: true }
  );

  const handlePanEnd = (xOffset?: number, yOffset?: number) => {
    xOffset && setXOffset(xOffset);
    yOffset && setYOffset(yOffset);
  };

  const handleZoom = (scale?: number | undefined) => {
    setScale(scale!);
  };

  const handleClickLabel = (sourceId: string, targetId: string) => {
    if (sourceId && targetId) {
      setConnectionConfig({ sourceId, targetId });
      setModelContentDisabled(true);
      setVisibilityOfModal(true);
    }
  };

  const handleSelectNode = (selectedNode: FlowNodeProps) => {
    onSelectNode(selectedNode.id);
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


  const handleMakeConnection = (sourceId: string, targetId: string) => {
    setConnections(
      [...connections, {
        id: generateConnectionId(MY_GRAPH_ID, v4()),
        source: sourceId,
        target: targetId,
      }]
    )
  };

  const generateStatusIcon = (nodeId: string) => {
    const style = { fontSize: 18 };
    const colorGreen = '#7ED321';
    const colorRed = 'rgb(255, 85, 0)';
    const colorGray = '#c4c4c4';
    let StatusIcon = <i className="iconfont icon-wait" style={{ ...style, color: colorGray }} />;

    if (progress[nodeId]) {
      const status = progress[nodeId].status;
      switch (status) {
        case 'Succeeded':
          StatusIcon = <i className="iconfont icon-success" style={{ ...style, color: colorGreen }} />;
          break;
        case 'Error':
          StatusIcon = <i className="iconfont icon-error" style={{ ...style, color: colorRed }} />;
          break;
        case 'Failed':
          StatusIcon = <i className="iconfont icon-error" style={{ ...style, color: colorRed }} />;
          break;
        case 'Pending':
          StatusIcon = <Spin size="small" />;
          break;
        case 'Running':
          StatusIcon = <Spin size="small" />;
          break;
        default:
          break;
      }
    }
    return StatusIcon;
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
        setProgress(res.data.data.progress.components);
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
        if (res.data.data.progress.status === 'Succeeded') {
          return Object.keys(interValTimerSet).forEach((key) => {
            clearInterval(interValTimerSet[key]);
          });
        }
        setProgress(res.data.data.progress.components);
      }
    }).catch((err) => {
      console.error(err);
    });
  };

  useEffect(() => {
    if (jobId) {
      getJobInfo();
      interValTimerSet[v4()] = setInterval(getProgress, 3000);
    }
    return () => {
      Object.keys(interValTimerSet).forEach((key) => {
        clearInterval(interValTimerSet[key]);
      });
      dispatch({ type: CLEAR_NODES });
    };
  }, []);

  return (
    <div className="workflow-stage">
      <div id="drop-stage">
        <Graph
          connections={connections}
          editMode
          height={height}
          id={MY_GRAPH_ID}
          maxScale={MAX_SCALE}
          minScale={MIN_SCALE}
          // onSelect={handleSelectNode}
          // do something when connect two endpoints
          onClickLabel={handleClickLabel}
          onBeforeDrop={() => null}
          onAddConnection={() => null}
          onRemoveConnection={() => null}
          onPanEnd={handlePanEnd}
          onZoom={handleZoom}
          scale={scale}
          width={width}
          xOffset={xOffset}
          yOffset={yOffset}
        >
          {
            Object.keys(nodes).map((id) => {
              return (
                //@ts-ignore
                <Node
                  id={id}
                  className="node"
                  selectedActive={id === selectedNodeId}
                  key={id}
                  type={nodes[id].type}
                  editMode
                  icon={nodes[id].icon}
                  label={nodes[id].label}
                  model={nodes[id].model}
                  onDrop={() => null}
                  //@ts-ignore
                  onSelect={handleSelectNode}
                  StatusIcon={generateStatusIcon(id)}
                  onDelete={() => null}
                  style={nodes[id].style}
                >
                </Node>
              );
            })
          }
        </Graph>
      </div>
      {
        visibilityOfModal &&
        //@ts-ignore
        <ModalConnections
          visible={visibilityOfModal}
          modalContentDisabled={modalContentDisabled}
          config={connectionConfig}
          handleOK={handleMakeConnection}
          handleCancel={() => setVisibilityOfModal(false)}
        />
      }
    </div>
  );
};

export default WorkflowStageForLog;