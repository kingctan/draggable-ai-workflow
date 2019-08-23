import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Button, Icon, Table, Modal, Divider, Input, message, Menu, Dropdown } from 'antd';

import { ProjectProps } from './ProjectProps';
import { formatDate } from '../../utils/formatHelper';

type Props = {};

const ProjectList: React.FC<Props> = (props) => {
  // const { } = props;

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

  const handlePlay = async (projectID: number) => {
    axios.post(`${process.env.REACT_APP_GO_WORKFLOW_SERVER}/job/create`, {
      projectID,
    }, {
        withCredentials: true
      })
      .then((res) => {
        if (res.data.code === 200) {
          message.success('已运行');
          (props as any).history.push('/instance-list');
        } else {
          message.error('运行失败');
        }
      }).catch((err) => {
        return message.error('服务器被吃了..');
      });
  };

  const filter = (list: ProjectProps[]) => list.filter((item: ProjectProps) => item.projectName.includes(filterVal));

  const handleRefresh = () => getList();

  const handleDelete = (projectId: string) => {
    axios.delete(`${process.env.REACT_APP_GO_WORKFLOW_SERVER}/project/delete?projectID=${projectId}`, {
      withCredentials: true
    }).then((res) => {
      if (res.data.code === 200) {
        message.success('删除成功');
        getList();
      }
    }).catch((err) => {
      console.error(err);
    });
  };

  useEffect(() => {
    getList();
  }, []);

  const MyMenu = (row: ProjectProps) => (
    <Menu>
      <Menu.Item
        key="project-edit"
        onClick={() => row.graph ? handlePlay(row.projectID) : message.warning('该项目未创建工作流')}
      >
        <span><Icon type="play-circle" theme="filled" /> 运行</span>
      </Menu.Item>
      <Menu.Item key="project-edit">
        <Link to={`/project-detail/${row.projectID}`}>
          <span><Icon type="edit" /> 修改</span >
        </Link>
      </Menu.Item>
      <Menu.Item
        key="project-delete"
        onClick={() => {
          Modal.confirm({
            title: "删除模板",
            content: <span>确定删除模板：<b>{row.projectName}</b> ？</span>,
            onOk() {
              handleDelete(row.projectID.toString());
            },
          });
        }}
      >
        <span><Icon type="delete" /> 删除</span >
      </Menu.Item>
    </Menu>
  );

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
    render: (text: string) => (
      <span className="table-column-desc">
        {text}
      </span>
    )
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
          工作流
        </Link>
        <Divider type="vertical" />
        {/* <a
          href="javascript:;"
          onClick={() => row.graph ? handlePlay(row.projectID) : message.warning('该项目未创建工作流')}
        >
          快速运行
        </a>
        <Divider type="vertical" /> */}
        <Dropdown overlay={MyMenu(row)} placement="bottomCenter" trigger={['click']}>
          <Button size="small">
            <Icon type="more" />
          </Button>
        </Dropdown>
      </span>
    ),
  }];

  return (
    <div>
      <div className="main-toolbar">
        <Link to="/project-detail">
          <Button type="primary"><Icon type="plus-square" /> 新增模板</Button>
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
        locale={{ emptyText: filterVal ? `当前列表搜索不到包含 “${filterVal}” 的模板..` : '暂无数据' }}
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