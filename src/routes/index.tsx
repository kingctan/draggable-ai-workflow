import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import Layout from '../components/Layout';
import Workflow from '../modules/workflow/Workflow';

// const isAuthenticated = () => {
//   return true;
// };

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

export const Routes = () =>
  <Layout>
    <HashRouter>
      <Switch>
        <Route path="/" exact component={Workflow} />
      </Switch>
    </HashRouter>
  </Layout>
