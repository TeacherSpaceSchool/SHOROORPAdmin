import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as tableActions from '../redux/actions/table'
import * as mini_dialogActions from '../redux/actions/mini_dialog'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom'
import { mainWindow } from '../App'
import { month } from '../redux/constants/other'
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
const styles = theme => ({
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
        const { showSelectStatistic } = props.mini_dialogActions;
        const { typeStatistic } = props.table;
        let [date, setDate] = useState(new Date());
        let [list, setList] = useState([]);
        let statuses = ['по годам', 'по месяцам', 'по дням']
        let [status, setStatus] = useState('по дням');
        let handleStatus =  (event) => {
            setStatus(event.target.value)
        };
        useEffect( ()=>{
            async function fetchData() {
                if(typeStatistic.what!=='Выбрать'){
                    date = JSON.stringify(date).split('-')
                    if(status === 'по годам')
                        date = ''
                    else if(status === 'по месяцам')
                        date = date[0].replace('"', '')
                    else if(status === 'по дням')
                        date = month[parseInt(date[1])-1]+' '+date[0].replace('"', '')
                    let _data = await tableActions.getDataSimple({name: 'Статистика', data: {date: date, what: typeStatistic.what, type: typeStatistic.type, status: status}})
                    setList(_data)
                }
            }
            fetchData();
        },[typeStatistic, status, date])

         return (
            <div>
                <br/>
                <h1>Статистика</h1>
                <br/>
                <TextField
                    select
                    SelectProps={{
                        MenuProps: {
                            className: classes.menu,
                        },
                    }}
                    label='статус'
                    type='login'
                    className={classes.textFieldDate}
                    margin='normal'
                    value={status}
                    onChange={handleStatus}
                >
                    {statuses != undefined?
                        statuses.map((option, idx) => (
                            <MenuItem key={idx} value={option}>
                                {option}
                            </MenuItem>
                        ))
                        :
                        null
                    }
                </TextField>
                <br/>
                { status === 'по месяцам'?
                    <DatePicker
                        views={['year']}
                        label='Дата'
                        className={classes.textFieldDate}
                        value={date}
                        onChange={setDate}
                    />
                    :
                    null

                }
                { status === 'по дням'?
                    <DatePicker
                        views={['year', 'month']}
                        label='Дата'
                        className={classes.textFieldDate}
                        value={date}
                        onChange={setDate}
                    />
                    :
                    null

                }
                <br/>
                <Button variant='outlined' onClick={()=>{showSelectStatistic()}} className={classes.button}>
                    {typeStatistic.name}
                </Button>

                {list!=undefined&&list.length>0?
                    list.map((element, idx)=> {
                        return(
                            <ExpansionPanel key={idx}>
                                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography className={classes.heading}>{element.date}</Typography>
                                    <Typography className={classes.secondaryHeading}>
                                        Выручка: <b style={{color: 'black'}}>{element.data.i}</b>&nbsp;&nbsp;
                                    </Typography>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails style={{padding: '0px'}}>
                                    <ExpansionPanel style={{width: '100%'}}>
                                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                            <Typography className={classes.heading}>Максым</Typography>
                                            <Typography className={classes.secondaryHeading}>
                                                <div style={{display: 'inline-block'}}>В: <b style={{color: 'black'}}>{element.data.m.v}</b>&nbsp;&nbsp;</div>
                                                <div style={{display: 'inline-block'}}>О: <b style={{color: 'black'}}>{element.data.m.o}</b>&nbsp;&nbsp;</div>
                                                <div style={{display: 'inline-block'}}>С: <b style={{color: 'black'}}>{element.data.m.s}</b>&nbsp;&nbsp;</div>
                                                <div style={{display: 'inline-block'}}>П: <b style={{color: 'black'}}>{element.data.m.pl}</b>&nbsp;&nbsp;</div>
                                                <div style={{display: 'inline-block'}}>к Т.Т.: <b style={{color: 'black'}}>{element.data.m.ktt}</b>&nbsp;&nbsp;</div>
                                                <div style={{display: 'inline-block'}}>к Д.: <b style={{color: 'black'}}>{element.data.m.kd}</b>&nbsp;&nbsp;</div>
                                                <div style={{display: 'inline-block'}}>П: <b style={{color: 'black'}}>{element.data.m.ps}</b>&nbsp;&nbsp;</div>
                                            </Typography>
                                        </ExpansionPanelSummary>
                                        <ExpansionPanelDetails style={{padding: '0px'}}>
                                            <center style={{width: '100%'}}>
                                                <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                                    Выдано:
                                                </div>
                                                &nbsp;{element.data.m.v}
                                            </center>
                                        </ExpansionPanelDetails>
                                        <ExpansionPanelDetails style={{padding: '0px'}}>
                                            <center style={{width: '100%'}}>
                                                <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                                    Остаток съем:
                                                </div>
                                                &nbsp;{element.data.m.o}
                                            </center>
                                        </ExpansionPanelDetails>
                                        <ExpansionPanelDetails style={{padding: '0px'}}>
                                            <center style={{width: '100%'}}>
                                                <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                                    Списание по акту:
                                                </div>
                                                &nbsp;{element.data.m.s}
                                            </center>
                                        </ExpansionPanelDetails>
                                        <ExpansionPanelDetails style={{padding: '0px'}}>
                                            <center style={{width: '100%'}}>
                                                <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                                    Продано литров:
                                                </div>
                                                &nbsp;{element.data.m.pl}
                                            </center>
                                        </ExpansionPanelDetails>
                                        <ExpansionPanelDetails style={{padding: '0px'}}>
                                            <center style={{width: '100%'}}>
                                                <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                                    Количество Т.Т.:
                                                </div>
                                                &nbsp;{element.data.m.ktt}
                                            </center>
                                        </ExpansionPanelDetails>
                                        <ExpansionPanelDetails style={{padding: '0px'}}>
                                            <center style={{width: '100%'}}>
                                                <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                                    Количество доливов:
                                                </div>
                                                &nbsp;{element.data.m.kd}
                                            </center>
                                        </ExpansionPanelDetails>
                                        <ExpansionPanelDetails style={{padding: '0px'}}>
                                            <center style={{width: '100%'}}>
                                                <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                                    Продано сом:
                                                </div>
                                                &nbsp;{element.data.m.ps}
                                            </center>
                                        </ExpansionPanelDetails>
                                    </ExpansionPanel>
                                </ExpansionPanelDetails>
                                <ExpansionPanelDetails style={{padding: '0px'}}>
                                    <ExpansionPanel style={{width: '100%'}}>
                                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                            <Typography className={classes.heading}>Чалап</Typography>
                                            <Typography className={classes.secondaryHeading}>
                                                <div style={{display: 'inline-block'}}>В: <b style={{color: 'black'}}>{element.data.ch.v}</b>&nbsp;&nbsp;</div>
                                                <div style={{display: 'inline-block'}}>О: <b style={{color: 'black'}}>{element.data.ch.o}</b>&nbsp;&nbsp;</div>
                                                <div style={{display: 'inline-block'}}>С: <b style={{color: 'black'}}>{element.data.ch.s}</b>&nbsp;&nbsp;</div>
                                                <div style={{display: 'inline-block'}}>П: <b style={{color: 'black'}}>{element.data.ch.pl}</b>&nbsp;&nbsp;</div>
                                                <div style={{display: 'inline-block'}}>к Т.Т.: <b style={{color: 'black'}}>{element.data.ch.ktt}</b>&nbsp;&nbsp;</div>
                                                <div style={{display: 'inline-block'}}>к Д.: <b style={{color: 'black'}}>{element.data.ch.kd}</b>&nbsp;&nbsp;</div>
                                                <div style={{display: 'inline-block'}}>П: <b style={{color: 'black'}}>{element.data.ch.ps}</b>&nbsp;&nbsp;</div>
                                            </Typography>
                                        </ExpansionPanelSummary>
                                        <ExpansionPanelDetails style={{padding: '0px'}}>
                                            <center style={{width: '100%'}}>
                                                <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                                    Выдано:
                                                </div>
                                                &nbsp;{element.data.ch.v}
                                            </center>
                                        </ExpansionPanelDetails>
                                        <ExpansionPanelDetails style={{padding: '0px'}}>
                                            <center style={{width: '100%'}}>
                                                <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                                    Остаток съем:
                                                </div>
                                                &nbsp;{element.data.ch.o}
                                            </center>
                                        </ExpansionPanelDetails>
                                        <ExpansionPanelDetails style={{padding: '0px'}}>
                                            <center style={{width: '100%'}}>
                                                <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                                    Списание по акту:
                                                </div>
                                                &nbsp;{element.data.ch.o}
                                            </center>
                                        </ExpansionPanelDetails>
                                        <ExpansionPanelDetails style={{padding: '0px'}}>
                                            <center style={{width: '100%'}}>
                                                <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                                    Продано литров:
                                                </div>
                                                &nbsp;{element.data.ch.pl}
                                            </center>
                                        </ExpansionPanelDetails>
                                        <ExpansionPanelDetails style={{padding: '0px'}}>
                                            <center style={{width: '100%'}}>
                                                <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                                    Количество Т.Т.:
                                                </div>
                                                &nbsp;{element.data.ch.ktt}
                                            </center>
                                        </ExpansionPanelDetails>
                                        <ExpansionPanelDetails style={{padding: '0px'}}>
                                            <center style={{width: '100%'}}>
                                                <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                                    Количество доливов:
                                                </div>
                                                &nbsp;{element.data.ch.kd}
                                            </center>
                                        </ExpansionPanelDetails>
                                        <ExpansionPanelDetails style={{padding: '0px'}}>
                                            <center style={{width: '100%'}}>
                                                <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                                    Продано сом:
                                                </div>
                                                &nbsp;{element.data.ch.ps}
                                            </center>
                                        </ExpansionPanelDetails>
                                    </ExpansionPanel>
                                </ExpansionPanelDetails>
                                <ExpansionPanelDetails style={{padding: '0px'}}>
                                    <ExpansionPanel style={{width: '100%'}}>
                                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                            <Typography className={classes.heading}>Квас</Typography>
                                            <Typography className={classes.secondaryHeading}>
                                                <div style={{display: 'inline-block'}}>В: <b style={{color: 'black'}}>{element.data.k.v}</b>&nbsp;&nbsp;</div>
                                                <div style={{display: 'inline-block'}}>О: <b style={{color: 'black'}}>{element.data.k.o}</b>&nbsp;&nbsp;</div>
                                                <div style={{display: 'inline-block'}}>С: <b style={{color: 'black'}}>{element.data.k.s}</b>&nbsp;&nbsp;</div>
                                                <div style={{display: 'inline-block'}}>П: <b style={{color: 'black'}}>{element.data.k.pl}</b>&nbsp;&nbsp;</div>
                                                <div style={{display: 'inline-block'}}>к Т.Т.: <b style={{color: 'black'}}>{element.data.k.ktt}</b>&nbsp;&nbsp;</div>
                                                <div style={{display: 'inline-block'}}>к Д.: <b style={{color: 'black'}}>{element.data.k.kd}</b>&nbsp;&nbsp;</div>
                                                <div style={{display: 'inline-block'}}>П: <b style={{color: 'black'}}>{element.data.k.ps}</b>&nbsp;&nbsp;</div>
                                            </Typography>
                                        </ExpansionPanelSummary>
                                        <ExpansionPanelDetails style={{padding: '0px'}}>
                                            <center style={{width: '100%'}}>
                                                <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                                    Выдано:
                                                </div>
                                                &nbsp;{element.data.k.v}
                                            </center>
                                        </ExpansionPanelDetails>
                                        <ExpansionPanelDetails style={{padding: '0px'}}>
                                            <center style={{width: '100%'}}>
                                                <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                                    Остаток съем:
                                                </div>
                                                &nbsp;{element.data.k.o}
                                            </center>
                                        </ExpansionPanelDetails>
                                        <ExpansionPanelDetails style={{padding: '0px'}}>
                                            <center style={{width: '100%'}}>
                                                <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                                    Списание по акту:
                                                </div>
                                                &nbsp;{element.data.k.o}
                                            </center>
                                        </ExpansionPanelDetails>
                                        <ExpansionPanelDetails style={{padding: '0px'}}>
                                            <center style={{width: '100%'}}>
                                                <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                                    Продано литров:
                                                </div>
                                                &nbsp;{element.data.k.pl}
                                            </center>
                                        </ExpansionPanelDetails>
                                        <ExpansionPanelDetails style={{padding: '0px'}}>
                                            <center style={{width: '100%'}}>
                                                <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                                    Количество Т.Т.:
                                                </div>
                                                &nbsp;{element.data.k.ktt}
                                            </center>
                                        </ExpansionPanelDetails>
                                        <ExpansionPanelDetails style={{padding: '0px'}}>
                                            <center style={{width: '100%'}}>
                                                <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                                    Количество доливов:
                                                </div>
                                                &nbsp;{element.data.k.kd}
                                            </center>
                                        </ExpansionPanelDetails>
                                        <ExpansionPanelDetails style={{padding: '0px'}}>
                                            <center style={{width: '100%'}}>
                                                <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                                    Продано сом:
                                                </div>
                                                &nbsp;{element.data.k.ps}
                                            </center>
                                        </ExpansionPanelDetails>
                                    </ExpansionPanel>
                                </ExpansionPanelDetails>
                                <ExpansionPanelDetails style={{padding: '0px'}}>
                                    <ExpansionPanel style={{width: '100%'}}>
                                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                            <Typography className={classes.heading}>Стакан Легенда</Typography>
                                            <Typography className={classes.secondaryHeading}>
                                                <div style={{display: 'inline-block'}}>В: <b style={{color: 'black'}}>{element.data.sl.v}</b>&nbsp;&nbsp;</div>
                                                <div style={{display: 'inline-block'}}>О: <b style={{color: 'black'}}>{element.data.sl.o}</b>&nbsp;&nbsp;</div>
                                                <div style={{display: 'inline-block'}}>С: <b style={{color: 'black'}}>{element.data.sl.s}</b>&nbsp;&nbsp;</div>
                                                <div style={{display: 'inline-block'}}>П: <b style={{color: 'black'}}>{element.data.sl.pl}</b>&nbsp;&nbsp;</div>
                                                <div style={{display: 'inline-block'}}>к Т.Т.: <b style={{color: 'black'}}>{element.data.sl.ktt}</b>&nbsp;&nbsp;</div>
                                                <div style={{display: 'inline-block'}}>к Д.: <b style={{color: 'black'}}>{element.data.sl.kd}</b>&nbsp;&nbsp;</div>
                                                <div style={{display: 'inline-block'}}>П: <b style={{color: 'black'}}>{element.data.sl.ps}</b>&nbsp;&nbsp;</div>
                                            </Typography>
                                        </ExpansionPanelSummary>
                                        <ExpansionPanelDetails style={{padding: '0px'}}>
                                            <center style={{width: '100%'}}>
                                                <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                                    Выдано:
                                                </div>
                                                &nbsp;{element.data.sl.v}
                                            </center>
                                        </ExpansionPanelDetails>
                                        <ExpansionPanelDetails style={{padding: '0px'}}>
                                            <center style={{width: '100%'}}>
                                                <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                                    Остаток съем:
                                                </div>
                                                &nbsp;{element.data.sl.o}
                                            </center>
                                        </ExpansionPanelDetails>
                                        <ExpansionPanelDetails style={{padding: '0px'}}>
                                            <center style={{width: '100%'}}>
                                                <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                                    Списание по акту:
                                                </div>
                                                &nbsp;{element.data.sl.o}
                                            </center>
                                        </ExpansionPanelDetails>
                                        <ExpansionPanelDetails style={{padding: '0px'}}>
                                            <center style={{width: '100%'}}>
                                                <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                                    Продано штук:
                                                </div>
                                                &nbsp;{element.data.sl.pl}
                                            </center>
                                        </ExpansionPanelDetails>
                                        <ExpansionPanelDetails style={{padding: '0px'}}>
                                            <center style={{width: '100%'}}>
                                                <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                                    Количество Т.Т.:
                                                </div>
                                                &nbsp;{element.data.sl.ktt}
                                            </center>
                                        </ExpansionPanelDetails>
                                        <ExpansionPanelDetails style={{padding: '0px'}}>
                                            <center style={{width: '100%'}}>
                                                <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                                    Количество доливов:
                                                </div>
                                                &nbsp;{element.data.sl.kd}
                                            </center>
                                        </ExpansionPanelDetails>
                                        <ExpansionPanelDetails style={{padding: '0px'}}>
                                            <center style={{width: '100%'}}>
                                                <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                                    Продано сом:
                                                </div>
                                                &nbsp;{element.data.sl.ps}
                                            </center>
                                        </ExpansionPanelDetails>
                                    </ExpansionPanel>

                                </ExpansionPanelDetails>
                                <ExpansionPanelDetails style={{padding: '0px'}}>
                                    <ExpansionPanel style={{width: '100%'}}>
                                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                            <Typography className={classes.heading}>Стакан 0,2</Typography>
                                            <Typography className={classes.secondaryHeading}>
                                                <div style={{display: 'inline-block'}}>В: <b style={{color: 'black'}}>{element.data.s02.v}</b>&nbsp;&nbsp;</div>
                                                <div style={{display: 'inline-block'}}>О: <b style={{color: 'black'}}>{element.data.s02.o}</b>&nbsp;&nbsp;</div>
                                                <div style={{display: 'inline-block'}}>С: <b style={{color: 'black'}}>{element.data.s02.s}</b>&nbsp;&nbsp;</div>
                                                <div style={{display: 'inline-block'}}>П: <b style={{color: 'black'}}>{element.data.s02.pl}</b>&nbsp;&nbsp;</div>
                                                <div style={{display: 'inline-block'}}>к Т.Т.: <b style={{color: 'black'}}>{element.data.s02.ktt}</b>&nbsp;&nbsp;</div>
                                                <div style={{display: 'inline-block'}}>к Д.: <b style={{color: 'black'}}>{element.data.s02.kd}</b>&nbsp;&nbsp;</div>
                                                <div style={{display: 'inline-block'}}>П: <b style={{color: 'black'}}>{element.data.s02.ps}</b>&nbsp;&nbsp;</div>
                                            </Typography>
                                        </ExpansionPanelSummary>
                                        <ExpansionPanelDetails style={{padding: '0px'}}>
                                            <center style={{width: '100%'}}>
                                                <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                                    Выдано:
                                                </div>
                                                &nbsp;{element.data.s02.v}
                                            </center>
                                        </ExpansionPanelDetails>
                                        <ExpansionPanelDetails style={{padding: '0px'}}>
                                            <center style={{width: '100%'}}>
                                                <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                                    Остаток съем:
                                                </div>
                                                &nbsp;{element.data.s02.o}
                                            </center>
                                        </ExpansionPanelDetails>
                                        <ExpansionPanelDetails style={{padding: '0px'}}>
                                            <center style={{width: '100%'}}>
                                                <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                                    Списание по акту:
                                                </div>
                                                &nbsp;{element.data.s02.o}
                                            </center>
                                        </ExpansionPanelDetails>
                                        <ExpansionPanelDetails style={{padding: '0px'}}>
                                            <center style={{width: '100%'}}>
                                                <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                                    Продано штук:
                                                </div>
                                                &nbsp;{element.data.s02.pl}
                                            </center>
                                        </ExpansionPanelDetails>
                                        <ExpansionPanelDetails style={{padding: '0px'}}>
                                            <center style={{width: '100%'}}>
                                                <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                                    Количество Т.Т.:
                                                </div>
                                                &nbsp;{element.data.s02.ktt}
                                            </center>
                                        </ExpansionPanelDetails>
                                        <ExpansionPanelDetails style={{padding: '0px'}}>
                                            <center style={{width: '100%'}}>
                                                <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                                    Количество доливов:
                                                </div>
                                                &nbsp;{element.data.s02.kd}
                                            </center>
                                        </ExpansionPanelDetails>
                                        <ExpansionPanelDetails style={{padding: '0px'}}>
                                            <center style={{width: '100%'}}>
                                                <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                                    Продано сом:
                                                </div>
                                                &nbsp;{element.data.s02.ps}
                                            </center>
                                        </ExpansionPanelDetails>
                                    </ExpansionPanel>

                                </ExpansionPanelDetails>
                                <ExpansionPanelDetails style={{padding: '0px'}}>
                                    <ExpansionPanel style={{width: '100%'}}>
                                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                            <Typography className={classes.heading}>Стакан 0.4</Typography>
                                            <Typography className={classes.secondaryHeading}>
                                                <div style={{display: 'inline-block'}}>В: <b style={{color: 'black'}}>{element.data.s04.v}</b>&nbsp;&nbsp;</div>
                                                <div style={{display: 'inline-block'}}>О: <b style={{color: 'black'}}>{element.data.s04.o}</b>&nbsp;&nbsp;</div>
                                                <div style={{display: 'inline-block'}}>С: <b style={{color: 'black'}}>{element.data.s04.s}</b>&nbsp;&nbsp;</div>
                                                <div style={{display: 'inline-block'}}>П: <b style={{color: 'black'}}>{element.data.s04.pl}</b>&nbsp;&nbsp;</div>
                                                <div style={{display: 'inline-block'}}>к Т.Т.: <b style={{color: 'black'}}>{element.data.s04.ktt}</b>&nbsp;&nbsp;</div>
                                                <div style={{display: 'inline-block'}}>к Д.: <b style={{color: 'black'}}>{element.data.s04.kd}</b>&nbsp;&nbsp;</div>
                                                <div style={{display: 'inline-block'}}>П: <b style={{color: 'black'}}>{element.data.s04.ps}</b>&nbsp;&nbsp;</div>
                                            </Typography>
                                        </ExpansionPanelSummary>
                                        <ExpansionPanelDetails style={{padding: '0px'}}>
                                            <center style={{width: '100%'}}>
                                                <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                                    Выдано:
                                                </div>
                                                &nbsp;{element.data.s04.v}
                                            </center>
                                        </ExpansionPanelDetails>
                                        <ExpansionPanelDetails style={{padding: '0px'}}>
                                            <center style={{width: '100%'}}>
                                                <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                                    Остаток съем:
                                                </div>
                                                &nbsp;{element.data.s04.o}
                                            </center>
                                        </ExpansionPanelDetails>
                                        <ExpansionPanelDetails style={{padding: '0px'}}>
                                            <center style={{width: '100%'}}>
                                                <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                                    Списание по акту:
                                                </div>
                                                &nbsp;{element.data.s04.o}
                                            </center>
                                        </ExpansionPanelDetails>
                                        <ExpansionPanelDetails style={{padding: '0px'}}>
                                            <center style={{width: '100%'}}>
                                                <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                                    Продано штук:
                                                </div>
                                                &nbsp;{element.data.s04.pl}
                                            </center>
                                        </ExpansionPanelDetails>
                                        <ExpansionPanelDetails style={{padding: '0px'}}>
                                            <center style={{width: '100%'}}>
                                                <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                                    Количество Т.Т.:
                                                </div>
                                                &nbsp;{element.data.s04.ktt}
                                            </center>
                                        </ExpansionPanelDetails>
                                        <ExpansionPanelDetails style={{padding: '0px'}}>
                                            <center style={{width: '100%'}}>
                                                <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                                    Количество доливов:
                                                </div>
                                                &nbsp;{element.data.s04.kd}
                                            </center>
                                        </ExpansionPanelDetails>
                                        <ExpansionPanelDetails style={{padding: '0px'}}>
                                            <center style={{width: '100%'}}>
                                                <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                                    Продано сом:
                                                </div>
                                                &nbsp;{element.data.s04.ps}
                                            </center>
                                        </ExpansionPanelDetails>
                                    </ExpansionPanel>

                                </ExpansionPanelDetails>
                                <ExpansionPanelDetails style={{padding: '0px'}}>
                                    <ExpansionPanel style={{width: '100%'}}>
                                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                            <Typography className={classes.heading}>Бутылка</Typography>
                                            <Typography className={classes.secondaryHeading}>
                                                <div style={{display: 'inline-block'}}>В: <b style={{color: 'black'}}>{element.data.b.v}</b>&nbsp;&nbsp;</div>
                                                <div style={{display: 'inline-block'}}>О: <b style={{color: 'black'}}>{element.data.b.o}</b>&nbsp;&nbsp;</div>
                                                <div style={{display: 'inline-block'}}>С: <b style={{color: 'black'}}>{element.data.b.s}</b>&nbsp;&nbsp;</div>
                                                <div style={{display: 'inline-block'}}>П: <b style={{color: 'black'}}>{element.data.b.pl}</b>&nbsp;&nbsp;</div>
                                                <div style={{display: 'inline-block'}}>к Т.Т.: <b style={{color: 'black'}}>{element.data.b.ktt}</b>&nbsp;&nbsp;</div>
                                                <div style={{display: 'inline-block'}}>к Д.: <b style={{color: 'black'}}>{element.data.b.kd}</b>&nbsp;&nbsp;</div>
                                                <div style={{display: 'inline-block'}}>П: <b style={{color: 'black'}}>{element.data.b.ps}</b>&nbsp;&nbsp;</div>
                                            </Typography>
                                        </ExpansionPanelSummary>
                                        <ExpansionPanelDetails style={{padding: '0px'}}>
                                            <center style={{width: '100%'}}>
                                                <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                                    Выдано:
                                                </div>
                                                &nbsp;{element.data.b.v}
                                            </center>
                                        </ExpansionPanelDetails>
                                        <ExpansionPanelDetails style={{padding: '0px'}}>
                                            <center style={{width: '100%'}}>
                                                <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                                    Остаток съем:
                                                </div>
                                                &nbsp;{element.data.b.o}
                                            </center>
                                        </ExpansionPanelDetails>
                                        <ExpansionPanelDetails style={{padding: '0px'}}>
                                            <center style={{width: '100%'}}>
                                                <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                                    Списание по акту:
                                                </div>
                                                &nbsp;{element.data.b.o}
                                            </center>
                                        </ExpansionPanelDetails>
                                        <ExpansionPanelDetails style={{padding: '0px'}}>
                                            <center style={{width: '100%'}}>
                                                <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                                    Продано штук:
                                                </div>
                                                &nbsp;{element.data.b.pl}
                                            </center>
                                        </ExpansionPanelDetails>
                                        <ExpansionPanelDetails style={{padding: '0px'}}>
                                            <center style={{width: '100%'}}>
                                                <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                                    Количество Т.Т.:
                                                </div>
                                                &nbsp;{element.data.b.ktt}
                                            </center>
                                        </ExpansionPanelDetails>
                                        <ExpansionPanelDetails style={{padding: '0px'}}>
                                            <center style={{width: '100%'}}>
                                                <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                                    Количество доливов:
                                                </div>
                                                &nbsp;{element.data.b.kd}
                                            </center>
                                        </ExpansionPanelDetails>
                                        <ExpansionPanelDetails style={{padding: '0px'}}>
                                            <center style={{width: '100%'}}>
                                                <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                                    Продано сом:
                                                </div>
                                                &nbsp;{element.data.b.ps}
                                            </center>
                                        </ExpansionPanelDetails>
                                    </ExpansionPanel>

                                </ExpansionPanelDetails>
                                <ExpansionPanelDetails style={{padding: '0px'}}>
                                    <ExpansionPanel style={{width: '100%'}}>
                                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                            <Typography className={classes.heading}>Прочее</Typography>
                                            <Typography className={classes.secondaryHeading}>
                                                <div style={{display: 'inline-block'}}>Н: <b style={{color: 'black'}}>{element.data.ntp}</b>&nbsp;&nbsp;</div>
                                                <div style={{display: 'inline-block'}}>М: <b style={{color: 'black'}}>{element.data.att}</b>&nbsp;&nbsp;</div>
                                                <div style={{display: 'inline-block'}}>И: <b style={{color: 'black'}}>{element.data.inc}</b>&nbsp;&nbsp;</div>
                                            </Typography>
                                        </ExpansionPanelSummary>
                                        <ExpansionPanelDetails style={{padding: '0px'}}>
                                            <center style={{width: '100%'}}>
                                                <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                                    Недосдача:
                                                </div>
                                                &nbsp;{element.data.ntp}
                                            </center>
                                        </ExpansionPanelDetails>
                                        <ExpansionPanelDetails style={{padding: '0px'}}>
                                            <center style={{width: '100%'}}>
                                                <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                                    Место:
                                                </div>
                                                &nbsp;{element.data.att}
                                            </center>
                                        </ExpansionPanelDetails>
                                        <ExpansionPanelDetails style={{padding: '0px'}}>
                                            <center style={{width: '100%'}}>
                                                <div style={{marginRight: '10px', display: 'inline-block', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                                    Инкассация:
                                                </div>
                                                &nbsp;{element.data.inc}
                                            </center>
                                        </ExpansionPanelDetails>
                                    </ExpansionPanel>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                        )
                    }):null
                }
                <br/>
                <br/>
            </div>
        );
  })

function mapStateToProps (state) {
    return {
        table: state.table,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        tableActions: bindActionCreators(tableActions, dispatch),
        mini_dialogActions: bindActionCreators(mini_dialogActions, dispatch),
    }
}

Event.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Plan));
