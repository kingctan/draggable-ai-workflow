import React, { SFC, useEffect, useState } from 'react';
import { Modal, Button, Badge, Table } from 'antd';
import axios from 'axios';
import { statusColorMap, statusTextMap } from '../modules/instance/InstanceList';
import { formatDate } from '../utils/formatHelper';
import { Link } from 'react-router-dom';
import { InstanceProps } from '../modules/instance/InstanceProps';

type Props = {
  title: string
  cronJobId: number | null
  visible: boolean
  handleCancel: () => void
};

const ModalTimedJobs: SFC<Props> = (props) => {
  const { title, cronJobId, visible, handleCancel } = props;

  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<InstanceProps[]>([]);

  const handleSubmit = () => {

  };

  const getList = () => {
    setLoading(true);
    axios.get(`${process.env.REACT_APP_GO_WORKFLOW_SERVER}/cronjob/jobs?cronjobID=${cronJobId}`, {
      withCredentials: true
    }).then((res) => {
      if (res.data.code === 200) {
        setList(res.data.data);
        setLoading(false);
      }
    }).catch((err) => {
      console.error(err);
    });
  };

  useEffect(() => {
    if (cronJobId && visible) {
      getList();
    }
  }, [visible]);

  const columns = [{
    title: '实例名',
    key: 'jobName',
    dataIndex: 'jobName',
    render: (text: string, row: InstanceProps) => (
      <Link to={`/instance-detail/${row.jobID}`} className="table-column-link" >
        {text}
      </Link>
    )
  },
  {
    title: '创建时间',
    key: 'createTime',
    dataIndex: 'createTime',
    render: (text: number) => formatDate(new Date(text), 'MM/dd/yyyy, hh:mm:ss')
  }, {
    title: '状态',
    key: 'status',
    dataIndex: 'status',
    render: (text: string) => (
      <span style={{ whiteSpace: 'nowrap' }}>
        <Badge color={statusColorMap[text]} text={statusTextMap[text]} />
      </span>
    )
  }];

  return (
    <Modal
      width={680}
      visible={visible}
      title={`${title} 实例列表`}
      onCancel={handleCancel}
      footer={[
        <Button key="back" onClick={handleCancel}>
          取消
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          确认
        </Button>,
      ]}
    >
      <Table
        rowKey="ID"
        size="small"
        columns={columns as any}
        loading={loading}
        // rowSelection={rowSelection}
        dataSource={list}
        pagination={{
          size: "small",
          total: list.length,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '40', '60', '100']
        }}
      />
    </Modal>
  )
};

export default ModalTimedJobs;