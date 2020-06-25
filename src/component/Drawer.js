import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Event from '@material-ui/icons/ListAlt';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { mainWindow } from '../App'
import * as tableActions from '../redux/actions/table'
import * as appActions from '../redux/actions/app'
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/UnfoldLess';
import ExpandMore from '@material-ui/icons/UnfoldMore';
import Face from '@material-ui/icons/Face';
import Info from '@material-ui/icons/Info';
import ArtTrack from '@material-ui/icons/Web';
import QuestionAnswer from '@material-ui/icons/QuestionAnswer';
import Storage from '@material-ui/icons/Storage';
import Assignment from '@material-ui/icons/Assignment';
import Timeline from '@material-ui/icons/Timeline';
import Assessment from '@material-ui/icons/Assessment';
import List1 from '@material-ui/icons/List';
import AssignmentInd from '@material-ui/icons/AssignmentInd';
import Commute from '@material-ui/icons/Commute';
import AccountBalance from '@material-ui/icons/AccountBalanceWallet';
import LocationOn from '@material-ui/icons/LocationOn';
import Receipt from '@material-ui/icons/Receipt';
import LocationCity from '@material-ui/icons/LocationCity';
import Archive from '@material-ui/icons/Archive';
import All from '@material-ui/icons/AllInbox';
import GpsFixed from '@material-ui/icons/GpsFixed';


const drawerWidth = 300;

const styles = theme => ({
    drawer: {
        width: drawerWidth,
        flexShrink: 0
    },
    drawerPaper: {
        width: drawerWidth,
    },
    toolbar: theme.mixins.toolbar,
    nested: {
        paddingLeft: theme.spacing.unit * 4,
    },
    nestedSelectedItem: {
        paddingLeft: theme.spacing.unit * 4,
        background: '#C1C1C1',
    },
    nested1: {
        paddingLeft: theme.spacing.unit * 6,
    },
    nested1SelectedItem: {
        paddingLeft: theme.spacing.unit * 6,
        background: '#C1C1C1',
    },
    nested2: {
        paddingLeft: theme.spacing.unit * 8
    },
    nested2SelectedItem: {
        paddingLeft: theme.spacing.unit * 8,
        background: '#C1C1C1',
    },


});

const MyDrawer = React.memo(
    (props) =>{
        const { drawer, profile } = props.app;
        const { status } = props.user;
        const { name } = props.table;
        const { showDrawer } = props.appActions;
        const { getData, setSelected } = props.tableActions;
        const { classes, location } = props;
        let [secondMenuOpen, setSecondMenuOpen] = useState({});
        let [thirdMenuOpen, setThirdMenuOpen] = useState({});
        let [fourthMenuOpen, setFourthMenuOpen] = useState({});
        let [regionList, setRegionList] = useState([]);
        let [pointList, setPointList] = useState([]);
        let [selectedRegion, setSelectedRegion] = useState('');
        let currentPath = location.pathname.split('/')[1];

        useEffect(()=>{
            async function fetchData() {
                setRegionList(await tableActions.getDataSimple({name: 'РегионИмя'}))
                setPointList(await tableActions.getDataSimple({name: 'ТочкаСРегионом'}))
            }
            fetchData();
        },[])
        let collapse = (name)=>{
            secondMenuOpen = {...secondMenuOpen}
            thirdMenuOpen = {...thirdMenuOpen}
            fourthMenuOpen = {...fourthMenuOpen}
            let open = !secondMenuOpen[name]
            let keys = Object.keys(thirdMenuOpen)
            for(let i = 0; i<keys.length; i++){
                thirdMenuOpen[keys[i]] = false
            }
            setThirdMenuOpen(thirdMenuOpen)
            keys = Object.keys(fourthMenuOpen)
            for(let i = 0; i<keys.length; i++){
                fourthMenuOpen[keys[i]] = false
            }
            setFourthMenuOpen(fourthMenuOpen)
            keys = Object.keys(secondMenuOpen)
            for(let i = 0; i<keys.length; i++){
                secondMenuOpen[keys[i]] = false
            }
            secondMenuOpen[name] = open
            setSecondMenuOpen(secondMenuOpen)

        }
        let collapse1 = (name)=>{
            thirdMenuOpen = {...thirdMenuOpen}
            fourthMenuOpen = {...fourthMenuOpen}
            let open = !thirdMenuOpen[name]
            let keys = Object.keys(thirdMenuOpen)
            for(let i = 0; i<keys.length; i++){
                thirdMenuOpen[keys[i]] = false
            }
            thirdMenuOpen[name] = open
            setThirdMenuOpen(thirdMenuOpen)
            keys = Object.keys(fourthMenuOpen)
            for(let i = 0; i<keys.length; i++){
                fourthMenuOpen[keys[i]] = false
            }
            setFourthMenuOpen(fourthMenuOpen)

        }
        let collapse2 = (name)=>{
            fourthMenuOpen = {...fourthMenuOpen}
            let open = !fourthMenuOpen[name]
            let keys = Object.keys(fourthMenuOpen)
            for(let i = 0; i<keys.length; i++){
                fourthMenuOpen[keys[i]] = false
            }
            fourthMenuOpen[name] = open
            setFourthMenuOpen(fourthMenuOpen)

        }
        let [selectedItem, setSelectedItem] = useState({});
        let collapseSelectedItem = (name)=>{
            selectedItem = {...selectedItem}
            let open = !selectedItem[name]
            let keys = Object.keys(selectedItem)
            for(let i = 0; i<keys.length; i++){
                selectedItem[keys[i]] = false
            }
            selectedItem[name] = open
            setSelectedItem(selectedItem)

        }
        const { authenticated } = props.user;
        let variant= ''
        if(mainWindow.current.offsetWidth>800)
            variant= 'permanent'
        return (
            <div>
                <Drawer
                    variant= {variant}
                    className={classes.drawer}
                    open={drawer}
                    onClose={()=>showDrawer(false)}
                    classes={{paper: classes.drawerPaper,}}
                >
                    {
                        mainWindow.current.offsetWidth>800?
                            <div className={classes.toolbar}/>
                        :
                            null
                    }
                    {authenticated?
                        <List>
                            {
                                status.status==='active'&&['реализатор', 'организатор'].includes(status.role)?
                                    <div>
                                        <ListItem button key={'event'} onClick={()=>{props.history.push('/profile');showDrawer(false); getData({search: '', sort: '', page: 0, name: ''}); setSelected(-1)}}>
                                            <ListItemIcon>
                                                <Face />
                                            </ListItemIcon>
                                            <ListItemText primary={'Профиль'} />
                                        </ListItem>
                                        <Divider variant='inset'/>
                                    </div>
                                    :
                                    null
                            }
                            {
                                status.status==='active'&&['admin', 'организатор'].includes(status.role)?
                                    <div>
                                        <ListItem button key={'event'} onClick={()=>{collapse('Данные')}}>
                                            <ListItemIcon><Storage /></ListItemIcon>
                                            <ListItemText primary={'Данные'} />
                                            {secondMenuOpen['Данные'] ? <ExpandLess /> : <ExpandMore />}
                                        </ListItem>
                                        <Divider variant='inset'/>
                                        <Collapse in={secondMenuOpen['Данные']} timeout='auto' unmountOnExit>
                                            <List component='div' disablePadding>
                                                {
                                                    ['admin'].includes(status.role)?
                                                        <>
                                                        <ListItem className={name==='Регион'&&currentPath===''?classes.nestedSelectedItem:classes.nested}
                                                                  button key={'event'}
                                                                  onClick={()=>{
                                                                      collapse1('регион')
                                                                      props.history.push('/');showDrawer(false); getData({search: '', sort: '', page: 0, name: 'Регион'}); setSelected(-1)}}>
                                                            <ListItemIcon><LocationCity /></ListItemIcon>
                                                            <ListItemText primary={'Регион'} />
                                                        </ListItem>
                                                        <Divider variant='inset'/>
                                                        </>
                                                        :
                                                        null
                                                }
                                                {
                                                    ['admin', 'организатор'].includes(status.role)?
                                                        <>
                                                        <ListItem className={classes.nested} button key={'event'} onClick={()=>{
                                                            if(status.role==='организатор') {
                                                                props.history.push('/');
                                                                showDrawer(false);
                                                                getData({search: '', sort: '', page: 0, name: 'Точка'});
                                                                setSelected(-1)
                                                            } else
                                                                collapse1('данныеТочка')}}>
                                                            <ListItemIcon><LocationOn /></ListItemIcon>
                                                            <ListItemText primary={'Точка'} />
                                                            {status.role==='организатор'?null:thirdMenuOpen['данныеТочка'] ? <ExpandLess /> : <ExpandMore />}
                                                        </ListItem>
                                                        <Divider variant='inset'/>
                                                        <Collapse in={thirdMenuOpen['данныеТочка']} timeout='auto' unmountOnExit>
                                                            <List component='div' disablePadding>
                                                                <ListItem className={selectedItem['ТочкаВсе']?classes.nested1SelectedItem:classes.nested1} button key={'event'} onClick={()=>{
                                                                    props.history.push('/');
                                                                    showDrawer(false);
                                                                    getData({search: '', sort: '', page: 0, name: 'Точка', region: ''});
                                                                    setSelected(-1);
                                                                    collapseSelectedItem('ТочкаВсе')
                                                                }}>
                                                                    <ListItemIcon><All /></ListItemIcon>
                                                                    <ListItemText primary={'Все'} />
                                                                </ListItem>
                                                                <Divider variant='inset'/>
                                                                {regionList!=undefined&&regionList.length>0?
                                                                    regionList.map((element, idx)=>{
                                                                    return(
                                                                        <React.Fragment key={idx}>
                                                                        <ListItem className={selectedItem['Точка'+element.guid]?classes.nested1SelectedItem:classes.nested1} button key={'event'} onClick={()=>{
                                                                            props.history.push('/');
                                                                            showDrawer(false);
                                                                            getData({search: '', sort: '', page: 0, name: 'Точка', region: element.guid});
                                                                            setSelected(-1);
                                                                            collapseSelectedItem('Точка'+element.guid)
                                                                        }}>
                                                                            <ListItemIcon><LocationOn /></ListItemIcon>
                                                                            <ListItemText primary={element.name} />
                                                                        </ListItem>
                                                                        <Divider variant='inset'/>
                                                                        </React.Fragment>
                                                                    )
                                                                    }):null}
                                                            </List>
                                                        </Collapse>
                                                        </>
                                                        :
                                                        null
                                                }
                                                {
                                                    ['admin'].includes(status.role)?
                                                        <>
                                                        <ListItem className={name==='Организатор'&&currentPath===''?classes.nestedSelectedItem:classes.nested
                                                        } button key={'event'} onClick={()=>{collapse1('организатор');props.history.push('/');showDrawer(false); getData({search: '', sort: '', page: 0, name: 'Организатор'}); setSelected(-1)}}>
                                                            <ListItemIcon><AssignmentInd /></ListItemIcon>
                                                            <ListItemText primary={'Организатор'} />
                                                        </ListItem>
                                                        <Divider variant='inset'/>
                                                        </>
                                                        :
                                                        null
                                                }
                                                {
                                                    ['admin', 'организатор'].includes(status.role)?
                                                        <>
                                                        <ListItem className={classes.nested} button key={'event'} onClick={()=>{
                                                            /*if(status.role==='организатор') {
                                                                props.history.push('/');
                                                                showDrawer(false);
                                                                getData({search: '', sort: '', page: 0, name: 'Реализатор'});
                                                                setSelected(-1)
                                                            } else*/
                                                                collapse1('данныеРеализатор')

                                                        }}>
                                                            <ListItemIcon><AssignmentInd /></ListItemIcon>
                                                            <ListItemText primary={'Реализатор'} />
                                                            {/*status.role==='организатор'?null:*/thirdMenuOpen['данныеРеализатор'] ? <ExpandLess /> : <ExpandMore />}
                                                        </ListItem>
                                                        <Divider variant='inset'/>
                                                        <Collapse in={thirdMenuOpen['данныеРеализатор']} timeout='auto' unmountOnExit>
                                                            <List component='div' disablePadding>
                                                                {
                                                                    status.role!='организатор'?
                                                                        <>
                                                                        <ListItem className={selectedItem['РеализаторВсе']?classes.nested1SelectedItem:classes.nested1} button key={'event'} onClick={()=>{
                                                                            props.history.push('/');
                                                                            showDrawer(false);
                                                                            getData({search: '', sort: '', page: 0, name: 'Реализатор', region: ''});
                                                                            setSelected(-1);
                                                                            collapseSelectedItem('РеализаторВсе')
                                                                        }}>
                                                                            <ListItemIcon><All /></ListItemIcon>
                                                                            <ListItemText primary={'Все'} />
                                                                        </ListItem>
                                                                        <Divider variant='inset'/>
                                                                        </>
                                                                        :
                                                                        null
                                                                }
                                                                {regionList!=undefined&&regionList.length>0?
                                                                    regionList.map((element, idx)=>{
                                                                        if(status.role!='организатор'||profile.guidRegion===element.guid||'lol'===element.guid)
                                                                            return(
                                                                                <React.Fragment key={idx}>
                                                                                    <ListItem className={selectedItem['Реализатор'+element.guid]?classes.nested1SelectedItem:classes.nested1} button key={'event'} onClick={()=>{
                                                                                        props.history.push('/');
                                                                                        showDrawer(false);
                                                                                        getData({search: '', sort: '', page: 0, name: 'Реализатор', region: element.guid});
                                                                                        setSelected(-1);
                                                                                        collapseSelectedItem('Реализатор'+element.guid)
                                                                                    }}>
                                                                                        <ListItemIcon><AssignmentInd /></ListItemIcon>
                                                                                        <ListItemText primary={element.name} />
                                                                                    </ListItem>
                                                                                    <Divider variant='inset'/>
                                                                                </React.Fragment>
                                                                            )
                                                                    }):null}
                                                            </List>
                                                        </Collapse>
                                                        </>
                                                        :
                                                        null
                                                }
                                                {/*
                                                    ['admin'].includes(status.role)?
                                                        <>
                                                        <ListItem className={classes.nested} button key={'event'} onClick={()=>{props.history.push('/');showDrawer(false); getData({search: '', sort: '', page: 0, name: 'Завсклада'}); setSelected(-1)}}>
                                                            <ListItemIcon><AssignmentInd /></ListItemIcon>
                                                            <ListItemText primary={'Завсклада'} />
                                                        </ListItem>
                                                        <Divider variant='inset'/>
                                                        </>
                                                        :
                                                        null*/
                                                }
                                                {
                                                    ['admin'].includes(status.role)?
                                                        <>
                                                        <ListItem className={name==='Машина'&&currentPath===''?classes.nestedSelectedItem:classes.nested} button key={'event'} onClick={()=>{collapse1('машина');props.history.push('/');showDrawer(false); getData({search: '', sort: '', page: 0, name: 'Машина'}); setSelected(-1)}}>
                                                            <ListItemIcon><Commute /></ListItemIcon>
                                                            <ListItemText primary={'Машина'} />
                                                        </ListItem>
                                                        <Divider variant='inset'/>
                                                        </>
                                                        :
                                                        null
                                                }
                                                {
                                                    ['admin'].includes(status.role)?
                                                        <>
                                                        <ListItem className={name==='Цена'&&currentPath===''?classes.nestedSelectedItem:classes.nested} button key={'event'} onClick={()=>{collapse1('цена');props.history.push('/');showDrawer(false); getData({search: '', sort: '', page: 0, name: 'Цена'}); setSelected(-1)}}>
                                                            <ListItemIcon><AccountBalance /></ListItemIcon>
                                                            <ListItemText primary={'Цена'} />
                                                        </ListItem>
                                                        <Divider variant='inset'/>
                                                        </>
                                                        :
                                                        null
                                                }
                                            </List>
                                        </Collapse>
                                    </div>
                                    :
                                    null
                            }
                            {
                                status.status==='active'&&['admin', 'реализатор', 'организатор', 'завсклада'].includes(status.role)?
                                    <div>
                                        <ListItem button key={'event'} onClick={()=>{collapse('Накладные')}}>
                                            <ListItemIcon><Assignment /></ListItemIcon>
                                            <ListItemText primary={'Накладные'} />
                                            {secondMenuOpen['Накладные'] ? <ExpandLess /> : <ExpandMore />}
                                        </ListItem>
                                        <Divider variant='inset'/>
                                        <Collapse in={secondMenuOpen['Накладные']} timeout='auto' unmountOnExit>
                                            <List component='div' disablePadding>
                                                {
                                                    ['admin', 'организатор', 'завсклада'].includes(status.role)?
                                                        <>
                                                        <ListItem className={(currentPath=='nnvv'&&status.role==='организатор')||(name==='Накладная на вечерний возврат сегодня'&&currentPath==='')?classes.nestedSelectedItem:classes.nested} button key={'event'} onClick={()=>{
                                                            showDrawer(false);
                                                            if(status.role==='организатор') {
                                                                props.history.push('/nnvv')
                                                            } else {
                                                                props.history.push('/');
                                                                getData({search: '', sort: '', page: 0, name: 'Накладная на вечерний возврат сегодня'});
                                                                setSelected(-1)
                                                            }
                                                            collapse1('nnvv');
                                                        }}>
                                                            <ListItemIcon><Receipt /></ListItemIcon>
                                                            <ListItemText primary={'Накладная на вечерний возврат сегодня'} />
                                                        </ListItem>
                                                        <Divider variant='inset'/>
                                                        </>
                                                        :
                                                        null
                                                }
                                                {
                                                    ['admin', 'организатор', 'завсклада'].includes(status.role)?
                                                        <>
                                                        <ListItem className={(currentPath=='nnpt'&&status.role==='организатор')||(name==='Накладная на пустую тару сегодня'&&currentPath==='')?classes.nestedSelectedItem:classes.nested} button key={'event'} onClick={()=>{
                                                            showDrawer(false);
                                                            if(status.role==='организатор') {
                                                                props.history.push('/nnpt')
                                                            } else {
                                                                props.history.push('/');
                                                                getData({search: '', sort: '', page: 0, name: 'Накладная на пустую тару сегодня'});
                                                                setSelected(-1)
                                                            }
                                                            collapse1('nnpt');
                                                        }}>
                                                            <ListItemIcon><Receipt /></ListItemIcon>
                                                            <ListItemText primary={'Накладная на пустую тару сегодня'} />
                                                        </ListItem>
                                                        <Divider variant='inset'/>
                                                        </>
                                                        :
                                                        null
                                                }
                                                {
                                                    ['admin', 'организатор', 'завсклада'].includes(status.role)?
                                                        <>
                                                        <ListItem className={(currentPath=='ns1'&&status.role==='организатор')||(name==='Накладная склад №1 сегодня'&&currentPath==='')?classes.nestedSelectedItem:classes.nested} button key={'event'} onClick={()=>{

                                                            showDrawer(false);
                                                            if(status.role==='организатор') {
                                                                props.history.push('/ns1')
                                                            } else {
                                                                props.history.push('/');
                                                                getData({search: '', sort: '', page: 0, name: 'Накладная склад №1 сегодня'});
                                                                setSelected(-1)
                                                            }
                                                            collapse1('ns1');

                                                        }}>
                                                            <ListItemIcon><Receipt /></ListItemIcon>
                                                            <ListItemText primary={'Накладная склад №1 сегодня'} />
                                                        </ListItem>
                                                        <Divider variant='inset'/>
                                                        </>
                                                        :
                                                        null
                                                }
                                                {
                                                    ['admin', 'организатор', 'завсклада'].includes(status.role)?
                                                        <>
                                                        <ListItem className={(currentPath=='ns2'&&status.role==='организатор')||(name==='Накладная склад №2 сегодня'&&currentPath==='')?classes.nestedSelectedItem:classes.nested} button key={'event'} onClick={()=>{

                                                            showDrawer(false);
                                                            if(status.role==='организатор') {
                                                                props.history.push('/ns2')

                                                            } else {
                                                                props.history.push('/');
                                                                getData({search: '', sort: '', page: 0, name: 'Накладная склад №2 сегодня'});
                                                                setSelected(-1)
                                                            }
                                                            collapse1('ns2');
                                                        }}>
                                                            <ListItemIcon><Receipt /></ListItemIcon>
                                                            <ListItemText primary={'Накладная склад №2 сегодня'} />
                                                        </ListItem>
                                                        <Divider variant='inset'/>
                                                        </>
                                                        :
                                                        null
                                                }
                                                {
                                                    ['admin', 'организатор', 'завсклада'].includes(status.role)?
                                                        <>
                                                        <ListItem className={(currentPath=='oo'&&status.role==='организатор')||(name==='Отчет организатора сегодня'&&currentPath==='')?classes.nestedSelectedItem:classes.nested} button key={'event'} onClick={()=>{
                                                            showDrawer(false);
                                                            if(status.role==='организатор') {
                                                                props.history.push('/oo')
                                                            } else {
                                                                props.history.push('/');
                                                                showDrawer(false);
                                                                getData({search: '', sort: '', page: 0, name: 'Отчет организатора сегодня'});
                                                                setSelected(-1)
                                                            }
                                                            //collapse1('oo');
                                                        }}>
                                                            <ListItemIcon><Receipt /></ListItemIcon>
                                                            <ListItemText primary={'Отчет организатора сегодня'} />
                                                        </ListItem>
                                                        <Divider variant='inset'/>
                                                        </>
                                                        :
                                                        null
                                                }
                                                {
                                                    ['admin', 'реализатор', 'организатор', 'завсклада'].includes(status.role)?
                                                        <>
                                                        <ListItem className={(currentPath=='or'&&status.role==='реализатор')||(name==='Отчет реализатора сегодня'&&currentPath==='')?classes.nestedSelectedItem:classes.nested} button key={'event'} onClick={()=>{

                                                            if(status.role==='реализатор') {
                                                                showDrawer(false);
                                                                props.history.push('/or')
                                                                //collapse1('Отчет реализатора сегодня')

                                                            } else if(status.role==='организатор') {
                                                                props.history.push('/');
                                                                showDrawer(false);
                                                                getData({search: '', sort: '', page: 0, name: 'Отчет реализатора сегодня', region: profile.guidRegion});
                                                                setSelected(-1)
                                                                //collapse1('Отчет реализатора сегодня')
                                                            } else
                                                                collapse1('Отчет реализатора сегодня')
                                                        }}>
                                                            <ListItemIcon><Receipt /></ListItemIcon>
                                                            <ListItemText primary={'Отчет реализатора сегодня'} />
                                                            {status.role==='реализатор'||status.role==='организатор'?null:thirdMenuOpen['Отчет реализатора сегодня'] ? <ExpandLess /> : <ExpandMore />}
                                                        </ListItem>
                                                        <Divider variant='inset'/>
                                                        <Collapse in={thirdMenuOpen['Отчет реализатора сегодня']} timeout='auto' unmountOnExit>
                                                            <List component='div' disablePadding>
                                                                <ListItem className={selectedItem['Отчет реализатора сегодняВсе']?classes.nested1SelectedItem:classes.nested1} button key={'event'} onClick={async()=>{
                                                                    props.history.push('/');
                                                                    showDrawer(false);
                                                                    getData({search: '', sort: '', page: 0, name: 'Отчет реализатора сегодня', region: ''});
                                                                    setSelected(-1)
                                                                    collapseSelectedItem('Отчет реализатора сегодняВсе')

                                                                }}>
                                                                    <ListItemIcon><All /></ListItemIcon>
                                                                    <ListItemText primary={'Все'} />
                                                                </ListItem>
                                                                <Divider variant='inset'/>
                                                                {regionList!=undefined&&regionList.length>0?
                                                                    (regionList).map((element, idx)=>{
                                                                        return(
                                                                            <React.Fragment key={idx}>
                                                                            <ListItem className={selectedItem['Отчет реализатора сегодня'+element.guid]?classes.nested1SelectedItem:classes.nested1} button key={'event'} onClick={async()=>{
                                                                                props.history.push('/');
                                                                                showDrawer(false);
                                                                                getData({search: '', sort: '', page: 0, name: 'Отчет реализатора сегодня', region: element.guid});
                                                                                setSelected(-1)
                                                                                collapseSelectedItem('Отчет реализатора сегодня'+element.guid)

                                                                            }}>
                                                                                <ListItemIcon><Receipt /></ListItemIcon>
                                                                                <ListItemText primary={element.name} />
                                                                            </ListItem>
                                                                            <Divider variant='inset'/>


                                                                            </React.Fragment>
                                                                        )
                                                                    }):null}
                                                            </List>
                                                        </Collapse>
                                                        </>
                                                        :
                                                        null
                                                }
                                            </List>
                                        </Collapse>
                                    </div>
                                    :
                                    null
                            }
                            {
                                status.status==='active'&&['admin', 'реализатор', 'организатор', 'завсклада'].includes(status.role)?
                                    <div>
                                        <ListItem button key={'event'} onClick={()=>{collapse('Архив')}}>
                                            <ListItemIcon><Archive /></ListItemIcon>
                                            <ListItemText primary={'Архив'} />
                                            {secondMenuOpen['Архив'] ? <ExpandLess /> : <ExpandMore />}
                                        </ListItem>
                                        <Divider variant='inset'/>
                                        <Collapse in={secondMenuOpen['Архив']} timeout='auto' unmountOnExit>
                                            <List component='div' disablePadding>
                                                {
                                                    ['admin', 'организатор', 'завсклада'].includes(status.role)?
                                                        <>
                                                        <ListItem className={classes.nested} button key={'event'} onClick={()=>{
                                                            if(status.role==='организатор') {
                                                                props.history.push('/');
                                                                showDrawer(false);
                                                                getData({search: '', sort: '', page: 0, name: 'Накладная на вечерний возврат'});
                                                                setSelected(-1)
                                                            } else
                                                                collapse1('Накладная на вечерний возврат')
                                                        }}>
                                                            <ListItemIcon><Archive /></ListItemIcon>
                                                            <ListItemText primary={'Накладная на вечерний возврат'} />
                                                            {status.role==='организатор'?null:thirdMenuOpen['Накладная на вечерний возврат'] ? <ExpandLess /> : <ExpandMore />}
                                                        </ListItem>
                                                        <Divider variant='inset'/>
                                                        <Collapse in={thirdMenuOpen['Накладная на вечерний возврат']} timeout='auto' unmountOnExit>
                                                            <List component='div' disablePadding>
                                                                <ListItem className={selectedItem['Накладная на вечерний возвратВсе']?classes.nested1SelectedItem:classes.nested1} button key={'event'} onClick={()=>{
                                                                    props.history.push('/');
                                                                    showDrawer(false);
                                                                    getData({search: '', sort: '', page: 0, name: 'Накладная на вечерний возврат', region: ''});
                                                                    setSelected(-1);
                                                                    collapseSelectedItem('Накладная на вечерний возвратВсе')
                                                                }}>
                                                                    <ListItemIcon><All /></ListItemIcon>
                                                                    <ListItemText primary={'Все'} />
                                                                </ListItem>
                                                                <Divider variant='inset'/>
                                                                {regionList!=undefined&&regionList.length>0?
                                                                    regionList.map((element, idx)=>{
                                                                        return(
                                                                            <React.Fragment key={idx}>
                                                                            <ListItem className={selectedItem['Накладная на вечерний возврат'+element.guid]?classes.nested1SelectedItem:classes.nested1} button key={'event'} onClick={()=>{
                                                                                props.history.push('/');
                                                                                showDrawer(false);
                                                                                getData({search: '', sort: '', page: 0, name: 'Накладная на вечерний возврат', region: element.guid});
                                                                                setSelected(-1);
                                                                                collapseSelectedItem('Накладная на вечерний возврат'+element.guid)
                                                                            }}>
                                                                                <ListItemIcon><Archive /></ListItemIcon>
                                                                                <ListItemText primary={element.name} />
                                                                            </ListItem>
                                                                            <Divider variant='inset'/>
                                                                            </React.Fragment>
                                                                        )
                                                                    }):null}
                                                            </List>
                                                        </Collapse>
                                                        </>
                                                        :
                                                        null
                                                }
                                                {
                                                    ['admin', 'организатор', 'завсклада'].includes(status.role)?
                                                        <>
                                                        <ListItem className={classes.nested} button key={'event'} onClick={()=>{

                                                            if(status.role==='организатор') {
                                                                props.history.push('/');
                                                                showDrawer(false);
                                                                getData({search: '', sort: '', page: 0, name: 'Накладная на пустую тару'});
                                                                setSelected(-1)
                                                            } else
                                                                collapse1('Накладная на пустую тару')

                                                        }}>
                                                            <ListItemIcon><Archive /></ListItemIcon>
                                                            <ListItemText primary={'Накладная на пустую тару'} />
                                                            {status.role==='организатор'?null:thirdMenuOpen['Накладная на пустую тару'] ? <ExpandLess /> : <ExpandMore />}
                                                        </ListItem>
                                                        <Divider variant='inset'/>
                                                        <Collapse in={thirdMenuOpen['Накладная на пустую тару']} timeout='auto' unmountOnExit>
                                                            <List component='div' disablePadding>
                                                                <ListItem className={selectedItem['Накладная на пустую таруВсе']?classes.nested1SelectedItem:classes.nested1} button key={'event'} onClick={()=>{
                                                                    props.history.push('/');
                                                                    showDrawer(false);
                                                                    getData({search: '', sort: '', page: 0, name: 'Накладная на пустую тару', region: ''});
                                                                    setSelected(-1);
                                                                    collapseSelectedItem('Накладная на пустую таруВсе')
                                                                }}>
                                                                    <ListItemIcon><All /></ListItemIcon>
                                                                    <ListItemText primary={'Все'} />
                                                                </ListItem>
                                                                <Divider variant='inset'/>
                                                                {regionList!=undefined&&regionList.length>0?
                                                                    regionList.map((element, idx)=>{
                                                                        return(
                                                                            <React.Fragment key={idx}>
                                                                            <ListItem className={selectedItem['Накладная на пустую тару'+element.guid]?classes.nested1SelectedItem:classes.nested1} button key={'event'} onClick={()=>{
                                                                                props.history.push('/');
                                                                                showDrawer(false);
                                                                                getData({search: '', sort: '', page: 0, name: 'Накладная на пустую тару', region: element.guid});
                                                                                setSelected(-1);
                                                                                collapseSelectedItem('Накладная на пустую тару'+element.guid)
                                                                            }}>
                                                                                <ListItemIcon><Archive /></ListItemIcon>
                                                                                <ListItemText primary={element.name} />
                                                                            </ListItem>
                                                                            <Divider variant='inset'/>
                                                                            </React.Fragment>
                                                                        )
                                                                    }):null}
                                                            </List>
                                                        </Collapse>
                                                        </>
                                                        :
                                                        null
                                                }
                                                {
                                                    ['admin', 'организатор', 'завсклада'].includes(status.role)?
                                                        <>
                                                        <ListItem className={classes.nested} button key={'event'} onClick={()=>{

                                                            if(status.role==='организатор') {
                                                                props.history.push('/');
                                                                showDrawer(false);
                                                                getData({search: '', sort: '', page: 0, name: 'Накладная склад №1'});
                                                                setSelected(-1)
                                                            } else
                                                                collapse1('Накладная склад №1')

                                                        }}>
                                                            <ListItemIcon><Archive /></ListItemIcon>
                                                            <ListItemText primary={'Накладная склад №1'} />
                                                            {status.role==='организатор'?null:thirdMenuOpen['Накладная склад №1'] ? <ExpandLess /> : <ExpandMore />}
                                                        </ListItem>
                                                        <Divider variant='inset'/>
                                                        <Collapse in={thirdMenuOpen['Накладная склад №1']} timeout='auto' unmountOnExit>
                                                            <List component='div' disablePadding>
                                                                <ListItem className={selectedItem['Накладная склад №1Все']?classes.nested1SelectedItem:classes.nested1} button key={'event'} onClick={()=>{
                                                                    props.history.push('/');
                                                                    showDrawer(false);
                                                                    getData({search: '', sort: '', page: 0, name: 'Накладная склад №1', region: ''});
                                                                    setSelected(-1);
                                                                    collapseSelectedItem('Накладная склад №1Все')
                                                                }}>
                                                                    <ListItemIcon><All /></ListItemIcon>
                                                                    <ListItemText primary={'Все'} />
                                                                </ListItem>
                                                                <Divider variant='inset'/>
                                                                {regionList!=undefined&&regionList.length>0?
                                                                    regionList.map((element, idx)=>{
                                                                        return(
                                                                            <React.Fragment key={idx}>
                                                                            <ListItem className={selectedItem['Накладная склад №1'+element.guid]?classes.nested1SelectedItem:classes.nested1} button key={'event'} onClick={()=>{
                                                                                props.history.push('/');
                                                                                showDrawer(false);
                                                                                getData({search: '', sort: '', page: 0, name: 'Накладная склад №1', region: element.guid});
                                                                                setSelected(-1);
                                                                                collapseSelectedItem('Накладная склад №1'+element.guid)
                                                                            }}>
                                                                                <ListItemIcon><Archive /></ListItemIcon>
                                                                                <ListItemText primary={element.name} />
                                                                            </ListItem>
                                                                            <Divider variant='inset'/>
                                                                            </React.Fragment>
                                                                        )
                                                                    }):null}
                                                            </List>
                                                        </Collapse>
                                                        </>
                                                        :
                                                        null
                                                }
                                                {
                                                    ['admin', 'организатор', 'завсклада'].includes(status.role)?
                                                        <>
                                                        <ListItem className={classes.nested} button key={'event'} onClick={()=>{

                                                            if(status.role==='организатор') {
                                                                props.history.push('/');
                                                                showDrawer(false);
                                                                getData({search: '', sort: '', page: 0, name: 'Накладная склад №2'});
                                                                setSelected(-1)
                                                            } else
                                                                collapse1('Накладная склад №2')
                                                        }}>
                                                            <ListItemIcon><Archive /></ListItemIcon>
                                                            <ListItemText primary={'Накладная склад №2'} />
                                                            {status.role==='организатор'?null:thirdMenuOpen['Накладная склад №2'] ? <ExpandLess /> : <ExpandMore />}
                                                        </ListItem>
                                                        <Divider variant='inset'/>
                                                        <Collapse in={thirdMenuOpen['Накладная склад №2']} timeout='auto' unmountOnExit>
                                                            <List component='div' disablePadding>
                                                                <ListItem className={selectedItem['Накладная склад №2Все']?classes.nested1SelectedItem:classes.nested1} button key={'event'} onClick={()=>{
                                                                    props.history.push('/');
                                                                    showDrawer(false);
                                                                    getData({search: '', sort: '', page: 0, name: 'Накладная склад №2', region: ''});
                                                                    setSelected(-1);
                                                                    collapseSelectedItem('Накладная склад №2Все')
                                                                }}>
                                                                    <ListItemIcon><All /></ListItemIcon>
                                                                    <ListItemText primary={'Все'} />
                                                                </ListItem>
                                                                <Divider variant='inset'/>
                                                                {regionList!=undefined&&regionList.length>0?
                                                                    regionList.map((element, idx)=>{
                                                                        return(
                                                                            <React.Fragment key={idx}>
                                                                            <ListItem className={selectedItem['Накладная склад №2'+element.guid]?classes.nested1SelectedItem:classes.nested1} button key={'event'} onClick={()=>{
                                                                                props.history.push('/');
                                                                                showDrawer(false);
                                                                                getData({search: '', sort: '', page: 0, name: 'Накладная склад №2', region: element.guid});
                                                                                setSelected(-1);
                                                                                collapseSelectedItem('Накладная склад №2'+element.guid)
                                                                            }}>
                                                                                <ListItemIcon><Archive /></ListItemIcon>
                                                                                <ListItemText primary={element.name} />
                                                                            </ListItem>
                                                                            <Divider variant='inset'/>
                                                                            </React.Fragment>
                                                                        )
                                                                    }):null}
                                                            </List>
                                                        </Collapse>
                                                        </>
                                                        :
                                                        null
                                                }
                                                {
                                                    ['admin', 'организатор', 'завсклада'].includes(status.role)?
                                                        <>
                                                        <ListItem className={classes.nested} button key={'event'} onClick={()=>{
                                                            if(status.role==='организатор') {
                                                                props.history.push('/');
                                                                showDrawer(false);
                                                                getData({search: '', sort: '', page: 0, name: 'Отчет организатора'});
                                                                setSelected(-1)
                                                            } else
                                                                collapse1('Отчет организатора')
                                                        }}>
                                                            <ListItemIcon><Archive /></ListItemIcon>
                                                            <ListItemText primary={'Отчет организатора'} />
                                                            {status.role==='организатор'?null:thirdMenuOpen['Отчет организатора'] ? <ExpandLess /> : <ExpandMore />}
                                                        </ListItem>
                                                        <Divider variant='inset'/>
                                                        <Collapse in={thirdMenuOpen['Отчет организатора']} timeout='auto' unmountOnExit>
                                                            <List component='div' disablePadding>
                                                                <ListItem className={selectedItem['Отчет организатораВсе']?classes.nested1SelectedItem:classes.nested1} button key={'event'} onClick={()=>{
                                                                    props.history.push('/');
                                                                    showDrawer(false);
                                                                    getData({search: '', sort: '', page: 0, name: 'Отчет организатора', region: ''});
                                                                    setSelected(-1);
                                                                    collapseSelectedItem('Отчет организатораВсе')
                                                                }}>
                                                                    <ListItemIcon><All /></ListItemIcon>
                                                                    <ListItemText primary={'Все'} />
                                                                </ListItem>
                                                                <Divider variant='inset'/>
                                                                {regionList!=undefined&&regionList.length>0?
                                                                    regionList.map((element, idx)=>{
                                                                        return(
                                                                            <React.Fragment key={idx}>
                                                                            <ListItem className={selectedItem['Отчет организатора'+element.guid]?classes.nested1SelectedItem:classes.nested1} button key={'event'} onClick={()=>{
                                                                                props.history.push('/');
                                                                                showDrawer(false);
                                                                                getData({search: '', sort: '', page: 0, name: 'Отчет организатора', region: element.guid});
                                                                                setSelected(-1);
                                                                                collapseSelectedItem('Отчет организатора'+element.guid)
                                                                            }}>
                                                                                <ListItemIcon><Archive /></ListItemIcon>
                                                                                <ListItemText primary={element.name} />
                                                                            </ListItem>
                                                                            <Divider variant='inset'/>
                                                                            </React.Fragment>
                                                                        )
                                                                    }):null}
                                                            </List>
                                                        </Collapse>
                                                        </>
                                                        :
                                                        null
                                                }
                                                {
                                                    ['admin', 'реализатор', 'организатор', 'завсклада'].includes(status.role)?
                                                        <>
                                                        <ListItem className={classes.nested} button key={'event'} onClick={()=>{

                                                            if(status.role==='реализатор') {
                                                                props.history.push('/');
                                                                showDrawer(false);
                                                                getData({search: '', sort: '', page: 0, name: 'Отчет реализатора'});
                                                                setSelected(-1)
                                                            } else
                                                                collapse1('Отчет реализатора')
                                                          }}>
                                                            <ListItemIcon><Archive /></ListItemIcon>
                                                            <ListItemText primary={'Отчет реализатора'} />
                                                            {status.role==='реализатор'?null:thirdMenuOpen['Отчет реализатора'] ? <ExpandLess /> : <ExpandMore />}
                                                        </ListItem>
                                                        <Divider variant='inset'/>
                                                        <Collapse in={thirdMenuOpen['Отчет реализатора']} timeout='auto' unmountOnExit>
                                                            <List component='div' disablePadding>
                                                                <ListItem className={selectedItem['Отчет реализатораВсе']?classes.nested1SelectedItem:classes.nested1} button key={'event'} onClick={async()=>{
                                                                    if(status.role==='организатор') {
                                                                        props.history.push('/');
                                                                        showDrawer(false);
                                                                        getData({search: '', sort: '', page: 0, name: 'Отчет реализатора', point: ''});
                                                                        setSelected(-1)
                                                                    } else {
                                                                        props.history.push('/');
                                                                        showDrawer(false);
                                                                        getData({search: '', sort: '', page: 0, name: 'Отчет реализатора', region: '', point: ''});
                                                                        setSelected(-1);
                                                                        collapseSelectedItem('Отчет реализатораВсе')
                                                                    }
                                                                    collapseSelectedItem('Отчет реализатораВсе')

                                                                }}>
                                                                    <ListItemIcon><All /></ListItemIcon>
                                                                    <ListItemText primary={'Все'} />
                                                                </ListItem>
                                                                <Divider variant='inset'/>
                                                                {(status.role==='организатор'?pointList[profile.guidRegion]:regionList)!=undefined&&(status.role==='организатор'?pointList[profile.guidRegion]:regionList).length>0?
                                                                    (status.role==='организатор'?pointList[profile.guidRegion]:regionList).map((element, idx)=>{
                                                                        return(
                                                                            <React.Fragment key={idx}>
                                                                            <ListItem className={selectedItem['Отчет реализатора'+element.guid]?classes.nested1SelectedItem:classes.nested1} button key={'event'} onClick={async()=>{
                                                                                if(status.role==='организатор') {
                                                                                    props.history.push('/');
                                                                                    showDrawer(false);
                                                                                    getData({search: '', sort: '', page: 0, name: 'Отчет реализатора', point: element.guid});
                                                                                    setSelected(-1)
                                                                                } else {
                                                                                    setSelectedRegion(element.guid)
                                                                                    collapse2('Отчет реализатора'+element.guid)
                                                                                }
                                                                                collapseSelectedItem('Отчет реализатора'+element.guid)

                                                                            }}>
                                                                                <ListItemIcon><Archive /></ListItemIcon>
                                                                                <ListItemText primary={element.name} />
                                                                                {status.role==='организатор'?null:fourthMenuOpen['Отчет реализатора'+element.guid] ? <ExpandLess /> : <ExpandMore />}
                                                                            </ListItem>
                                                                            <Divider variant='inset'/>
                                                                            {selectedRegion===element.guid?
                                                                                <Collapse in={fourthMenuOpen['Отчет реализатора'+element.guid]} timeout='auto' unmountOnExit>
                                                                                    <List component='div' disablePadding>
                                                                                        <ListItem className={selectedItem['Отчет реализатораВсеВсе']?classes.nested2SelectedItem:classes.nested2} button key={'event'} onClick={()=>{
                                                                                            props.history.push('/');
                                                                                            showDrawer(false);
                                                                                            getData({search: '', sort: '', page: 0, name: 'Отчет реализатора', region: element.guid, point: ''});
                                                                                            setSelected(-1);
                                                                                            collapseSelectedItem('Отчет реализатораВсеВсе')
                                                                                        }}>
                                                                                            <ListItemIcon><All /></ListItemIcon>
                                                                                            <ListItemText primary={'Все'} />
                                                                                        </ListItem>
                                                                                        <Divider variant='inset'/>
                                                                                        {pointList[selectedRegion]!=undefined&&pointList[selectedRegion].length>0?
                                                                                            pointList[selectedRegion].map((element1, idx)=>{
                                                                                                return(
                                                                                                    <React.Fragment key={idx}>
                                                                                                    <ListItem className={selectedItem['Отчет реализатора'+element1.guid]?classes.nested2SelectedItem:classes.nested2} button key={'event'} onClick={()=>{
                                                                                                        props.history.push('/');
                                                                                                        showDrawer(false);
                                                                                                        getData({search: '', sort: '', page: 0, name: 'Отчет реализатора', region: element.guid, point: element1.guid});
                                                                                                        setSelected(-1);
                                                                                                        collapseSelectedItem('Отчет реализатора'+element1.guid)
                                                                                                    }}>
                                                                                                        <ListItemIcon><Archive /></ListItemIcon>
                                                                                                        <ListItemText primary={element1.name} />
                                                                                                    </ListItem>
                                                                                                    <Divider variant='inset'/>
                                                                                                    </React.Fragment>
                                                                                                )
                                                                                            }):null}
                                                                                    </List>
                                                                                </Collapse>
                                                                                :
                                                                                null
                                                                            }

                                                                            </React.Fragment>
                                                                        )
                                                                    }):null}
                                                            </List>
                                                        </Collapse>
                                                        </>
                                                        :
                                                        null
                                                }
                                            </List>
                                        </Collapse>
                                    </div>
                                    :
                                    null
                            }
                            {
                                status.status==='active'&&['admin', 'реализатор', 'организатор'].includes(status.role)?
                                    <div>
                                        <ListItem button key={'event'} onClick={()=>{collapse('Статистика')}}>
                                            <ListItemIcon><Assessment /></ListItemIcon>
                                            <ListItemText primary={'Статистика'} />
                                            {secondMenuOpen['Статистика'] ? <ExpandLess /> : <ExpandMore />}
                                        </ListItem>
                                        <Divider variant='inset'/>
                                        <Collapse in={secondMenuOpen['Статистика']} timeout='auto' unmountOnExit>
                                            <List component='div' disablePadding>
                                                {
                                                    ['admin', 'организатор'].includes(status.role)?
                                                        <>
                                                        <ListItem className={name==='План'&&currentPath===''?classes.nestedSelectedItem:classes.nested} button key={'event'} onClick={()=>{collapse1('план');props.history.push('/');showDrawer(false); getData({search: '', sort: '', page: 0, name: 'План'}); setSelected(-1)}}>
                                                            <ListItemIcon><Event /></ListItemIcon>
                                                            <ListItemText primary={'План'} />
                                                        </ListItem>
                                                        <Divider variant='inset'/>
                                                        </>
                                                        :
                                                        null
                                                }
                                                {
                                                    ['admin'].includes(status.role)?
                                                        <>
                                                        <ListItem className={currentPath==='statistic'?classes.nestedSelectedItem:classes.nested} button key={'event'} onClick={()=>{collapse1('статистика');props.history.push('/statistic');showDrawer(false);setSelected(-1)}}>
                                                            <ListItemIcon><Timeline /></ListItemIcon>
                                                            <ListItemText primary={'Статистика'} />
                                                        </ListItem>
                                                        <Divider variant='inset'/>
                                                        </>
                                                        :
                                                        null
                                                }
                                                {
                                                    ['admin', 'организатор'].includes(status.role)?
                                                        <>
                                                        <ListItem className={currentPath==='ro'?classes.nestedSelectedItem:classes.nested} button key={'event'} onClick={()=>{collapse1('рейтингРегионов');props.history.push('/ro');showDrawer(false);setSelected(-1)}}>
                                                            <ListItemIcon><List1 /></ListItemIcon>
                                                            <ListItemText primary={'Рейтинг регионов'} />
                                                        </ListItem>
                                                        <Divider variant='inset'/>
                                                        </>
                                                        :
                                                        null
                                                }
                                                {
                                                    ['admin', 'организатор', 'реализатор'].includes(status.role)?
                                                        <>
                                                        <ListItem className={currentPath==='rr'?classes.nestedSelectedItem:classes.nested} button key={'event'} onClick={()=>{collapse1('рейтингТочек');props.history.push('/rr');showDrawer(false);setSelected(-1)}}>
                                                            <ListItemIcon><List1 /></ListItemIcon>
                                                            <ListItemText primary={'Рейтинг точек'} />
                                                        </ListItem>
                                                        <Divider variant='inset'/>
                                                        </>
                                                        :
                                                        null
                                                }
                                                {
                                                    ['admin', 'организатор', 'реализатор'].includes(status.role)?
                                                        <>
                                                        <ListItem className={currentPath==='geo'?classes.nestedSelectedItem:classes.nested} button key={'event'} onClick={()=>{collapse1('геолокация');props.history.push('/geo');showDrawer(false);setSelected(-1)}}>
                                                            <ListItemIcon><GpsFixed/></ListItemIcon>
                                                            <ListItemText primary={'Геолокация'} />
                                                        </ListItem>
                                                        <Divider variant='inset'/>
                                                        </>
                                                        :
                                                        null
                                                }
                                            </List>
                                        </Collapse>
                                    </div>
                                    :
                                    null
                            }
                            {
                                status.status==='active'&&['admin', 'реализатор', 'организатор', 'завсклада'].includes(status.role)?
                                    <div>
                                        <ListItem button key={'event'} onClick={()=>{collapse('информация')}}>
                                            <ListItemIcon><Info /></ListItemIcon>
                                            <ListItemText primary={'Информация'} />
                                            {secondMenuOpen['информация'] ? <ExpandLess /> : <ExpandMore />}
                                        </ListItem>
                                        <Divider variant='inset'/>
                                        <Collapse in={secondMenuOpen['информация']} timeout='auto' unmountOnExit>
                                            <List component='div' disablePadding>
                                                <ListItem className={(name==='Блог'&&currentPath===''&&status.role==='admin')||currentPath=='blog'?classes.nestedSelectedItem:classes.nested} button key={'event'} onClick={()=>{
                                                    if(status.role === 'admin') {
                                                        props.history.push('/');
                                                        getData({search: '', sort: '', page: 0, name: 'Блог'});
                                                    } else {
                                                        props.history.push('/blog');
                                                    }
                                                    showDrawer(false);
                                                    collapse1('blog');

                                                    setSelected(-1);
                                                }}>
                                                    <ListItemIcon><ArtTrack /></ListItemIcon>
                                                    <ListItemText primary={'Новости'} />
                                                </ListItem>
                                                <Divider variant='inset'/>
                                                <ListItem className={(name==='FAQ'&&currentPath===''&&status.role==='admin')||currentPath=='FAQ'?classes.nestedSelectedItem:classes.nested} button key={'event'} onClick={()=>{
                                                    if(status.role === 'admin') {
                                                        props.history.push('/');
                                                        getData({search: '', sort: '', page: 0, name: 'FAQ'});
                                                    } else {
                                                        props.history.push('/FAQ');
                                                    }
                                                    collapse1('FAQ');
                                                    showDrawer(false);

                                                    setSelected(-1);
                                                }}>
                                                    <ListItemIcon><QuestionAnswer /></ListItemIcon>
                                                    <ListItemText primary={'FAQ'} />
                                                </ListItem>
                                                <Divider variant='inset'/>
                                            </List>
                                        </Collapse>
                                    </div>
                                    :
                                    null
                            }
                        </List>
                        :
                        null
                    }
                </Drawer>
            </div>
        );
    }
)

function mapStateToProps (state) {
    return {
        app: state.app,
        user: state.user,
        table: state.table
    }
}

function mapDispatchToProps(dispatch) {
    return {
        appActions: bindActionCreators(appActions, dispatch),
        tableActions: bindActionCreators(tableActions, dispatch),
    }
}

MyDrawer.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default  connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(MyDrawer));