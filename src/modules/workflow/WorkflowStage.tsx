import React, { useState, CSSProperties } from 'react';
import { AutoSizer } from 'react-virtualized';
import CSSModules from 'react-css-modules';
import { Graph, Node, NodeContent } from '../../components/JSPlumb';
import { debounce } from 'lodash';
import { Connections } from 'jsplumb';
import FlowNode from '../../components/FlowNode';

type Props = {

};

const flowNodes: {
  [key: string]: {
    id?: string
    label: string,
    icon: string
    style: CSSProperties
    type: 'both' | 'source' | 'target'
  }
} = {
  node1: {
    label: '数据',
    icon: 'icon-database',
    type: 'source',
    style: {
      left: 272.5,
      top: 233
    },
  },
  node2: {
    label: '模型',
    icon: 'icon-ziyuanshezhi',
    type: 'target',
    style: {
      left: 372.5,
      top: 233
    }
  }
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

  const handleDrop = (id: string, x: number, y: number) => {
    setNodes({
      ...nodes,
      [id]: { ...nodes[id], x, y }
    });
  };

  return (
    <div className="workflow-stage">
      <AutoSizer onResize={handleResize}>
        {() => null}
      </AutoSizer>
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
                onDrop={handleDrop}
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
  );
};

export default CSSModules(WorkflowStage);