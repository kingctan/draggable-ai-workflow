import React, { useState, useEffect, CSSProperties, SyntheticEvent, Children, cloneElement, PureComponent, SFC } from 'react';
import { jsPlumb, jsPlumbInstance, ConnectionMadeEventInfo } from 'jsplumb';
import panAndZoomHoc from 'react-pan-and-zoom-hoc';

import settings from '../settings';
import { generateGraphId, generateNodeId } from '../util';
import './index.css';

const PanAndZoom = panAndZoomHoc('div');

type Props = {
  className?: string
  id: string
  label?: string
  onRemoveNode?: () => void
  selected?: boolean
  style: CSSProperties
  styleName?: string
};

const NodeContent: SFC<Props> = (props) => {

  const { className, children, id, selected, style, styleName } = props;

  useEffect(() => {

  }, []);

  return (
    <div
      className={`className ${styleName ? styleName : ''} node-content ${(selected ? 'node-selected' : '')}`}
      style={style}
    >
      <div>
        {children}
      </div>
    </div>
  );
};

export default NodeContent;