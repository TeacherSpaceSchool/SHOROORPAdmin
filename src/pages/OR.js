import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as tableActions from '../redux/actions/table'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom'
import { mainWindow } from '../App'
import { month, checkInt } from '../redux/constants/other'
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { DatePicker } from 'material-ui-pickers';
export const datePicker = React.createRef();

const width = mainWindow===undefined||mainWindow.current.offsetWidth>800? 500: 240;
const width1 = mainWindow===undefined||mainWindow.current.offsetWidth>800? 240: 120;
const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
    },
    textFieldSmall: {
        display: 'inline-block',
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: width1
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
        useEffect( ()=>{
            async function fetchData() {
                if (!(status.status==='active'&&['admin', 'организатор', 'реализатор'].includes(status.role))) {
                props.history.push('/')
            }
                let _data
                _data = await tableActions.getDataSimple({name: 'Цена1'})
                setPrice(_data)
                if(selected===-1) {
                    if(status.role==='реализатор'){
                        _data = await tableActions.getDataSimple({name: 'РеализаторПоID'})
                        if(_data!==undefined) {
                            let date = new Date()
                            date = JSON.stringify(date).split('-')
                            date = date[2].split('T')[0] + ' ' + month[parseInt(date[1]) - 1] + ' ' + date[0].replace('"', '')
                            let _data1 = await tableActions.getDataSimple({
                                name: 'Отчет реализатора по данным',
                                data: {data: date, realizator: _data.guid, region: _data.guidRegion, point: _data.guidPoint}})
                            if (_data1 !== undefined && _data1 !== '') {
                                setDate(_data1.data)
                                setRealizator(_data1.realizator)
                                setOrganizator(_data1.organizator)
                                setRegion(_data1.region)
                                setPoint(_data1.point)
                                setGuidOrganizator(_data1.guidOrganizator)
                                setGuidRegion(_data1.guidRegion)
                                setGuidRealizator(_data1.guidRealizator)
                                setGuidPoint(_data1.guidPoint)
                                setNakladnaya(JSON.parse(_data1.dataTable))
                                setId(_data1._id)


                            } else {
                                setRegion(_data.region)
                                setPoint(_data.point)
                                setRealizator(_data.name)
                                setOrganizator(_data.organizator)
                                setGuidOrganizator(_data.guidOrganizator)
                                setGuidRegion(_data.guidRegion)
                                setGuidRealizator(_data.guid)
                                setGuidPoint(_data.guidPoint)
                                let date = new Date()
                                date = JSON.stringify(date).split('-')
                                date = date[2].split('T')[0] + ' ' + month[parseInt(date[1]) - 1] + ' ' + date[0].replace('"', '')
                                setDate(date)
                            }

                        }

                    } else if (status.role==='организатор') {
                        let date = new Date()
                        date = JSON.stringify(date).split('-')
                        date = date[2].split('T')[0]+' '+month[parseInt(date[1])-1]+' '+date[0].replace('"', '')
                        setDate(date)
                    }
                }
                else {
                    _data = await tableActions.getDataSimple({name: 'Отчет реализатора по данным',
                        data: {data: data[selected][1], realizator:  data[selected][4], region: data[selected][2], point: data[selected][3]}})
                    if(_data!==undefined){
                        setDate(_data.data)
                        setRealizator(_data.realizator)
                        setOrganizator(_data.organizator)
                        setRegion(_data.region)
                        setPoint(_data.point)
                        setGuidOrganizator(_data.guidOrganizator)
                        setGuidRegion(_data.guidRegion)
                        setGuidRealizator(_data.guidRealizator)
                        setGuidPoint(_data.guidPoint)
                        setNakladnaya(JSON.parse(_data.dataTable))
                        setId(_data._id)
                    }
                    let date1 = new Date()
                    date1 = JSON.stringify(date1).split('-')
                    date1 = date1[2].split('T')[0]+' '+month[parseInt(date1[1])-1]+' '+date1[0].replace('"', '')
                    setCheckDate(date1!==_data.data)
                }
            }
            fetchData();
        },[])
        let [checkDate, setCheckDate] = useState(false);
        const { setSelected, addData, setData, setSelectedRegion, setSelectedPoint} = props.tableActions;
        const { selected, data, point1 } = props.table;
        const { classes } = props;
        const { status } = props.user;
        let [realizator, setRealizator] = useState('');
        let [organizator, setOrganizator] = useState('');
        let [region, setRegion] = useState('');
        let [guidOrganizator, setGuidOrganizator] = useState('');
        let [guidRegion, setGuidRegion] = useState('');
        let [guidRealizator, setGuidRealizator] = useState('');
        let [guidPoint, setGuidPoint] = useState('');
        let [price, setPrice] = useState({});
        let [point, setPoint] = useState('');
        useEffect( ()=>{
            if(guidRegion!==undefined&&guidRegion.length>0)
                setSelectedRegion(guidRegion)
        },[guidRegion])
        useEffect( ()=>{
            if(guidPoint!==undefined&&guidPoint.length>0)
                setSelectedPoint(guidPoint)
        },[guidPoint])
        let [date, setDate] = useState('');
        let [disabled, setDisabled] = useState(false);
        let [id, setId] = useState('');
        let [date1, setDate1] = useState(new Date());
        let handleDate1 =  async (date) => {
            setNakladnaya({
                'vydano': {
                    'r':
                        {'time':'', 'ml':'', 'chl':'', 'kl':'', 'sl':'', 's02':'', 's04':'', 'b':'', 'o': false, 'p': false},
                    'd1':
                        {'time':'', 'ml':'', 'chl':'', 'kl':'', 'sl':'', 's02':'', 's04':'', 'b':'', 'o': false, 'p': false},
                    'd2':
                        {'time':'', 'ml':'', 'chl':'', 'kl':'', 'sl':'', 's02':'', 's04':'', 'b':'', 'o': false, 'p': false},
                    'd3':
                        {'time':'', 'ml':'', 'chl':'', 'kl':'', 'sl':'', 's02':'', 's04':'', 'b':'', 'o': false, 'p': false},
                    'i':
                        {'time':'', 'ml':'', 'chl':'', 'kl':'', 'sl':'', 's02':'', 's04':'', 'b':'', 'o': false, 'p': false},
                },
                'vozvrat': {
                    'v':
                        {'time':'', 'mn1':'', 'ml1':'', 'mn':'', 'ml':'', 'chn25':'', 'chn10':'', 'chl':'', 'chn251':'', 'chn101':'', 'chl1':'', 'kn':'', 'kl':'', 'kn1':'', 'kl1':'', 'sl':'', 's02':'', 's04':'', 'b':'', 'o': false, 'p': false},
                    's':
                        {'time':'', 'ml':'', 'chl':'', 'kl':'', 'sl':'', 's02':'', 's04':'', 'b':'', 'o': false, 'p': false},
                    'p':
                        {'time':'', 'ml':'', 'chl':'', 'kl':'', 'sl':'', 's02':'', 's04':'', 'b':'', 'o': false, 'p': false},
                    'virychka':
                        {'time':'', 'ml':'', 'chl':'', 'kl':'', 'sl':'', 's02':'', 's04':'', 'b':'', 'o': false, 'p': false},
                },
                'i': {
                    'iv':'',
                    'm':'',
                    'o': 200,
                    'n':'',
                    'inc':'',
                    'fv': -200,
                },
                'r':'',
                'm': false,
            });
            setId('')
            setDate1(date)
            date = JSON.stringify(date).split('-')
            date = date[2].split('T')[0]+' '+month[parseInt(date[1])-1]+' '+date[0].replace('"', '')
            setDate(date)
        };
        let [nakladnaya, setNakladnaya] = useState({
            'vydano': {
                'r':
                    {'time':'', 'ml':'', 'chl':'', 'kl':'', 'sl':'', 's02':'', 's04':'', 'b':'', 'o': false, 'p': false},
                'd1':
                    {'time':'', 'ml':'', 'chl':'', 'kl':'', 'sl':'', 's02':'', 's04':'', 'b':'', 'o': false, 'p': false},
                'd2':
                    {'time':'', 'ml':'', 'chl':'', 'kl':'', 'sl':'', 's02':'', 's04':'', 'b':'', 'o': false, 'p': false},
                'd3':
                    {'time':'', 'ml':'', 'chl':'', 'kl':'', 'sl':'', 's02':'', 's04':'', 'b':'', 'o': false, 'p': false},
                'i':
                    {'time':'', 'ml':'', 'chl':'', 'kl':'', 'sl':'', 's02':'', 's04':'', 'b':'', 'o': false, 'p': false},
            },
            'vozvrat': {
                'v':
                    {'time':'', 'mn1':'', 'ml1':'', 'mn':'', 'ml':'', 'chn25':'', 'chn10':'', 'chl':'', 'chn251':'', 'chn101':'', 'chl1':'', 'kn':'', 'kl':'', 'kn1':'', 'kl1':'', 'sl':'', 's02':'', 's04':'', 'b':'', 'o': false, 'p': false},
                's':
                    {'time':'', 'ml':'', 'chl':'', 'kl':'', 'sl':'', 's02':'', 's04':'', 'b':'', 'o': false, 'p': false},
                'p':
                    {'time':'', 'ml':'', 'chl':'', 'kl':'', 'sl':'', 's02':'', 's04':'', 'b':'', 'o': false, 'p': false},
                'virychka':
                    {'time':'', 'ml':'', 'chl':'', 'kl':'', 'sl':'', 's02':'', 's04':'', 'b':'', 'o': false, 'p': false},
            },
            'i': {
                'iv':'',
                'm':'',
                'o': 200,
                'n':'',
                'inc':'',
                'fv': -200,
            },
            'r':'',
            'm': false,
        });
        let handleVozvrat =  (event, type, what) => {
            if(!nakladnaya['vozvrat'][type]['o']||!nakladnaya['m']) {
                nakladnaya= {...nakladnaya}
                if(what!=='time'&&what!=='mn'&&what!=='chn25'&&what!=='chn10'&&what!=='kn'&&what!=='mn1'&&what!=='chn251'&&what!=='chn101'&&what!=='kn1'){
                    let litr = parseInt(event.target.value)
                    if (isNaN(litr)) {
                        nakladnaya['vozvrat'][type][what] = ''
                    } else {
                        nakladnaya['vozvrat'][type][what] = litr
                    }
                    nakladnaya['vozvrat']['p'][what.substring(0,what.charAt(what.length-1)==='1'?what.length-1:what.length)] = checkInt(nakladnaya['vydano']['i'][what.substring(0,what.charAt(what.length-1)==='1'?what.length-1:what.length)]) - (checkInt(nakladnaya['vozvrat']['v'][what.substring(0,what.charAt(what.length-1)==='1'?what.length-1:what.length)]) + checkInt(nakladnaya['vozvrat']['v'][what.substring(0,what.charAt(what.length-1)==='1'?what.length-1:what.length)+'1']) + checkInt(nakladnaya['vozvrat']['s'][what.substring(0,what.charAt(what.length-1)==='1'?what.length-1:what.length)]))
                    let prodanolitrov =  checkInt(nakladnaya['vozvrat']['p']['ml']) + checkInt(nakladnaya['vozvrat']['p']['chl']) + checkInt(nakladnaya['vozvrat']['p']['kl'])
                    prodanolitrov =  prodanolitrov * 1.1
                    let prodanolitrovemk =  checkInt(nakladnaya['vozvrat']['p']['s02']*0.2) + checkInt(nakladnaya['vozvrat']['p']['s04']*0.4) + checkInt(nakladnaya['vozvrat']['p']['b'])
                    if (prodanolitrovemk > prodanolitrov){
                        let rastrata  = prodanolitrovemk -  prodanolitrov
                        nakladnaya['r'] = rastrata.toFixed(1)
                    } else
                        nakladnaya['r'] = 0
                    nakladnaya['vozvrat']['virychka']['ml'] = checkInt(nakladnaya['vozvrat']['p']['ml']) * (price['Максым']!==undefined?parseInt(price['Максым']):0)
                    nakladnaya['vozvrat']['virychka']['chl'] = checkInt(nakladnaya['vozvrat']['p']['chl']) * (price['Чалап']!==undefined?parseInt(price['Чалап']):0)
                    nakladnaya['vozvrat']['virychka']['kl'] = checkInt(nakladnaya['vozvrat']['p']['kl']) * (price['Квас']!==undefined?parseInt(price['Квас']):0)
                    nakladnaya['vozvrat']['virychka']['sl'] = checkInt(nakladnaya['vozvrat']['p']['sl']) * (price['Стакан Легенда']!==undefined?parseInt(price['Стакан Легенда']):0)
                    nakladnaya['i']['iv'] = checkInt(nakladnaya['vozvrat']['virychka']['ml']) + checkInt(nakladnaya['vozvrat']['virychka']['chl']) + checkInt(nakladnaya['vozvrat']['virychka']['kl']) + checkInt(nakladnaya['vozvrat']['virychka']['sl'])
                }
                else {
                    nakladnaya['vozvrat'][type][what] = event.target.value
                }
                if(nakladnaya['vozvrat'][type]['time'].length===0){
                    let date = new Date()
                    let hours = date.getHours()
                    let minute = date.getMinutes()
                    if(minute>2){
                        minute = minute - 3
                        minute = minute.toString()
                        if(minute.length===1){
                            minute = '0'+minute
                        }
                    } else {
                        hours = hours - 1
                        if(minute===0){
                            minute = '57'
                        } else if(minute===1){
                            minute = '58'
                        } else if(minute===2){
                            minute = '59'
                        }
                    }
                    date = hours.toString()+':'+minute
                    nakladnaya['vozvrat'][type]['time'] = date
                }
                nakladnaya['i']['fv'] = checkInt(nakladnaya['i']['iv']) - checkInt(nakladnaya['i']['m']) - checkInt(nakladnaya['i']['o']) - checkInt(nakladnaya['i']['n']) - checkInt(nakladnaya['i']['inc'])
                setNakladnaya(nakladnaya)
            }
        };
        let handleVydano =  (event, type, what) => {
            if(!nakladnaya['vydano'][type]['o']||!nakladnaya['m']) {
                nakladnaya= {...nakladnaya}
                if(what!=='time'){
                    let litr = parseInt(event.target.value)
                    if (isNaN(litr)) {
                        nakladnaya['vydano'][type][what] = ''
                    } else {
                        if(nakladnaya['vydano'][type]['time'].length===0){
                            let date = new Date()
                            let hours = date.getHours()
                            let minute = date.getMinutes()
                            if(minute>2){
                                minute = minute - 3
                                minute = minute.toString()
                                if(minute.length===1){
                                    minute = '0'+minute
                                }
                            } else {
                                hours = hours - 1
                                if(minute===0){
                                    minute = '57'
                                } else if(minute===1){
                                    minute = '58'
                                } else if(minute===2){
                                    minute = '59'
                                }
                            }
                            date = hours.toString()+':'+minute
                            nakladnaya['vydano'][type]['time'] = date
                        }
                        nakladnaya['vydano'][type][what] = litr
                    }
                    nakladnaya['vydano']['i'][what] = checkInt(nakladnaya['vydano']['r'][what]) + checkInt(nakladnaya['vydano']['d1'][what]) + checkInt(nakladnaya['vydano']['d2'][what]) + checkInt(nakladnaya['vydano']['d3'][what])
                    nakladnaya['vozvrat']['p'][what] = checkInt(nakladnaya['vydano']['i'][what]) - (checkInt(nakladnaya['vozvrat']['v'][what]) + checkInt(nakladnaya['vozvrat']['v'][what+'1']) + checkInt(nakladnaya['vozvrat']['s'][what]))
                    nakladnaya['vozvrat']['virychka']['ml'] = checkInt(nakladnaya['vozvrat']['p']['ml']) * (price['Максым']!==undefined?parseInt(price['Максым']):0)
                    nakladnaya['vozvrat']['virychka']['chl'] = checkInt(nakladnaya['vozvrat']['p']['chl']) * (price['Чалап']!==undefined?parseInt(price['Чалап']):0)
                    nakladnaya['vozvrat']['virychka']['kl'] = checkInt(nakladnaya['vozvrat']['p']['kl']) * (price['Квас']!==undefined?parseInt(price['Квас']):0)
                    nakladnaya['vozvrat']['virychka']['sl'] = checkInt(nakladnaya['vozvrat']['p']['sl']) * (price['Стакан Легенда']!==undefined?parseInt(price['Стакан Легенда']):0)
                    nakladnaya['i']['iv'] = checkInt(nakladnaya['vozvrat']['virychka']['ml']) + checkInt(nakladnaya['vozvrat']['virychka']['chl']) + checkInt(nakladnaya['vozvrat']['virychka']['kl']) + checkInt(nakladnaya['vozvrat']['virychka']['sl'])
                    let prodanolitrov =  checkInt(nakladnaya['vozvrat']['p']['ml']) + checkInt(nakladnaya['vozvrat']['p']['chl']) + checkInt(nakladnaya['vozvrat']['p']['kl'])
                    prodanolitrov =  prodanolitrov * 1.1
                    let prodanolitrovemk =  checkInt(nakladnaya['vozvrat']['p']['s02'])*0.2 + checkInt(nakladnaya['vozvrat']['p']['s04'])*0.4 + checkInt(nakladnaya['vozvrat']['p']['b'])
                    if (prodanolitrovemk > prodanolitrov){
                        let rastrata  = prodanolitrovemk -  prodanolitrov
                        nakladnaya['r'] = rastrata.toFixed(1)
                    } else
                        nakladnaya['r'] = 0
                } else
                    nakladnaya['vydano'][type][what] = event.target.value
                nakladnaya['i']['fv'] = checkInt(nakladnaya['i']['iv']) - checkInt(nakladnaya['i']['m']) - checkInt(nakladnaya['i']['o']) - checkInt(nakladnaya['i']['n']) - checkInt(nakladnaya['i']['inc'])
                setNakladnaya(nakladnaya)
            }
        };
        let handleItogo =  (event, type) => {
            if(!nakladnaya['m']) {
                nakladnaya= {...nakladnaya}
                let litr = parseInt(event.target.value)
                if (isNaN(litr)) {
                    nakladnaya['i'][type] = ''
                } else {
                    nakladnaya['i'][type] = litr
                }
                nakladnaya['i']['fv'] = checkInt(nakladnaya['i']['iv']) - checkInt(nakladnaya['i']['m']) - checkInt(nakladnaya['i']['o']) - checkInt(nakladnaya['i']['n']) - checkInt(nakladnaya['i']['inc'])
                setNakladnaya(nakladnaya)
            }
        };
        let handleMainPodpis = (event) => {
            nakladnaya= {...nakladnaya}
            nakladnaya['m'] = event.target.checked
            setNakladnaya(nakladnaya)
        };
        useEffect(()=>{
            if(selected===-1) {
                    if(point1!==undefined&&point1.name!==undefined){
                        setRegion(point1.region)
                        setPoint(point1.point)
                        setRealizator(point1.name)
                        setOrganizator(point1.organizator)
                        setGuidOrganizator(point1.guidOrganizator)
                        setGuidRegion(point1.guidRegion)
                        setGuidRealizator(point1.guid)
                        setGuidPoint(point1.guidPoint)
                     }
            }
        },[point1])
         return (
            <div>
                <br/>
                <h1>Отчет реализатора</h1>
                <b>Реализатор:</b>&nbsp;{realizator}&nbsp;&nbsp;<b>Организатор:</b>&nbsp;{organizator}
                <br/>
                <b>Точка:</b>&nbsp;{point}&nbsp;&nbsp;<b>Регион:</b>&nbsp;{region}
                <br/>
                {
                    selected===-1&&['admin', 'организатор'].includes(status.role)?
                        <>
                        <div style={{cursor: 'pointer'}} onClick={()=>{datePicker.current.open()}}>
                            <b>Дата:</b>&nbsp;{date}
                        </div>
                        <DatePicker
                            style={{display: 'none'}}
                            ref={datePicker}
                            className={classes.textFieldSmall}
                            value={date1}
                            onChange={handleDate1}
                        />
                        </>
                        :
                        <>
                        <b>Дата:</b>&nbsp;{date}
                        <br/>
                        </>
                }
                <b>Выручка:</b>&nbsp;{nakladnaya.i.fv}&nbsp;&nbsp;<b>Перерасход:</b>&nbsp;{nakladnaya.r}
                <br/>
                <br/>
                <ExpansionPanel>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography className={classes.heading}><b>Выдано</b></Typography>
                        <Typography className={classes.secondaryHeading}>
                            <div style={{display: 'inline-block'}}>М: <b style={{color: 'black'}}>{nakladnaya.vydano.i.ml}</b>&nbsp;&nbsp;</div>
                            <div style={{display: 'inline-block'}}>Ч: <b style={{color: 'black'}}>{nakladnaya.vydano.i.chl}</b>&nbsp;&nbsp;</div>
                            <div style={{display: 'inline-block'}}>К: <b style={{color: 'black'}}>{nakladnaya.vydano.i.kl}</b>&nbsp;&nbsp;</div>
                            <div style={{display: 'inline-block'}}>СЛ: <b style={{color: 'black'}}>{nakladnaya.vydano.i.sl}</b>&nbsp;&nbsp;</div>
                            <div style={{display: 'inline-block'}}>С02: <b style={{color: 'black'}}>{nakladnaya.vydano.i.s02}</b>&nbsp;&nbsp;</div>
                            <div style={{display: 'inline-block'}}>С04: <b style={{color: 'black'}}>{nakladnaya.vydano.i.s04}</b>&nbsp;&nbsp;</div>
                            <div style={{display: 'inline-block'}}>Б: <b style={{color: 'black'}}>{nakladnaya.vydano.i.b}</b>&nbsp;&nbsp;</div>
                        </Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanel>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography className={classes.heading}>Растановка</Typography>
                            <Typography className={classes.secondaryHeading}>
                                <div style={{display: 'inline-block'}}>М: <b style={{color: 'black'}}>{nakladnaya.vydano.r.ml}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Ч: <b style={{color: 'black'}}>{nakladnaya.vydano.r.chl}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>К: <b style={{color: 'black'}}>{nakladnaya.vydano.r.kl}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>СЛ: <b style={{color: 'black'}}>{nakladnaya.vydano.r.sl}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>С02: <b style={{color: 'black'}}>{nakladnaya.vydano.r.s02}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>С04: <b style={{color: 'black'}}>{nakladnaya.vydano.r.s04}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Б: <b style={{color: 'black'}}>{nakladnaya.vydano.r.b}</b>&nbsp;&nbsp;</div>
                            </Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Время:
                                </div>
                                &nbsp;{nakladnaya.vydano.r.time}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Максым литр:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||nakladnaya.vydano.r.o||nakladnaya.m}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vydano.r.ml}
                                    onChange={(event)=>{handleVydano(event, 'r', 'ml')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Чалап литр:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||nakladnaya.vydano.r.o||nakladnaya.m}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vydano.r.chl}
                                    onChange={(event)=>{handleVydano(event, 'r', 'chl')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Квас литр:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||nakladnaya.vydano.r.o||nakladnaya.m}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vydano.r.kl}
                                    onChange={(event)=>{handleVydano(event, 'r', 'kl')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Стакан Легенда:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||nakladnaya.vydano.r.o||nakladnaya.m}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vydano.r.sl}
                                    onChange={(event)=>{handleVydano(event, 'r', 'sl')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Стакан 0.2:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||nakladnaya.vydano.r.o||nakladnaya.m}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vydano.r.s02}
                                    onChange={(event)=>{handleVydano(event, 'r', 's02')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Стакан 0.4:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||nakladnaya.vydano.r.o||nakladnaya.m}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vydano.r.s04}
                                    onChange={(event)=>{handleVydano(event, 'r', 's04')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Бутылки:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||nakladnaya.vydano.r.o||nakladnaya.m}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vydano.r.b}
                                    onChange={(event)=>{handleVydano(event, 'r', 'b')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <br/>
                    </ExpansionPanel>
                    <ExpansionPanel>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography className={classes.heading}>1-й долив</Typography>

                            <Typography className={classes.secondaryHeading}>
                                <div style={{display: 'inline-block'}}>М: <b style={{color: 'black'}}>{nakladnaya.vydano.d1.ml}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Ч: <b style={{color: 'black'}}>{nakladnaya.vydano.d1.chl}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>К: <b style={{color: 'black'}}>{nakladnaya.vydano.d1.kl}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>СЛ: <b style={{color: 'black'}}>{nakladnaya.vydano.d1.sl}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>С02: <b style={{color: 'black'}}>{nakladnaya.vydano.d1.s02}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>С04: <b style={{color: 'black'}}>{nakladnaya.vydano.d1.s04}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Б: <b style={{color: 'black'}}>{nakladnaya.vydano.d1.b}</b>&nbsp;&nbsp;</div>
                            </Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Время:
                                </div>
                                &nbsp;{nakladnaya.vydano.d1.time}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Максым литр:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||nakladnaya.vydano.d1.o||nakladnaya.m}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vydano.d1.ml}
                                    onChange={(event)=>{handleVydano(event, 'd1', 'ml')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Чалап литр:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||nakladnaya.vydano.d1.o||nakladnaya.m}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vydano.d1.chl}
                                    onChange={(event)=>{handleVydano(event, 'd1', 'chl')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Квас литр:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||nakladnaya.vydano.d1.o||nakladnaya.m}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vydano.d1.kl}
                                    onChange={(event)=>{handleVydano(event, 'd1', 'kl')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Стакан Легенда:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||nakladnaya.vydano.d1.o||nakladnaya.m}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vydano.d1.sl}
                                    onChange={(event)=>{handleVydano(event, 'd1', 'sl')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Стакан 0.2:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||nakladnaya.vydano.d1.o||nakladnaya.m}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vydano.d1.s02}
                                    onChange={(event)=>{handleVydano(event, 'd1', 's02')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Стакан 0.4:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||nakladnaya.vydano.d1.o||nakladnaya.m}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vydano.d1.s04}
                                    onChange={(event)=>{handleVydano(event, 'd1', 's04')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Бутылки:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||nakladnaya.vydano.d1.o||nakladnaya.m}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vydano.d1.b}
                                    onChange={(event)=>{handleVydano(event, 'd1', 'b')}}
                                />
                            </center>
                        </ExpansionPanelDetails>

                        <br/>
                    </ExpansionPanel>
                    <ExpansionPanel>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography className={classes.heading}>2-й долив</Typography>

                            <Typography className={classes.secondaryHeading}>
                                <div style={{display: 'inline-block'}}>М: <b style={{color: 'black'}}>{nakladnaya.vydano.d2.ml}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Ч: <b style={{color: 'black'}}>{nakladnaya.vydano.d2.chl}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>К: <b style={{color: 'black'}}>{nakladnaya.vydano.d2.kl}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>СЛ: <b style={{color: 'black'}}>{nakladnaya.vydano.d2.sl}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>С02: <b style={{color: 'black'}}>{nakladnaya.vydano.d2.s02}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>С04: <b style={{color: 'black'}}>{nakladnaya.vydano.d2.s04}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Б: <b style={{color: 'black'}}>{nakladnaya.vydano.d2.b}</b>&nbsp;&nbsp;</div>
                            </Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Время:
                                </div>
                                &nbsp;{nakladnaya.vydano.d2.time}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Максым литр:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||nakladnaya.vydano.d2.o||nakladnaya.m}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vydano.d2.ml}
                                    onChange={(event)=>{handleVydano(event, 'd2', 'ml')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Чалап литр:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||nakladnaya.vydano.d2.o||nakladnaya.m}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vydano.d2.chl}
                                    onChange={(event)=>{handleVydano(event, 'd2', 'chl')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Квас литр:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||nakladnaya.vydano.d2.o||nakladnaya.m}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vydano.d2.kl}
                                    onChange={(event)=>{handleVydano(event, 'd2', 'kl')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Стакан Легенда:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||nakladnaya.vydano.d2.o||nakladnaya.m}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vydano.d2.sl}
                                    onChange={(event)=>{handleVydano(event, 'd2', 'sl')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Стакан 0.2:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||nakladnaya.vydano.d2.o||nakladnaya.m}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vydano.d2.s02}
                                    onChange={(event)=>{handleVydano(event, 'd2', 's02')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Стакан 0.4:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||nakladnaya.vydano.d2.o||nakladnaya.m}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vydano.d2.s04}
                                    onChange={(event)=>{handleVydano(event, 'd2', 's04')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Бутылки:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||nakladnaya.vydano.d2.o||nakladnaya.m}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vydano.d2.b}
                                    onChange={(event)=>{handleVydano(event, 'd2', 'b')}}
                                />
                            </center>
                        </ExpansionPanelDetails>

                        <br/>
                    </ExpansionPanel>
                    <ExpansionPanel>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography className={classes.heading}>3-й долив</Typography>

                            <Typography className={classes.secondaryHeading}>
                                <div style={{display: 'inline-block'}}>М: <b style={{color: 'black'}}>{nakladnaya.vydano.d3.ml}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Ч: <b style={{color: 'black'}}>{nakladnaya.vydano.d3.chl}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>К: <b style={{color: 'black'}}>{nakladnaya.vydano.d3.kl}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>СЛ: <b style={{color: 'black'}}>{nakladnaya.vydano.d3.sl}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>С02: <b style={{color: 'black'}}>{nakladnaya.vydano.d3.s02}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>С04: <b style={{color: 'black'}}>{nakladnaya.vydano.d3.s04}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Б: <b style={{color: 'black'}}>{nakladnaya.vydano.d3.b}</b>&nbsp;&nbsp;</div>
                            </Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Время:
                                </div>
                                &nbsp;{nakladnaya.vydano.d3.time}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Максым литр:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||nakladnaya.vydano.d3.o||nakladnaya.m}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vydano.d3.ml}
                                    onChange={(event)=>{handleVydano(event, 'd3', 'ml')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Чалап литр:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||nakladnaya.vydano.d3.o||nakladnaya.m}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vydano.d3.chl}
                                    onChange={(event)=>{handleVydano(event, 'd3', 'chl')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Квас литр:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||nakladnaya.vydano.d3.o||nakladnaya.m}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vydano.d3.kl}
                                    onChange={(event)=>{handleVydano(event, 'd3', 'kl')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Стакан Легенда:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||nakladnaya.vydano.d3.o||nakladnaya.m}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vydano.d3.sl}
                                    onChange={(event)=>{handleVydano(event, 'd3', 'sl')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Стакан 0.2:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||nakladnaya.vydano.d3.o||nakladnaya.m}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vydano.d3.s02}
                                    onChange={(event)=>{handleVydano(event, 'd3', 's02')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Стакан 0.4:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||nakladnaya.vydano.d3.o||nakladnaya.m}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vydano.d3.s04}
                                    onChange={(event)=>{handleVydano(event, 'd3', 's04')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Бутылки:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||nakladnaya.vydano.d3.o||nakladnaya.m}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vydano.d3.b}
                                    onChange={(event)=>{handleVydano(event, 'd3', 'b')}}
                                />
                            </center>
                        </ExpansionPanelDetails>

                        <br/>
                    </ExpansionPanel>
                    <ExpansionPanel>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography className={classes.heading}>Итого</Typography>

                            <Typography className={classes.secondaryHeading}>
                                <div style={{display: 'inline-block'}}>М: <b style={{color: 'black'}}>{nakladnaya.vydano.i.ml}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Ч: <b style={{color: 'black'}}>{nakladnaya.vydano.i.chl}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>К: <b style={{color: 'black'}}>{nakladnaya.vydano.i.kl}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>СЛ: <b style={{color: 'black'}}>{nakladnaya.vydano.i.sl}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>С02: <b style={{color: 'black'}}>{nakladnaya.vydano.i.s02}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>С04: <b style={{color: 'black'}}>{nakladnaya.vydano.i.s04}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Б: <b style={{color: 'black'}}>{nakladnaya.vydano.i.b}</b>&nbsp;&nbsp;</div>
                            </Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Максым литр:
                                </div>
                                &nbsp;{nakladnaya.vydano.i.ml}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Чалап литр:
                                </div>
                                &nbsp;{nakladnaya.vydano.i.chl}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Квас литр:
                                </div>
                                &nbsp;{nakladnaya.vydano.i.kl}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Стакан Легенда:
                                </div>
                                &nbsp;{nakladnaya.vydano.i.sl}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Стакан 0.2:
                                </div>
                                &nbsp;{nakladnaya.vydano.i.s02}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Стакан 0.4:
                                </div>
                                &nbsp;{nakladnaya.vydano.i.s04}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Бутылки:
                                </div>
                                &nbsp;{nakladnaya.vydano.i.b}
                            </center>
                        </ExpansionPanelDetails>

                        <br/>
                    </ExpansionPanel>
                    <br/>
                </ExpansionPanel>
                <ExpansionPanel>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography className={classes.heading}><b>Выручка</b></Typography>
                        <Typography className={classes.secondaryHeading}>
                            <div style={{display: 'inline-block'}}>М: <b style={{color: 'black'}}>{nakladnaya.vozvrat.virychka.ml}</b>&nbsp;&nbsp;</div>
                            <div style={{display: 'inline-block'}}>Ч: <b style={{color: 'black'}}>{nakladnaya.vozvrat.virychka.chl}</b>&nbsp;&nbsp;</div>
                            <div style={{display: 'inline-block'}}>К: <b style={{color: 'black'}}>{nakladnaya.vozvrat.virychka.kl}</b>&nbsp;&nbsp;</div>
                            <div style={{display: 'inline-block'}}>СЛ: <b style={{color: 'black'}}>{nakladnaya.vozvrat.virychka.sl}</b>&nbsp;&nbsp;</div>
                        </Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanel>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography className={classes.heading}>Съем</Typography>
                            <Typography className={classes.secondaryHeading}>
                                <div style={{display: 'inline-block'}}>М: <b style={{color: 'black'}}>{nakladnaya.vozvrat.v.ml+nakladnaya.vozvrat.v.ml1}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Ч: <b style={{color: 'black'}}>{nakladnaya.vozvrat.v.chl+nakladnaya.vozvrat.v.chl1}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>К: <b style={{color: 'black'}}>{nakladnaya.vozvrat.v.kl+nakladnaya.vozvrat.v.kl1}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>СЛ: <b style={{color: 'black'}}>{nakladnaya.vozvrat.v.sl}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>С02: <b style={{color: 'black'}}>{nakladnaya.vozvrat.v.s02}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>С04: <b style={{color: 'black'}}>{nakladnaya.vozvrat.v.s04}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Б: <b style={{color: 'black'}}>{nakladnaya.vozvrat.v.b}</b>&nbsp;&nbsp;</div>
                            </Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Время:
                                </div>
                                &nbsp;{nakladnaya.vozvrat.v.time}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Максым № кеги:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||nakladnaya.vozvrat.v.o||nakladnaya.m}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vozvrat.v.mn}
                                    onChange={(event)=>{handleVozvrat(event, 'v', 'mn')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Максым литр:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||nakladnaya.vozvrat.v.o||nakladnaya.m}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vozvrat.v.ml}
                                    onChange={(event)=>{handleVozvrat(event, 'v', 'ml')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Максым № кеги:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||nakladnaya.vozvrat.v.o||nakladnaya.m}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vozvrat.v.mn1}
                                    onChange={(event)=>{handleVozvrat(event, 'v', 'mn1')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Максым литр:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||nakladnaya.vozvrat.v.o||nakladnaya.m}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vozvrat.v.ml1}
                                    onChange={(event)=>{handleVozvrat(event, 'v', 'ml1')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Чалап № кеги 25:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||nakladnaya.vozvrat.v.o||nakladnaya.m}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vozvrat.v.chn25}
                                    onChange={(event)=>{handleVozvrat(event, 'v', 'chn25')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Чалап № кеги 10:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||nakladnaya.vozvrat.v.o||nakladnaya.m}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vozvrat.v.chn10}
                                    onChange={(event)=>{handleVozvrat(event, 'v', 'chn10')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Чалап литр:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||nakladnaya.vozvrat.v.o||nakladnaya.m}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vozvrat.v.chl}
                                    onChange={(event)=>{handleVozvrat(event, 'v', 'chl')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Чалап № кеги 25:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||nakladnaya.vozvrat.v.o||nakladnaya.m}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vozvrat.v.chn251}
                                    onChange={(event)=>{handleVozvrat(event, 'v', 'chn251')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Чалап № кеги 10:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||nakladnaya.vozvrat.v.o||nakladnaya.m}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vozvrat.v.chn101}
                                    onChange={(event)=>{handleVozvrat(event, 'v', 'chn101')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Чалап литр:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||nakladnaya.vozvrat.v.o||nakladnaya.m}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vozvrat.v.chl1}
                                    onChange={(event)=>{handleVozvrat(event, 'v', 'chl1')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Квас № кеги:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||nakladnaya.vozvrat.v.o||nakladnaya.m}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vozvrat.v.kn}
                                    onChange={(event)=>{handleVozvrat(event, 'v', 'kn')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Квас литр:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||nakladnaya.vozvrat.v.o||nakladnaya.m}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vozvrat.v.kl}
                                    onChange={(event)=>{handleVozvrat(event, 'v', 'kl')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Квас № кеги:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||nakladnaya.vozvrat.v.o||nakladnaya.m}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vozvrat.v.kn1}
                                    onChange={(event)=>{handleVozvrat(event, 'v', 'kn1')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Квас литр:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||nakladnaya.vozvrat.v.o||nakladnaya.m}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vozvrat.v.kl1}
                                    onChange={(event)=>{handleVozvrat(event, 'v', 'kl1')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Стакан Легенда:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||nakladnaya.vozvrat.v.o||nakladnaya.m}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vozvrat.v.sl}
                                    onChange={(event)=>{handleVozvrat(event, 'v', 'sl')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Стакан 0.2:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||nakladnaya.vozvrat.v.o||nakladnaya.m}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vozvrat.v.s02}
                                    onChange={(event)=>{handleVozvrat(event, 'v', 's02')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Стакан 0.4:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||nakladnaya.vozvrat.v.o||nakladnaya.m}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vozvrat.v.s04}
                                    onChange={(event)=>{handleVozvrat(event, 'v', 's04')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Бутылки:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||nakladnaya.vozvrat.v.o||nakladnaya.m}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vozvrat.v.b}
                                    onChange={(event)=>{handleVozvrat(event, 'v', 'b')}}
                                />
                            </center>
                        </ExpansionPanelDetails>

                        <br/>
                    </ExpansionPanel>
                    <ExpansionPanel>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography className={classes.heading}>Списание по акту</Typography>

                            <Typography className={classes.secondaryHeading}>
                                <div style={{display: 'inline-block'}}>М: <b style={{color: 'black'}}>{nakladnaya.vozvrat.s.ml}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Ч: <b style={{color: 'black'}}>{nakladnaya.vozvrat.s.chl}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>К: <b style={{color: 'black'}}>{nakladnaya.vozvrat.s.kl}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>СЛ: <b style={{color: 'black'}}>{nakladnaya.vozvrat.s.sl}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>С02: <b style={{color: 'black'}}>{nakladnaya.vozvrat.s.s02}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>С04: <b style={{color: 'black'}}>{nakladnaya.vozvrat.s.s04}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Б: <b style={{color: 'black'}}>{nakladnaya.vozvrat.s.b}</b>&nbsp;&nbsp;</div>
                            </Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Максым литр:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||nakladnaya.vozvrat.s.o||nakladnaya.m}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vozvrat.s.ml}
                                    onChange={(event)=>{handleVozvrat(event, 's', 'ml')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Чалап литр:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||nakladnaya.vozvrat.s.o||nakladnaya.m}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vozvrat.s.chl}
                                    onChange={(event)=>{handleVozvrat(event, 's', 'chl')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Квас литр:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||nakladnaya.vozvrat.s.o||nakladnaya.m}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vozvrat.s.kl}
                                    onChange={(event)=>{handleVozvrat(event, 's', 'kl')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Стакан Легенда:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||nakladnaya.vozvrat.s.o||nakladnaya.m}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vozvrat.s.sl}
                                    onChange={(event)=>{handleVozvrat(event, 's', 'sl')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Стакан 0.2:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||nakladnaya.vozvrat.s.o||nakladnaya.m}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vozvrat.s.s02}
                                    onChange={(event)=>{handleVozvrat(event, 's', 's02')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Стакан 0.4:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||nakladnaya.vozvrat.s.o||nakladnaya.m}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vozvrat.s.s04}
                                    onChange={(event)=>{handleVozvrat(event, 's', 's04')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Бутылки:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||nakladnaya.vozvrat.s.o||nakladnaya.m}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vozvrat.s.b}
                                    onChange={(event)=>{handleVozvrat(event, 's', 'b')}}
                                />
                            </center>
                        </ExpansionPanelDetails>

                        <br/>
                    </ExpansionPanel>

                    <ExpansionPanel>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography className={classes.heading}>Продано</Typography>

                            <Typography className={classes.secondaryHeading}>
                                <div style={{display: 'inline-block'}}>М: <b style={{color: 'black'}}>{nakladnaya.vozvrat.p.ml}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Ч: <b style={{color: 'black'}}>{nakladnaya.vozvrat.p.chl}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>К: <b style={{color: 'black'}}>{nakladnaya.vozvrat.p.kl}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>СЛ: <b style={{color: 'black'}}>{nakladnaya.vozvrat.p.sl}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>С02: <b style={{color: 'black'}}>{nakladnaya.vozvrat.p.s02}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>С04: <b style={{color: 'black'}}>{nakladnaya.vozvrat.p.s04}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Б: <b style={{color: 'black'}}>{nakladnaya.vozvrat.p.b}</b>&nbsp;&nbsp;</div>
                            </Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Максым литр:
                                </div>
                                &nbsp;{nakladnaya.vozvrat.p.ml}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Чалап литр:
                                </div>
                                &nbsp;{nakladnaya.vozvrat.p.chl}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Квас литр:
                                </div>
                                &nbsp;{nakladnaya.vozvrat.p.kl}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Стакан Легенда:
                                </div>
                                &nbsp;{nakladnaya.vozvrat.p.sl}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Стакан 0.2:
                                </div>
                                &nbsp;{nakladnaya.vozvrat.p.s02}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Стакан 0.4:
                                </div>
                                &nbsp;{nakladnaya.vozvrat.p.s04}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Бутылки:
                                </div>
                                &nbsp;{nakladnaya.vozvrat.p.b}
                            </center>
                        </ExpansionPanelDetails>

                        <br/>
                    </ExpansionPanel>

                    <ExpansionPanel>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography className={classes.heading}>Выручка</Typography>
                            <Typography className={classes.secondaryHeading}>
                                <div style={{display: 'inline-block'}}>М: <b style={{color: 'black'}}>{nakladnaya.vozvrat.virychka.ml}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Ч: <b style={{color: 'black'}}>{nakladnaya.vozvrat.virychka.chl}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>К: <b style={{color: 'black'}}>{nakladnaya.vozvrat.virychka.kl}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>СЛ: <b style={{color: 'black'}}>{nakladnaya.vozvrat.virychka.sl}</b>&nbsp;&nbsp;</div>
                            </Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Максым литр:
                                </div>
                                &nbsp;{nakladnaya.vozvrat.virychka.ml}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Чалап литр:
                                </div>
                                &nbsp;{nakladnaya.vozvrat.virychka.chl}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Квас литр:
                                </div>
                                &nbsp;{nakladnaya.vozvrat.virychka.kl}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Стакан Легенда:
                                </div>
                                &nbsp;{nakladnaya.vozvrat.virychka.sl}
                            </center>
                        </ExpansionPanelDetails>

                        <br/>
                    </ExpansionPanel>


                    <br/>
                </ExpansionPanel>
                <ExpansionPanel>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography className={classes.heading}>Итого</Typography>
                        <Typography className={classes.secondaryHeading}>
                            <div style={{display: 'inline-block'}}>ИВ: <b style={{color: 'black'}}>{nakladnaya.i.iv}</b>&nbsp;&nbsp;</div>
                            <div style={{display: 'inline-block'}}>М: <b style={{color: 'black'}}>{nakladnaya.i.m}</b>&nbsp;&nbsp;</div>
                            <div style={{display: 'inline-block'}}>О: <b style={{color: 'black'}}>{nakladnaya.i.o}</b>&nbsp;&nbsp;</div>
                            <div style={{display: 'inline-block'}}>Н: <b style={{color: 'black'}}>{nakladnaya.i.n}</b>&nbsp;&nbsp;</div>
                            <div style={{display: 'inline-block'}}>И: <b style={{color: 'black'}}>{nakladnaya.i.inc}</b>&nbsp;&nbsp;</div>
                            <div style={{display: 'inline-block'}}>ФВ: <b style={{color: 'black'}}>{nakladnaya.i.fv}</b>&nbsp;&nbsp;</div>
                        </Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails style={{padding: '0px'}}>
                        <center style={{width: '100%'}}>
                            <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                Итого выручка:
                            </div>
                            &nbsp;{nakladnaya.i.iv}
                        </center>
                    </ExpansionPanelDetails>
                    <ExpansionPanelDetails style={{padding: '0px'}}>
                        <center style={{width: '100%'}}>
                            <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                Место:
                            </div>
                            <TextField
                                disabled={status.role==='admin'?false:checkDate||nakladnaya.m}
                                style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                type="number"
                                margin='normal'
                                value={nakladnaya.i.m}
                                onChange={(event)=>{handleItogo(event, 'm')}}
                            />
                        </center>
                    </ExpansionPanelDetails>
                    <ExpansionPanelDetails style={{padding: '0px'}}>
                        <center style={{width: '100%'}}>
                            <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                Обед:
                            </div>
                            &nbsp;{nakladnaya.i.o}
                        </center>
                    </ExpansionPanelDetails>
                    <ExpansionPanelDetails style={{padding: '0px'}}>
                        <center style={{width: '100%'}}>
                            <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                Недосдача:
                            </div>
                            <TextField
                                disabled={status.role==='admin'?false:checkDate||nakladnaya.vydano.r.o||nakladnaya.m}
                                style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                type="number"
                                margin='normal'
                                value={nakladnaya.i.n}
                                onChange={(event)=>{handleItogo(event, 'n')}}
                            />
                        </center>
                    </ExpansionPanelDetails>
                    <ExpansionPanelDetails style={{padding: '0px'}}>
                        <center style={{width: '100%'}}>
                            <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                Инкасс.:
                            </div>
                            <TextField
                                disabled={status.role==='admin'?false:checkDate||nakladnaya.vydano.r.o||nakladnaya.m}
                                style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                type="number"
                                margin='normal'
                                value={nakladnaya.i.inc}
                                onChange={(event)=>{handleItogo(event, 'inc')}}
                            />
                        </center>
                    </ExpansionPanelDetails>
                    <ExpansionPanelDetails style={{padding: '0px'}}>
                        <center style={{width: '100%'}}>
                            <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                Фактическая выручка:
                            </div>
                            &nbsp;{nakladnaya.i.fv}
                        </center>
                    </ExpansionPanelDetails>
                    <br/>
                </ExpansionPanel>
                <center style={{width: '100%'}}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={nakladnaya.m}
                                color='primary'
                                disabled={status.role==='admin'||status.role==='организатор'?false:checkDate||nakladnaya.vydano.r.p||status.role!=='организатор'||nakladnaya.m}
                                onChange={(event)=>{handleMainPodpis(event)}}
                            />
                        }
                        label='Принять'
                    />
                </center>
                <br/>
                <div>
                    <Link className='link' to={''}>
                        <Button variant='contained' color='primary' onClick={()=>{
                            if(realizator.length>0&&guidRegion!=='lol'&&guidPoint!=='lol') {
                                if (selected === -1)
                                    addData({
                                        search: '', sort: '', page: 0, name: 'Отчет реализатора', data: {
                                            dataTable: JSON.stringify(nakladnaya),
                                            data: date,
                                            organizator: organizator,
                                            realizator: realizator,
                                            region: region,
                                            point: point,
                                            guidRegion: guidRegion,
                                            guidOrganizator: guidOrganizator,
                                            guidPoint: guidPoint,
                                            guidRealizator: guidRealizator,
                                            disabled: disabled
                                        }
                                    });
                                else
                                    setData({
                                        id: id, search: '', sort: '', page: 0, name: 'Отчет реализатора', data: {
                                            dataTable: JSON.stringify(nakladnaya),
                                            data: date,
                                            organizator: organizator,
                                            realizator: realizator,
                                            region: region,
                                            point: point,
                                            guidRegion: guidRegion,
                                            guidOrganizator: guidOrganizator,
                                            guidPoint: guidPoint,
                                            guidRealizator: guidRealizator,
                                            disabled: disabled
                                        }
                                    });
                            }
                            setSelected(-1)}} className={classes.button}>
                            Сохранить
                        </Button>
                    </Link>
                    <Link className='link' to={''} onClick={()=>{setSelected(-1)}}>
                        <Button variant='contained' color='secondary' className={classes.button}>
                            Отмена
                        </Button>
                    </Link>
                </div>


            </div>
        );
  })

function mapStateToProps (state) {
    return {
        user: state.user,
        table: state.table,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        tableActions: bindActionCreators(tableActions, dispatch),
    }
}

Event.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Plan));
