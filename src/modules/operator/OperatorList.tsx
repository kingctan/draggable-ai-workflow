import React, { useState, useEffect } from 'react';
import { Button, Icon, message, Input } from 'antd';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { OperatorProps } from './OperatorProps';

type Props = {

};

const Operator: React.FC<{ title: string, icon?: string, isDirectory: boolean }> = ({ title, icon = '', isDirectory }) => {
  return (
    <div className="operator">
      <div className="operator-icon">
        {
          isDirectory ? <Icon type={icon} theme="filled" /> : <Icon type="folder" theme="filled" />
        }
      </div>
      <div className="operator-text">
        {title || 'Unknown'}
      </div>
    </div>
  )
};

const OperatorList: React.FC<Props> = (props) => {
  const { } = props;

  const currentPath = (props as any).match.params.currentPath ? decodeURIComponent((props as any).match.params.currentPath) : '';

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterVal, setFilterVal] = useState('');

  // const filter = (list: OperatorProps[]) => list.filter((item: OperatorProps) => item.title.includes(filterVal));

  const handleRefresh = () => getList();

  const getList = () => {
    console.log(currentPath);
    axios.get(`${process.env.REACT_APP_GO_WORKFLOW_SERVER}/component/tree`)
      .then((res) => {
        if (res.data.code === 200) {
          console.log(res.data.data);
          setList(res.data.data);
          setLoading(false);
        }
      }).catch((err) => {
        message.error('服务器被吃了..');
      });
  };

  const handleGoToNewPath = (navItemIndex: number) => () => {
    const pathItems = currentPath.split('/');
    const newPath = `${pathItems.slice(0, navItemIndex + 1).join('/')}`;
    (props as any).history.push(`/operator-list/${encodeURIComponent(newPath)}`);
  };

  useEffect(() => {
    getList();
  }, [currentPath]);

  return (
    <div>
      <div className="table-toolbar">
        <Link to="/operator-detail">
          <Button type="primary">
            <Icon type="plus-square" /> 新增算子
          </Button>
        </Link>
        <Button onClick={handleRefresh}><Icon type="reload" /> 刷新</Button>
        <div className="table-toolbar-right">
          <Input.Search value={filterVal} onChange={(e) => setFilterVal(e.target.value)} placeholder="搜索" />
        </div>
      </div>
      <div className="bread-nav">
        <Icon type="appstore" theme="filled" /> &nbsp;
        <Link to={`/operator-list`}>
          <span>所有算子</span>
        </Link>
        {
          currentPath.split('/').map((item, index) => (
            <i key={item + index}>
              <Icon type="right" className="bread-arrow" />
              <span onClick={handleGoToNewPath(index)}>{item}</span>
            </i>
          ))
        }
      </div>
      <div className="operator-list">
        {
          list.map((item: OperatorProps, index: number) => (
            // <Link to={`/operator-list/${formatPath(item.directory)}`}>
            <Operator
              icon={item.icon}
              key={index}
              title={item.title}
              isDirectory={!!item.model}
            />
            // </Link>
          ))
        }
        {
          list.map((item: OperatorProps, index: number) => (
            // <Link to={`/operator-list/${formatPath(item.directory)}`}>
            <Operator
              icon={item.icon}
              key={index}
              title={item.title}
              isDirectory={!!item.model}
            />
            // </Link>
          ))
        }
      </div>
    </div>
  );
};

export default OperatorList;