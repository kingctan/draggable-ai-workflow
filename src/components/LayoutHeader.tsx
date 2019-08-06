import React, { SFC } from 'react';
import { Layout as AntLayout, Icon, Divider } from 'antd';

const { Header } = AntLayout;

type Props = {
  collapsed: boolean
  toggleSidebar: () => void
}

const LayoutHeader: SFC<Props> = (props) => {

  const { collapsed, toggleSidebar } = props;

  const logout = () => {
    sessionStorage.clear();
    // window.location.href = process.env.REACT_APP_OA_URL!;
  };

  return (
    <Header
      className="header"
      id="header"
      style={{
        width: `calc(100% - ${collapsed ? 80 : 220}px)`,
        left: collapsed ? 80 : 220
      }}
    >
      <div id="header-inner">
        <Icon
          className="trigger"
          type={collapsed ? 'menu-unfold' : 'menu-fold'}
          onClick={toggleSidebar}
          style={{ fontSize: 16 }}
        />

        <div className="header-account">
          <span>
            <Icon type="user" /> &nbsp;{sessionStorage.getItem('t-name')}
          </span>
          <Divider type="vertical" />
          <span className="logout-btn" onClick={logout}>
            退出
          </span>
        </div>
      </div>
    </Header >
  )
};

export default LayoutHeader;
