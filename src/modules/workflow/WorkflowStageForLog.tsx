import React, { useState, useEffect } from 'react';
import { AutoSizer } from 'react-virtualized';
import { debounce } from 'lodash';
import { v4 } from 'uuid';
import axios from 'axios';
import { useDrop, DropTargetMonitor } from 'react-dnd'
import { Graph, Node } from '../../components/JSPlumb';
import { FlowNodeProps, FlowNodesProps, FlowConnectionProps, OutputRuntimeProps, ConnectionConfigProps, ProgressProps } from './WorkflowProps';
import { XYCoord } from 'dnd-core';
import { useMappedState, useDispatch } from 'redux-react-hook';
import { Button, Icon, Tooltip, message, Spin } from 'antd';
import { generateNodeId, generateConnectionId } from '../../components/JSPlumb/util';
import { ADD_NODE, REMOVE_NODE, NEW_CONNECTION, UPDATE_NODE_STYLE, REMOVE_CONNECTION, CLEAR_NODES } from './workflowReducer';
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
    const style = { fontSize: 20 };
    let StatusIcon = <Icon type="question" style={style} />;

    if (progress[nodeId]) {
      const status = progress[nodeId].status;
      switch (status) {
        case 'Succeeded':
          StatusIcon = <Icon type="check" style={style} />;
          break;
        case 'Error':
          StatusIcon = <Icon type="close" style={style} />;
          break;
        case 'Failed':
          StatusIcon = <Icon type="close" style={style} />;
          break;
        case 'Pending':
          StatusIcon = <Spin size="small" style={style} />;
          break;
        case 'Running':
          StatusIcon = <Spin size="small" style={style} />;
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

  useEffect(() => {
    if (jobId) {
      getJobInfo();
    }
    return () => {
      dispatch({ type: CLEAR_NODES });
    }
  }, []);

  return (
    <div className="workflow-stage">
      <AutoSizer onResize={handleResize}>
        {() => null}
      </AutoSizer>
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