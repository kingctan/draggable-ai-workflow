import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Icon, Table, Input, Badge } from 'antd';

import { InstanceProps } from './InstanceProps';
import { formatDate } from '../../utils/formatHelper';
import { Link } from 'react-router-dom';

type Props = {};

const statusColorMap: any = {
  Succeeded: 'green',
  Failed: 'red',
  Running: 'orange',
};

const statusTextMap: any = {
  Succeeded: '成功',
  Failed: '失败',
  Running: '运行中..',
};

const InstanceList: React.FC<Props> = (props) => {
  // const { } = props;

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
      <Link to={`/instance-detail/${row.jobID}`} className="table-column-link">
        {text}
      </Link>
    )
  }, {
    title: '描述',
    key: 'note',
    dataIndex: 'note',
    render: (text: string) => (
      <span className="table-column-desc">
        {text}
      </span>
    )
  },
  {
    title: '所属项目',
    key: 'projectName',
    dataIndex: 'projectName',
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
  }, {
    title: '操作',
    key: 'operate',
    align: 'center',
    render: (text: string, row: InstanceProps) => (
      <a
        target="_blank"
        href={`http://39.108.232.245:8081/workflows/default/${row.jobName}`}
        style={{ whiteSpace: 'nowrap' }}
      >
        日志
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