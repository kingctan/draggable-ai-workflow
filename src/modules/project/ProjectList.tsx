import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Button, Icon, Table, Modal, Divider, Input } from 'antd';

import { ProjectProps } from './ProjectProps';
import { formatDate } from '../../utils/formatHelper';

type Props = {

};

const ProjectList: React.FC<Props> = (props) => {
  const { } = props;

  const [list, setList] = useState<ProjectProps[]>([]);
  const [filterVal, setFilterVal] = useState(''); // 搜索框值
  const [loading, setLoading] = useState(false);

  const getList = () => {
    setLoading(true);
    axios.get(`${process.env.REACT_APP_GO_WORKFLOW_SERVER}/project/list`, {
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

  const filter = (list: ProjectProps[]) => list.filter((item: ProjectProps) => item.projectName.includes(filterVal));

  const handleRefresh = () => getList();

  useEffect(() => {
    getList();
  }, []);

  const columns = [{
    title: '名称',
    key: 'projectName',
    dataIndex: 'projectName',
    render: (text: string, row: ProjectProps) => (
      <Link to={`/workflow/${row.projectID}`} className="table-column-link">
        {text}
      </Link>
    )
  }, {
    title: '描述',
    key: 'note',
    dataIndex: 'note',
  }, {
    title: '管理员',
    key: 'admin',
    dataIndex: 'admin',
    render: (text: { [k: string]: string }) => text.root || '',
  },
  {
    title: '更新时间',
    key: 'updateTime',
    dataIndex: 'updateTime',
    render: (text: number) => formatDate(new Date(text), 'MM/dd/yyyy, hh:mm:ss')
  }, {
    title: '操作',
    key: 'operate',
    align: 'center',
    render: (text: string, row: ProjectProps) => (
      <span style={{ whiteSpace: 'nowrap' }}>
        <Link to={`/workflow/${row.projectID}`}>
          <p style={{ display: 'inline-block', margin: 0 }}>
            工作流
          </p>
        </Link>
        <Divider type="vertical" />
        <Link to={`/project-detail/${row.projectID}`}>
          <p style={{ display: 'inline-block', margin: 0 }}>
            修改
          </p>
        </Link>
        <Divider type="vertical" />
        <a
          href="javascript:;"
          onClick={() => {
            Modal.confirm({
              title: "删除项目",
              content: <span>确定删除项目：<b>{row.projectName}</b> ？</span>,
              onOk() {
              },
            });
          }}
        >
          {/* <Icon type="delete" />  */}
          删除
        </a>
      </span>
    ),
  }];

  return (
    <div>
      <div className="main-toolbar">
        <Link to="/project-detail">
          <Button type="primary"><Icon type="plus-square" /> 新增项目</Button>
        </Link>
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
        locale={{ emptyText: filterVal ? `当前列表搜索不到包含 “${filterVal}” 的项目..` : '暂无数据' }}
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

export default ProjectList;