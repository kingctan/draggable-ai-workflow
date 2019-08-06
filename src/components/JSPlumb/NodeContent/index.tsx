import React, { useEffect, CSSProperties, SFC } from 'react';

import './index.css';

type Props = {
  className?: string
  id: string
  label?: string
  onRemoveNode?: () => void
  selected?: boolean
  style: CSSProperties
  styleName?: string
  icon: string
  type: 'both' | 'source' | 'target'
};

const JsplumbNodeContent: SFC<Props> = (props) => {

  const { className, children, icon, label, selected, style, styleName, type } = props;

  useEffect(() => {

  }, []);

  return (
    <div
      className={`${className} ${styleName ? styleName : ''} node-content ${(selected ? 'node-selected' : '')}`}
      style={style}
    >
      {(type === 'target' || type === 'both') && <div className="dot-rect-top"></div>}
      {(type === 'source' || type === 'both') && <div className="dot-rect-bottom"></div>}
      <div>
        {children}
      </div>
      <div className="right-keyword-wrapper" style={{ display: 'none' }}>
        <div className="delete-icon">删除</div>
        <div>不可用</div></div>
      <strong>
        <i className={`iconfont ${icon} node-icon`}></i>
        <span>{label}</span>
      </strong>
      <span className="node-meta el-tooltip" >
        ...
        </span>
    </div>
  );
};

export default JsplumbNodeContent;