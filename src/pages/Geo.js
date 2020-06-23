import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as tableActions from '../redux/actions/table'
import * as mini_dialogActions from '../redux/actions/mini_dialog'
import Button from '@material-ui/core/Button';
import { mainWindow } from '../App'
import Fab from '@material-ui/core/Fab';
import { DatePicker } from 'material-ui-pickers';
import { Map, YMaps, Placemark } from 'react-yandex-maps';
import GpsFixed from '@material-ui/icons/GpsFixed';
import * as snackbarActions from '../redux/actions/snackbar'

export const datePicker = React.createRef();
const marginFab = mainWindow===undefined||mainWindow.current.offsetWidth>800? 20: 10;
const width = mainWindow===undefined||mainWindow.current.offsetWidth>800? 500: 240;
const styles = theme => ({
    fab: {
        position: 'fixed',
        bottom: marginFab,
        right: marginFab
    },
    fab2: {
        position: 'fixed',
        bottom: marginFab+76,
        right: marginFab
    },
    button: {
        width: '200px',
        margin: theme.spacing.unit,
    },
    textFieldDate: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: width/2,
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: '33.33%',
        flexShrink: 0,
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    },
});

const Plan = React.memo(
    (props) =>{
        const { classes } = props;
        const { showSelectRegion, showSelectPoint } = props.mini_dialogActions;
        const { setSelectedRegionGeo, setSelectedPointGeo } = props.tableActions;
        const { showSnackBar } = props.snackbarActions;
        const { regionGeo, pointGeo  } = props.table;
        const { status } = props.user;
        const { profile } = props.app;
        let [date, setDate] = useState(new Date());
        let [list, setList] = useState([]);
        useEffect( ()=>{
            (async ()=> {
                if((pointGeo.guid).length!==0&&(regionGeo.guid).length!==0){
                    let data = await tableActions.getDataSimple({name: 'Геолокация', data: {date: (JSON.stringify(date)).split('T')[0], guidRegion: regionGeo.guid, guidPoint: pointGeo.guid}})
                    if(data.length===0){
                        setList([{point: pointGeo.name, geo: '42.8700000, 74.5900000', region: regionGeo.name, guidPoint: pointGeo.guid, guidRegion: regionGeo.guid, date: (JSON.stringify(date)).split('T')[0]}])
                    }
                    else {
                        setList(data)
                    }
                }
                else {
                    setList(await tableActions.getDataSimple({
                        name: 'Геолокация',
                        data: {date: (JSON.stringify(date)).split('T')[0], guidRegion: regionGeo.guid, guidPoint: pointGeo.guid}
                    }))
                }
            })();
        },[pointGeo, regionGeo, date])
        useEffect( ()=>{
            (async ()=> {
                if (!(status.status==='active'&&['admin', 'организатор', 'реализатор'].includes(status.role))) {
                    props.history.push('/')
                }
                if (status.role!==undefined&&'admin'!==status.role) {
                    setSelectedRegionGeo({name: profile.region, guid: profile.guidRegion});
                    if ('организатор'!==status.role)
                        setSelectedPointGeo({name: profile.point, guid: profile.guidPoint});
                }
            })();
        },[])
        let [size, setSize] = useState(600);
        useEffect(()=>{(async ()=>{
            setSize(mainWindow.current.offsetWidth>1000? [1000, 500]: [mainWindow.current.offsetWidth, 300])
        })()},[]);
        let dragend = (e) => {
            let geo = e.get('target').geometry.getCoordinates()
            saveGeo(geo[0]+', '+geo[1])
        }
        let getGeo = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position)=>{
                    saveGeo(position.coords.latitude+', '+position.coords.longitude)
                });
            } else {
                showSnackBar('Геолокация не поддерживается')
            }
        }
        let saveGeo = async(geo) => {
            setList(await tableActions.getDataSimple({name: 'ГеолокацияСохранить', data: {
                point: pointGeo.name, geo: geo, region: regionGeo.name, date: (JSON.stringify(date)).split('T')[0], guidRegion: regionGeo.guid, guidPoint: pointGeo.guid}}))
        }
        return (
             <YMaps>
                <center>
                    <br/>
                    <h1>Геолокация</h1>
                    <br/>
                    <DatePicker
                        views={['year', 'month', 'day']}
                        label='Дата'
                        className={classes.textField}
                        value={date}
                        onChange={setDate}
                    />
                    <br/>
                    <Button variant='outlined' onClick={()=>{if('admin'===status.role)showSelectRegion()}} className={classes.button}>
                        {regionGeo.name}
                    </Button>
                    <Button variant='outlined' onClick={()=>{if(['admin', 'организатор'].includes(status.role))showSelectPoint()}} className={classes.button}>
                        {pointGeo.name}
                    </Button>
                    <br/>
                    <Map height={size[1]} width={size[0]} defaultState={{ center: [42.8700000, 74.5900000], zoom: 12 }} >
                        {list!=undefined&&list.length>0?
                            list.map((element, idx)=> {
                                return(
                                    <Placemark onDragEnd={dragend} key={idx} options={{draggable: ((pointGeo.guid).length!==0&&(pointGeo.guid).length!==0), iconColor: '#252850'}} properties={{iconCaption: element.point}} geometry={element.geo.split(', ')} />
                                )}):null}
                    </Map>
                </center>
                 {(pointGeo.guid).length!==0&&(pointGeo.guid).length!==0?
                     <Fab color='primary' aria-label='Найти геолокацию' className={classes.fab} onClick={getGeo}>
                         <GpsFixed/>
                     </Fab>
                     :null}
             </YMaps>
        );
  })

function mapStateToProps (state) {
    return {
        table: state.table,
        user: state.user,
        app: state.app,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        tableActions: bindActionCreators(tableActions, dispatch),
        snackbarActions: bindActionCreators(snackbarActions, dispatch),
        mini_dialogActions: bindActionCreators(mini_dialogActions, dispatch),
    }
}

Event.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Plan));
