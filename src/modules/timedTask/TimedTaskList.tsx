import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { findIndex } from 'lodash';
import axios from 'axios';
import { Button, Icon, Table, Modal, Divider, Input, message, Badge, Menu, Dropdown } from 'antd';

import { formatDate } from '../../utils/formatHelper';
import { TimedTaskProps } from './TimedTaskProps';
import ModalTimedJobs from '../../components/ModalTimedJobs';

type Props = {};

export const statusColorMap: any = {
  Running: 'orange',
  Failed: 'red',
  Stoped: '#ccc',
};

export const statusTextMap: any = {
  Running: '运行中',
  Failed: '失败',
  Stoped: '停止',
};

const TimedTaskList: React.FC<Props> = (props) => {
  // const { } = props;

  const [list, setList] = useState<TimedTaskProps[]>([]);
  const [visibilityJobModal, setVisibilityJobModal] = useState<boolean>(false);
  const [filterVal, setFilterVal] = useState(''); // 搜索框值
  const [loading, setLoading] = useState(false);
  const [selectedCronjobID, setSelectedCronjobID] = useState<number | null>(null);

  const getList = () => {
    setLoading(true);
    axios.get(`${process.env.REACT_APP_GO_WORKFLOW_SERVER}/cronjob/list`, {
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

  const filter = (list: TimedTaskProps[]) => list.filter((item: TimedTaskProps) => item.projectName.includes(filterVal));

  const handleRefresh = () => getList();

  const handleStop = (row: TimedTaskProps) => {
    Modal.confirm({
      title: "停止定时任务",
      content: <span>确定停止定时任务：<b>{row.projectName}</b> ？</span>,
      onOk() {
        axios.post(`${process.env.REACT_APP_GO_WORKFLOW_SERVER}/cronjob/stop`, {
          cronjobID: row.ID,
        }, {
            withCredentials: true
          }).then((res) => {
            if (res.data.code === 200) {
              message.success('已停止');
              getList();
            }
          }).catch((err) => {
            console.error(err);
          });
      },
    });
  };

  const handleDelete = (ID: number) => {
    axios.delete(`${process.env.REACT_APP_GO_WORKFLOW_SERVER}/cronjob/delete?cronjobID=${ID}`, {
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


  const MyMenu = (row: TimedTaskProps) => (
    <Menu>
      <Menu.Item key="task-stop" disabled={row.status !== 'Running'} onClick={() => handleStop(row)}>
        <span><Icon type="poweroff" /> 停止</span >
      </Menu.Item>
      <Menu.Item
        key="task-delete"
        disabled={row.status === 'Running'}
        onClick={() => {
          Modal.confirm({
            title: "删除定时任务",
            content: <span>确定删除定时任务：<b>{row.projectName}</b> ？</span>,
            onOk() {
              handleDelete(row.ID);
            },
          });
        }}
      >
        <span><Icon type="delete" /> 删除</span >
      </Menu.Item>
    </Menu>
  );

  const columns = [{
    title: '快照名称',
    key: 'projectName',
    dataIndex: 'projectName',
  }, {
    title: '定时类型',
    key: 'note',
    dataIndex: 'note',
    render: (text: string, row: TimedTaskProps) => {
      text = '延时';
      if (row.cycle !== 0) {
        text = '周期运行';
      } else if (row.cycle === 0 && row.sync) {
        text = '同步';
      }
      return <span>{text}</span>
    }
  }, {
    title: '周期',
    key: 'cycle',
    dataIndex: 'cycle',
    render: (text: number) => {
      let str = '';
      if (text) {
        if (text < 60) {
          str = `${text} 分钟/次`;
        } else if (text >= 60 && text < 1440) {
          str = `${text / 60} 小时/次`;
        } else {
          str = `${text / 1440} 天/次`;
        }
      }
      return <span>{str}</span>
    }
  }, {
    title: '创建时间',
    key: 'CreatedAt',
    dataIndex: 'CreatedAt',
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
    render: (text: string, row: TimedTaskProps) => (
      <span style={{ whiteSpace: 'nowrap' }}>
        <a
          href="javascript:;"
          onClick={() => {
            setVisibilityJobModal(true);
            setSelectedCronjobID(row.ID);
          }}
        >
          查看实例
          </a>
        <Divider type="vertical" />
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
        locale={{ emptyText: filterVal ? `当前列表搜索不到包含 “${filterVal}” 的定时任务..` : '暂无数据' }}
        pagination={{
          size: "small",
          total: list.length,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '40', '60', '100']
        }}
      />
      {
        visibilityJobModal &&
        <ModalTimedJobs
          title={list[findIndex(list, { ID: selectedCronjobID! })].projectName}
          cronJobId={selectedCronjobID}
          visible={visibilityJobModal}
          handleCancel={() => setVisibilityJobModal(false)}
        />
      }
    </div>
  );
};

export default TimedTaskList;