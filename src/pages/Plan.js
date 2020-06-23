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
import { DatePicker } from 'material-ui-pickers';
import { month, checkInt } from '../redux/constants/other'

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';


const width = mainWindow===undefined||mainWindow.current.offsetWidth>800? 500: 240;
const width1 = mainWindow===undefined||mainWindow.current.offsetWidth>800? 240: 120;
const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: width,
    },
    message: {
        width: width,
        marginTop: theme.spacing.unit,
        marginBottom: theme.spacing.unit,
        marginLeft: 'calc((100% - '+width+'px)/2)',
        marginRight: 'calc((100% - '+width+'px)/2)'
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
                if(selected===-1) {
                    let regions = [], _data = await tableActions.getDataSimple({name: 'РегионИмя'})
                    if(_data!==undefined){
                        for (let i = 0; i < _data.length; i++) {
                            let points = [], _data1 = await tableActions.getDataSimple({name: 'ТочкаПоРегиону', data: {region: _data[i].guid}})
                            for (let i1 = 0; i1 < _data1.length; i1++) {
                                points[i1] = {name: _data1[i1].name, guidPoint: _data1[i1].guid, plan: '', current: 0}
                            }
                            regions[i] = {name: _data[i].name, guidRegion: _data[i].guid, plan: 0, current: 0, points: points}
                        }
                        setRegions(regions)
                    }
                }
                else {
                let _data = await tableActions.getDataSimple({name: 'ПланПоДате', data: {date: data[selected][0]}})
                if(_data!==undefined) {
                    setRegions(JSON.parse(_data.regions))
                    setDate(_data.date)
                    setPlan(_data.norma)
                    setCurrent(_data.current)
                    setId(_data._id)
                    if ('организатор' === status.role) {
                        let or = JSON.parse(_data.regions)
                        for (let i = 0; i < or.length; i++) {
                            if (profile.region === or[i].name) {
                                setPlan(JSON.parse(_data.regions)[0].plan)
                                setCurrent(JSON.parse(_data.regions)[0].current)
                            }
                        }

                        _data = await tableActions.getDataSimple({name: 'Профиль'})
                        setProfile(_data)
                    }
                }
            }
            }
            fetchData();
        },[])
        const { setSelected, addData, setData } = props.tableActions;
        const { selected, data } = props.table;
        const { classes } = props;
        const { status } = props.user;
        let [date, setDate] = useState('2019-01-01');
        let [profile, setProfile] = useState({});
        let [virtualList, setVirtualList] = useState({});
        let [id, setId] = useState('2019-01-01');
        let [current, setCurrent] = useState(0);
        let [plan, setPlan] = useState(0);
        let [regions, setRegions] = useState([]);
        let handlePoints =  (event, region, point) => {
            let plan = parseInt(event.target.value)
            regions[region].points[point].plan = isNaN(plan)?'':plan
            regions[region].plan = 0
            for(let i = 0; i<regions[region].points.length; i++) {
                regions[region].plan += checkInt(regions[region].points[i].plan)
            }
            plan = 0
            for(let i = 0; i<regions.length; i++) {
                plan += checkInt(regions[i].plan)
            }
            setRegions(regions)
            setPlan(plan)
        };
         return (
            <div>
                <br/>
                <br/>
                {
                    selected===-1?
                        <>
                        <DatePicker
                            views={['year', 'month']}
                            label='Дата'
                            className={classes.textField}
                            value={date}
                            onChange={setDate}
                        />
                        <br/>
                        </>
                        :
                        <div class={classes.message}>
                            <h3>
                                {date}
                            </h3>
                        </div>
                }
                <div className={classes.message}>
                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle'}}>
                        Цель: <div style={{display: 'inline-block', fontWeight: 'bold'}}>{plan}</div>
                    </div>
                    <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle'}}>
                        Прогресс: <div style={{display: 'inline-block', fontWeight: 'bold'}}>{plan!==0&&plan!==''?Math.round(current*100/plan)+'%':current}</div>
                    </div>
                </div>
                <br/>
                {regions!=undefined&&regions.length>0?
                    regions.map((element, idx)=>{
                    if(status.role=='admin'||(status.role=='организатор'&&profile.region===element.name))
                        return(
                            <ExpansionPanel key={idx} onClick={()=>{virtualList= {...virtualList}; virtualList[element.name]=true; setVirtualList(virtualList)}}>
                                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography className={classes.heading}>{element.name}</Typography>
                                    <Typography className={classes.secondaryHeading}>
                                        Цель: <b style={{color: 'black'}}>{element.plan}</b>&nbsp;&nbsp;
                                        Прогресс: <b style={{color: 'black'}}>{element.plan!==0&&element.plan!==''?Math.round(element.current*100/element.plan)+'%':element.current}</b>
                                    </Typography>
                                </ExpansionPanelSummary>
                                 {virtualList[element.name]===true&&element.points!=undefined&&element.points.length>0?
                                     element.points.map((element, idx1)=>{
                                         return(
                                             <ExpansionPanelDetails key={idx}>
                                                 <center style={{width: '100%'}}>
                                                     <b>{element.name}</b><br/>
                                                     <div style={{width: '40px', marginRight: '10px', display: 'inline-block', verticalAlign: 'middle'}}>
                                                        Цель:
                                                     </div>
                                                     <TextField
                                                         style={{marginTop: '12px', marginRight: '10px', width: '70px', display: 'inline-block', verticalAlign: 'middle'}}
                                                         type="number"
                                                         margin='normal'
                                                         value={element.plan}
                                                         onChange={(event)=>{handlePoints(event, idx, idx1)}}
                                                     />
                                                     <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle'}}>
                                                         Прогресс: <div style={{display: 'inline-block', fontWeight: 'bold'}}>{element.plan!==0&&element.plan!==''?Math.round(element.current*100/element.plan)+'%':element.current}</div>
                                                     </div>
                                                 </center>
                                             </ExpansionPanelDetails>
                                         )
                                        })
                                        :
                                        null
                                    }
                            </ExpansionPanel>
                            )
                    }):null
                }
                <br/>
                <div>
                    <Link className='link' to={''}>
                        <Button variant='contained' color='primary' onClick={()=>{
                            if(selected===-1) {
                                addData({
                                    search: '', sort: '', page: 0, name: 'План', data: {
                                        norma: plan,
                                        regions: JSON.stringify(regions),
                                        date: month[(new Date(date)).getMonth()]+' '+(1900+(new Date(date)).getYear())
                                    }
                                });
                            } else
                                setData({id: id, search: '', sort: '', page: 0, name: 'План', data: {
                                    norma: plan,
                                    regions: JSON.stringify(regions)
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
