import React, { useState, CSSProperties } from 'react';
import { AutoSizer } from 'react-virtualized';
import CSSModules from 'react-css-modules';
import Graph from 'jsplumb-react';
import { debounce } from 'lodash';
import NodeContent from 'jsplumb-react';
import Node from 'jsplumb-react';

type Props = {

};

const flowNodes: {
  [key: string]: {
    label: string,
    style: CSSProperties
  }
} = {
  node1: {
    label: 'node 1',
    style: {
      left: 272.5,
      top: 233
    }
  },
  node2: {
    label: 'node 2',
    style: {
      left: 372.5,
      top: 233
    }
  }
};

const flowConnections: any = [
  {
    id: 'connection1',
    source: 'node1',
    target: 'node2'
  },
];

const WorkflowStage: React.FC<Props> = (props) => {
  const { } = props;

  const [scale, setScale] = useState<number>(1);
  const [maxScale, setMaxScale] = useState<number>(2);
  const [minScale, setMinScale] = useState<number>(0.25);
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

  const handleZoom = (scale: number) => {
    console.log(scale);
    setScale(scale);
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

  const handleAddConnection = (source: string, id: string, target: string) => {
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

  const children = (id: string, drag: boolean) => (
    //@ts-ignore
    <NodeContent
      id={id}
      label={nodes[id].label}
      onRemoveNode={handleClose}
      style={{ height: 50 }}
    >
      {nodes[id].label || id}
    </NodeContent>
  );

  const RenderNodes = Object.keys(nodes).map((id) => {
    const { label, type } = nodes[id];

    return (
      //@ts-ignore
      <Node
        id={id}
        key={id}
        onDrop={handleDrop}
        style={nodes[id].style}
        className='node'
      >
        {children}
      </Node>
    );
  });


  return (
    <div className="workflow-stage">
      <AutoSizer onResize={handleResize}>
        {() => null}
      </AutoSizer>
      {
        //@ts-ignore
        <Graph
          connections={connections}
          height={height}
          id={'simpleDiagram'}
          maxScale={maxScale}
          minScale={minScale}
          onAddConnection={handleAddConnection}
          onRemoveConnection={handleRemoveConnection}
          onPanEnd={handlePanEnd}
          onZoom={handleZoom}
          scale={scale}
          width={width}
          xOffset={xOffset}
          yOffset={yOffset}
        >
          {RenderNodes}
        </Graph>

      }

    </div>
  );
};

export default CSSModules(WorkflowStage);