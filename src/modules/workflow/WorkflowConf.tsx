import React, { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Button, Icon } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { formItemLayout, formItemLayoutForWorkFlowConfig, tailFormItemLayoutForWorkFlowConfig } from '../../utils/FormLayout';
import { FlowNodeProps, ParamConfigProps } from './WorkflowProps';

type Props = {
  nodeInfo: FlowNodeProps | undefined
  changeParamConfigs: (newParamConfig: ParamConfigProps) => void
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
  const { nodeInfo } = props;

  const [paramConfigs, setParamConfigs] = useState<NodeParamConfigProps>({});

  const { getFieldDecorator, validateFields, getFieldsValue, setFieldsValue } = props.form;

  useEffect(() => {
    if (nodeInfo && nodeInfo.model && nodeInfo.model.params) {
      setParamConfigs(nodeInfo.model.params);
    }
  }, [nodeInfo]);

  return (
    <div className="workflow-conf">
      <Form onSubmit={() => { }}>
        <Form.Item>
          <h3>{nodeInfo && nodeInfo.label || ''}</h3>
        </Form.Item>
        {/* {!paramConfigs && <div>当前未选择节点</div>}
        {
          (paramConfigs && Object.keys(paramConfigs).length === 0) &&
          <div>当前节点没有可调参数</div>
        } */}
        {
          Object.keys(paramConfigs).map((key: string) => (
            <Form.Item label={paramConfigs[key].name}>
              {getFieldDecorator('note', {
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
    </div>
  );
};

export default Form.create<Props & WorkflowConfProps>({
  name: 'WorkflowConf',
  onValuesChange: (props, changedValues, allValues) => {
    console.log(props.nodeInfo);
    console.log(allValues);
    props.changeParamConfigs({

    });
  }
})(WorkflowConf);