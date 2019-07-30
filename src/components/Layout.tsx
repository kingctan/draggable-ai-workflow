import React, { FC, ReactElement, useState } from 'react';
import { Layout as AntLayout } from 'antd';
import LayoutHeader from './LayoutHeader';
import LayoutSidebar from './LayoutSidebar';

const { Content } = AntLayout;

type Props = {
  children: ReactElement,
  navmark: string,
};

const Layout: FC<Props> = (props) => {
  const { children, navmark } = props;

  const localSidebarCollapsed: string | null = localStorage.getItem('sidebar-collapsed');
  const [collapsed, setCollapsed] = useState(
    (localSidebarCollapsed === 'false' || localSidebarCollapsed === null) ? false : true
  );

  const toggleSidebar = () => {
    localStorage.setItem('sidebar-collapsed', (!collapsed).toString());
    setCollapsed(!collapsed);
  };

  return (
    <AntLayout className="my-layout">
      <LayoutSidebar
        navmark={navmark}
        collapsed={collapsed} />
      <AntLayout style={{ marginLeft: collapsed ? 80 : 220 }}>
        <LayoutHeader
          collapsed={collapsed}
          toggleSidebar={toggleSidebar}
        />
        <Content id="main" style={{ margin: '64px 0 0 0' }}>
          {children}
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;
