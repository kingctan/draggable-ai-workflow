import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Button, Icon, Table, Modal, Divider, Input, Badge } from 'antd';

import { InstanceProps } from './InstanceProps';
import { formatDate } from '../../utils/formatHelper';

type Props = {

};

const statusColorMap: any = {
  Succeeded: 'green',
  Failed: 'red',
  Running: 'orange',
}

const InstanceList: React.FC<Props> = (props) => {
  const { } = props;

  const [list, setList] = useState<InstanceProps[]>([]);
  const [filterVal, setFilterVal] = useState(''); // 搜索框值
  const [loading, setLoading] = useState(false);

  const getList = () => {
    setLoading(true);
    axios.get(`${process.env.REACT_APP_GO_WORKFLOW_SERVER}/job/list`, {
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

  const filter = (list: InstanceProps[]) => list.filter((item: InstanceProps) => item.jobName.includes(filterVal));

  const handleRefresh = () => getList();

  useEffect(() => {
    getList();
  }, []);

  const columns = [{
    title: '实例名',
    key: 'jobName',
    dataIndex: 'jobName',
    render: (text: string, row: InstanceProps) => (
      <span className="table-column-link">
        <a
          target="_blank"
          href={`http://39.108.232.245:31441/workflows/default/${row.jobName}`}
          style={{ whiteSpace: 'nowrap' }}
        >
          {text}
        </a>
      </span>
    )
  }, {
    title: '描述',
    key: 'note',
    dataIndex: 'note',
  },
  //  {
  //   title: '所属项目',
  //   key: 'projectName',
  //   dataIndex: 'projectName',
  // },
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
      <Badge color={statusColorMap[text]} text={text} />
    )
  }, {
    title: '操作',
    key: 'operate',
    align: 'center',
    render: (text: string, row: InstanceProps) => (
      <a
        target="_blank"
        href={`http://39.108.232.245:31441/workflows/default/${row.jobName}`}
        style={{ whiteSpace: 'nowrap' }}
      >
        <p style={{ display: 'inline-block', margin: 0 }}>
          日志
          </p>
      </a>
    ),
  }];

  return (
    <div>
      <div className="main-toolbar">
        {/* <Button>
          <Icon type="delete" /> 批量删除
        </Button> */}
        <Button onClick={handleRefresh}><Icon type="reload" /> 刷新</Button>
        <div className="main-toolbar-right">
          <Input.Search value={filterVal} onChange={(e) => setFilterVal(e.target.value)} placeholder="搜索" />
        </div>
      </div>
      <Table
        rowKey="id"
        columns={columns as any}
        // rowSelection={rowSelection}
        dataSource={filter(list)}
        loading={loading}
        locale={{ emptyText: filterVal ? `当前列表搜索不到包含 “${filterVal}” 的实例..` : '暂无数据' }}
        pagination={{
          size: "small",
          total: list.length,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '40', '60', '100']
        }}
      />
    </div>
  );
};

export default InstanceList;