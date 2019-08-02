import React, { useState, useEffect, CSSProperties, SyntheticEvent, Children, cloneElement, PureComponent, SFC } from 'react';
import { generateNodeId } from '../util';
import { jsPlumbInstance } from 'jsplumb';

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
  dragSettings?: {}
  sourceSettings?: any
  targetSettings?: any
};

const defaultDragSettings = {};
const defaultSourceSettings = {};
const defaultTargetSettings = {};

//@ts-ignore
const Node: SFC<Props> = (props) => {

  const { children, className, diagramId, id, styleName } = props;

  const [drag, setDrag] = useState<boolean>(false);

  const connectionFilter = ':not(.jsplumb-react-node)';
  const dragFilter = ':not(.jsplumb-react-node)';

  let style: CSSProperties = {};
  let node: HTMLElement;
  let timeout: NodeJS.Timer;
  let drop: boolean = false;
  let ref = (currentNode: HTMLDivElement) => (node = currentNode);

  const makeNodeDraggable = () => {
    const { dragSettings, id, jsPlumb } = props;
    jsPlumb.draggable(node, {
      filter: dragFilter,
      ...dragSettings,
      drag: handleDrag,
      // Hacky, but only way found to pass id to `.getSelection()`
      // @ts-ignore
      id,
      stop: handleDrop
    });
  };

  const handleDrag = (params: any) => {
    drop = true;
    if (
      props.style.left !== params.pos[0] ||
      props.style.top !== params.pos[1]
    ) {
      if (props.onDrag) {
        props.onDrag(id, params.pos[0], params.pos[1]);
      }
    }
  };

  const addSourceEndPoints = () => {
    const { sourceSettings, id, jsPlumb } = props;

    jsPlumb.makeSource(node, {
      filter: connectionFilter,
      ...sourceSettings,
      parameters: {
        ...sourceSettings.parameters,
        source: id
      }
    });
  };

  const handlePrevent = (event: any) => {
    if (
      // @ts-ignore
      !(
        event.ctrlKey ||
        (event.touches && event.targetTouches.length > 1)
      ) &&
      (
        !drop &&
        style.left === props.style.left &&
        style.top === props.style.top
      )
    ) {
      setDrag(false);
      clearTimeout(timeout);
      timeout = setTimeout(
        () => {
          return node && setDrag(true);
        },
        500
      );
    }
  };

  const handleDrop = (params: any) => {
    drop = false;
    if (
      props.style.left !== params.pos[0] ||
      props.style.top !== params.pos[1]
    ) {
      if (props.onDrop) {
        props.onDrop(props.id, params.pos[0], params.pos[1]);
      }
    }
  };

  const addTargetEndPoints = () => {
    const { allowLoopback, id, jsPlumb, targetSettings } = props;

    jsPlumb.makeTarget(node, {
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

  const handlePointerDown = (event: any) => {
    style = props.style;
    handleSelect(
      event.ctrlKey ||
      (event.touches && event.targetTouches.length > 1)
    );
  };

  const handleSelect = (multiSelect?: boolean) => {
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

  useEffect(() => {
    const { type } = props;

    if (type === 'both' || type === 'source') { addSourceEndPoints(); }
    if (type === 'both' || type === 'target') { addTargetEndPoints(); }

    makeNodeDraggable();

    style = props.style;

  }, []);

  return (
    <div
      className={className}
      id={generateNodeId(diagramId, id)}
      onPointerUp={handlePrevent}
      onPointerDown={handlePointerDown}
      ref={ref}
      style={props.style}
      styleName={styleName}
    >
      <div styleName={`node-anchor-${(drag ? 'disabled' : 'enabled')}`}>
        {children(id, drag)}
      </div>
    </div>

  );
};

export default Node;