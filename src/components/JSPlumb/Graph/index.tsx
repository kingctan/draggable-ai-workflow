import React, { useState, useEffect, CSSProperties, SyntheticEvent } from 'react';
import { jsPlumb, jsPlumbInstance, ConnectionMadeEventInfo } from 'jsplumb';
import panAndZoomHoc from 'react-pan-and-zoom-hoc';

import settings from '../settings';
import { generateGraphId, generateNodeId } from '../util';

const PanAndZoom = panAndZoomHoc('div');

type Props = {
  id: string
  settings?: any
  className?: string
  connections: []
  style?: CSSProperties
  styleName?: string
  maxScale: number
  minScale: number
  onAddConnection?: (source: string, id: string, target: string) => void
  onPanAndZoom?: (xOffset: number, yOffset: number, newScale: number) => void
  onPanEnd: (zoomXOffset?: number, zoomYOffset?: number, e?: any) => void
  onPanMove?: () => void
  onPanStart?: () => void
  onRemoveConnection?: () => void
  onSelect?: (arg: any) => void
  onZoom: (newScale: number) => void
  passOnProps?: boolean
  renderOnChange?: boolean
  scale: number
  scaleFactor?: number
  width: number
  height: number
  xOffset: number
  yOffset: number
};

const Graph: React.FC<Props> = (props) => {
  const {
    id,
    className,
    connections,
    style,
    styleName,
    maxScale,
    minScale,
    onSelect,
    onZoom,
    onPanStart,
    onPanEnd,
    onPanAndZoom,
    passOnProps,
    renderOnChange,
    scale,
    scaleFactor,
    width,
    height,
    xOffset,
    yOffset,
  } = props;

  const [stateXOffset, setStateXOffset] = useState<number>(0.0);
  const [stateYOffset, setStateYOffset] = useState<number>(0.0);

  const JsPlumb: jsPlumbInstance = jsPlumb.getInstance({
    ...settings,
    ...props.settings,
    container: generateGraphId(props.id),
  });

  const timeout = setTimeout(
    () => {
      // renderConnections();
      JsPlumb.setSuspendDrawing(false, true);
    },
    200
  );

  const styles: CSSProperties = {
    height,
    width,
    ...style
  };

  const handlePanAndZoom = (xOffset: number, yOffset: number, newScale: number) => {

    const zoomXOffset = stateXOffset + (stateXOffset - xOffset);
    const zoomYOffset = stateYOffset + (stateYOffset - yOffset);

    if (scale !== newScale && onPanEnd) {
      onPanEnd(zoomXOffset, zoomYOffset);
    }
    if (onZoom) { onZoom(newScale); }
    if (onPanAndZoom) { onPanAndZoom(xOffset, yOffset, newScale); }

    if (stateXOffset !== zoomXOffset || stateYOffset !== zoomYOffset) {
      setStateXOffset(zoomXOffset);
      setStateYOffset(zoomYOffset);
    }
    setStateXOffset(zoomXOffset);
    setStateYOffset(zoomYOffset);
  };

  const handlePanMove = (xOffset: number, yOffset: number) => {
    const newXOffset = stateXOffset + (stateXOffset - xOffset);
    const newYOffset = stateYOffset + (stateYOffset - yOffset);

    if (stateXOffset !== newXOffset || stateYOffset !== newYOffset) {
      setStateXOffset(newXOffset);
      setStateYOffset(newYOffset);
    }
    setStateXOffset(newXOffset);
    setStateYOffset(newYOffset);
  }


  const handlePanEnd = (xOffset: number, yOffset: number, event: MouseEvent | TouchEvent) => {
    const newXOffset = props.xOffset + (props.xOffset - xOffset);
    const newYOffset = props.yOffset + (props.yOffset - yOffset);

    if (props.xOffset !== newXOffset || props.yOffset !== newYOffset) {
      if (onPanEnd) {
        onPanEnd(newXOffset, newYOffset, event);
      }
    }
  };

  const panStyle = style && {
    MozTransform: `scale(${scale})`,
    left: `${Number(
      style.width ?
        style.width.toString().replace('px', '') :
        width
    ) * xOffset * scale}px`,
    top: `${Number(
      style.height ?
        style.height.toString().replace('px', '') :
        height
    ) * yOffset * scale}px`,
    transform: `scale(${scale})`
  };

  const handleMouseDown = (event: SyntheticEvent<HTMLDivElement>) => {
    // @ts-ignore
    if (!event.ctrlKey) {
      // @ts-ignore
      JsPlumb.clearDragSelection();

      if (onSelect) {
        onSelect([]);
      }
    }
  };

  useEffect(() => {
    JsPlumb.ready(() => {

      JsPlumb.bind('connectionDragStop', (connection: any) => {
        connection.getOverlay("label-connector").show();
        connection.bind("click", function (conn: any) {
        });
        connection.bind("mouseover", function (conn: any) {
          connection.getOverlay("delete-connector").show();
        });
        connection.bind("mouseout", function (conn: any) {
          connection.getOverlay("delete-connector").hide();
        });
      });

      JsPlumb.setSuspendDrawing(true);

      // Try and make first paint less spastic

    })
  }, []);

  return (
    <>
      <PanAndZoom
        className={className}
        id={generateGraphId(id)}
        // styleName={`${styleName} container`}
        style={styles}
        maxScale={maxScale}
        minScale={minScale}
        onPanAndZoom={handlePanAndZoom}
        onPanEnd={handlePanEnd}
        onPanMove={handlePanMove}
        onPanStart={onPanStart}
        passOnProps={passOnProps}
        renderOnChange={renderOnChange}
        scale={scale}
        scaleFactor={scaleFactor}
        x={xOffset}
        y={yOffset}
      >
        <div
          onMouseDown={handleMouseDown}
          style={panStyle}
          styleName='panAndZoom'
        >
          {/* <Nodes
            id={id}
            jsPlumb={jsPlumb}
            onRender={readyNode}
            onSelect={onSelect}
          >
            <div>2</div>
          </Nodes> */}
          <div>2</div>
        </div>

      </PanAndZoom>
    </>
  );
};

export default Graph;