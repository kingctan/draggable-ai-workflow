import React, { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Button, Icon } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { formItemLayout, formItemLayoutForWorkFlowConfig, tailFormItemLayoutForWorkFlowConfig } from '../../utils/FormLayout';
import { FlowNodeProps, ParamConfigProps, FlowNodesProps } from './WorkflowProps';
import { useDispatch, useMappedState } from 'redux-react-hook';

type Props = {
  selectedNodeId: string
  onChangeParam: (nodeId: string, paramKey: string, paramValue: string) => void
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

  const [loading, setLoading] = useState(true);
  const [nodeInfo, setNodeInfo] = useState<FlowNodeProps | null>(null);
  const [paramConfigs, setParamConfigs] = useState<NodeParamConfigProps | null>(null);

  const nodes: FlowNodesProps = useMappedState(state => state.workflowReducer);

  const { getFieldDecorator, validateFields, getFieldsValue, setFieldsValue } = props.form;

  useEffect(() => {
    setLoading(true);
    const nodeInfo = nodes[selectedNodeId];
    setNodeInfo(nodeInfo);
    if (nodeInfo && nodeInfo.model && nodeInfo.model.params) {
      setParamConfigs(nodeInfo.model.params);
    }
    setLoading(false);
  }, [selectedNodeId]);


  return (
    <div className="workflow-conf">
      {
        !loading &&
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