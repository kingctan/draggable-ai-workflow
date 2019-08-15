import React, { useState, useEffect } from 'react';
import { Button, Icon, message, Input, Spin } from 'antd';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { OperatorProps } from './OperatorProps';

type Props = {};

const NotFound: React.FC<{ content: string }> = ({ content }) => {
  return (
    <div style={{ color: '#ccc' }}>
      {content}
    </div>
  )
};

const OperatorList: React.FC<Props> = (props) => {
  // const { } = props;

  const currentPath = (props as any).match.params.currentPath ? decodeURIComponent((props as any).match.params.currentPath) : '';

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterVal, setFilterVal] = useState('');

  const filter = (list: OperatorProps[]) => list.filter((item: OperatorProps) => item.title.includes(filterVal));

  const handleRefresh = () => getList();

  const getList = () => {
    setLoading(true);
    axios.get(`${process.env.REACT_APP_GO_WORKFLOW_SERVER}/component/list?path=%2F${currentPath}`)
      .then((res) => {
        if (res.data.code === 200) {
          console.log(res.data.data);
          setList(res.data.data || []);
          setLoading(false);
        } else {
          (props as any).history.push(`/operator-list`);
        }
      }).catch((err) => {
        message.error('服务器被吃了..或传的路径出错');
        (props as any).history.push(`/operator-list`);
      });
  };

  const handleGoToNewPath = (navItemIndex: number) => () => {
    const pathItems = currentPath.split('/');
    const newPath = `${pathItems.slice(0, navItemIndex + 1).join('/')}`;
    (props as any).history.push(`/operator-list/${encodeURIComponent(newPath)}`);
  };

  const handleToDetail = (obj: OperatorProps) => {
    let newPath: string;
    if (!!obj.model) {
      sessionStorage.setItem('OperatorListCurrentPath', currentPath);
      newPath = `/operator-detail/${obj.model.componentID}`;
    } else {
      newPath = `/operator-list/${encodeURIComponent(obj.path)}`
    }
    (props as any).history.push(newPath);
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
                  // <Link
                  //   to={
                  //     item.model ?
                  //       `/operator-detail/${item.model.componentID}` :
                  //       `/operator-list/${item.model ? encodeURIComponent(currentPath) : encodeURIComponent(item.path)}`
                  //   }
                  //   key={index}
                  // >
                  <div className="operator" onClick={() => handleToDetail(item)}>
                    <div className="operator-icon">
                      {
                        !!item.model ?
                          <Icon type={item.icon || 'code'} style={{ color: 'rgba(0,0,0,.6)', fontSize: 40 }} /> :
                          <Icon type="folder" theme="filled" style={{ color: '#00cdea' }} />
                      }
                    </div>
                    <div className="operator-text">
                      {item.title || 'Unknown'}
                    </div>
                  </div>
                ))
            )
        }
      </div>
    </div>
  );
};

export default OperatorList;