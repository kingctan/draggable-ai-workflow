import React, { useEffect, useState } from 'react';
import { Form, Input, InputNumber } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { FlowNodeProps, FlowNodesProps } from './WorkflowProps';
import { useMappedState } from 'redux-react-hook';

type Props = {
  selectedNodeId: string
  onChangeParam: (nodeId: string, paramKey: string, paramValue: string | number) => void
};

type NodeParamConfigProps = {
  [k: string]: {
    default: string
    name: string
    type: string
  }
};

interface WorkflowConfProps extends FormComponentProps { }

const WorkflowConf: React.FC<Props & WorkflowConfProps> = (props) => {
  const { selectedNodeId } = props;

  const [nodeInfo, setNodeInfo] = useState<FlowNodeProps | null>(null);
  const [paramConfigs, setParamConfigs] = useState<NodeParamConfigProps | null>(null);

  const nodes: FlowNodesProps = useMappedState(state => state.workflowReducer);

  const { getFieldDecorator } = props.form;

  useEffect(() => {
    setParamConfigs(null);
    setTimeout(() => {
      const nodeInfo = nodes[selectedNodeId];

      setNodeInfo(nodeInfo);
      if (!selectedNodeId) {
        setParamConfigs(null);
      }
      if (nodeInfo && nodeInfo.model && nodeInfo.model.params) {
        setParamConfigs(nodeInfo.model.params);
      }
    }, 0);

  }, [selectedNodeId]);


  return (
    <div className="workflow-conf">
      {
        paramConfigs &&
        <Form onSubmit={() => { }}>
          <Form.Item>
            <h3>{nodeInfo && nodeInfo.label || ''}</h3>
          </Form.Item>
          {
            !paramConfigs && <div>选择节点可配置参数</div>
          }
          {
            (paramConfigs && Object.keys(paramConfigs).length === 0) &&
            <div>该节点无可调参数</div>
          }
          {
            paramConfigs && Object.keys(paramConfigs).map((key: string) => (
              <Form.Item label={paramConfigs[key].name}>
                {getFieldDecorator(`${key}`, {
                  initialValue: paramConfigs[key].default,
                  rules: [{
                    required: true,
                    message: `请填写${paramConfigs[key].name}`,
                  }],
                })(
                  (paramConfigs[key].type === 'int' || paramConfigs[key].type === 'float') ?
                    <InputNumber style={{ width: '100%' }} /> :
                    <Input />
                )}
              </Form.Item>
            ))
          }
        </Form>
      }
    </div>
  );
};

export default Form.create<Props & WorkflowConfProps>({
  name: 'WorkflowConf',
  onFieldsChange: (props, changedValues, allValues) => {
    const key = Object.keys(changedValues)[0] || '';
    const value = changedValues[key].value || '';
    props.onChangeParam(props.selectedNodeId, key, value);
  }
})(WorkflowConf);