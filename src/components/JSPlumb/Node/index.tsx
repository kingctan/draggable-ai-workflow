import React, { useState, useEffect, CSSProperties, SFC } from 'react';
import { jsPlumbInstance } from 'jsplumb';

import './index.css'
import { generateNodeId } from '../util';


type Props = {
  allowLoopback?: boolean
  children: (id: string, drag: boolean) => Element
  className: string
  diagramId: string
  id: string
  jsPlumb: jsPlumbInstance
  onDrag?: (id: string, pos0: any, pos1: any) => void
  onDrop?: (id: string, pos0: any, pos1: any) => void
  onSelect: (selections: any) => void
  style: {
    left: number,
    top: number,
  }
  styleName?: string
  type?: 'both' | 'source' | 'target',
  dragSettings?: any
  sourceSettings?: any
  targetSettings?: any
};

const defaultDragSettings = {};
const defaultSourceSettings = {};
const defaultTargetSettings = {};

//@ts-ignore
const Node: SFC<Props> = (props) => {

  const {
    allowLoopback,
    children = () => (<div />),
    className = 'jsplumb-react-node',
    diagramId = '',
    dragSettings = defaultDragSettings,
    id,
    sourceSettings = defaultSourceSettings,
    targetSettings = defaultTargetSettings,
    jsPlumb,
    style = {
      left: 0,
      top: 0,
    },
    styleName = 'node',
    type = 'both',
  } = props;

  const [drag, setDrag] = useState<boolean>(true);

  const connectionFilter = ':not(.jsplumb-react-node)';
  const dragFilter = ':not(.jsplumb-react-node)';

  let localStyle: CSSProperties = {};
  let node: HTMLElement | undefined;
  let timeout: NodeJS.Timer;
  let drop: boolean = false;
  let ref = (currentNode: HTMLDivElement) => (node = currentNode);

  const makeNodeDraggable = () => {
    jsPlumb.draggable(node!, {
      filter: dragFilter,
      ...dragSettings,
      drag: handleDrag,
      // Hacky, but only way found to pass id to `.getSelection()`
      // @ts-ignore
      id,
      stop: handleDrop
    });
  };

  const addSourceEndPoints = () => {
    jsPlumb.makeSource(node!, {
      filter: connectionFilter,
      ...sourceSettings,
      parameters: {
        ...sourceSettings.parameters,
        source: id
      }
    });
  };

  const addTargetEndPoints = () => {
    jsPlumb.makeTarget(node!, {
      allowLoopback,
      ...targetSettings,
      dropOptions: {
        hoverClass: 'dragHover',
        ...targetSettings.dropOptions
      },
      parameters: {
        ...targetSettings.parameters,
        target: id
      }
    });
  };

  const handlePrevent = (event: any) => {
    // console.log('handlePrevent');
    // if (
    //   !(
    //     event.ctrlKey ||
    //     (event.touches && event.targetTouches.length > 1)
    //   ) &&
    //   (
    //     !drop &&
    //     localStyle.left === style.left &&
    //     localStyle.top === style.top
    //   )
    // ) {
    //   setDrag(false);
    //   clearTimeout(timeout);
    //   timeout = setTimeout(
    //     () => {
    //       return node && setDrag(true);
    //     },
    //     500
    //   );
    // }
  };

  const handleDrag = (params: any) => {
    // console.log('handleDrag');
    drop = true;
    if (
      style.left !== params.pos[0] ||
      style.top !== params.pos[1]
    ) {
      if (props.onDrag) {
        props.onDrag(id, params.pos[0], params.pos[1]);
      }
    }
  };

  const handleDrop = (params: any) => {
    // console.log('handleDrop');
    drop = false;
    if (
      style.left !== params.pos[0] ||
      style.top !== params.pos[1]
    ) {
      if (props.onDrop) {
        props.onDrop(props.id, params.pos[0], params.pos[1]);
      }
    }
  };

  const handlePointerDown = (event: any) => {
    // console.log('handlePointerDown');
    localStyle = style;
    handleSelect(
      event.ctrlKey ||
      (event.touches && event.targetTouches.length > 1)
    );
  };

  const handleSelect = (multiSelect?: boolean) => {
    // console.log('handleSelect');
    const { jsPlumb, onSelect } = props;

    if (!multiSelect) {
      // @ts-ignore
      jsPlumb.clearDragSelection();
    }

    // @ts-ignore
    jsPlumb.addToDragSelection(node);

    if (onSelect) {
      // @ts-ignore
      const selections = jsPlumb._katavorio_main
        .getSelection()
        .map((node: any) => (
          node.params.id
        ));

      onSelect(selections);
    }
  };

  const handleDeselect = () => {
    const { id, jsPlumb, onSelect } = props;

    // @ts-ignore
    jsPlumb.removeFromDragSelection(this.node);

    if (onSelect) {
      // @ts-ignore
      const selections: string[] = jsPlumb._katavorio_main
        .getSelection()
        .map((node: any) => (
          node.params.id
        ))
        .filter((nodeId: string) => {
          return (nodeId !== id);
        });

      onSelect(selections);
    }
  };

  useEffect(() => {
    if (type === 'both' || type === 'source') { addSourceEndPoints(); }
    if (type === 'both' || type === 'target') { addTargetEndPoints(); }

    makeNodeDraggable();

    localStyle = style;

    return () => {
      clearTimeout(timeout);
      handleDeselect();
      props.jsPlumb.removeAllEndpoints(node!);
      node = undefined;
    };

  }, []);

  return (
    <div
      className={`${className} ${styleName ? styleName : ''}`}
      id={generateNodeId(diagramId, id)}
      onPointerUp={handlePrevent}
      onPointerDown={handlePointerDown}
      ref={ref}
      style={localStyle}
    >
      <div
        className={`node-anchor-${(drag ? 'disabled' : 'enabled')}`}
      >
        {children(id, drag)}
      </div>
    </div>

  );
};

export default Node;