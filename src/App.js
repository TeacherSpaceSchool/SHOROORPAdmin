import React, { lazy, Suspense, useEffect } from 'react';
import './App.css';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as userActions from './redux/actions/user'
import * as appActions from './redux/actions/app'
import { Switch, withRouter, Route } from 'react-router-dom'
import { getDataSimple } from './redux/actions/table'


const FAQ = lazy(() => import('./pages/FAQ'));
const Main = lazy(() => import('./pages/Main'));
const AppBar = lazy(() => import('./component/AppBar'));
const Drawer = lazy(() => import('./component/Drawer'));
const Dialog = lazy(() => import('./component/Dialog'));
const Plan = lazy(() => import('./pages/Plan'));
const NNPT = lazy(() => import('./pages/NNPT'));
const NS1 = lazy(() => import('./pages/NS1'));
const NS2 = lazy(() => import('./pages/NS2'));
const NNVV = lazy(() => import('./pages/NNVV'));
const OR = lazy(() => import('./pages/OR'));
const OO = lazy(() => import('./pages/OO'));
const RR = lazy(() => import('./pages/RR'));
const RO = lazy(() => import('./pages/RO'));
const Profile = lazy(() => import('./pages/Profile'));
const Blog = lazy(() => import('./pages/Blog'));
const Statistic = lazy(() => import('./pages/Statistic'));
export const mainWindow = React.createRef();

const App = (
    (props) =>{
        const { checkAuthenticated, setStatus, setReiting } = props.userActions;
        const { setProfile } = props.appActions;
        useEffect(async ()=>{
            await checkAuthenticated();
            await setStatus()
            setProfile(await getDataSimple({name: 'Профиль'}))
            setReiting(await getDataSimple({name: 'Рейтинг свой'}))
        },[])
        return (
              <div ref={mainWindow} className='App'>
                  <Suspense fallback={null}>
                      <AppBar history={props.history} location={props.location}/>
                  </Suspense>
                  <Suspense fallback={null}>
                      <Drawer history={props.history}/>
                  </Suspense>
                  <div className='App-body'>
                      <Switch>
                          <Route  path='/' exact component={WaitingComponent(Main, props.history, props.location)}/>
                          <Route  path='/plan' exact component={WaitingComponent(Plan, props.history, props.location)}/>
                          <Route  path='/nnpt' exact component={WaitingComponent(NNPT, props.history, props.location)}/>
                          <Route  path='/ns1' exact component={WaitingComponent(NS1, props.history, props.location)}/>
                          <Route  path='/ns2' exact component={WaitingComponent(NS2, props.history, props.location)}/>
                          <Route  path='/nnvv' exact component={WaitingComponent(NNVV, props.history, props.location)}/>
                          <Route  path='/oo' exact component={WaitingComponent(OO, props.history, props.location)}/>
                          <Route  path='/or' exact component={WaitingComponent(OR, props.history, props.location)}/>
                          <Route  path='/rr' exact component={WaitingComponent(RR, props.history, props.location)}/>
                          <Route  path='/ro' exact component={WaitingComponent(RO, props.history, props.location)}/>
                          <Route  path='/blog' exact component={WaitingComponent(Blog, props.history, props.location)}/>
                          <Route  path='/FAQ' exact component={WaitingComponent(FAQ, props.history, props.location)}/>
                          <Route  path='/profile' exact component={WaitingComponent(Profile, props.history, props.location)}/>
                          <Route  path='/statistic' exact component={WaitingComponent(Statistic, props.history, props.location)}/>
                      </Switch>
                  </div>
                  <Suspense fallback={null}>
                      <Dialog/>
                  </Suspense>
              </div>
        );
  })

function WaitingComponent(Component, history, location) {
    return props => (
        <Suspense fallback={<div>Loading...</div>}>
            <Component {...props}  history={history} location={location}/>
        </Suspense>
    );
}

function mapStateToProps (state) {
    return {
        user: state.user
    }
}

function mapDispatchToProps(dispatch) {
    return {
        userActions: bindActionCreators(userActions, dispatch),
        appActions: bindActionCreators(appActions, dispatch),
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
