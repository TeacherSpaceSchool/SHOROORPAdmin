import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as userActions from '../redux/actions/user'
import * as appActions from '../redux/actions/app'
import * as mini_dialogActions from '../redux/actions/mini_dialog'
import Sign from './Sign';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { mainWindow } from '../App'
import AccountCircle from '@material-ui/icons/AccountCircle';
import Menu1 from '@material-ui/icons/Menu';
import IconButton from '@material-ui/core/IconButton';

const styles = {
    appBar: {
        zIndex: 1201,
        background: '#252850'
    },
    root: {
        flexGrow: 1,
    },
    grow: {
        flexGrow: 1,
    },
};

const MyAppBar = React.memo(
    (props) =>{
        const { authenticated, status } = props.user;
        const { classes, location } = props;
        const { logout } = props.userActions;
        const { selected, name } = props.table;
        const { drawer } = props.app;
        const { showDrawer } = props.appActions;
        const { setMiniDialog, showMiniDialog, showAddMiniDialog, showSelectRealizators } = props.mini_dialogActions;
        let currentPath = location.pathname.split('/')[1];
        const [anchorEl, setAnchorEl] = React.useState(null);
        const open = Boolean(anchorEl);
        let handleMenu = (event) => {
            setAnchorEl(event.currentTarget);
        }
        let handleClose = () => {
            setAnchorEl(null);
        }
        return (
                <div>
                    <div className={classes.root}>
                        <AppBar position="fixed" className={classes.appBar}>
                            <Toolbar>
                                {mainWindow.current.offsetWidth<800?
                                    <IconButton
                                        aria-owns='menu-appbar'
                                        aria-haspopup='true'
                                        onClick={() => {showDrawer(!drawer)}}
                                        color='inherit'
                                    >
                                        <Menu1 />
                                    </IconButton>
                                    :null
                                }
                                <Typography variant="h6" color="inherit" className={classes.grow}>
                                        {status.role!==undefined?
                                            status.role==='admin'?
                                                'Админ'
                                                :
                                                status.role.charAt(0).toUpperCase() + status.role.slice(1)
                                            :
                                            'ШОРО ОРП'
                                        }
                                </Typography>
                                {mainWindow.current.offsetWidth>450?
                                    authenticated ?
                                        <div>
                                            {navigator.onLine && !['', 'Реализатор', 'Организатор', 'Регион', 'Точка', 'Цена', 'Отчет реализатора', 'Отчет организатора', 'Накладная на вечерний возврат', 'Накладная склад №2', 'Накладная склад №1', 'Накладная на пустую тару' , 'Отчет реализатора сегодня' , 'Отчет организатора сегодня', 'Накладная на вечерний возврат сегодня', 'Накладная склад №2 сегодня', 'Накладная склад №1 сегодня', 'Накладная на пустую тару сегодня'].includes(name) && !['blog','FAQ', 'plan', 'nnpt', 'nnvv', 'ns1', 'ns2', 'oo', 'or'].includes(currentPath)  && status.role==='admin' ?
                                                    <Button  variant="outlined" color="inherit" onClick={()=>{
                                                        if(name==='План')
                                                            props.history.push('/plan')
                                                        else
                                                            showAddMiniDialog()}
                                                    } style={{marginRight: '20px'}}>Добавить</Button>
                                                    :
                                                navigator.onLine && name!=='' && currentPath!=='blog' && currentPath!=='FAQ' && currentPath!=='plan' && currentPath!=='nnpt' && currentPath!=='nnvv' && currentPath!=='ns1' && currentPath!=='ns2' && currentPath!=='oo' && currentPath!=='or'  && ((name==='Отчет реализатора сегодня' && status.role==='организатор') || (name==='Отчет реализатора' && status.role==='организатор') || (name==='Отчет организатора' && status.role==='организатор') || (name==='Накладная на вечерний возврат' && status.role==='организатор') || (name==='Накладная склад №2' && status.role==='организатор') || (name==='Накладная склад №1' && status.role==='организатор') || (name==='Накладная на пустую тару' && status.role==='организатор')) ?
                                                        <Button  variant="outlined" color="inherit" onClick={()=>{
                                                            if(name==='Накладная на пустую тару')
                                                                props.history.push('/nnpt')
                                                            else if(name==='Накладная склад №1')
                                                                props.history.push('/ns1')
                                                            else if(name==='Накладная склад №2')
                                                                props.history.push('/ns2')
                                                            else if(name==='Накладная на вечерний возврат')
                                                                props.history.push('/nnvv')
                                                            else if(name==='Отчет организатора')
                                                                props.history.push('/oo')
                                                            else if(name==='Отчет реализатора'||name==='Отчет реализатора сегодня')
                                                                props.history.push('/or')
                                                            else
                                                                showAddMiniDialog()
                                                        }
                                                        } style={{marginRight: '20px'}}>Добавить</Button>
                                                        :
                                                    navigator.onLine && name!=='' && currentPath!=='blog' && currentPath!=='FAQ' && currentPath!=='plan' && currentPath!=='nnpt' && currentPath!=='nnvv' && currentPath!=='ns1' && currentPath!=='ns2' && currentPath!=='oo' && currentPath!=='or' && ((name==='Отчет реализатора' && status.role==='реализатор')) ?
                                                            <Button  variant="outlined" color="inherit" onClick={()=>{
                                                                if(name==='Отчет реализатора')
                                                                    props.history.push('/or')
                                                            }
                                                            } style={{marginRight: '20px'}}>Добавить</Button>
                                                            :
                                                            currentPath==='or' && currentPath!=='blog' && currentPath!=='FAQ' && selected===-1 && status.role==='организатор' ?
                                                                <Button  variant="outlined" color="inherit" onClick={()=>{
                                                                    showSelectRealizators()
                                                                }
                                                                } style={{marginRight: '20px'}}>Точка</Button>
                                                                :
                                                                null
                                            }
                                            <Button  variant="outlined" color="inherit" onClick={logout}>Выйти</Button>
                                        </div>
                                        :
                                        <Button  variant="outlined" color="inherit" onClick={()=>{setMiniDialog('Авторизация', <Sign/>);showMiniDialog(true)}}>Войти</Button>
                                    :
                                    <div>
                                        <IconButton
                                            aria-owns={open ? 'menu-appbar' : undefined}
                                            aria-haspopup='true'
                                            onClick={handleMenu}
                                            color='inherit'
                                        >
                                            <AccountCircle />
                                        </IconButton>
                                        <Menu
                                            id='menu-appbar'
                                            anchorEl={anchorEl}
                                            anchorOrigin={{
                                                vertical: 'top',
                                                horizontal: 'right',
                                            }}
                                            transformOrigin={{
                                                vertical: 'top',
                                                horizontal: 'right',
                                            }}
                                            open={open}
                                            onClose={handleClose}
                                        >
                                            {authenticated ?
                                                <>
                                                {navigator.onLine && !['', 'Цена', 'Организатор', 'Регион', 'Точка', 'Отчет реализатора', 'Отчет организатора', 'Накладная на вечерний возврат', 'Накладная склад №2', 'Накладная склад №1', 'Накладная на пустую тару' , 'Отчет реализатора сегодня' , 'Отчет организатора сегодня', 'Накладная на вечерний возврат сегодня', 'Накладная склад №2 сегодня', 'Накладная склад №1 сегодня', 'Накладная на пустую тару сегодня'].includes(name) && !['blog','FAQ', 'plan', 'nnpt', 'nnvv', 'ns1', 'ns2', 'oo', 'or'].includes(currentPath)  && status.role==='admin' ?
                                                    <MenuItem onClick={()=>
                                                    {handleClose();
                                                        if(name==='План')
                                                            props.history.push('/plan')
                                                        else
                                                            showAddMiniDialog()
                                                    }}>Добавить</MenuItem>
                                                    :
                                                    navigator.onLine && name!=='' && currentPath!=='blog' && currentPath!=='FAQ' && currentPath!=='plan' && currentPath!=='nnpt' && currentPath!=='nnvv' && currentPath!=='ns1' && currentPath!=='ns2' && currentPath!=='oo' && currentPath!=='or'  && ((name==='Отчет реализатора' && status.role==='организатор') || (name==='Отчет организатора' && status.role==='организатор') || (name==='Накладная на вечерний возврат' && status.role==='организатор') || (name==='Накладная склад №2' && status.role==='организатор') || (name==='Накладная склад №1' && status.role==='организатор') || (name==='Накладная на пустую тару' && status.role==='организатор')) ?
                                                        <MenuItem onClick={()=>
                                                        {handleClose();
                                                            if(name==='Накладная на пустую тару')
                                                                props.history.push('/nnpt')
                                                            else if(name==='Накладная склад №1')
                                                                props.history.push('/ns1')
                                                            else if(name==='Накладная склад №2')
                                                                props.history.push('/ns2')
                                                            else if(name==='Накладная на вечерний возврат')
                                                                props.history.push('/nnvv')
                                                            else if(name==='Отчет организатора')
                                                                props.history.push('/oo')
                                                            else if(name==='Отчет реализатора')
                                                                props.history.push('/or')
                                                            else
                                                                showAddMiniDialog()
                                                        }}>Добавить</MenuItem>
                                                        :
                                                        navigator.onLine && name!=='' && currentPath!=='blog' && currentPath!=='FAQ' && currentPath!=='plan' && currentPath!=='nnpt' && currentPath!=='nnvv' && currentPath!=='ns1' && currentPath!=='ns2' && currentPath!=='oo' && currentPath!=='or'  && ((name==='Отчет реализатора' && status.role==='реализатор')) ?
                                                            <MenuItem  variant="outlined" color="inherit" onClick={()=>{
                                                                if(name==='Отчет реализатора')
                                                                    props.history.push('/or')
                                                            }
                                                            } style={{marginRight: '20px'}}>Добавить</MenuItem>
                                                            :
                                                            currentPath==='or'  && currentPath!=='blog' && currentPath!=='FAQ' && selected===-1 && status.role==='организатор' ?
                                                                <MenuItem  variant="outlined" color="inherit" onClick={()=>{
                                                                    showSelectRealizators()
                                                                }
                                                                } style={{marginRight: '20px'}}>Точка</MenuItem>
                                                                :
                                                                null
                                                }
                                                <MenuItem onClick={()=>{handleClose(); logout()}}>Выйти</MenuItem>
                                                </>
                                                :
                                                <MenuItem onClick={()=>{handleClose();setMiniDialog('Авторизация', <Sign/>);showMiniDialog(true)}}>Войти</MenuItem>
                                            }
                                        </Menu>
                                    </div>
                                }


                            </Toolbar>
                        </AppBar>
                    </div>
                </div>
        )
    }
)

MyAppBar.propTypes = {
    classes: PropTypes.object.isRequired,
};

function mapStateToProps (state) {
    return {
        table: state.table,
        app: state.app,
        user: state.user
    }
}

function mapDispatchToProps(dispatch) {
    return {
        mini_dialogActions: bindActionCreators(mini_dialogActions, dispatch),
        appActions: bindActionCreators(appActions, dispatch),
        userActions: bindActionCreators(userActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(MyAppBar))