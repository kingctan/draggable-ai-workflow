import React, { useState } from 'react';
import { AutoSizer } from 'react-virtualized';
import CSSModules from 'react-css-modules';
import { debounce } from 'lodash';
import { v4 } from 'uuid';
import { useDrop, DropTargetMonitor } from 'react-dnd'
import { Graph, Node } from '../../components/JSPlumb';
import { FlowNodeProps } from './WorkflowProps';
import { XYCoord } from 'dnd-core';
import { useMappedState } from 'redux-react-hook';
import { Button, Icon, Tooltip, message } from 'antd';

type Props = {

};

const flowNodes: FlowNodeProps = {
  // [v4()]: {
  //   label: '数据',
  //   icon: 'icon-database',
  //   type: 'source',
  //   style: {
  //     left: 272.5,
  //     top: 233
  //   },
  // },
  // [v4()]: {
  //   label: '模型',
  //   icon: 'icon-ziyuanshezhi',
  //   type: 'target',
  //   style: {
  //     left: 372.5,
  //     top: 233
  //   }
  // }
};

const flowConnections: any = [
  // {
  //   id: 'connection1',
  //   source: 'node1',
  //   target: 'node2'
  // },
];

const WorkflowStage: React.FC<Props> = (props) => {
  const { } = props;

  const MAX_SCALE = 2;
  const MIN_SCALE = 0.5;

  const [scale, setScale] = useState<number>(1);
  const [width, setWidth] = useState<number>(500);
  const [height, setHeight] = useState<number>(500);
  const [nodes, setNodes] = useState<any>(flowNodes);
  // const nodes: FlowNodeProps = useMappedState(state => state.workflowReducer)
  const [xOffset, setXOffset] = useState<number>(0.0);
  const [yOffset, setYOffset] = useState<number>(0.0);
  const [connections, setConnections] = useState<any>(flowConnections);

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
    console.log(scale);
    setScale(scale!);
  };

  const handleClose = (id: string | undefined) => {
    if (id) {
      const { [id]: omit, ...remaining } = nodes;
      setNodes(remaining);
      setConnections(connections.filter((connection: any) => (
        connection.source !== id && connection.target !== id
      )));
    }
  };

  const handleAddConnection = (id: string, source: string, target: string) => {
    console.log({ id, source, target })
    setConnections([
      ...connections,
      { id, source, target }
    ]);
  };

  const handleRemoveConnection = (connectionId?: string, sourceId?: string) => {
    // if (confirm('Remove connection \'' + connectionId + '\'?')) {
    setConnections(connections.filter((connection: any) => (
      connection.id !== connectionId
    )));
    // }
  };

  const handleSave = () => {

  };

  const handlePlay = () => {

  };

  const handleReset = () => {
    setScale(1);
    setXOffset(0.0);
    setYOffset(0.0);
    setWidth(500);
    setHeight(500);
  };

  // const handleDrop = (id: string, x: number, y: number) => {
  //   setNodes({
  //     ...nodes,
  //     [id]: { ...nodes[id], x, y }
  //   });
  // };

  const [{ canDrop, isOver }, drop] = useDrop({
    accept: 'box',
    drop: (item: any, monitor: DropTargetMonitor) => {
      const clientOffset: XYCoord | null = monitor.getSourceClientOffset();

      const ndDropPlace = document.getElementById('drop-stage');
      const dropPlaceOffset: { left: number, top: number } = ndDropPlace!.getBoundingClientRect();

      const relativeXOffset = clientOffset!.x - dropPlaceOffset.left;
      const relativeYOffset = clientOffset!.y - dropPlaceOffset.top;

      // console.log(item);

      // console.log(`横坐标相对便宜：`, relativeXOffset);
      // console.log(`纵坐标相对便宜：`, relativeYOffset);
      setNodes({
        ...nodes,
        [v4()]: {
          label: item.name.title,
          icon: 'icon-database',
          type: 'both',
          style: {
            left: relativeXOffset,
            top: relativeYOffset,
          },
        }
      });

      return {
        name: 'stage',
      }
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  return (
    <div className="workflow-stage">
      <AutoSizer onResize={handleResize}>
        {() => null}
      </AutoSizer>
      <div ref={drop} id="drop-stage">
        <div className="stage-toolbar">
          <Button.Group>
            <Tooltip placement="top" title="保存">
              <Button onClick={handleSave}><Icon type="save" theme="filled" />保存</Button>
            </Tooltip>
            <Tooltip placement="top" title="运行">
              <Button onClick={handlePlay}><Icon type="play-circle" theme="filled" />运行</Button>
            </Tooltip>
            <Tooltip placement="top" title="画布重置">
              <Button onClick={handleReset}><Icon type="sync" /></Button>
            </Tooltip>
            <Tooltip placement="top" title="全屏">
              <Button onClick={() => message.warn('开发中 😁')}><Icon type="fullscreen" /></Button>
            </Tooltip>
          </Button.Group>
        </div>
        <Graph
          connections={connections}
          height={height}
          id={'simpleDiagram'}
          maxScale={MAX_SCALE}
          minScale={MIN_SCALE}
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
                  key={id}
                  // onDrop={handleDrop}
                  style={nodes[id].style}
                  className="node"
                  {...nodes[id]}
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

export default CSSModules(WorkflowStage);