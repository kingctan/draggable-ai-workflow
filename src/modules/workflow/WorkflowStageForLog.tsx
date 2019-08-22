import React, { useState, useEffect } from 'react';
import { Graph, Node } from '../../components/JSPlumb';
import { FlowNodeProps, FlowNodesProps, FlowConnectionProps, ConnectionConfigProps, ProgressProps } from './WorkflowProps';
import { useMappedState, useDispatch } from 'redux-react-hook';
import { Spin } from 'antd';
import { CLEAR_NODES } from './workflowReducer';
import ModalConnections from '../../components/ModalConnections';

type Props = {
  graphId: string
  selectedNodeId: string
  connections: FlowConnectionProps[]
  progress: ProgressProps
  onSelectNode: (nodeId: string) => void
};

const MAX_SCALE = 2;
const MIN_SCALE = 0.5;

const WorkflowStageForLog: React.FC<Props> = (props) => {
  const { graphId, selectedNodeId, connections, progress, onSelectNode } = props;

  const [visibilityOfModal, setVisibilityOfModal] = useState(false);
  const [modalContentDisabled, setModelContentDisabled] = useState(false);
  const [connectionConfig, setConnectionConfig] = useState<ConnectionConfigProps | null>(null);

  const [scale, setScale] = useState<number>(1);
  const [width, setWidth] = useState<number>(500);
  const [height, setHeight] = useState<number>(500);
  const [xOffset, setXOffset] = useState<number>(0.0);
  const [yOffset, setYOffset] = useState<number>(0.0);

  const nodes: FlowNodesProps = useMappedState(state => state.workflowReducer);
  const dispatch = useDispatch();

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

  useEffect(() => {
    return () => {
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
          id={graphId}
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
          handleOK={() => null}
          handleCancel={() => setVisibilityOfModal(false)}
        />
      }
    </div>
  );
};

export default WorkflowStageForLog;