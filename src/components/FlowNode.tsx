import React, { useEffect } from 'react';

type Props = {
  key: string
  active: boolean
  handleSelect: () => void
};

type WorkflowNodeProps = {
  id: string
  title: string
  icon: string
  type: 'both' | 'source' | 'target'
};

const FlowNode: React.FC<WorkflowNodeProps & Props> = (props) => {
  const { title, id, type, icon, active, handleSelect } = props;

  useEffect(() => {

  }, []);

  return (
    <div
      id={id}
      className={`workflow-node ${active ? 'active' : ''} jtk-node`}
      // style={{
      //   position: 'absolute',
      //   top: originalPosition.y,
      //   left: originalPosition.x
      // }}
      onClick={() => handleSelect()}
    >
      {(type === 'source' || type === 'both') && <div className="dot-rect-top"></div>}
      {(type === 'target' || type === 'both') && <div className="dot-rect-bottom"></div>}
      <div className="right-keyword-wrapper" style={{ display: 'none' }}>
        <div className="delete-icon">删除</div>
        <div>不可用</div></div>
      <strong>
        <i className={`iconfont ${icon} node-icon`}></i>
        <span>{title}</span>
      </strong>
      <span className="node-meta el-tooltip" >
        ...
        </span>
    </div>
  );
};

export default FlowNode;