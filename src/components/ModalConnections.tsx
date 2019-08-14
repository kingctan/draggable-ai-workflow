import React, { SFC } from 'react';
import { Modal, Button, Form } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { FlowNodesProps, FlowConnectionProps } from '../modules/workflow/WorkflowProps';

type Props = {
  visible: boolean
  loading: boolean
  sourceId: string
  targetId: string
  nodes: FlowNodesProps
  connections: FlowConnectionProps[]
  handleOk: () => void
  handleCancel: () => void
};

interface ConnectionConfigProps extends FormComponentProps { };

const ModalConnections: SFC<Props & ConnectionConfigProps> = (props) => {
  const { visible, loading = false, handleOk, handleCancel } = props;

  return (
    <Modal
      visible={visible}
      title="输入输出配置"
      onOk={handleOk}
      onCancel={handleCancel}
      footer={[
        <Button key="back" onClick={handleCancel}>
          取消
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
          确认
        </Button>,
      ]}
    >
      <p>Some contents...</p>
    </Modal>
  )
};

export default Form.create<ConnectionConfigProps>({
  name: 'ModalConnections',
})(ModalConnections);