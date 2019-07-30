import React from 'react';

type Props = {
  children: React.ReactElement,
};

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <div>
      {children}
    </div>
  );
};

export default Layout;