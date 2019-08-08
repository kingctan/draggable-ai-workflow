import React, { useEffect, useState } from 'react';
import { Form, Input } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { formItemLayout, formItemLayoutForWorkFlowConfig, tailFormItemLayoutForWorkFlowConfig } from '../../utils/FormLayout';
import { FlowNodeProps } from './WorkflowProps';

type Props = {
  nodeInfo: FlowNodeProps | undefined
};

type ParamConfigProps = {
  [k: string]: {
    default: string
    name: string
    type: string
  }
};

interface WorkflowConfProps extends FormComponentProps { }

const WorkflowConf: React.FC<Props & WorkflowConfProps> = (props) => {
  const { nodeInfo } = props;

  const [paramConfigs, setParamConfigs] = useState<ParamConfigProps>({});

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
          <h3 style={{ textAlign: 'center' }}>标题</h3>
        </Form.Item>
        <Form.Item label="项目描述" {...formItemLayoutForWorkFlowConfig}>
          {getFieldDecorator('note', {
          })(
            <Input />
          )}
        </Form.Item>
      </Form>
    </div>
  );
};

export default Form.create<WorkflowConfProps>({
  name: 'WorkflowConf',
})(WorkflowConf);