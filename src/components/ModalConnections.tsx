import React, { SFC, useEffect } from 'react';
import { Modal, Button, Form, Icon, Tag, Table, Input, Row, Col, Select, message } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { FlowNodesProps, ConnectionConfigProps } from '../modules/workflow/WorkflowProps';
import { formItemLayout, formItemLayoutForWorkFlowConfig } from '../utils/FormLayout';
import { useMappedState, useDispatch } from 'redux-react-hook';
import { NEW_CONNECTION } from '../modules/workflow/workflowReducer';

type Props = {
  visible: boolean
  config: ConnectionConfigProps | null
  modalContentDisabled: boolean
  handleOK: (sourceId: string, targetId: string) => void
  handleCancel: () => void
};

interface ConnectionConfigFormProps extends FormComponentProps { };

const ModalConnections: SFC<Props & ConnectionConfigFormProps> = (props) => {
  const { visible, config, modalContentDisabled, handleOK, handleCancel } = props;

  const { getFieldDecorator, validateFields, getFieldsValue, setFieldsValue } = props.form;

  const nodes: FlowNodesProps = useMappedState(state => state.workflowReducer);
  const dispatch = useDispatch();

  const handleSubmit = () => {
    const values: { [field: string]: any } = getFieldsValue();
    const sourceId = config!.sourceId;
    const targetId = config!.targetId;

    let isModify = false; // 不能全部填写“无”
    values.output.forEach((sourceOutput: string) => {
      if (sourceOutput && sourceOutput !== '*') isModify = true;
    });
    if (!isModify) {
      return message.warning(<span>请保证当前组件 <b>{nodes[sourceId].label}</b> 至少有一个输出</span>);
    }

    for (let i = 0; i < values.output.length; i += 1) {
      const sourceOutput = values.output[i];

      if (sourceOutput && sourceOutput !== '*') {
        isModify = true;

        dispatch({
          type: NEW_CONNECTION,
          sourceId,
          targetId,
          sourceOutput,
          targetInput: values.input[i],
        });

        handleOK(sourceId, targetId);
        handleCancel();
        break;
      }
    }


  };

  useEffect(() => {

  }, []);

  const columns = [
    {
      title: '输出',
      dataIndex: 'output',
      key: 'output',
      width: '50%',
      render: (text: string, record: string, index: number) => {
        let disabled = false;
        let initialValue = '*';
        const targetInputRuntime = nodes[config!.targetId].inputRuntime;
        if (targetInputRuntime && targetInputRuntime[record]) {
          disabled = true;
          initialValue = targetInputRuntime[record].name;
        }

        return (
          <Form.Item className="table-small-form-item">
            {getFieldDecorator(disabled ? `output-disabled-[${index}]` : `output[${index}]`, {
              initialValue: initialValue,
            })(
              <Select style={{ width: '100%' }} disabled={modalContentDisabled || disabled}>
                {Object.keys(nodes[config!.sourceId].model.outputs).map((outputKey: string) => (
                  <Select.Option
                    value={outputKey}
                    key={outputKey}
                    disabled={nodes[config!.sourceId].model.outputs[outputKey].type !== nodes[config!.targetId].model.inputs[record].type}
                  >
                    {outputKey}
                    {` `}
                    ({nodes[config!.sourceId].model.outputs[outputKey].type})
                  </Select.Option>
                ))}
                <Select.Option value="*" key="*">
                  (无)
              </Select.Option>
              </Select>
            )}
          </Form.Item>
        )
      },
    },
    {
      title: '输入',
      dataIndex: 'input',
      key: 'input',
      width: '50%',
      render: (text: string, record: string, index: number) => (
        <Form.Item className="table-small-form-item">
          {getFieldDecorator(`input[${index}]`, {
            initialValue: record
          })(
            <Select style={{ width: '100%' }} disabled>
              {Object.keys(nodes[config!.targetId].model.inputs).map((inputKey: string) => (
                <Select.Option value={inputKey} key={inputKey}>
                  {inputKey} ({nodes[config!.targetId].model.inputs[inputKey].type})
                </Select.Option>
              ))}
            </Select>
          )}
        </Form.Item>
      ),
    },
  ];

  return (
    <Modal
      visible={visible}
      title="输入输出配置"
      onCancel={handleCancel}
      footer={modalContentDisabled ? null : [
        <Button key="back" onClick={handleCancel}>
          取消
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          确认
        </Button>,
      ]}
    >
      {
        config &&
        <div>
          <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Tag color="blue">{nodes[config.sourceId].label}</Tag>
            <Icon type="arrow-right" />&nbsp;
            <Tag color="blue">{nodes[config.targetId].label}</Tag>
          </p>
          <div>
            <Table
              size="small"
              bordered
              pagination={false}
              columns={columns}
              dataSource={Object.keys(nodes[config.targetId].model.inputs || [])}
            />
          </div>
        </div>
      }
    </Modal>
  )
};

export default Form.create<ConnectionConfigFormProps>({
  name: 'ModalConnections',
})(ModalConnections);