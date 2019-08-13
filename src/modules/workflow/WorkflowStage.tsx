import React, { useState, useEffect } from 'react';
import { AutoSizer } from 'react-virtualized';
import { debounce } from 'lodash';
import { v4 } from 'uuid';
import axios from 'axios';
import { useDrop, DropTargetMonitor } from 'react-dnd'
import { Graph, Node } from '../../components/JSPlumb';
import { FlowNodeProps, FlowNodesProps, FlowConnectionProps, OutputRuntimeProps } from './WorkflowProps';
import { XYCoord } from 'dnd-core';
import { useMappedState, useDispatch } from 'redux-react-hook';
import { Button, Icon, Tooltip, message } from 'antd';
import { generateNodeId, generateConnectionId } from '../../components/JSPlumb/util';
import { ADD_NODE, REMOVE_NODE, NEW_CONNECTION, UPDATE_NODE_STYLE, REMOVE_CONNECTION } from './workflowReducer';

type Props = {
  projectId: number | null
  selectedNodeId: string
  onSelectNode: (nodeId: string) => void
};

// const flowNodes: FlowNodesProps = {};
// const flowConnections: any = [];

const MAX_SCALE = 2;
const MIN_SCALE = 0.5;
const MY_GRAPH_ID = 'simpleDiagram';

const WorkflowStage: React.FC<Props> = (props) => {
  const { projectId, selectedNodeId, onSelectNode } = props;

  const [loadingForSave, setLoadingForSave] = useState(false);
  const [loadingForRun, setLoadingForRun] = useState(false);

  const [scale, setScale] = useState<number>(1);
  const [width, setWidth] = useState<number>(500);
  const [height, setHeight] = useState<number>(500);
  // const [nodes, setNodes] = useState<any>(flowNodes);
  const [xOffset, setXOffset] = useState<number>(0.0);
  const [yOffset, setYOffset] = useState<number>(0.0);
  // const [selectedNode, setSelectedNode] = useState<FlowNodeProps | null>(null);
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
    // console.log(scale);
    setScale(scale!);
  };

  // const handleClose = (id: string | undefined) => {
  //   if (id) {
  //     const { [id]: omit, ...remaining } = nodes;
  //     setNodes(remaining);
  //     setConnections(connections.filter((connection: any) => (
  //       connection.source !== id && connection.target !== id
  //     )));
  //   }
  // };

  const handleAddConnection = (id: string, source: string, target: string) => {
    console.log(id, source, target);

    // setConnections([
    //   ...connections,
    //   { id, source, target }
    // ]);
  };

  const handleRemoveConnection = (connectionId?: string, sourceId?: string, targetId?: string) => {
    setConnections(connections.filter((connection: any) => (
      connection.id !== connectionId
    )));
    dispatch({
      type: REMOVE_CONNECTION,
      sourceId,
      targetId,
    });
  };

  const handleDeleteNode = (nodeId: string) => {
    // console.log(nodeId);
    // const newNodes = { ...nodes };
    // delete newNodes[nodeId];
    // setNodes(newNodes);
    dispatch({
      type: REMOVE_NODE,
      nodeId,
    });

    if (nodeId === selectedNodeId) {
      onSelectNode('');
    }

  };

  const handleBeforeDrop = (sourceId: string, targetId: string) => {
    const source: FlowNodeProps = nodes[sourceId];
    const target: FlowNodeProps = nodes[targetId];
    let checkType = false; // 判断连线两端算子输入输出类型是否匹配
    if (target.model && source.model) {

      const outputTypes: string[] = []; // 存所有输入、所有输出的type
      Object.keys(source.model.outputs).forEach((outputKey: string) => {
        outputTypes.push(source.model.outputs[outputKey].type);
      });
      Object.keys(target.model.inputs).forEach((inputKey: string) => {
        if (outputTypes.includes(target.model.inputs[inputKey].type)) checkType = true;
      });

      if (target.inputRuntime && Object.keys(target.inputRuntime).length === Object.keys(target.model.inputs).length) {
        message.warning(<span><b>{target.label}</b> 无法接受更多的输入！</span>);
        return false;
      }

      if (checkType) {
        dispatch({
          type: NEW_CONNECTION,
          sourceId,
          targetId,
        });
        return true;
      } else {
        message.warning('两个组件的输入输出不匹配，无法建立连接！');
        return false;
      }

    } else {
      message.warning('无法建议连接：请使用自定义组件并配置至少一个输入或输出，其它组件暂时只做展示！', 6);
      return false;
    }
  };

  const handleSave = async () => {
    console.log(`nodes: `, nodes);

    if (Object.keys(nodes).length === 0) return message.warning('未制作工作流..');

    const graph: any = [];
    setLoadingForSave(true);

    Object.keys(nodes).forEach((nodeId: string) => {
      const node: FlowNodeProps = nodes[nodeId];

      const params: any = {};
      Object.keys(nodes[nodeId].model.params).forEach((paramKey: string) => {
        params[paramKey] = {
          value: nodes[nodeId].model.params[paramKey].default,
          type: nodes[nodeId].model.params[paramKey].type,
        };
      });

      graph.push({
        id: node.id,
        name: node.label,
        code: node.model.code,
        container: node.model.container,
        deps: node.deps || [],
        fe: node.style,
        model: node.model,
        inputs: node.inputRuntime,
        outputs: node.outputRuntime,
        params,
      });
    });
    await axios.put(`${process.env.REACT_APP_GO_WORKFLOW_SERVER}/project/update`, {
      projectID: projectId,
      graph: {
        version: "v1.0",
        graph,
      }
    })
      .then((res) => {
        setLoadingForSave(false);
        if (res.data.code === 200) {
          return message.success('已保存');
        } else {
          return message.error('保存失败');
        }
      }).catch((err) => {
        setLoadingForSave(false);
        return message.error('服务器被吃了..');
      });
  };

  const handlePlay = async () => {
    if (Object.keys(nodes).length === 0) return message.warning('未制作工作流..');

    setLoadingForRun(true);
    await handleSave();

    axios.post(`${process.env.REACT_APP_GO_WORKFLOW_SERVER}/job/create`, {
      projectID: projectId,
    })
      .then((res) => {
        if (res.data.code === 200) {
          setLoadingForRun(false);
          return message.success('已运行，可前往实例列表查看任务');
        } else {
          return message.error('运行失败');
        }
      }).catch((err) => {
        setLoadingForRun(false);
        return message.error('服务器被吃了..');
      });
  };

  const handleReset = () => {
    setScale(1);
    setXOffset(0.0);
    setYOffset(0.0);
    setWidth(500);
    setHeight(500);
  };

  const handleScreen = () => {
    console.log('🌺', nodes);
    console.log('🖼', connections);
    message.warn('开发中 😁');
  };

  const handleSelectNode = (selectedNode: FlowNodeProps) => {
    onSelectNode(selectedNode.id);
  };

  const handleDrop = (id: string, x: number, y: number) => {
    // setNodes({
    //   ...nodes,
    //   [id]: { ...nodes[id], x, y }
    // });
    dispatch({
      type: UPDATE_NODE_STYLE,
      nodeId: id,
      left: x,
      top: y
    });
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

  const [{
    // canDrop,
    // isOver
  }, drop] = useDrop({
    accept: 'box',
    drop: (item: any, monitor: DropTargetMonitor) => {
      const clientOffset: XYCoord | null = monitor.getSourceClientOffset();

      const ndDropPlace = document.getElementById('drop-stage');
      const dropPlaceOffset: { left: number, top: number } = ndDropPlace!.getBoundingClientRect();

      const relativeXOffset = clientOffset!.x - dropPlaceOffset.left;
      const relativeYOffset = clientOffset!.y - dropPlaceOffset.top;

      // console.log(`✨拖动结束！`, item.name);
      const payload = item.name;
      const nodeId = generateNodeId(MY_GRAPH_ID, v4());

      const outputRuntime: OutputRuntimeProps = {};

      // 最后提交时不用关心输出的依赖，只需要把输出原来就有的所有key都带上就行
      Object.keys(payload.model.outputs).forEach((outputKey: string) => {
        outputRuntime[outputKey] = {
          type: payload.model.outputs[outputKey].type,
        }
      });

      dispatch({
        type: ADD_NODE,
        nodeId,
        nodeInfo: {
          id: nodeId,
          label: payload.title,
          icon: 'icon-code1',
          type: generateNodeType(payload),
          model: payload.model,
          style: {
            left: relativeXOffset,
            top: relativeYOffset,
          },
          outputRuntime,
        }
      });

      onSelectNode(nodeId);

    },
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const getWorkflowInfo = () => {
    axios.get(`${process.env.REACT_APP_GO_WORKFLOW_SERVER}/project/get?projectID=${projectId}`)
      .then((res) => {
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
        }
      }).catch((err) => {
        // message.error('服务器被吃了..');
      });
  };

  useEffect(() => {
    if (projectId) {
      getWorkflowInfo();
    }
  }, []);

  return (
    <div className="workflow-stage">
      <AutoSizer onResize={handleResize}>
        {() => null}
      </AutoSizer>
      <div ref={drop} id="drop-stage">
        <div className="stage-toolbar">
          <Button.Group>
            <Tooltip placement="top" title="保存">
              <Button onClick={handleSave}>
                {loadingForSave ? <Icon type="loading" /> : <Icon type="save" theme="filled" />} 保存
              </Button>
            </Tooltip>
            <Tooltip placement="top" title="运行">
              <Button onClick={handlePlay} >
                {loadingForRun ? <Icon type="loading" /> : <Icon type="play-circle" theme="filled" />} 运行
              </Button>
            </Tooltip>
            <Tooltip placement="top" title="缩放重置">
              <Button onClick={handleReset}><Icon type="sync" /></Button>
            </Tooltip>
            <Tooltip placement="top" title="全屏">
              <Button onClick={handleScreen}><Icon type="fullscreen" /></Button>
            </Tooltip>
          </Button.Group>
        </div>
        <Graph
          connections={connections}
          height={height}
          id={MY_GRAPH_ID}
          maxScale={MAX_SCALE}
          minScale={MIN_SCALE}
          // onSelect={handleSelectNode}
          // do something when connect two endpoints
          onBeforeDrop={handleBeforeDrop}
          onAddConnection={handleAddConnection}
          onRemoveConnection={handleRemoveConnection}
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
                  icon={nodes[id].icon}
                  label={nodes[id].label}
                  model={nodes[id].model}
                  onDrop={handleDrop}
                  //@ts-ignore
                  onSelect={handleSelectNode}
                  onDelete={handleDeleteNode}
                  style={nodes[id].style}
                >
                </Node>
              );
            })
          }
        </Graph>
      </div>
    </div>
  );
};

export default WorkflowStage;