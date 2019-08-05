import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Button, Icon, Table, Modal, Divider, Input } from 'antd';

import { ProjectProps } from './ProjectProps';

type Props = {

};

const ProjectList: React.FC<Props> = (props) => {
  const { } = props;

  const [list, setList] = useState<ProjectProps[]>([]);
  const [filterVal, setFilterVal] = useState(''); // 搜索框值
  const [loading, setLoading] = useState(false);

  const getList = () => {
    setLoading(true);
    axios.get(`${process.env.REACT_APP_JAVA_SERVER_URL}/v1.0/project/allEngaged?userId=${sessionStorage.getItem('t-passport')}`, {
      withCredentials: true
    }).then((res) => {
      setLoading(false);
      setList([]);
    }).catch((err) => {
      console.error(err);
    });
  };

  const filter = (list: ProjectProps[]) => list.filter((item: ProjectProps) => item.name.includes(filterVal));

  const handleRefresh = () => getList();

  const columns = [{
    title: 'ID',
    key: 'id',
    dataIndex: 'id',
  }, {
    title: '名称',
    key: 'name',
    dataIndex: 'name',
    render: (text: string, row: ProjectProps) => (
      <Link to={`/file-list/${row.id}`} className="table-column-link">
        <Icon type="appstore" theme="filled" /> {text}
      </Link>
    )
  }, {
    title: '描述',
    key: 'projectDesc',
    dataIndex: 'projectDesc',
    render: (text: string) => (
      <span className="table-column-desc">
        {text}
      </span>
    ),
  }, {
    title: '管理员',
    key: 'admin',
    dataIndex: 'admin',
    // render: (text: string[]) => {
    //   const firstLetter = text[0][0].toUpperCase() || '?';
    //   return (
    //     <span style={{ whiteSpace: 'nowrap' }}>
    //       {/* <Avatar size="small" style={letterColor[firstLetter]}>{firstLetter}</Avatar> {text[0]} */}
    //     </span>
    //   )
    // }
  }, {
    title: '操作',
    key: 'operate',
    align: 'center',
    render: (text: string, row: ProjectProps) => (
      <span style={{ whiteSpace: 'nowrap' }}>
        <Link to={`/project-detail/${row.id}`}>
          <p style={{ display: 'inline-block', margin: 0 }}>
            {/* <Icon type="edit" />  */}
            修改
          </p>
        </Link>
        <Divider type="vertical" />
        <a
          href="javascript:;"
          onClick={() => {
            Modal.confirm({
              title: "删除项目",
              content: <span>确定删除项目：<b>{row.name}</b> ？</span>,
              onOk() {
                // deleteItems(row.id).then((res) => {
                //   if ((res as any).data.errno === 0) {
                //     getList();
                //     message.success('删除成功！');
                //   } else {
                //     message.error('删除失败！');
                //   }
                // }).catch(() => message.error('删除失败！'));
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
      <div className="toolbar">
        <Link to="/project-detail">
          <Button type="primary"><Icon type="plus-square" /> 新增项目</Button>
        </Link>
        <Button  >
          <Icon type="delete" /> 批量删除
        </Button>
        <Button onClick={handleRefresh}><Icon type="reload" /> 刷新</Button>
        <div className="toolbar-right">
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