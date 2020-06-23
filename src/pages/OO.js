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
import { month , checkInt } from '../redux/constants/other'
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import MenuItem from '@material-ui/core/MenuItem';

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
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: width,
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
                if (!(status.status==='active'&&['admin', 'организатор'].includes(status.role))) {
                props.history.push('/')
            }
                let _data = await tableActions.getDataSimple({name: 'Номера авто'})
                setAutos(_data)
                _data = await tableActions.getDataSimple({name: 'Цена1'})
                setPrice(_data)
                if(selected===-1) {
                    _data = await tableActions.getDataSimple({name: 'ОрганизаторПоID'})
                    if(_data!==undefined){
                        let date = new Date()
                        date = JSON.stringify(date).split('-')
                        date = date[2].split('T')[0]+' '+month[parseInt(date[1])-1]+' '+date[0].replace('"', '')
                        let _data1 = await tableActions.getDataSimple({name: 'Отчет организатора по данным', data: {
                            data: date, organizator: _data.guid, region: _data.guidRegion}})
                        if(_data1!==undefined&&_data1!==''){
                            setDate(_data1.data)
                            setOrganizator(_data1.organizator)
                            setRegion(_data1.region)
                            setNakladnaya(JSON.parse(_data1.dataTable))
                            setId(_data1._id)
                            setGuidOrganizator(_data1.guidOrganizator)
                            setGuidRegion(_data1.guidRegion)
                        } else {

                            setRegion(_data.region)
                            setOrganizator(_data.name)
                            setGuidOrganizator(_data.guid)
                            setGuidRegion(_data.guidRegion)
                            let date = new Date()
                            date = JSON.stringify(date).split('-')
                            date = date[2].split('T')[0]+' '+month[parseInt(date[1])-1]+' '+date[0].replace('"', '')
                            setDate(date)

                            _data = await tableActions.getDataSimple({name: 'Все отчеты реализаторов по дате',
                                data: {data: date, organizator: _data.guid, region: _data.guidRegion}
                            })
                            if(_data!=undefined){
                                nakladnaya= {...nakladnaya}
                                nakladnaya.r.otr = 100 * _data.length
                                let dolivkiM = [], dolivkiCh = [], dolivkiK = [], dolivkiSl = [], dolivkiS02 = [], dolivkiS04 = [], dolivkiB = []

                                nakladnaya['time'] = {
                                    'r': '',
                                    'd1': '',
                                    'd2': '',
                                    'd3': '',
                                    's': '',
                                }

                                for(let i=0; i<_data.length; i++){
                                    let dataTable = JSON.parse(_data[i].dataTable)

                                    if(nakladnaya['time']['r'].length===0&&dataTable.vydano.r.time.length>0){
                                        nakladnaya['time']['r'] = dataTable.vydano.r.time
                                    }
                                    if(nakladnaya['time']['d1'].length===0&&dataTable.vydano.d1.time.length>0){
                                        nakladnaya['time']['d1'] = dataTable.vydano.d1.time
                                    }
                                    if(nakladnaya['time']['d2'].length===0&&dataTable.vydano.d2.time.length>0){
                                        nakladnaya['time']['d2'] = dataTable.vydano.d2.time
                                    }
                                    if(nakladnaya['time']['d3'].length===0&&dataTable.vydano.d3.time.length>0){
                                        nakladnaya['time']['d3'] = dataTable.vydano.d3.time
                                    }
                                    if(nakladnaya['time']['s'].length===0&&dataTable.vozvrat.v.time.length>0){
                                        nakladnaya['time']['s'] = dataTable.vozvrat.v.time
                                    }

                                    if(dataTable.vydano.d3.ml.length>0){
                                        dolivkiM[i]=3
                                    }
                                    else if(dataTable.vydano.d2.ml.length>0){
                                        dolivkiM[i]=2
                                    }
                                    else if(dataTable.vydano.d1.ml.length>0){
                                        dolivkiM[i]=1
                                    }
                                    else {
                                        dolivkiM[i]=0
                                    }

                                    if(dataTable.vydano.d3.kl.length>0){
                                        dolivkiK[i]=3
                                    }
                                    else if(dataTable.vydano.d2.kl.length>0){
                                        dolivkiK[i]=2
                                    }
                                    else if(dataTable.vydano.d1.kl.length>0){
                                        dolivkiK[i]=1
                                    }
                                    else {
                                        dolivkiK[i]=0
                                    }

                                    if(dataTable.vydano.d3.chl.length>0){
                                        dolivkiCh[i]=3
                                    }
                                    else if(dataTable.vydano.d2.chl.length>0){
                                        dolivkiCh[i]=2
                                    }
                                    else if(dataTable.vydano.d1.chl.length>0){
                                        dolivkiCh[i]=1
                                    }
                                    else {
                                        dolivkiCh[i]=0
                                    }

                                    if(dataTable.vydano.d3.sl.length>0){
                                        dolivkiSl[i]=3
                                    }
                                    else if(dataTable.vydano.d2.sl.length>0){
                                        dolivkiSl[i]=2
                                    }
                                    else if(dataTable.vydano.d1.sl.length>0){
                                        dolivkiSl[i]=1
                                    }
                                    else {
                                        dolivkiSl[i]=0
                                    }


                                    if(dataTable.vydano.d3.s02.length>0){
                                        dolivkiS02[i]=3
                                    }
                                    else if(dataTable.vydano.d2.s02.length>0){
                                        dolivkiS02[i]=2
                                    }
                                    else if(dataTable.vydano.d1.s02.length>0){
                                        dolivkiS02[i]=1
                                    }
                                    else {
                                        dolivkiS02[i]=0
                                    }

                                    if(dataTable.vydano.d3.s04.length>0){
                                        dolivkiS04[i]=3
                                    }
                                    else if(dataTable.vydano.d2.s04.length>0){
                                        dolivkiS04[i]=2
                                    }
                                    else if(dataTable.vydano.d1.s04.length>0){
                                        dolivkiS04[i]=1
                                    }
                                    else {
                                        dolivkiS04[i]=0
                                    }

                                    if(dataTable.vydano.d3.b!==0){
                                        dolivkiB[i]=3
                                    }
                                    if(dataTable.vydano.d1.b){
                                        dolivkiB[i]=1
                                    }
                                    if(dataTable.vydano.d2.b!==0){
                                        dolivkiB[i]=2
                                    }

                                    nakladnaya.p.m.v += checkInt(dataTable.vydano.i.ml)
                                    nakladnaya.p.ch.v += checkInt(dataTable.vydano.i.chl)
                                    nakladnaya.p.k.v += checkInt(dataTable.vydano.i.kl)
                                    nakladnaya.p.sl.v += checkInt(dataTable.vydano.i.sl)
                                    nakladnaya.p.s02.v += checkInt(dataTable.vydano.i.s02)
                                    nakladnaya.p.s04.v += checkInt(dataTable.vydano.i.s04)
                                    nakladnaya.p.b.v += checkInt(dataTable.vydano.i.b)

                                    nakladnaya.p.m.o += checkInt(dataTable.vozvrat.v.ml)
                                    nakladnaya.p.ch.o += checkInt(dataTable.vozvrat.v.chl)
                                    nakladnaya.p.k.o += checkInt(dataTable.vozvrat.v.kl)
                                    nakladnaya.p.m.o += checkInt(dataTable.vozvrat.v.ml1)
                                    nakladnaya.p.ch.o += checkInt(dataTable.vozvrat.v.chl1)
                                    nakladnaya.p.k.o += checkInt(dataTable.vozvrat.v.kl1)
                                    nakladnaya.p.sl.o += checkInt(dataTable.vozvrat.v.sl)
                                    nakladnaya.p.s02.o += checkInt(dataTable.vozvrat.v.s02)
                                    nakladnaya.p.s04.o += checkInt(dataTable.vozvrat.v.s04)
                                    nakladnaya.p.b.o += checkInt(dataTable.vozvrat.v.b)

                                    nakladnaya.p.m.s += checkInt(dataTable.vozvrat.s.ml)
                                    nakladnaya.p.ch.s += checkInt(dataTable.vozvrat.s.chl)
                                    nakladnaya.p.k.s += checkInt(dataTable.vozvrat.s.kl)
                                    nakladnaya.p.sl.s += checkInt(dataTable.vozvrat.s.sl)
                                    nakladnaya.p.s02.s += checkInt(dataTable.vozvrat.s.s02)
                                    nakladnaya.p.s04.s += checkInt(dataTable.vozvrat.s.s04)
                                    nakladnaya.p.b.s += checkInt(dataTable.vozvrat.s.b)

                                    nakladnaya.p.m.pl += checkInt(dataTable.vozvrat.p.ml)
                                    nakladnaya.p.ch.pl += checkInt(dataTable.vozvrat.p.chl)
                                    nakladnaya.p.k.pl += checkInt(dataTable.vozvrat.p.kl)
                                    nakladnaya.p.sl.pl += checkInt(dataTable.vozvrat.p.sl)
                                    nakladnaya.p.s02.pl += checkInt(dataTable.vozvrat.p.s02)
                                    nakladnaya.p.s04.pl += checkInt(dataTable.vozvrat.p.s04)
                                    nakladnaya.p.b.pl += checkInt(dataTable.vozvrat.p.b)

                                    nakladnaya.p.m.ps += checkInt(dataTable.vozvrat.virychka.ml)
                                    nakladnaya.p.ch.ps += checkInt(dataTable.vozvrat.virychka.chl)
                                    nakladnaya.p.k.ps += checkInt(dataTable.vozvrat.virychka.kl)
                                    nakladnaya.p.sl.ps += checkInt(dataTable.vozvrat.virychka.sl)
                                    nakladnaya.p.s02.ps += checkInt(dataTable.vozvrat.virychka.s02)
                                    nakladnaya.p.s04.ps += checkInt(dataTable.vozvrat.virychka.s04)
                                    nakladnaya.p.b.ps += checkInt(dataTable.vozvrat.virychka.b)

                                    nakladnaya.p.m.ktt = _data.length
                                    nakladnaya.p.ch.ktt = _data.length
                                    nakladnaya.p.k.ktt = _data.length
                                    nakladnaya.p.sl.ktt = _data.length
                                    nakladnaya.p.s02.ktt = _data.length
                                    nakladnaya.p.s04.ktt = _data.length
                                    nakladnaya.p.b.ktt = _data.length

                                    nakladnaya.r.ntp += checkInt(dataTable.vozvrat.virychka.sl)
                                }
                                nakladnaya.p.m.kd = dolivkiM.length>0?Math.max.apply(Math, dolivkiM):0;
                                nakladnaya.p.k.kd = dolivkiK.length>0?Math.max.apply(Math, dolivkiK):0;
                                nakladnaya.p.ch.kd = dolivkiCh.length>0?Math.max.apply(Math, dolivkiCh):0;
                                nakladnaya.p.sl.kd = dolivkiSl.length>0?Math.max.apply(Math, dolivkiSl):0;
                                nakladnaya.p.s02.kd = dolivkiS02.length>0?Math.max.apply(Math, dolivkiS02):0;
                                nakladnaya.p.s04.kd = dolivkiS04.length>0?Math.max.apply(Math, dolivkiS04):0;
                                nakladnaya.p.b.kd = dolivkiB.length>0?Math.max.apply(Math, dolivkiB):0;

                                nakladnaya['p']['i'] = checkInt(nakladnaya['p']['m']['ps']) + checkInt(nakladnaya['p']['ch']['ps']) + checkInt(nakladnaya['p']['k']['ps']) + checkInt(nakladnaya['p']['sl']['ps'])
                                nakladnaya['i'] = checkInt(nakladnaya['p']['i']) - checkInt(nakladnaya['r']['otr']) - checkInt(nakladnaya['r']['oo']) - checkInt(nakladnaya['r']['ntp']) - checkInt(nakladnaya['r']['att']) - checkInt(nakladnaya['r']['at']) - checkInt(nakladnaya['r']['vs'])
                                setNakladnaya(nakladnaya)
                            }

                         }

                    }
                }
                else {
                    _data = await tableActions.getDataSimple({name: 'Отчет организатора по данным',
                        data: {data: data[selected][1], organizator: data[selected][2], region: data[selected][3]}})
                    if(_data!==undefined){
                        setDate(_data.data)
                        setOrganizator(_data.organizator)
                        setRegion(_data.region)
                        setGuidOrganizator(_data.guidOrganizator)
                        setGuidRegion(_data.guidRegion)
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
        const { setSelected, addData, setData, setSelectedRegion } = props.tableActions;
        const { selected, data } = props.table;
        const { classes } = props;
        const { status } = props.user;
        let [organizator, setOrganizator] = useState('');
        let [region, setRegion] = useState('');
        let [guidOrganizator, setGuidOrganizator] = useState('');
        let [guidRegion, setGuidRegion] = useState('');
        useEffect( ()=>{
            if(guidRegion!==undefined&&guidRegion.length>0)
                setSelectedRegion(guidRegion)
        },[guidRegion])
        let [date, setDate] = useState('');
        let [date1, setDate1] = useState(new Date());
        let handleDate1 =  async (date) => {
            nakladnaya = {
                'p': {
                    'i': 0,
                    'm': {'v': 0, 'o': 0, 's': 0, 'pl': 0, 'ktt': 0, 'kd': 0, 'ps': 0},
                    'ch': {'v': 0, 'o': 0, 's': 0, 'pl': 0, 'ktt': 0, 'kd': 0, 'ps': 0},
                    'k': {'v': 0, 'o': 0, 's': 0, 'pl': 0, 'ktt': 0, 'kd': 0, 'ps': 0},
                    'sl': {'v': 0, 'o': 0, 's': 0, 'pl': 0, 'ktt': 0, 'kd': 0, 'ps': 0},
                    's02': {'v': 0, 'o': 0, 's': 0, 'pl': 0, 'ktt': 0, 'kd': 0, 'ps': 0},
                    's04': {'v': 0, 'o': 0, 's': 0, 'pl': 0, 'ktt': 0, 'kd': 0, 'ps': 0},
                    'b': {'v': 0, 'o': 0, 's': 0, 'pl': 0, 'ktt': 0, 'kd': 0, 'ps': 0},
                },
                'r': {
                    'otr': 0,
                    'oo': 100,
                    'ntp': 0,
                    'att': 0,
                    'at': '',
                    'vs': '',
                    'inc': 0
                },
                'time': {
                    'r': '',
                    'd1': '',
                    'd2': '',
                    'd3': '',
                    's': '',
                },
                'a': {
                    'n': '',
                    'r': '',
                    'd1': '',
                    'd2': '',
                    'd3': '',
                    's': '',
                    'lkm': '',
                },
                'i': -100,
                'm': false,
            };
            setId('')
            setDate1(date)
            date = JSON.stringify(date).split('-')
            date = date[2].split('T')[0]+' '+month[parseInt(date[1])-1]+' '+date[0].replace('"', '')
            setDate(date)

            let _data = await tableActions.getDataSimple({name: 'Все отчеты реализаторов по дате',
                data: {data: date, organizator: guidOrganizator, region: guidRegion}
            })
            if(_data!=undefined){
                nakladnaya.r.otr = 100 * _data.length
                let dolivkiM = [], dolivkiCh = [], dolivkiK = [], dolivkiSl = [], dolivkiS02 = [], dolivkiS04 = [], dolivkiB = []
                nakladnaya['time'] = {
                    'r': '',
                    'd1': '',
                    'd2': '',
                    'd3': '',
                    's': '',
                }
                for(let i=0; i<_data.length; i++){
                    let dataTable = JSON.parse(_data[i].dataTable)

                    if(nakladnaya['time']['r'].length===0&&dataTable.vydano.r.time.length>0){
                        nakladnaya['time']['r'] = dataTable.vydano.r.time
                    }
                    if(nakladnaya['time']['d1'].length===0&&dataTable.vydano.d1.time.length>0){
                        nakladnaya['time']['d1'] = dataTable.vydano.d1.time
                    }
                    if(nakladnaya['time']['d2'].length===0&&dataTable.vydano.d2.time.length>0){
                        nakladnaya['time']['d2'] = dataTable.vydano.d2.time
                    }
                    if(nakladnaya['time']['d3'].length===0&&dataTable.vydano.d3.time.length>0){
                        nakladnaya['time']['d3'] = dataTable.vydano.d3.time
                    }
                    if(nakladnaya['time']['s'].length===0&&dataTable.vozvrat.v.time.length>0){
                        nakladnaya['time']['s'] = dataTable.vozvrat.v.time
                    }

                    if(dataTable.vydano.d3.ml.length>0){
                        dolivkiM[i]=3
                    }
                    else if(dataTable.vydano.d2.ml.length>0){
                        dolivkiM[i]=2
                    }
                    else if(dataTable.vydano.d1.ml.length>0){
                        dolivkiM[i]=1
                    }
                    else {
                        dolivkiM[i]=0
                    }

                    if(dataTable.vydano.d3.kl.length>0){
                        dolivkiK[i]=3
                    }
                    else if(dataTable.vydano.d2.kl.length>0){
                        dolivkiK[i]=2
                    }
                    else if(dataTable.vydano.d1.kl.length>0){
                        dolivkiK[i]=1
                    }
                    else {
                        dolivkiK[i]=0
                    }

                    if(dataTable.vydano.d3.chl.length>0){
                        dolivkiCh[i]=3
                    }
                    else if(dataTable.vydano.d2.chl.length>0){
                        dolivkiCh[i]=2
                    }
                    else if(dataTable.vydano.d1.chl.length>0){
                        dolivkiCh[i]=1
                    }
                    else {
                        dolivkiCh[i]=0
                    }

                    if(dataTable.vydano.d3.sl.length>0){
                        dolivkiSl[i]=3
                    }
                    else if(dataTable.vydano.d2.sl.length>0){
                        dolivkiSl[i]=2
                    }
                    else if(dataTable.vydano.d1.sl.length>0){
                        dolivkiSl[i]=1
                    }
                    else {
                        dolivkiSl[i]=0
                    }


                    if(dataTable.vydano.d3.s02.length>0){
                        dolivkiS02[i]=3
                    }
                    else if(dataTable.vydano.d2.s02.length>0){
                        dolivkiS02[i]=2
                    }
                    else if(dataTable.vydano.d1.s02.length>0){
                        dolivkiS02[i]=1
                    }
                    else {
                        dolivkiS02[i]=0
                    }

                    if(dataTable.vydano.d3.s04.length>0){
                        dolivkiS04[i]=3
                    }
                    else if(dataTable.vydano.d2.s04.length>0){
                        dolivkiS04[i]=2
                    }
                    else if(dataTable.vydano.d1.s04.length>0){
                        dolivkiS04[i]=1
                    }
                    else {
                        dolivkiS04[i]=0
                    }

                    if(dataTable.vydano.d3.b!==0){
                        dolivkiB[i]=3
                    }
                    if(dataTable.vydano.d1.b){
                        dolivkiB[i]=1
                    }
                    if(dataTable.vydano.d2.b!==0){
                        dolivkiB[i]=2
                    }

                    nakladnaya.p.m.v += checkInt(dataTable.vydano.i.ml)
                    nakladnaya.p.ch.v += checkInt(dataTable.vydano.i.chl)
                    nakladnaya.p.k.v += checkInt(dataTable.vydano.i.kl)
                    nakladnaya.p.sl.v += checkInt(dataTable.vydano.i.sl)
                    nakladnaya.p.s02.v += checkInt(dataTable.vydano.i.s02)
                    nakladnaya.p.s04.v += checkInt(dataTable.vydano.i.s04)
                    nakladnaya.p.b.v += checkInt(dataTable.vydano.i.b)

                    nakladnaya.p.m.o += checkInt(dataTable.vozvrat.v.ml)
                    nakladnaya.p.ch.o += checkInt(dataTable.vozvrat.v.chl)
                    nakladnaya.p.k.o += checkInt(dataTable.vozvrat.v.kl)
                    nakladnaya.p.m.o += checkInt(dataTable.vozvrat.v.ml1)
                    nakladnaya.p.ch.o += checkInt(dataTable.vozvrat.v.chl1)
                    nakladnaya.p.k.o += checkInt(dataTable.vozvrat.v.kl1)
                    nakladnaya.p.sl.o += checkInt(dataTable.vozvrat.v.sl)
                    nakladnaya.p.s02.o += checkInt(dataTable.vozvrat.v.s02)
                    nakladnaya.p.s04.o += checkInt(dataTable.vozvrat.v.s04)
                    nakladnaya.p.b.o += checkInt(dataTable.vozvrat.v.b)

                    nakladnaya.p.m.s += checkInt(dataTable.vozvrat.s.ml)
                    nakladnaya.p.ch.s += checkInt(dataTable.vozvrat.s.chl)
                    nakladnaya.p.k.s += checkInt(dataTable.vozvrat.s.kl)
                    nakladnaya.p.sl.s += checkInt(dataTable.vozvrat.s.sl)
                    nakladnaya.p.s02.s += checkInt(dataTable.vozvrat.s.s02)
                    nakladnaya.p.s04.s += checkInt(dataTable.vozvrat.s.s04)
                    nakladnaya.p.b.s += checkInt(dataTable.vozvrat.s.b)

                    nakladnaya.p.m.pl += checkInt(dataTable.vozvrat.p.ml)
                    nakladnaya.p.ch.pl += checkInt(dataTable.vozvrat.p.chl)
                    nakladnaya.p.k.pl += checkInt(dataTable.vozvrat.p.kl)
                    nakladnaya.p.sl.pl += checkInt(dataTable.vozvrat.p.sl)
                    nakladnaya.p.s02.pl += checkInt(dataTable.vozvrat.p.s02)
                    nakladnaya.p.s04.pl += checkInt(dataTable.vozvrat.p.s04)
                    nakladnaya.p.b.pl += checkInt(dataTable.vozvrat.p.b)

                    nakladnaya.p.m.ps += checkInt(dataTable.vozvrat.virychka.ml)
                    nakladnaya.p.ch.ps += checkInt(dataTable.vozvrat.virychka.chl)
                    nakladnaya.p.k.ps += checkInt(dataTable.vozvrat.virychka.kl)
                    nakladnaya.p.sl.ps += checkInt(dataTable.vozvrat.virychka.sl)
                    nakladnaya.p.s02.ps += checkInt(dataTable.vozvrat.virychka.s02)
                    nakladnaya.p.s04.ps += checkInt(dataTable.vozvrat.virychka.s04)
                    nakladnaya.p.b.ps += checkInt(dataTable.vozvrat.virychka.b)

                    nakladnaya.p.m.ktt = _data.length
                    nakladnaya.p.ch.ktt = _data.length
                    nakladnaya.p.k.ktt = _data.length
                    nakladnaya.p.sl.ktt = _data.length
                    nakladnaya.p.s02.ktt = _data.length
                    nakladnaya.p.s04.ktt = _data.length
                    nakladnaya.p.b.ktt = _data.length

                    nakladnaya.r.ntp += checkInt(dataTable.vozvrat.virychka.sl)
                }
                nakladnaya.p.m.kd = dolivkiM.length>0?Math.max.apply(Math, dolivkiM):0;
                nakladnaya.p.k.kd = dolivkiK.length>0?Math.max.apply(Math, dolivkiK):0;
                nakladnaya.p.ch.kd = dolivkiCh.length>0?Math.max.apply(Math, dolivkiCh):0;
                nakladnaya.p.sl.kd = dolivkiSl.length>0?Math.max.apply(Math, dolivkiSl):0;
                nakladnaya.p.s02.kd = dolivkiS02.length>0?Math.max.apply(Math, dolivkiS02):0;
                nakladnaya.p.s04.kd = dolivkiS04.length>0?Math.max.apply(Math, dolivkiS04):0;
                nakladnaya.p.b.kd = dolivkiB.length>0?Math.max.apply(Math, dolivkiB):0;

                nakladnaya['p']['i'] = checkInt(nakladnaya['p']['m']['ps']) + checkInt(nakladnaya['p']['ch']['ps']) + checkInt(nakladnaya['p']['k']['ps']) + checkInt(nakladnaya['p']['sl']['ps'])
                nakladnaya['i'] = checkInt(nakladnaya['p']['i']) - checkInt(nakladnaya['r']['otr']) - checkInt(nakladnaya['r']['oo']) - checkInt(nakladnaya['r']['ntp']) - checkInt(nakladnaya['r']['att']) - checkInt(nakladnaya['r']['at']) - checkInt(nakladnaya['r']['vs'])
            }
            setNakladnaya(nakladnaya)
        };
        let [autos, setAutos] = useState([]);
        let [disabled, setDisabled] = useState(false);
        let [id, setId] = useState('');
        let [price, setPrice] = useState({});
        let [nakladnaya, setNakladnaya] = useState({
            'p': {
                'i': 0,
                'm': {'v': 0, 'o': 0, 's': 0, 'pl': 0, 'ktt': 0, 'kd': 0, 'ps': 0},
                'ch': {'v': 0, 'o': 0, 's': 0, 'pl': 0, 'ktt': 0, 'kd': 0, 'ps': 0},
                'k': {'v': 0, 'o': 0, 's': 0, 'pl': 0, 'ktt': 0, 'kd': 0, 'ps': 0},
                'sl': {'v': 0, 'o': 0, 's': 0, 'pl': 0, 'ktt': 0, 'kd': 0, 'ps': 0},
                's02': {'v': 0, 'o': 0, 's': 0, 'pl': 0, 'ktt': 0, 'kd': 0, 'ps': 0},
                's04': {'v': 0, 'o': 0, 's': 0, 'pl': 0, 'ktt': 0, 'kd': 0, 'ps': 0},
                'b': {'v': 0, 'o': 0, 's': 0, 'pl': 0, 'ktt': 0, 'kd': 0, 'ps': 0},
            },
            'r': {
                'otr': 0,
                'oo': 100,
                'ntp': 0,
                'att': 0,
                'at': '',
                'vs': '',
                'inc': 0
            },
            'time': {
                'r': '',
                'd1': '',
                'd2': '',
                'd3': '',
                's': '',
            },
            'a': {
                'n': '',
                'r': '',
                'd1': '',
                'd2': '',
                'd3': '',
                's': '',
                'lkm': '',
            },
            'i': -100,
            'm': false,
        });
        let handleRashod =  (event, what) => {
            if(!nakladnaya['m']) {
                nakladnaya= {...nakladnaya}
                let litr = parseInt(event.target.value)
                if (isNaN(litr)) {
                    nakladnaya['r'][what] = ''
                } else {
                    nakladnaya['r'][what] = litr
                }
                nakladnaya['i'] = nakladnaya['p']['i'] - nakladnaya['r']['otr'] - nakladnaya['r']['oo'] - nakladnaya['r']['ntp'] - nakladnaya['r']['att'] - checkInt(nakladnaya['r']['at']) - checkInt(nakladnaya['r']['vs'])
                setNakladnaya(nakladnaya)
            }
        };
        let handleAuto =  (event, what) => {
            if(!nakladnaya['m']) {
                nakladnaya= {...nakladnaya}
                nakladnaya['a'][what] = event.target.value
                setNakladnaya(nakladnaya)
            }
        };
        let handlePodpis =  (event) => {
            nakladnaya= {...nakladnaya}
            nakladnaya['m'] = event.target.checked
            setNakladnaya(nakladnaya)
        };
         return (
            <div>
                <br/>
                <h1>Отчет организатора</h1>
                <b>Организатор:</b>&nbsp;{organizator}&nbsp;<b>Регион:</b>&nbsp;{region}
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
                <b>Выручка:</b>&nbsp;{nakladnaya.i}
                <br/>
                <br/>
                <ExpansionPanel>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography className={classes.heading}><b>Продано</b></Typography>
                        <Typography className={classes.secondaryHeading}>
                            <div style={{display: 'inline-block'}}>М: <b style={{color: 'black'}}>{nakladnaya.p.m.ps}</b>&nbsp;&nbsp;</div>
                            <div style={{display: 'inline-block'}}>Ч: <b style={{color: 'black'}}>{nakladnaya.p.ch.ps}</b>&nbsp;&nbsp;</div>
                            <div style={{display: 'inline-block'}}>К: <b style={{color: 'black'}}>{nakladnaya.p.k.ps}</b>&nbsp;&nbsp;</div>
                            <div style={{display: 'inline-block'}}>СЛ: <b style={{color: 'black'}}>{nakladnaya.p.sl.ps}</b>&nbsp;&nbsp;</div>
                            <div style={{display: 'inline-block'}}>И: <b style={{color: 'black'}}>{nakladnaya.p.i}</b>&nbsp;&nbsp;</div>
                        </Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails style={{padding: '0px'}}>
                        <ExpansionPanel style={{width: '100%'}}>
                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography className={classes.heading}>Максым</Typography>
                                <Typography className={classes.secondaryHeading}>
                                    <div style={{display: 'inline-block'}}>В: <b style={{color: 'black'}}>{nakladnaya.p.m.v}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>О: <b style={{color: 'black'}}>{nakladnaya.p.m.o}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>С: <b style={{color: 'black'}}>{nakladnaya.p.m.s}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>П: <b style={{color: 'black'}}>{nakladnaya.p.m.pl}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>к Т.Т.: <b style={{color: 'black'}}>{nakladnaya.p.m.ktt}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>к Д.: <b style={{color: 'black'}}>{nakladnaya.p.m.kd}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>П: <b style={{color: 'black'}}>{nakladnaya.p.m.ps}</b>&nbsp;&nbsp;</div>
                                </Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Выдано:
                                    </div>
                                    &nbsp;{nakladnaya.p.m.v}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Остаток съем:
                                    </div>
                                    &nbsp;{nakladnaya.p.m.o}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Списание по акту:
                                    </div>
                                    &nbsp;{nakladnaya.p.m.s}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Продано литров:
                                    </div>
                                    &nbsp;{nakladnaya.p.m.pl}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Количество Т.Т.:
                                    </div>
                                    &nbsp;{nakladnaya.p.m.ktt}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Количество доливов:
                                    </div>
                                    &nbsp;{nakladnaya.p.m.kd}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Продано сом:
                                    </div>
                                    &nbsp;{nakladnaya.p.m.ps}
                                </center>
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                    </ExpansionPanelDetails>
                    <ExpansionPanelDetails style={{padding: '0px'}}>
                        <ExpansionPanel style={{width: '100%'}}>
                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography className={classes.heading}>Чалап</Typography>
                                <Typography className={classes.secondaryHeading}>
                                    <div style={{display: 'inline-block'}}>В: <b style={{color: 'black'}}>{nakladnaya.p.ch.v}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>О: <b style={{color: 'black'}}>{nakladnaya.p.ch.o}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>С: <b style={{color: 'black'}}>{nakladnaya.p.ch.s}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>П: <b style={{color: 'black'}}>{nakladnaya.p.ch.pl}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>к Т.Т.: <b style={{color: 'black'}}>{nakladnaya.p.ch.ktt}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>к Д.: <b style={{color: 'black'}}>{nakladnaya.p.ch.kd}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>П: <b style={{color: 'black'}}>{nakladnaya.p.ch.ps}</b>&nbsp;&nbsp;</div>
                                </Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Выдано:
                                    </div>
                                    &nbsp;{nakladnaya.p.ch.v}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Остаток съем:
                                    </div>
                                    &nbsp;{nakladnaya.p.ch.o}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Списание по акту:
                                    </div>
                                    &nbsp;{nakladnaya.p.ch.o}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Продано литров:
                                    </div>
                                    &nbsp;{nakladnaya.p.ch.pl}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Количество Т.Т.:
                                    </div>
                                    &nbsp;{nakladnaya.p.ch.ktt}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Количество доливов:
                                    </div>
                                    &nbsp;{nakladnaya.p.ch.kd}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Продано сом:
                                    </div>
                                    &nbsp;{nakladnaya.p.ch.ps}
                                </center>
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                    </ExpansionPanelDetails>
                    <ExpansionPanelDetails style={{padding: '0px'}}>
                        <ExpansionPanel style={{width: '100%'}}>
                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography className={classes.heading}>Квас</Typography>
                                <Typography className={classes.secondaryHeading}>
                                    <div style={{display: 'inline-block'}}>В: <b style={{color: 'black'}}>{nakladnaya.p.k.v}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>О: <b style={{color: 'black'}}>{nakladnaya.p.k.o}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>С: <b style={{color: 'black'}}>{nakladnaya.p.k.s}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>П: <b style={{color: 'black'}}>{nakladnaya.p.k.pl}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>к Т.Т.: <b style={{color: 'black'}}>{nakladnaya.p.k.ktt}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>к Д.: <b style={{color: 'black'}}>{nakladnaya.p.k.kd}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>П: <b style={{color: 'black'}}>{nakladnaya.p.k.ps}</b>&nbsp;&nbsp;</div>
                                </Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Выдано:
                                    </div>
                                    &nbsp;{nakladnaya.p.k.v}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Остаток съем:
                                    </div>
                                    &nbsp;{nakladnaya.p.k.o}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Списание по акту:
                                    </div>
                                    &nbsp;{nakladnaya.p.k.o}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Продано литров:
                                    </div>
                                    &nbsp;{nakladnaya.p.k.pl}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Количество Т.Т.:
                                    </div>
                                    &nbsp;{nakladnaya.p.k.ktt}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Количество доливов:
                                    </div>
                                    &nbsp;{nakladnaya.p.k.kd}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Продано сом:
                                    </div>
                                    &nbsp;{nakladnaya.p.k.ps}
                                </center>
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                    </ExpansionPanelDetails>
                    <ExpansionPanelDetails style={{padding: '0px'}}>
                        <ExpansionPanel style={{width: '100%'}}>
                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography className={classes.heading}>Стакан Легенда</Typography>
                                <Typography className={classes.secondaryHeading}>
                                    <div style={{display: 'inline-block'}}>В: <b style={{color: 'black'}}>{nakladnaya.p.sl.v}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>О: <b style={{color: 'black'}}>{nakladnaya.p.sl.o}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>С: <b style={{color: 'black'}}>{nakladnaya.p.sl.s}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>П: <b style={{color: 'black'}}>{nakladnaya.p.sl.pl}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>к Т.Т.: <b style={{color: 'black'}}>{nakladnaya.p.sl.ktt}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>к Д.: <b style={{color: 'black'}}>{nakladnaya.p.sl.kd}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>П: <b style={{color: 'black'}}>{nakladnaya.p.sl.ps}</b>&nbsp;&nbsp;</div>
                                </Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Выдано:
                                    </div>
                                    &nbsp;{nakladnaya.p.sl.v}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Остаток съем:
                                    </div>
                                    &nbsp;{nakladnaya.p.sl.o}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Списание по акту:
                                    </div>
                                    &nbsp;{nakladnaya.p.sl.o}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Продано штук:
                                    </div>
                                    &nbsp;{nakladnaya.p.sl.pl}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Количество Т.Т.:
                                    </div>
                                    &nbsp;{nakladnaya.p.sl.ktt}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Количество доливов:
                                    </div>
                                    &nbsp;{nakladnaya.p.sl.kd}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Продано сом:
                                    </div>
                                    &nbsp;{nakladnaya.p.sl.ps}
                                </center>
                            </ExpansionPanelDetails>
                        </ExpansionPanel>

                    </ExpansionPanelDetails>
                    <ExpansionPanelDetails style={{padding: '0px'}}>
                        <ExpansionPanel style={{width: '100%'}}>
                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography className={classes.heading}>Стакан 0,2</Typography>
                                <Typography className={classes.secondaryHeading}>
                                    <div style={{display: 'inline-block'}}>В: <b style={{color: 'black'}}>{nakladnaya.p.s02.v}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>О: <b style={{color: 'black'}}>{nakladnaya.p.s02.o}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>С: <b style={{color: 'black'}}>{nakladnaya.p.s02.s}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>П: <b style={{color: 'black'}}>{nakladnaya.p.s02.pl}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>к Т.Т.: <b style={{color: 'black'}}>{nakladnaya.p.s02.ktt}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>к Д.: <b style={{color: 'black'}}>{nakladnaya.p.s02.kd}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>П: <b style={{color: 'black'}}>{nakladnaya.p.s02.ps}</b>&nbsp;&nbsp;</div>
                                </Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Выдано:
                                    </div>
                                    &nbsp;{nakladnaya.p.s02.v}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Остаток съем:
                                    </div>
                                    &nbsp;{nakladnaya.p.s02.o}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Списание по акту:
                                    </div>
                                    &nbsp;{nakladnaya.p.s02.o}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Продано штук:
                                    </div>
                                    &nbsp;{nakladnaya.p.s02.pl}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Количество Т.Т.:
                                    </div>
                                    &nbsp;{nakladnaya.p.s02.ktt}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Количество доливов:
                                    </div>
                                    &nbsp;{nakladnaya.p.s02.kd}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Продано сом:
                                    </div>
                                    &nbsp;{nakladnaya.p.s02.ps}
                                </center>
                            </ExpansionPanelDetails>
                        </ExpansionPanel>

                    </ExpansionPanelDetails>
                    <ExpansionPanelDetails style={{padding: '0px'}}>
                        <ExpansionPanel style={{width: '100%'}}>
                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography className={classes.heading}>Стакан 0.4</Typography>
                                <Typography className={classes.secondaryHeading}>
                                    <div style={{display: 'inline-block'}}>В: <b style={{color: 'black'}}>{nakladnaya.p.s04.v}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>О: <b style={{color: 'black'}}>{nakladnaya.p.s04.o}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>С: <b style={{color: 'black'}}>{nakladnaya.p.s04.s}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>П: <b style={{color: 'black'}}>{nakladnaya.p.s04.pl}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>к Т.Т.: <b style={{color: 'black'}}>{nakladnaya.p.s04.ktt}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>к Д.: <b style={{color: 'black'}}>{nakladnaya.p.s04.kd}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>П: <b style={{color: 'black'}}>{nakladnaya.p.s04.ps}</b>&nbsp;&nbsp;</div>
                                </Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Выдано:
                                    </div>
                                    &nbsp;{nakladnaya.p.s04.v}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Остаток съем:
                                    </div>
                                    &nbsp;{nakladnaya.p.s04.o}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Списание по акту:
                                    </div>
                                    &nbsp;{nakladnaya.p.s04.o}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Продано штук:
                                    </div>
                                    &nbsp;{nakladnaya.p.s04.pl}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Количество Т.Т.:
                                    </div>
                                    &nbsp;{nakladnaya.p.s04.ktt}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Количество доливов:
                                    </div>
                                    &nbsp;{nakladnaya.p.s04.kd}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Продано сом:
                                    </div>
                                    &nbsp;{nakladnaya.p.s04.ps}
                                </center>
                            </ExpansionPanelDetails>
                        </ExpansionPanel>

                    </ExpansionPanelDetails>
                    <ExpansionPanelDetails style={{padding: '0px'}}>
                        <ExpansionPanel style={{width: '100%'}}>
                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography className={classes.heading}>Бутылка</Typography>
                                <Typography className={classes.secondaryHeading}>
                                    <div style={{display: 'inline-block'}}>В: <b style={{color: 'black'}}>{nakladnaya.p.b.v}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>О: <b style={{color: 'black'}}>{nakladnaya.p.b.o}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>С: <b style={{color: 'black'}}>{nakladnaya.p.b.s}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>П: <b style={{color: 'black'}}>{nakladnaya.p.b.pl}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>к Т.Т.: <b style={{color: 'black'}}>{nakladnaya.p.b.ktt}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>к Д.: <b style={{color: 'black'}}>{nakladnaya.p.b.kd}</b>&nbsp;&nbsp;</div>
                                    <div style={{display: 'inline-block'}}>П: <b style={{color: 'black'}}>{nakladnaya.p.b.ps}</b>&nbsp;&nbsp;</div>
                                </Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Выдано:
                                    </div>
                                    &nbsp;{nakladnaya.p.b.v}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Остаток съем:
                                    </div>
                                    &nbsp;{nakladnaya.p.b.o}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Списание по акту:
                                    </div>
                                    &nbsp;{nakladnaya.p.b.o}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Продано штук:
                                    </div>
                                    &nbsp;{nakladnaya.p.b.pl}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Количество Т.Т.:
                                    </div>
                                    &nbsp;{nakladnaya.p.b.ktt}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Количество доливов:
                                    </div>
                                    &nbsp;{nakladnaya.p.b.kd}
                                </center>
                            </ExpansionPanelDetails>
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Продано сом:
                                    </div>
                                    &nbsp;{nakladnaya.p.b.ps}
                                </center>
                            </ExpansionPanelDetails>
                        </ExpansionPanel>

                    </ExpansionPanelDetails>
                    <br/>
                </ExpansionPanel>

                <ExpansionPanel>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography className={classes.heading}>Расходы</Typography>
                        <Typography className={classes.secondaryHeading}>
                            <div style={{display: 'inline-block'}}>Отп: <b style={{color: 'black'}}>{nakladnaya.r.otr}</b>&nbsp;&nbsp;</div>
                            <div style={{display: 'inline-block'}}>Оо: <b style={{color: 'black'}}>{nakladnaya.r.oo}</b>&nbsp;&nbsp;</div>
                            <div style={{display: 'inline-block'}}>Нтп: <b style={{color: 'black'}}>{nakladnaya.r.ntp}</b>&nbsp;&nbsp;</div>
                            <div style={{display: 'inline-block'}}>Атт: <b style={{color: 'black'}}>{nakladnaya.r.att}</b>&nbsp;&nbsp;</div>
                            <div style={{display: 'inline-block'}}>Ат: <b style={{color: 'black'}}>{nakladnaya.r.at}</b>&nbsp;&nbsp;</div>
                            <div style={{display: 'inline-block'}}>В: <b style={{color: 'black'}}>{nakladnaya.r.vs}</b>&nbsp;&nbsp;</div>
                        </Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails style={{padding: '0px'}}>
                        <center style={{width: '100%'}}>
                            <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                Обед торгового представителя:
                            </div>
                            &nbsp;{nakladnaya.r.otr}
                        </center>
                    </ExpansionPanelDetails>
                    <br/>
                    <br/>
                    <ExpansionPanelDetails style={{padding: '0px'}}>
                        <center style={{width: '100%'}}>
                            <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                Обед организатора:
                            </div>
                            &nbsp;{nakladnaya.r.oo}
                        </center>
                    </ExpansionPanelDetails>
                    <ExpansionPanelDetails style={{padding: '0px'}}>
                        <center style={{width: '100%'}}>
                            <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                Недосдача торгового представителя:
                            </div>
                            &nbsp;{nakladnaya.r.ntp}
                        </center>
                    </ExpansionPanelDetails>
                    <ExpansionPanelDetails style={{padding: '0px'}}>
                        <center style={{width: '100%'}}>
                            <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                Инкассация:
                            </div>
                            &nbsp;{nakladnaya.r.inc}
                        </center>
                    </ExpansionPanelDetails>
                    <ExpansionPanelDetails style={{padding: '0px'}}>
                        <center style={{width: '100%'}}>
                            <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                Аренда торговой точки:
                            </div>
                            &nbsp;{nakladnaya.r.att}
                        </center>
                    </ExpansionPanelDetails>
                    <ExpansionPanelDetails style={{padding: '0px'}}>
                        <center style={{width: '100%'}}>
                            <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                Аренда тачки:
                            </div>
                            <TextField
                                disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.m}
                                style={{width: '70px', display: 'inline-block', verticalAlign: 'middle'}}
                                type="number"
                                margin='normal'
                                value={nakladnaya.r.at}
                                onChange={(event)=>{handleRashod(event, 'at')}}
                            />
                        </center>
                    </ExpansionPanelDetails>
                    <ExpansionPanelDetails style={{padding: '0px'}}>
                        <center style={{width: '100%'}}>
                            <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                Въезд на рынок, стоянка:
                            </div>
                            <TextField
                                disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.m}
                                style={{width: '70px', display: 'inline-block', verticalAlign: 'middle'}}
                                type="number"
                                margin='normal'
                                value={nakladnaya.r.vs}
                                onChange={(event)=>{handleRashod(event, 'vs')}}
                            />
                        </center>
                    </ExpansionPanelDetails>
                </ExpansionPanel>

                <ExpansionPanel>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography className={classes.heading}>Авто</Typography>
                        <Typography className={classes.secondaryHeading}>
                            <div style={{display: 'inline-block'}}>№: <b style={{color: 'black'}}>{nakladnaya.a.n}</b>&nbsp;&nbsp;</div>
                            <div style={{display: 'inline-block'}}>Р: <b style={{color: 'black'}}>{nakladnaya.a.r}</b>&nbsp;&nbsp;</div>
                            <div style={{display: 'inline-block'}}>Д1: <b style={{color: 'black'}}>{nakladnaya.a.d1}</b>&nbsp;&nbsp;</div>
                            <div style={{display: 'inline-block'}}>Д2: <b style={{color: 'black'}}>{nakladnaya.a.d2}</b>&nbsp;&nbsp;</div>
                            <div style={{display: 'inline-block'}}>Д3: <b style={{color: 'black'}}>{nakladnaya.a.d3}</b>&nbsp;&nbsp;</div>
                            <div style={{display: 'inline-block'}}>С: <b style={{color: 'black'}}>{nakladnaya.a.s}</b>&nbsp;&nbsp;</div>
                            <div style={{display: 'inline-block'}}>Лкм: <b style={{color: 'black'}}>{nakladnaya.a.lkm}</b>&nbsp;&nbsp;</div>
                        </Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails style={{padding: '0px'}}>
                        <center style={{width: '100%'}}>
                            <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                авто:
                            </div>
                            <TextField
                                disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.m}
                                select
                                style={{width: '120px'}}
                                className={classes.textField}
                                value={nakladnaya.a.n}
                                onChange={(event)=>{handleAuto(event, 'n')}}
                                SelectProps={{
                                    MenuProps: {
                                        className: classes.menu,
                                    },
                                }}
                                margin='normal'
                            >
                                {autos.map((option, idx) => (
                                    <MenuItem key={idx} value={option}>
                                        {option}
                                    </MenuItem>
                                ))
                                }
                            </TextField>
                        </center>
                    </ExpansionPanelDetails>
                    <ExpansionPanelDetails style={{padding: '0px'}}>
                        <center style={{width: '100%'}}>
                            <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                Растановка:
                            </div>
                            <TextField
                                disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.m}
                                style={{width: '70px', display: 'inline-block', verticalAlign: 'middle'}}
                                type="login"
                                margin='normal'
                                value={nakladnaya.a.r}
                                onChange={(event)=>{handleAuto(event, 'r')}}
                            />
                        </center>
                    </ExpansionPanelDetails>
                    <ExpansionPanelDetails style={{padding: '0px'}}>
                        <center style={{width: '100%'}}>
                            <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                1-й долив:
                            </div>
                            <TextField
                                disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.m}
                                style={{width: '70px', display: 'inline-block', verticalAlign: 'middle'}}
                                type="login"
                                margin='normal'
                                value={nakladnaya.a.d1}
                                onChange={(event)=>{handleAuto(event, 'd1')}}
                            />
                        </center>
                    </ExpansionPanelDetails>
                    <ExpansionPanelDetails style={{padding: '0px'}}>
                        <center style={{width: '100%'}}>
                            <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                2-й долив:
                            </div>
                            <TextField
                                disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.m}
                                style={{width: '70px', display: 'inline-block', verticalAlign: 'middle'}}
                                type="login"
                                margin='normal'
                                value={nakladnaya.a.d2}
                                onChange={(event)=>{handleAuto(event, 'd2')}}
                            />
                        </center>
                    </ExpansionPanelDetails>
                    <ExpansionPanelDetails style={{padding: '0px'}}>
                        <center style={{width: '100%'}}>
                            <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                3-й долив:
                            </div>
                            <TextField
                                disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.m}
                                style={{width: '70px', display: 'inline-block', verticalAlign: 'middle'}}
                                type="login"
                                margin='normal'
                                value={nakladnaya.a.d3}
                                onChange={(event)=>{handleAuto(event, 'd3')}}
                            />
                        </center>
                    </ExpansionPanelDetails>
                    <ExpansionPanelDetails style={{padding: '0px'}}>
                        <center style={{width: '100%'}}>
                            <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                Съем:
                            </div>
                            <TextField
                                disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.m}
                                style={{width: '70px', display: 'inline-block', verticalAlign: 'middle'}}
                                type="login"
                                margin='normal'
                                value={nakladnaya.a.s}
                                onChange={(event)=>{handleAuto(event, 's')}}
                            />
                        </center>
                    </ExpansionPanelDetails>
                    <ExpansionPanelDetails style={{padding: '0px'}}>
                        <center style={{width: '100%'}}>
                            <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                Лишние км:
                            </div>
                            <TextField
                                disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.m}
                                style={{width: '70px', display: 'inline-block', verticalAlign: 'middle'}}
                                type="number"
                                margin='normal'
                                value={nakladnaya.a.lkm}
                                onChange={(event)=>{handleAuto(event, 'lkm')}}
                            />
                        </center>
                    </ExpansionPanelDetails>
                </ExpansionPanel>

                <ExpansionPanel>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography className={classes.heading}>Время</Typography>
                        <Typography className={classes.secondaryHeading}>
                            <div style={{display: 'inline-block'}}>Р: <b style={{color: 'black'}}>{nakladnaya.time!==undefined?nakladnaya.time.r:''}</b>&nbsp;&nbsp;</div>
                            <div style={{display: 'inline-block'}}>Д1: <b style={{color: 'black'}}>{nakladnaya.time!==undefined?nakladnaya.time.d1:''}</b>&nbsp;&nbsp;</div>
                            <div style={{display: 'inline-block'}}>Д2: <b style={{color: 'black'}}>{nakladnaya.time!==undefined?nakladnaya.time.d2:''}</b>&nbsp;&nbsp;</div>
                            <div style={{display: 'inline-block'}}>Д3: <b style={{color: 'black'}}>{nakladnaya.time!==undefined?nakladnaya.time.d3:''}</b>&nbsp;&nbsp;</div>
                            <div style={{display: 'inline-block'}}>С: <b style={{color: 'black'}}>{nakladnaya.time!==undefined?nakladnaya.time.s:''}</b>&nbsp;&nbsp;</div>
                        </Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails style={{padding: '0px'}}>
                        <center style={{width: '100%'}}>
                            <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                Растановка:
                            </div>
                            &nbsp;{nakladnaya.time!==undefined?nakladnaya.time.r:''}
                        </center>
                    </ExpansionPanelDetails>
                    <ExpansionPanelDetails style={{padding: '0px'}}>
                        <center style={{width: '100%'}}>
                            <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                1-й долив:
                            </div>
                            &nbsp;{nakladnaya.time!==undefined?nakladnaya.time.d1:''}
                        </center>
                    </ExpansionPanelDetails>
                    <ExpansionPanelDetails style={{padding: '0px'}}>
                        <center style={{width: '100%'}}>
                            <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                2-й долив:
                            </div>
                            &nbsp;{nakladnaya.time!==undefined?nakladnaya.time.d2:''}
                        </center>
                    </ExpansionPanelDetails>
                    <ExpansionPanelDetails style={{padding: '0px'}}>
                        <center style={{width: '100%'}}>
                            <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                3-й долив:
                            </div>
                            &nbsp;{nakladnaya.time!==undefined?nakladnaya.time.d3:''}
                        </center>
                    </ExpansionPanelDetails>
                    <ExpansionPanelDetails style={{padding: '0px'}}>
                        <center style={{width: '100%'}}>
                            <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                Съем:
                            </div>
                            &nbsp;{nakladnaya.time!==undefined?nakladnaya.time.s:''}
                        </center>
                    </ExpansionPanelDetails>
                </ExpansionPanel>

                <center style={{width: '100%'}}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={nakladnaya.m}
                                color='primary'
                                disabled={status.role==='admin'?false:checkDate||nakladnaya.m||status.role!=='admin'}
                                onChange={(event)=>{handlePodpis(event)}}
                            />
                        }
                        label='Принят'
                    />
                </center>
                <br/>
                <div>
                    <Link className='link' to={''}>
                        <Button variant='contained' color='primary' onClick={()=>{
                            if(guidRegion!=='lol'){
                                if(selected===-1)
                                    addData({search: '', sort: '', page: 0, name: 'Отчет организатора', data: {
                                        dataTable: JSON.stringify(nakladnaya),
                                        data: date,
                                        organizator: organizator,
                                        region: region,
                                        guidOrganizator: guidOrganizator,
                                        guidRegion: guidRegion,
                                        disabled: disabled
                                    }});
                                else
                                    setData({id: id, search: '', sort: '', page: 0, name: 'Отчет организатора', data: {
                                        dataTable: JSON.stringify(nakladnaya),
                                        data: date,
                                        organizator: organizator,
                                        region: region,
                                        guidOrganizator: guidOrganizator,
                                        guidRegion: guidRegion,
                                        disabled: disabled
                                    }});
                                setSelected(-1)
                            }}} className={classes.button}>
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
