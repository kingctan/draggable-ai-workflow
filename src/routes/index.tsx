import React, { FC } from 'react';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import Layout from '../components/Layout';
import ProjectList from '../modules/project/ProjectList';
import ProjectDetail from '../modules/project/ProjectDetail';
import InstanceList from '../modules/instance/InstanceList';
import InstanceDetail from '../modules/instance/InstanceDetail';
import OperatorList from '../modules/operator/OperatorList';
import OperatorDetail from '../modules/operator/OperatorDetail';

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
      <LayoutRoute path="/project-list" exact navmark="project" component={ProjectList} />
      <LayoutRoute path="/project-detail" exact navmark="project" component={ProjectDetail} />
      <LayoutRoute path="/instance-list" exact navmark="instance" component={InstanceList} />
      <LayoutRoute path="/instance-detail" exact navmark="instance" component={InstanceDetail} />
      <LayoutRoute path="/operator-list" exact navmark="operator" component={OperatorList} />
      <LayoutRoute path="/operator-list/:currentPath" exact navmark="operator" component={OperatorList} />
      <LayoutRoute path="/operator-detail" exact navmark="operator" component={OperatorDetail} />
      <LayoutRoute path="/operator-detail/:componentId" exact navmark="operator" component={OperatorDetail} />
    </Switch>
  </HashRouter>;
