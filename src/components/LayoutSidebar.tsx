import React, { SFC } from 'react';
import { Link } from 'react-router-dom';
import { Layout as AntLayout, Menu, Icon } from 'antd';

const { ItemGroup: MenuItemGroup } = Menu;
const { Sider } = AntLayout;

type Props = {
  navmark: string
  collapsed: boolean
};

const LayoutSidebar: SFC<Props> = (props) => {
  const { navmark, collapsed } = props;

  return (
    <Sider width={220} id="sidebar" trigger={null} collapsible collapsed={collapsed}>
      <Link to="/">
        <div id="logo">
          {collapsed ? "海聪" : "海聪 AI Flow"}
        </div>
      </Link>
      <Menu
        mode="inline"
        theme="dark"
        selectedKeys={[navmark]}
        // style={{ height: '100%', borderRight: 0 }}
        style={{ marginTop: 84 }}
      >
        <MenuItemGroup key="10127f0a" title={!collapsed && "工作流"}>
          <Menu.Item key="project">
            <Link to={sessionStorage.getItem("page-history") || '/project-list'}>
              <Icon type="appstore" theme="filled" />
              <span>模板管理</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="timed">
            <Link to="/timed-list">
              <Icon type="clock-circle" />
              <span>定时任务</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="instance">
            <Link to="/instance-list">
              <Icon type="pie-chart" />
              <span>实例管理</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="operator">
            <Link to="/operator-list">
              <Icon type="build" />
              <span>算子管理</span>
            </Link>
          </Menu.Item>
        </MenuItemGroup>
      </Menu>
    </Sider>
  )
};

export default LayoutSidebar;