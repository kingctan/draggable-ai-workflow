import React from 'react';
import { Form, Input } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { formItemLayout, formItemLayoutForWorkFlowConfig } from '../../utils/FormLayout';

type Props = {};

interface WorkflowConfProps extends FormComponentProps { };

const WorkflowConf: React.FC<Props & WorkflowConfProps> = (props) => {
  const { } = props;

  const { getFieldDecorator, validateFields, getFieldsValue, setFieldsValue } = props.form;

  return (
    <div className="workflow-conf">
      <Form onSubmit={() => { }}>
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