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

const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
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
        const { status } = props.user;
        if (!(status.status==='active'&&['admin', 'организатор', 'завсклада'].includes(status.role))) {
            props.history.push('/')
        }
        useEffect( ()=>{
            async function fetchData() {
                if(selected===-1) {
                let _data = await tableActions.getDataSimple({name: 'ОрганизаторПоID'})
                 if(_data!==undefined){
                     let date = new Date()
                     date = JSON.stringify(date).split('-')
                     date = date[2].split('T')[0]+' '+month[parseInt(date[1])-1]+' '+date[0].replace('"', '')
                     let _data1 = await tableActions.getDataSimple({name: 'Накладная на пустую тару по данным', data: {
                         data: date, organizator: _data.guid, region: _data.guidRegion}})
                     if(_data1!==undefined&&_data1!==''){
                         setDate(_data1.data)
                         setOrganizator(_data1.organizator)
                         setRegion(_data1.region)
                         setGuidOrganizator(_data1.guidOrganizator)
                         setGuidRegion(_data1.guidRegion)
                         setNakladnaya(JSON.parse(_data1.dataTable))
                         setId(_data1._id)
                     } else {
                         setRegion(_data.region)
                         setOrganizator(_data.name)
                         setGuidOrganizator(_data.guid)
                         setGuidRegion(_data.guidRegion)
                         let date = new Date()
                         date = JSON.stringify(date).split('-')
                         date = date[2].split('T')[0]+' '+month[parseInt(date[1])-1]+' '+date[0].replace('"', '')
                         setDate(date)
                         check(date, _data.guid, _data.guidRegion)
                 }
                }
            }
                else {
                let _data = await tableActions.getDataSimple({name: 'Накладная на пустую тару по данным',
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
        const { setSelected, addData, setData, setSelectedRegion } = props.tableActions;
        const { selected, data, name } = props.table;
        const { classes } = props;
        let [organizator, setOrganizator] = useState('');
        let [region, setRegion] = useState('');
        let [guidOrganizator, setGuidOrganizator] = useState('');
        let [guidRegion, setGuidRegion] = useState('');
        useEffect( ()=>{
            if(region!==undefined&&region.length>0)
                setSelectedRegion(guidRegion)
        },[guidRegion])
        let [checkDate, setCheckDate] = useState(false);
        let [date, setDate] = useState('');
        let [date1, setDate1] = useState(new Date());
        let handleDate1 =  async (date) => {
            setNakladnaya({
                'r': {'m25':'', 'm10':'', 'ch25':'', 'ch10':'', 'k25':'', 'k10':'', 'o': false, 'p': false},
                'd1':{'m25':'', 'm10':'', 'ch25':'', 'ch10':'', 'k25':'', 'k10':'', 'o': false, 'p': false},
                'd2':{'m25':'', 'm10':'', 'ch25':'', 'ch10':'', 'k25':'', 'k10':'', 'o': false, 'p': false},
                'd3':{'m25':'', 'm10':'', 'ch25':'', 'ch10':'', 'k25':'', 'k10':'', 'o': false, 'p': false},
                's':{'m25':'', 'm10':'', 'ch25':'', 'ch10':'', 'k25':'', 'k10':'', 'o': false, 'p': false},
                'i':{'m25':'', 'm10':'', 'ch25':'', 'ch10':'', 'k25':'', 'k10':'', 'o': false, 'p': false},
                'ostalos':{'m25':'', 'm10':'', 'ch25':'', 'ch10':'', 'k25':'', 'k10':'', 'o': false, 'p': false}
            });
            setId('')
            setDate1(date)
            date = JSON.stringify(date).split('-')
            date = date[2].split('T')[0]+' '+month[parseInt(date[1])-1]+' '+date[0].replace('"', '')
            setDate(date)
        };
        let [disabled, setDisabled] = useState(false);
        let [id, setId] = useState('');
        let [nakladnaya, setNakladnaya] = useState({
            'r': {'m25':'', 'm10':'', 'ch25':'', 'ch10':'', 'k25':'', 'k10':'', 'o': false, 'p': false},
            'd1':{'m25':'', 'm10':'', 'ch25':'', 'ch10':'', 'k25':'', 'k10':'', 'o': false, 'p': false},
            'd2':{'m25':'', 'm10':'', 'ch25':'', 'ch10':'', 'k25':'', 'k10':'', 'o': false, 'p': false},
            'd3':{'m25':'', 'm10':'', 'ch25':'', 'ch10':'', 'k25':'', 'k10':'', 'o': false, 'p': false},
            's':{'m25':'', 'm10':'', 'ch25':'', 'ch10':'', 'k25':'', 'k10':'', 'o': false, 'p': false},
            'i':{'m25':'', 'm10':'', 'ch25':'', 'ch10':'', 'k25':'', 'k10':'', 'o': false, 'p': false},
            'ostalos':{'m25':'', 'm10':'', 'ch25':'', 'ch10':'', 'k25':'', 'k10':'', 'o': false, 'p': false}
        });
        let handleLitr = async (event, type, what) => {
            if(!nakladnaya[type]['o']) {
                nakladnaya= {...nakladnaya}
                let litr = parseInt(event.target.value)
                if (isNaN(litr)) {
                    nakladnaya[type][what] = ''
                } else {
                    nakladnaya[type][what] = litr
                }
                nakladnaya['i'][what] = checkInt(nakladnaya['r'][what]) + checkInt(nakladnaya['d1'][what]) + checkInt(nakladnaya['d2'][what]) + checkInt(nakladnaya['d3'][what]) + checkInt(nakladnaya['s'][what])
                setNakladnaya(nakladnaya)
                check(date, guidOrganizator, guidRegion)
            }
        };
        let handlePodpis =  (event, type, what) => {
            nakladnaya= {...nakladnaya}
            nakladnaya[type][what] = event.target.checked
            setNakladnaya(nakladnaya)
        };
        let check = async (date, organizator, region) => {
            let _data1 = await tableActions.getDataSimple({name: 'Накладная склад №1 по данным', data: {data: date, organizator: organizator, region: region}})
            if(_data1!==undefined&&_data1.dataTable!==undefined){
                nakladnaya= {...nakladnaya}
                let dataTable = JSON.parse(_data1.dataTable)
                nakladnaya['ostalos']['m25'] = checkInt(dataTable['vozvrat']['i']['m25']) - checkInt(nakladnaya['i']['m25'])
                nakladnaya['ostalos']['ch10'] = checkInt(dataTable['vozvrat']['i']['ch10']) - checkInt(nakladnaya['i']['ch10'])
                nakladnaya['ostalos']['ch25'] = checkInt(dataTable['vozvrat']['i']['ch25']) - checkInt(nakladnaya['i']['ch25'])
                nakladnaya['ostalos']['k10'] = checkInt(dataTable['vozvrat']['i']['k10']) - checkInt(nakladnaya['i']['k10'])
                setNakladnaya(nakladnaya)
            }
        };
         return (
            <div>
                <br/>
                <h1>Накладная на пустую тару</h1>
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
                <br/>
                <ExpansionPanel>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography className={classes.heading}>Растановка</Typography>
                        <Typography className={classes.secondaryHeading}>
                            <div style={{display: 'inline-block'}}>М25: <b style={{color: 'black'}}>{nakladnaya.r.m25}</b>&nbsp;&nbsp;</div>
                            <div style={{display: 'inline-block'}}>Ч25: <b style={{color: 'black'}}>{nakladnaya.r.ch25}</b>&nbsp;&nbsp;</div>
                            <div style={{display: 'inline-block'}}>Ч10: <b style={{color: 'black'}}>{nakladnaya.r.ch10}</b>&nbsp;&nbsp;</div>
                            <div style={{display: 'inline-block'}}>К10: <b style={{color: 'black'}}>{nakladnaya.r.k10}</b>&nbsp;&nbsp;</div>
                        </Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails style={{padding: '0px'}}>
                        <center style={{width: '100%'}}>
                            <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                Максым 25:
                            </div>
                            <TextField
                                disabled={status.role==='admin'?false:(status.role!=='организатор'||nakladnaya.r.o||checkDate)}
                                style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                type='number'
                                margin='normal'
                                value={nakladnaya.r.m25}
                                onChange={(event)=>{handleLitr(event, 'r', 'm25')}}
                            />
                        </center>
                    </ExpansionPanelDetails>
                    <ExpansionPanelDetails style={{padding: '0px'}}>
                        <center style={{width: '100%'}}>
                            <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                Чалап 25:
                            </div>
                            <TextField
                                disabled={status.role==='admin'?false:(status.role!=='организатор'||nakladnaya.r.o||checkDate)}
                                style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                type='number'
                                margin='normal'
                                value={nakladnaya.r.ch25}
                                onChange={(event)=>{handleLitr(event, 'r', 'ch25')}}
                            />
                        </center>
                    </ExpansionPanelDetails>
                    <ExpansionPanelDetails style={{padding: '0px'}}>
                        <center style={{width: '100%'}}>
                            <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                Чалап 10:
                            </div>
                            <TextField
                                disabled={status.role==='admin'?false:(status.role!=='организатор'||nakladnaya.r.o||checkDate)}
                                style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                type='number'
                                margin='normal'
                                value={nakladnaya.r.ch10}
                                onChange={(event)=>{handleLitr(event, 'r', 'ch10')}}
                            />
                        </center>
                    </ExpansionPanelDetails>
                    <ExpansionPanelDetails style={{padding: '0px'}}>
                        <center style={{width: '100%'}}>
                            <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                Квас 10:
                            </div>
                            <TextField
                                disabled={status.role==='admin'?false:(status.role!=='организатор'||nakladnaya.r.o||checkDate)}
                                style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                type='number'
                                margin='normal'
                                value={nakladnaya.r.k10}
                                onChange={(event)=>{handleLitr(event, 'r', 'k10')}}
                            />
                        </center>
                    </ExpansionPanelDetails>
                    <ExpansionPanelDetails style={{padding: '0px'}}>
                        <center style={{width: '100%'}}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={nakladnaya.r.o}
                                        color='primary'
                                        disabled={status.role==='admin'?false:nakladnaya.r.p||status.role!=='организатор'||checkDate}
                                        onChange={(event)=>{handlePodpis(event, 'r', 'o')}}
                                    />
                                }
                                label='Отпустил'
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={nakladnaya.r.p}
                                        color='primary'
                                        disabled={status.role==='admin'?false:nakladnaya.r.p||!nakladnaya.r.o||status.role!=='завсклада'||checkDate}
                                        onChange={(event)=>{handlePodpis(event, 'r', 'p')}}
                                    />
                                }
                                label='Принял'
                            />
                        </center>
                    </ExpansionPanelDetails>
                    <br/>
                </ExpansionPanel>

                <ExpansionPanel>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography className={classes.heading}>1-й долив</Typography>
                        <Typography className={classes.secondaryHeading}>
                            <div style={{display: 'inline-block'}}>М25: <b style={{color: 'black'}}>{nakladnaya.d1.m25}</b>&nbsp;&nbsp;</div>
                            <div style={{display: 'inline-block'}}>Ч25: <b style={{color: 'black'}}>{nakladnaya.d1.ch25}</b>&nbsp;&nbsp;</div>
                            <div style={{display: 'inline-block'}}>Ч10: <b style={{color: 'black'}}>{nakladnaya.d1.ch10}</b>&nbsp;&nbsp;</div>
                            <div style={{display: 'inline-block'}}>К10: <b style={{color: 'black'}}>{nakladnaya.d1.k10}</b>&nbsp;&nbsp;</div>
                        </Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails style={{padding: '0px'}}>
                        <center style={{width: '100%'}}>
                            <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                Максым 25:
                            </div>
                            <TextField
                                disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.d1.o}
                                style={{width: '70px', display: 'inline-block', verticalAlign: 'middle'}}
                                type='number'
                                margin='normal'
                                value={nakladnaya.d1.m25}
                                onChange={(event)=>{handleLitr(event, 'd1', 'm25')}}
                            />
                        </center>
                    </ExpansionPanelDetails>
                    <ExpansionPanelDetails style={{padding: '0px'}}>
                        <center style={{width: '100%'}}>
                            <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                Чалап 25:
                            </div>
                            <TextField
                                disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.d1.o}
                                style={{width: '70px', display: 'inline-block', verticalAlign: 'middle'}}
                                type='number'
                                margin='normal'
                                value={nakladnaya.d1.ch25}
                                onChange={(event)=>{handleLitr(event, 'd1', 'ch25')}}
                            />
                        </center>
                    </ExpansionPanelDetails>
                    <ExpansionPanelDetails style={{padding: '0px'}}>
                        <center style={{width: '100%'}}>
                            <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                Чалап 10:
                            </div>
                            <TextField
                                disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.d1.o }
                                style={{width: '70px', display: 'inline-block', verticalAlign: 'middle'}}
                                type='number'
                                margin='normal'
                                value={nakladnaya.d1.ch10}
                                onChange={(event)=>{handleLitr(event, 'd1', 'ch10')}}
                            />
                        </center>
                    </ExpansionPanelDetails>
                    <ExpansionPanelDetails style={{padding: '0px'}}>
                        <center style={{width: '100%'}}>
                            <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                Квас 10:
                            </div>
                            <TextField
                                disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.d1.o }
                                style={{width: '70px', display: 'inline-block', verticalAlign: 'middle'}}
                                type='number'
                                margin='normal'
                                value={nakladnaya.d1.k10}
                                onChange={(event)=>{handleLitr(event, 'd1', 'k10')}}
                            />
                        </center>
                    </ExpansionPanelDetails>
                    <ExpansionPanelDetails style={{padding: '0px'}}>
                        <center style={{width: '100%'}}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={nakladnaya.d1.o}
                                        color='primary'
                                        disabled={status.role==='admin'?false:checkDate||nakladnaya.d1.p||status.role!=='организатор' }
                                        onChange={(event)=>{handlePodpis(event, 'd1', 'o')}}
                                    />
                                }
                                label='Отпустил'
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={nakladnaya.d1.p}
                                        color='primary'
                                        disabled={status.role==='admin'?false:checkDate||nakladnaya.d1.p||disabled||!nakladnaya.d1.o||status.role!=='завсклада' }
                                        onChange={(event)=>{handlePodpis(event, 'd1', 'p')}}
                                    />
                                }
                                label='Принял'
                            />
                        </center>
                    </ExpansionPanelDetails>
                </ExpansionPanel>

                <ExpansionPanel>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography className={classes.heading}>2-й долив</Typography>
                        <Typography className={classes.secondaryHeading}>
                            <div style={{display: 'inline-block'}}>М25: <b style={{color: 'black'}}>{nakladnaya.d2.m25}</b>&nbsp;&nbsp;</div>
                            <div style={{display: 'inline-block'}}>Ч25: <b style={{color: 'black'}}>{nakladnaya.d2.ch25}</b>&nbsp;&nbsp;</div>
                            <div style={{display: 'inline-block'}}> Ч10: <b style={{color: 'black'}}>{nakladnaya.d2.ch10}</b>&nbsp;&nbsp;</div>
                            <div style={{display: 'inline-block'}}>К10: <b style={{color: 'black'}}>{nakladnaya.d2.k10}</b>&nbsp;&nbsp;</div>
                        </Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails style={{padding: '0px'}}>
                        <center style={{width: '100%'}}>
                            <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                Максым 25:
                            </div>
                            <TextField
                                disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.d2.o }
                                style={{width: '70px', display: 'inline-block', verticalAlign: 'middle'}}
                                type='number'
                                margin='normal'
                                value={nakladnaya.d2.m25}
                                onChange={(event)=>{handleLitr(event, 'd2', 'm25')}}
                            />
                        </center>
                    </ExpansionPanelDetails>
                    <ExpansionPanelDetails style={{padding: '0px'}}>
                        <center style={{width: '100%'}}>
                            <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                Чалап 25:
                            </div>
                            <TextField
                                disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.d2.o }
                                style={{width: '70px', display: 'inline-block', verticalAlign: 'middle'}}
                                type='number'
                                margin='normal'
                                value={nakladnaya.d2.ch25}
                                onChange={(event)=>{handleLitr(event, 'd2', 'ch25')}}
                            />
                        </center>
                    </ExpansionPanelDetails>
                    <ExpansionPanelDetails style={{padding: '0px'}}>
                        <center style={{width: '100%'}}>
                            <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                Чалап 10:
                            </div>
                            <TextField
                                disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.d2.o }
                                style={{width: '70px', display: 'inline-block', verticalAlign: 'middle'}}
                                type='number'
                                margin='normal'
                                value={nakladnaya.d2.ch10}
                                onChange={(event)=>{handleLitr(event, 'd2', 'ch10')}}
                            />
                        </center>
                    </ExpansionPanelDetails>
                    <ExpansionPanelDetails style={{padding: '0px'}}>
                        <center style={{width: '100%'}}>
                            <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                Квас 10:
                            </div>
                            <TextField
                                disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.d2.o }
                                style={{width: '70px', display: 'inline-block', verticalAlign: 'middle'}}
                                type='number'
                                margin='normal'
                                value={nakladnaya.d2.k10}
                                onChange={(event)=>{handleLitr(event, 'd2', 'k10')}}
                            />
                        </center>
                    </ExpansionPanelDetails>
                    <ExpansionPanelDetails style={{padding: '0px'}}>
                        <center style={{width: '100%'}}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={nakladnaya.d2.o}
                                        color='primary'
                                        disabled={status.role==='admin'?false:checkDate||nakladnaya.d2.p||status.role!=='организатор' }
                                        onChange={(event)=>{handlePodpis(event, 'd2', 'o')}}
                                    />
                                }
                                label='Отпустил'
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={nakladnaya.d2.p}
                                        color='primary'
                                        disabled={status.role==='admin'?false:checkDate||nakladnaya.d2.p||disabled||!nakladnaya.d2.o||status.role!=='завсклада' }
                                        onChange={(event)=>{handlePodpis(event, 'd2', 'p')}}
                                    />
                                }
                                label='Принял'
                            />
                        </center>
                    </ExpansionPanelDetails>
                    <br/>
                </ExpansionPanel>
                <ExpansionPanel>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography className={classes.heading}>3-й долив</Typography>
                        <Typography className={classes.secondaryHeading}>
                            <div style={{display: 'inline-block'}}>М25: <b style={{color: 'black'}}>{nakladnaya.d3.m25}</b>&nbsp;&nbsp;</div>
                            <div style={{display: 'inline-block'}}>Ч25: <b style={{color: 'black'}}>{nakladnaya.d3.ch25}</b>&nbsp;&nbsp;</div>
                            <div style={{display: 'inline-block'}}>Ч10: <b style={{color: 'black'}}>{nakladnaya.d3.ch10}</b>&nbsp;&nbsp;</div>
                            <div style={{display: 'inline-block'}}>К10: <b style={{color: 'black'}}>{nakladnaya.d3.k10}</b>&nbsp;&nbsp;</div>
                        </Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails style={{padding: '0px'}}>
                        <center style={{width: '100%'}}>
                            <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                Максым 25:
                            </div>
                            <TextField
                                disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.d3.o }
                                style={{width: '70px', display: 'inline-block', verticalAlign: 'middle'}}
                                type='number'
                                margin='normal'
                                value={nakladnaya.d3.m25}
                                onChange={(event)=>{handleLitr(event, 'd3', 'm25')}}
                            />
                        </center>
                    </ExpansionPanelDetails>
                    <ExpansionPanelDetails style={{padding: '0px'}}>
                        <center style={{width: '100%'}}>
                            <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                Чалап 25:
                            </div>
                            <TextField
                                disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.d3.o }
                                style={{width: '70px', display: 'inline-block', verticalAlign: 'middle'}}
                                type='number'
                                margin='normal'
                                value={nakladnaya.d3.ch25}
                                onChange={(event)=>{handleLitr(event, 'd3', 'ch25')}}
                            />
                        </center>
                    </ExpansionPanelDetails>
                    <ExpansionPanelDetails style={{padding: '0px'}}>
                        <center style={{width: '100%'}}>
                            <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                Чалап 10:
                            </div>
                            <TextField
                                disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.d3.o }
                                style={{width: '70px', display: 'inline-block', verticalAlign: 'middle'}}
                                type='number'
                                margin='normal'
                                value={nakladnaya.d3.ch10}
                                onChange={(event)=>{handleLitr(event, 'd3', 'ch10')}}
                            />
                        </center>
                    </ExpansionPanelDetails>
                    <ExpansionPanelDetails style={{padding: '0px'}}>
                        <center style={{width: '100%'}}>
                            <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                Квас 10:
                            </div>
                            <TextField
                                disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.d3.o }
                                style={{width: '70px', display: 'inline-block', verticalAlign: 'middle'}}
                                type='number'
                                margin='normal'
                                value={nakladnaya.d3.k10}
                                onChange={(event)=>{handleLitr(event, 'd3', 'k10')}}
                            />
                        </center>
                    </ExpansionPanelDetails>
                    <ExpansionPanelDetails style={{padding: '0px'}}>
                        <center style={{width: '100%'}}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={nakladnaya.d3.o}
                                        color='primary'
                                        disabled={status.role==='admin'?false:checkDate||nakladnaya.d3.p||status.role!=='организатор' }
                                        onChange={(event)=>{handlePodpis(event, 'd3', 'o')}}
                                    />
                                }
                                label='Отпустил'
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={nakladnaya.d3.p}
                                        color='primary'
                                        disabled={status.role==='admin'?false:checkDate||nakladnaya.d3.p||disabled||!nakladnaya.d3.o||status.role!=='завсклада' }
                                        onChange={(event)=>{handlePodpis(event, 'd3', 'p')}}
                                    />
                                }
                                label='Принял'
                            />
                        </center>
                    </ExpansionPanelDetails>
                    <br/>
                </ExpansionPanel>

                <ExpansionPanel>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography className={classes.heading}>Съем</Typography>
                        <Typography className={classes.secondaryHeading}>
                            <div style={{display: 'inline-block'}}>М25: <b style={{color: 'black'}}>{nakladnaya.s.m25}</b>&nbsp;&nbsp;</div>
                            <div style={{display: 'inline-block'}}>Ч25: <b style={{color: 'black'}}>{nakladnaya.s.ch25}</b>&nbsp;&nbsp;</div>
                            <div style={{display: 'inline-block'}}>Ч10: <b style={{color: 'black'}}>{nakladnaya.s.ch10}</b>&nbsp;&nbsp;</div>
                            <div style={{display: 'inline-block'}}>К10: <b style={{color: 'black'}}>{nakladnaya.s.k10}</b>&nbsp;&nbsp;</div>
                        </Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails style={{padding: '0px'}}>
                        <center style={{width: '100%'}}>
                            <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                Максым 25:
                            </div>
                            <TextField
                                disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.s.o }
                                style={{width: '70px', display: 'inline-block', verticalAlign: 'middle'}}
                                type='number'
                                margin='normal'
                                value={nakladnaya.s.m25}
                                onChange={(event)=>{handleLitr(event, 's', 'm25')}}
                            />
                        </center>
                    </ExpansionPanelDetails>
                    <ExpansionPanelDetails style={{padding: '0px'}}>
                        <center style={{width: '100%'}}>
                            <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                Чалап 25:
                            </div>
                            <TextField
                                disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.s.o }
                                style={{width: '70px', display: 'inline-block', verticalAlign: 'middle'}}
                                type='number'
                                margin='normal'
                                value={nakladnaya.s.ch25}
                                onChange={(event)=>{handleLitr(event, 's', 'ch25')}}
                            />
                        </center>
                    </ExpansionPanelDetails>
                    <ExpansionPanelDetails style={{padding: '0px'}}>
                        <center style={{width: '100%'}}>
                            <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                Чалап 10:
                            </div>
                            <TextField
                                disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.s.o }
                                style={{width: '70px', display: 'inline-block', verticalAlign: 'middle'}}
                                type='number'
                                margin='normal'
                                value={nakladnaya.s.ch10}
                                onChange={(event)=>{handleLitr(event, 's', 'ch10')}}
                            />
                        </center>
                    </ExpansionPanelDetails>
                    <ExpansionPanelDetails style={{padding: '0px'}}>
                        <center style={{width: '100%'}}>
                            <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                Квас 10:
                            </div>
                            <TextField
                                disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.s.o }
                                style={{width: '70px', display: 'inline-block', verticalAlign: 'middle'}}
                                type='number'
                                margin='normal'
                                value={nakladnaya.s.k10}
                                onChange={(event)=>{handleLitr(event, 's', 'k10')}}
                            />
                        </center>
                    </ExpansionPanelDetails>
                    <ExpansionPanelDetails style={{padding: '0px'}}>
                        <center style={{width: '100%'}}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={nakladnaya.s.o}
                                        color='primary'
                                        disabled={status.role==='admin'?false:checkDate||nakladnaya.s.p||status.role!=='организатор' }
                                        onChange={(event)=>{handlePodpis(event, 's', 'o')}}
                                    />
                                }
                                label='Отпустил'
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={nakladnaya.s.p}
                                        color='primary'
                                        disabled={status.role==='admin'?false:checkDate||nakladnaya.s.p||disabled||!nakladnaya.s.o||status.role!=='завсклада' }
                                        onChange={(event)=>{handlePodpis(event, 's', 'p')}}
                                    />
                                }
                                label='Принял'
                            />
                        </center>
                    </ExpansionPanelDetails>
                    <br/>
                </ExpansionPanel>

                <ExpansionPanel>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography className={classes.heading}>Итого</Typography>
                        <Typography className={classes.secondaryHeading}>
                            <div style={{display: 'inline-block'}}>М25: <b style={{color: 'black'}}>{nakladnaya.i.m25}</b>&nbsp;&nbsp;</div>
                            <div style={{display: 'inline-block'}}>Ч25: <b style={{color: 'black'}}>{nakladnaya.i.ch25}</b>&nbsp;&nbsp;</div>
                            <div style={{display: 'inline-block'}}>Ч10: <b style={{color: 'black'}}>{nakladnaya.i.ch10}</b>&nbsp;&nbsp;</div>
                            <div style={{display: 'inline-block'}}>К10: <b style={{color: 'black'}}>{nakladnaya.i.k10}</b>&nbsp;&nbsp;</div>
                        </Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails style={{padding: '5px'}}>
                        <center style={{width: '100%'}}>
                            <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                Максым 25:
                            </div>
                            &nbsp;{nakladnaya.i.m25}
                        </center>
                    </ExpansionPanelDetails>
                    <ExpansionPanelDetails style={{padding: '5px'}}>
                        <center style={{width: '100%'}}>
                            <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                Чалап 25:
                            </div>
                            &nbsp;{nakladnaya.i.ch25}
                        </center>
                    </ExpansionPanelDetails>
                    <ExpansionPanelDetails style={{padding: '5px'}}>
                        <center style={{width: '100%'}}>
                            <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                Чалап 10:
                            </div>
                            &nbsp;{nakladnaya.i.ch10}
                        </center>
                    </ExpansionPanelDetails>
                    <ExpansionPanelDetails style={{padding: '5px'}}>
                        <center style={{width: '100%'}}>
                            <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                Квас 10:
                            </div>
                            &nbsp;{nakladnaya.i.k10}
                        </center>
                    </ExpansionPanelDetails>
                    <br/>
                </ExpansionPanel>

                {nakladnaya.ostalos!==undefined?
                    <ExpansionPanel>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography className={classes.heading}>Осталось</Typography>
                            <Typography className={classes.secondaryHeading}>
                                <div style={{display: 'inline-block'}}>М25: <b style={{color: 'black'}}>{nakladnaya.ostalos.m25}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Ч25: <b style={{color: 'black'}}>{nakladnaya.ostalos.ch25}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Ч10: <b style={{color: 'black'}}>{nakladnaya.ostalos.ch10}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>К10: <b style={{color: 'black'}}>{nakladnaya.ostalos.k10}</b>&nbsp;&nbsp;</div>
                            </Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails style={{padding: '5px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Максым 25:
                                </div>
                                &nbsp;{nakladnaya.ostalos.m25}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '5px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Чалап 25:
                                </div>
                                &nbsp;{nakladnaya.ostalos.ch25}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '5px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Чалап 10:
                                </div>
                                &nbsp;{nakladnaya.ostalos.ch10}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '5px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Квас 10:
                                </div>
                                &nbsp;{nakladnaya.ostalos.k10}
                            </center>
                        </ExpansionPanelDetails>
                        <br/>
                    </ExpansionPanel>
                    :
                    null
                }


                <br/>
                <div>
                    <Link className='link' to={''}>
                        <Button variant='contained' color='primary' onClick={()=>{
                            if(guidRegion!=='lol'){
                                if(selected===-1)
                                    addData({search: '', sort: '', page: 0, name: 'Накладная на пустую тару', data: {
                                        dataTable: JSON.stringify(nakladnaya),
                                        data: date,
                                        organizator: organizator,
                                        region: region,
                                        guidOrganizator: guidOrganizator,
                                        guidRegion: guidRegion,
                                        disabled: disabled
                                    }});
                                else
                                    setData({id: id, search: '', sort: '', page: 0, name: status.role === 'admin'?name:'Накладная на пустую тару', data: {
                                        dataTable: JSON.stringify(nakladnaya),
                                        data: date,
                                        organizator: organizator,
                                        region: region,
                                        guidOrganizator: guidOrganizator,
                                        guidRegion: guidRegion,
                                        disabled: disabled
                                    }});
                                setSelected(-1)
                            }
                        }} className={classes.button}>
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
