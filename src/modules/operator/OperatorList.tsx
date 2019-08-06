import React, { useState, useEffect } from 'react';
import { Button, Icon, message, Input, Spin } from 'antd';
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
          isDirectory ?
            <Icon type={icon || 'code'} style={{ color: 'rgba(0,0,0,.6)', fontSize: 40 }} /> :
            <Icon type="folder" theme="filled" style={{ color: '#00cdea' }} />
        }
      </div>
      <div className="operator-text">
        {title || 'Unknown'}
      </div>
    </div>
  )
};

const NotFound: React.FC<{ content: string }> = ({ content }) => {
  return (
    <div style={{ color: '#ccc' }}>
      {content}
    </div>
  )
};

const OperatorList: React.FC<Props> = (props) => {
  const { } = props;

  const currentPath = (props as any).match.params.currentPath ? decodeURIComponent((props as any).match.params.currentPath) : '';

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterVal, setFilterVal] = useState('');

  const filter = (list: OperatorProps[]) => list.filter((item: OperatorProps) => item.title.includes(filterVal));

  const handleRefresh = () => getList();

  const getList = () => {
    setLoading(true);
    axios.get(`${process.env.REACT_APP_GO_WORKFLOW_SERVER}/component/list?path=/${currentPath}`)
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
      <div className="main-toolbar">
        <Link to="/operator-detail">
          <Button type="primary">
            <Icon type="plus-square" /> 新增算子
          </Button>
        </Link>
        <Button onClick={handleRefresh}><Icon type="reload" /> 刷新</Button>
        <div className="main-toolbar-right">
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
          loading ? <Spin tip="加载中..." className="spin" style={{ color: '#fff' }} /> :
            (
              filter(list).length === 0 ? <NotFound content={`Oops.. 找不到名字包含 “${filterVal}” 的文件`} /> :
                filter(list).map((item: OperatorProps, index: number) => (
                  <Link
                    to={`/operator-list/${item.model ? encodeURIComponent(currentPath) : encodeURIComponent(item.path)}`}
                    key={index}
                  >
                    <Operator
                      icon={item.icon}
                      title={item.title}
                      isDirectory={!!item.model}
                    />
                  </Link>
                ))
            )
        }
      </div>
    </div>
  );
};

export default OperatorList;