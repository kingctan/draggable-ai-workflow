import React, { FC } from 'react';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import Layout from '../components/Layout';
import Workflow from '../modules/workflow/Workflow';
import ProjectList from '../modules/project/ProjectList';
import ProjectDetail from '../modules/project/ProjectDetail';
import InstanceList from '../modules/instance/InstanceList';
import InstanceDetail from '../modules/instance/InstanceDetail';
import BrickList from '../modules/brick/BrickList';
import BrickDetail from '../modules/brick/BrickDetail';

const isAuthenticated = () => {
  return true;
};

// const PrivateRoute: FC<Props> = ({ component: Component, ...rest }) => {
//   return (
//     <div>
//       <Route
//         {...rest}
//         render={props => (
//           isAuthenticated() ? <Component {...props} /> : <Redirect to={{ pathname: '/login' }} />
//         )}
//       />
//     </div>
//   )
// };

type Props = {
  component: any,
  exact: boolean,
  path: string,
  navmark?: string  // 侧栏高亮
}

const LayoutRoute: FC<Props> = ({ component: Component, ...rest }) => {
  return (
    <Layout navmark={rest.navmark!}>
      <Route
        {...rest}
        render={props => (
          isAuthenticated() ? <Component {...props} /> : <Redirect to={{ pathname: '/login' }} />
        )}
      />
    </Layout>
  )
};

export const Routes = () =>
  <HashRouter>
    <Switch>
      <LayoutRoute path="/" exact navmark="project" component={ProjectList} />
      <LayoutRoute path="/project-detail" exact navmark="project" component={ProjectDetail} />
      <LayoutRoute path="/instance-list" exact navmark="instance" component={InstanceList} />
      <LayoutRoute path="/instance-detail" exact navmark="instance" component={InstanceDetail} />
      <LayoutRoute path="/brick-list" exact navmark="brick" component={BrickList} />
      <LayoutRoute path="/brick-detail" exact navmark="brick" component={BrickDetail} />
    </Switch>
  </HashRouter>;
