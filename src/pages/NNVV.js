import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as tableActions from '../redux/actions/table'
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
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: width,
    },
    urls: {
        margin: theme.spacing.unit,
        width: width,
        maxHeight: 100,
        overflow: 'auto'
    },
    message: {
        width: width,
        marginTop: theme.spacing.unit,
        marginBottom: theme.spacing.unit,
        marginLeft: 'calc((100% - '+width+'px)/2)',
        marginRight: 'calc((100% - '+width+'px)/2)'
    },
    MuiPickersToolbar: {
        toolbar: {
            backgroundColor: '#000',
        },
    },
    MuiPickersModal: {
        dialogAction: {
            color: '#000',
        },
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
        useEffect(async ()=>{
            if (!(status.status==='active'&&['admin', 'организатор', 'завсклада'].includes(status.role))) {
                props.history.push('/')
            }
            if(selected===-1) {
                let _data = await tableActions.getDataSimple({name: 'ОрганизаторПоID'})
                if(_data!==undefined) {
                    setRegion(_data.region)
                    setOrganizator(_data.name)
                    let date = new Date()
                    date = JSON.stringify(date).split('-')
                    date = date[2].split('T')[0] + ' ' + month[parseInt(date[1]) - 1] + ' ' + date[0].replace('"', '')
                    setDate(date)

                    _data = await tableActions.getDataSimple({
                        name: 'Все отчеты реализаторов по дате',
                        data: {data: date, organizator: _data.name, region: _data.region}
                    })
                    if (_data != undefined) {
                        nakladnaya['m']['data'] = []
                        nakladnaya['ch']['data'] = []
                        nakladnaya['k']['data'] = []
                        nakladnaya['m']['all'] = 0
                        nakladnaya['ch']['all'] = 0
                        nakladnaya['k']['all'] = 0
                        for (let i = 0; i < _data.length; i++) {
                            let dataTable = JSON.parse(_data[i].dataTable)
                            if(dataTable.vozvrat.v.mn.length>0&&checkInt(dataTable.vozvrat.v.ml)>0) {
                                nakladnaya['m']['data'].push({'№': dataTable.vozvrat.v.mn, 'l': dataTable.vozvrat.v.ml})
                                nakladnaya['m']['all'] += dataTable.vozvrat.v.ml
                            }
                            if(dataTable.vozvrat.v.kn.length>0&&checkInt(dataTable.vozvrat.v.ml)>0) {
                                nakladnaya['k']['data'].push({'№': dataTable.vozvrat.v.kn, 'l': dataTable.vozvrat.v.kl})
                                nakladnaya['k']['all'] += dataTable.vozvrat.v.kl
                            }
                        }
                        setNakladnaya(nakladnaya)
                    }
                }
            } else {
                let _data = await tableActions.getDataSimple({name: 'Накладная на вечерний возврат по данным', data: {data: data[selected][1], organizator: data[selected][0].split(':')[0], region: data[selected][0].split(':')[1].trim()}})
                if(_data!==undefined){
                    setDate(_data.data)
                    setOrganizator(_data.organizator)
                    setRegion(_data.region)
                    setNakladnaya(JSON.parse(_data.dataTable))
                    setId(_data._id)
                }
                let date1 = new Date()
                date1 = JSON.stringify(date1).split('-')
                date1 = date1[2].split('T')[0]+' '+month[parseInt(date1[1])-1]+' '+date1[0].replace('"', '')
                setCheckDate(date1!==_data.data)
            }
        },[])
        const { setSelected, addData, setData } = props.tableActions;
        const { selected, data } = props.table;
        const { classes } = props;
        const { status } = props.user;
        let [checkDate, setCheckDate] = useState(false);
        let [organizator, setOrganizator] = useState('');
        let [region, setRegion] = useState('');
        let [date, setDate] = useState('');
        let [date1, setDate1] = useState(new Date());
        let handleDate1 =  async (date) => {
            setDate1(date)
            date = JSON.stringify(date).split('-')
            date = date[2].split('T')[0]+' '+month[parseInt(date[1])-1]+' '+date[0].replace('"', '')
            setDate(date)

            let _data = await tableActions.getDataSimple({
                name: 'Все отчеты реализаторов по дате',
                data: {data: date, organizator: organizator, region: region}
            })
            if (_data != undefined) {
                nakladnaya['m']['data'] = []
                nakladnaya['ch']['data'] = []
                nakladnaya['k']['data'] = []
                nakladnaya['m']['all'] = 0
                nakladnaya['ch']['all'] = 0
                nakladnaya['k']['all'] = 0
                for (let i = 0; i < _data.length; i++) {
                    let dataTable = JSON.parse(_data[i].dataTable)
                    if(dataTable.vozvrat.v.mn.length>0&&checkInt(dataTable.vozvrat.v.ml)>0) {
                        nakladnaya['m']['data'].push({'№': dataTable.vozvrat.v.mn, 'l': dataTable.vozvrat.v.ml})
                        nakladnaya['m']['all'] += dataTable.vozvrat.v.ml
                    }

                    if(dataTable.vozvrat.v.kn.length>0&&checkInt(dataTable.vozvrat.v.kl)>0) {
                        nakladnaya['k']['all'] += dataTable.vozvrat.v.kl
                        nakladnaya['k']['data'].push({'№': dataTable.vozvrat.v.kn, 'l': dataTable.vozvrat.v.kl})
                    }
                }
                setNakladnaya(nakladnaya)
            }
        };
        let [disabled, setDisabled] = useState(false);
        let [id, setId] = useState('');
        let [nakladnaya, setNakladnaya] = useState({
            'm': {'all': 0, 'data': [], 'o': false, 'p': false},
            'ch': {'all': 0, 'data': [], 'o': false, 'p': false},
            'k': {'all': 0, 'data': [], 'o': false, 'p': false},
        });
        let handleNumber =  (event, type, number) => {
            if(!nakladnaya[type]['o']) {
                nakladnaya[type]['data'][number]['№'] = event.target.value
                setNakladnaya(nakladnaya)
            }
        };
        let handleLitr =  (event, type, number) => {
            if(!nakladnaya[type]['o']) {
                let litr = parseInt(event.target.value)
                if (isNaN(litr)) {
                    nakladnaya[type]['data'][number]['l'] = 0
                } else {
                    nakladnaya[type]['data'][number]['l'] = litr
                }
                let all = 0
                for(let i=0; i<nakladnaya[type]['data'].length; i++){
                    all += nakladnaya[type]['data'][i]['l']
                }
                nakladnaya[type]['all'] = all
                setNakladnaya(nakladnaya)
            }
        };
        let handlePodpis =  (event, type, what) => {
            nakladnaya[type][what] = event.target.checked
            setNakladnaya(nakladnaya)
        };
        let add =  (type) => {
            nakladnaya[type]['data'].push({'№': '', 'l': 0})
            setNakladnaya(nakladnaya)
        };
        let check = () => {
            let date1 = new Date()
            date1 = JSON.stringify(date1).split('-')
            date1 = date1[2].split('T')[0]+' '+month[parseInt(date1[1])-1]+' '+date1[0].replace('"', '')
            return status.role!=='admin' && date1!==date

        }
         return (
            <div>
                <br/>
                <h1>Накладная на вечерний возврат</h1>
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
                        <Typography className={classes.heading}>Максым</Typography>
                        <Typography className={classes.secondaryHeading}>
                            <div style={{display: 'inline-block'}}><b style={{color: 'black'}}>{nakladnaya.m.all}</b>&nbsp;&nbsp;</div>
                        </Typography>
                    </ExpansionPanelSummary>
                    {
                        nakladnaya.m.data.map((element) => {return(
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        №:
                                    </div>
                                    &nbsp;{element['№']}&nbsp;&nbsp;
                                    <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Литр:
                                    </div>
                                    &nbsp;{element['l']}
                                </center>
                            </ExpansionPanelDetails>
                        )})
                    }
                    <ExpansionPanelDetails style={{padding: '0px'}}>
                        <center style={{width: '100%'}}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={nakladnaya.m.o}
                                        color='primary'
                                        disabled={status.role==='admin'?false:checkDate||nakladnaya.m.p||status.role!=='организатор'}
                                        onChange={(event)=>{handlePodpis(event, 'm', 'o')}}
                                    />
                                }
                                label='Отпустил'
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={nakladnaya.m.p}
                                        color='primary'
                                        disabled={status.role==='admin'?false:checkDate||nakladnaya.m.p||disabled||!nakladnaya.m.o||status.role!=='завсклада'}
                                        onChange={(event)=>{handlePodpis(event, 'm', 'p')}}
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
                        <Typography className={classes.heading}>Квас</Typography>
                        <Typography className={classes.secondaryHeading}>
                            <div style={{display: 'inline-block'}}><b style={{color: 'black'}}>{nakladnaya.k.all}</b>&nbsp;&nbsp;</div>
                        </Typography>
                    </ExpansionPanelSummary>
                    {
                        nakladnaya.k.data.map((element, idx) => {return(
                            <ExpansionPanelDetails style={{padding: '0px'}}>
                                <center style={{width: '100%'}}>
                                    <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        №:
                                    </div>
                                    &nbsp;{element['№']}&nbsp;&nbsp;
                                    <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                        Литр:
                                    </div>
                                    &nbsp;{element['l']}
                                </center>
                            </ExpansionPanelDetails>
                        )})
                    }
                    <ExpansionPanelDetails style={{padding: '0px'}}>
                        <center style={{width: '100%'}}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={nakladnaya.k.o}
                                        color='primary'
                                        disabled={status.role==='admin'?false:checkDate||nakladnaya.k.p||status.role!=='организатор'}
                                        onChange={(event)=>{handlePodpis(event, 'k', 'o')}}
                                    />
                                }
                                label='Отпустил'
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={nakladnaya.k.p}
                                        color='primary'
                                        disabled={status.role==='admin'?false:checkDate||nakladnaya.k.p||disabled||!nakladnaya.k.o||status.role!=='завсклада'}
                                        onChange={(event)=>{handlePodpis(event, 'k', 'p')}}
                                    />
                                }
                                label='Принял'
                            />
                        </center>
                    </ExpansionPanelDetails>
                    <br/>
                </ExpansionPanel>


                <br/>
                <div>
                    <Link className='link' to={''}>
                        <Button variant='contained' color='primary' onClick={()=>{
                            if(selected===-1)
                                addData({search: '', sort: '', page: 0, name: 'Накладная на вечерний возврат', data: {
                                    dataTable: JSON.stringify(nakladnaya),
                                    data: date,
                                    organizator: organizator,
                                    region: region,
                                    disabled: disabled
                                }});
                            else
                                setData({id: id, search: '', sort: '', page: 0, name: 'Накладная на вечерний возврат', data: {
                                    dataTable: JSON.stringify(nakladnaya),
                                    data: date,
                                    organizator: organizator,
                                    region: region,
                                    disabled: disabled
                                }});
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
