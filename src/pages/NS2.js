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
                if (!(status.status==='active'&&['admin', 'организатор', 'завсклада'].includes(status.role))) {
                props.history.push('/')
            }
                if(selected===-1) {
                    let _data = await tableActions.getDataSimple({name: 'ОрганизаторПоID'})
                    if(_data!==undefined){
                        let date = new Date()
                        date = JSON.stringify(date).split('-')
                        date = date[2].split('T')[0]+' '+month[parseInt(date[1])-1]+' '+date[0].replace('"', '')
                        let _data1 = await tableActions.getDataSimple({name: 'Накладная склад №2 по данным', data:
                            {data: date, organizator: _data.guid, region: _data.guidRegion}})
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
                            nakladnaya= {...nakladnaya}
                            let _data1 = await tableActions.getDataSimple({
                                name: 'Все отчеты реализаторов по дате',
                                data: {data: date, organizator: _data.guid, region: _data.guidRegion}
                            })
                            if (_data1 != undefined) {

                                nakladnaya['vydano']['r']['sh02'] = 0
                                nakladnaya['vydano']['r']['sh04'] = 0
                                nakladnaya['vydano']['r']['l'] = 0
                                nakladnaya['vydano']['r']['b'] = 0

                                nakladnaya['vydano']['d1']['sh02'] = 0
                                nakladnaya['vydano']['d1']['sh04'] = 0
                                nakladnaya['vydano']['d1']['l'] = 0
                                nakladnaya['vydano']['d1']['b'] = 0

                                nakladnaya['vydano']['d2']['sh02'] = 0
                                nakladnaya['vydano']['d2']['sh04'] = 0
                                nakladnaya['vydano']['d2']['l'] = 0
                                nakladnaya['vydano']['d2']['b'] = 0

                                nakladnaya['vydano']['d3']['sh02'] = 0
                                nakladnaya['vydano']['d3']['sh04'] = 0
                                nakladnaya['vydano']['d3']['l'] = 0
                                nakladnaya['vydano']['d3']['b'] = 0

                                nakladnaya['vozvrat']['s']['sh02'] = 0
                                nakladnaya['vozvrat']['s']['sh04'] = 0
                                nakladnaya['vozvrat']['s']['l'] = 0
                                nakladnaya['vozvrat']['s']['b'] = 0

                                for(let i = 0; i<_data1.length; i++){
                                    let addDataTable = JSON.parse(_data1[i].dataTable)
                                    if(checkInt(addDataTable.vozvrat.v.s02)>0) {
                                        nakladnaya['vozvrat']['s']['sh02'] += checkInt(addDataTable.vozvrat.v.s02)
                                    }
                                    if(checkInt(addDataTable.vozvrat.v.s04)>0) {
                                        nakladnaya['vozvrat']['s']['sh04'] += checkInt(addDataTable.vozvrat.v.s04)
                                    }
                                    if(checkInt(addDataTable.vozvrat.v.sl)>0) {
                                        nakladnaya['vozvrat']['s']['l'] += checkInt(addDataTable.vozvrat.v.sl)
                                    }
                                    if(checkInt(addDataTable.vozvrat.v.b)>0) {
                                        nakladnaya['vozvrat']['s']['b'] += checkInt(addDataTable.vozvrat.v.b)
                                    }

                                    if(checkInt(addDataTable.vydano.r.s02)>0) {
                                        nakladnaya['vydano']['r']['sh02'] += checkInt(addDataTable.vydano.r.s02)
                                    }
                                    if(checkInt(addDataTable.vydano.r.s04)>0) {
                                        nakladnaya['vydano']['r']['sh04'] += checkInt(addDataTable.vydano.r.s04)
                                    }
                                    if(checkInt(addDataTable.vydano.r.sl)>0) {
                                        nakladnaya['vydano']['r']['l'] += checkInt(addDataTable.vydano.r.sl)
                                    }
                                    if(checkInt(addDataTable.vydano.r.b)>0) {
                                        nakladnaya['vydano']['r']['b'] += checkInt(addDataTable.vydano.r.b)
                                    }

                                    if(checkInt(addDataTable.vydano.d1.s02)>0) {
                                        nakladnaya['vydano']['d1']['sh02'] += checkInt(addDataTable.vydano.d1.s02)
                                    }
                                    if(checkInt(addDataTable.vydano.d1.s04)>0) {
                                        nakladnaya['vydano']['d1']['sh04'] += checkInt(addDataTable.vydano.d1.s04)
                                    }
                                    if(checkInt(addDataTable.vydano.d1.sl)>0) {
                                        nakladnaya['vydano']['d1']['l'] += checkInt(addDataTable.vydano.d1.sl)
                                    }
                                    if(checkInt(addDataTable.vydano.d1.b)>0) {
                                        nakladnaya['vydano']['d1']['b'] += checkInt(addDataTable.vydano.d1.b)
                                    }

                                    if(checkInt(addDataTable.vydano.d2.s02)>0) {
                                        nakladnaya['vydano']['d2']['sh02'] += checkInt(addDataTable.vydano.d2.s02)
                                    }
                                    if(checkInt(addDataTable.vydano.d2.s04)>0) {
                                        nakladnaya['vydano']['d2']['sh04'] += checkInt(addDataTable.vydano.d2.s04)
                                    }
                                    if(checkInt(addDataTable.vydano.d2.sl)>0) {
                                        nakladnaya['vydano']['d2']['l'] += checkInt(addDataTable.vydano.d2.sl)
                                    }
                                    if(checkInt(addDataTable.vydano.d2.b)>0) {
                                        nakladnaya['vydano']['d2']['b'] += checkInt(addDataTable.vydano.d2.b)
                                    }

                                    if(checkInt(addDataTable.vydano.d3.s02)>0) {
                                        nakladnaya['vydano']['d3']['sh02'] += checkInt(addDataTable.vydano.d3.s02)
                                    }
                                    if(checkInt(addDataTable.vydano.d3.s04)>0) {
                                        nakladnaya['vydano']['d3']['sh04'] += checkInt(addDataTable.vydano.d3.s04)
                                    }
                                    if(checkInt(addDataTable.vydano.d3.sl)>0) {
                                        nakladnaya['vydano']['d3']['l'] += checkInt(addDataTable.vydano.d3.sl)
                                    }
                                    if(checkInt(addDataTable.vydano.d3.b)>0) {
                                        nakladnaya['vydano']['d3']['b'] += checkInt(addDataTable.vydano.d3.b)
                                    }
                                }
                                nakladnaya['vydano']['i']['sh02'] = checkInt(nakladnaya['vydano']['r']['sh02']) + checkInt(nakladnaya['vydano']['d1']['sh02']) + checkInt(nakladnaya['vydano']['d2']['sh02']) + checkInt(nakladnaya['vydano']['d3']['sh02'])
                                nakladnaya['vydano']['i']['sh04'] = checkInt(nakladnaya['vydano']['r']['sh04']) + checkInt(nakladnaya['vydano']['d1']['sh04']) + checkInt(nakladnaya['vydano']['d2']['sh04']) + checkInt(nakladnaya['vydano']['d3']['sh04'])
                                nakladnaya['vydano']['i']['l'] = checkInt(nakladnaya['vydano']['r']['l']) + checkInt(nakladnaya['vydano']['d1']['l']) + checkInt(nakladnaya['vydano']['d2']['l']) + checkInt(nakladnaya['vydano']['d3']['l'])
                                nakladnaya['vydano']['i']['b'] = checkInt(nakladnaya['vydano']['r']['b']) + checkInt(nakladnaya['vydano']['d1']['b']) + checkInt(nakladnaya['vydano']['d2']['b']) + checkInt(nakladnaya['vydano']['d3']['b'])

                                nakladnaya['vozvrat']['iv']['sh02'] = checkInt(nakladnaya['vozvrat']['i']['sh02']) + checkInt(nakladnaya['vozvrat']['v']['sh02']) + checkInt(nakladnaya['vozvrat']['s']['sh02'])
                                nakladnaya['vozvrat']['iv']['sh04'] = checkInt(nakladnaya['vozvrat']['i']['sh04']) + checkInt(nakladnaya['vozvrat']['v']['sh04']) + checkInt(nakladnaya['vozvrat']['s']['sh04'])
                                nakladnaya['vozvrat']['iv']['l'] = checkInt(nakladnaya['vozvrat']['i']['l']) + checkInt(nakladnaya['vozvrat']['v']['l']) + checkInt(nakladnaya['vozvrat']['s']['l'])
                                nakladnaya['vozvrat']['iv']['b'] = checkInt(nakladnaya['vozvrat']['i']['b']) + checkInt(nakladnaya['vozvrat']['v']['b']) + checkInt(nakladnaya['vozvrat']['s']['b'])

                            }
                            setNakladnaya(nakladnaya)
                        }
                    }
                }
                else {
                    let _data = await tableActions.getDataSimple({name: 'Накладная склад №2 по данным',
                        data: {data: data[selected][1], organizator: data[selected][2], region: data[selected][3]}})
                    if(_data!==undefined) {
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
        const { selected, data, name } = props.table;
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
            setNakladnaya({
                'vydano': {
                    'r':
                        {'s02':'', 'sh02':'', 's04':'', 'sh04':'', 'l':'', 'b':'', 'pm':'', 'pv':'', 'o': false, 'p': false},
                    'd1':
                        {'s02':'', 'sh02':'', 's04':'', 'sh04':'', 'l':'', 'b':'', 'pm':'', 'pv':'', 'o': false, 'p': false},
                    'd2':
                        {'s02':'', 'sh02':'', 's04':'', 'sh04':'', 'l':'', 'b':'', 'pm':'', 'pv':'', 'o': false, 'p': false},
                    'd3':
                        {'s02':'', 'sh02':'', 's04':'', 'sh04':'', 'l':'', 'b':'', 'pm':'', 'pv':'', 'o': false, 'p': false},
                    'i':
                        {'s02':'', 'sh02':'', 's04':'', 'sh04':'', 'l':'', 'b':'', 'pm':'', 'pv':'', 'o': false, 'p': false},
                },
                'vozvrat': {
                    'r':
                        {'s02':'', 'sh02':'', 's04':'', 'sh04':'', 'l':'', 'b':'', 'pm':'', 'pv':'', 'o': false, 'p': false},
                    'd1':
                        {'s02':'', 'sh02':'', 's04':'', 'sh04':'', 'l':'', 'b':'', 'pm':'', 'pv':'', 'o': false, 'p': false},
                    'd2':
                        {'s02':'', 'sh02':'', 's04':'', 'sh04':'', 'l':'', 'b':'', 'pm':'', 'pv':'', 'o': false, 'p': false},
                    'd3':
                        {'s02':'', 'sh02':'', 's04':'', 'sh04':'', 'l':'', 'b':'', 'pm':'', 'pv':'', 'o': false, 'p': false},
                    'i':
                        {'s02':'', 'sh02':'', 's04':'', 'sh04':'', 'l':'', 'b':'', 'pm':'', 'pv':'', 'o': false, 'p': false},
                    'v':
                        {'s02':'', 'sh02':'', 's04':'', 'sh04':'', 'l':'', 'b':'', 'pm':'', 'pv':'', 'o': false, 'p': false},
                    's':
                        {'s02':'', 's0502':'', 'sh02':'', 's04':'', 's0504':'', 'sh04':'', 'l':'', 'b':'', 'pm':'', 'pv':'', 'o': false, 'p': false},
                    'iv':
                        {'s02':'', 'sh02':'', 's04':'', 'sh04':'', 'l':'', 'b':'', 'pm':'', 'pv':'', 'o': false, 'p': false},
                },
            });
            setId('')
            setDate1(date)
            date = JSON.stringify(date).split('-')
            date = date[2].split('T')[0]+' '+month[parseInt(date[1])-1]+' '+date[0].replace('"', '')
            setDate(date)

            let _data1 = await tableActions.getDataSimple({
                name: 'Все отчеты реализаторов по дате',
                data: {data: date, organizator: guidOrganizator, region: guidRegion}
            })
            if (_data1 != undefined) {

                nakladnaya['vydano']['r']['sh02'] = 0
                nakladnaya['vydano']['r']['sh04'] = 0
                nakladnaya['vydano']['r']['l'] = 0
                nakladnaya['vydano']['r']['b'] = 0

                nakladnaya['vydano']['d1']['sh02'] = 0
                nakladnaya['vydano']['d1']['sh04'] = 0
                nakladnaya['vydano']['d1']['l'] = 0
                nakladnaya['vydano']['d1']['b'] = 0

                nakladnaya['vydano']['d2']['sh02'] = 0
                nakladnaya['vydano']['d2']['sh04'] = 0
                nakladnaya['vydano']['d2']['l'] = 0
                nakladnaya['vydano']['d2']['b'] = 0

                nakladnaya['vydano']['d3']['sh02'] = 0
                nakladnaya['vydano']['d3']['sh04'] = 0
                nakladnaya['vydano']['d3']['l'] = 0
                nakladnaya['vydano']['d3']['b'] = 0

                nakladnaya['vozvrat']['s']['sh02'] = 0
                nakladnaya['vozvrat']['s']['sh04'] = 0
                nakladnaya['vozvrat']['s']['l'] = 0
                nakladnaya['vozvrat']['s']['b'] = 0

                for(let i = 0; i<_data1.length; i++){
                    let addDataTable = JSON.parse(_data1[i].dataTable)
                    if(checkInt(addDataTable.vozvrat.v.s02)>0) {
                        nakladnaya['vozvrat']['s']['sh02'] += checkInt(addDataTable.vozvrat.v.s02)
                    }
                    if(checkInt(addDataTable.vozvrat.v.s04)>0) {
                        nakladnaya['vozvrat']['s']['sh04'] += checkInt(addDataTable.vozvrat.v.s04)
                    }
                    if(checkInt(addDataTable.vozvrat.v.sl)>0) {
                        nakladnaya['vozvrat']['s']['l'] += checkInt(addDataTable.vozvrat.v.sl)
                    }
                    if(checkInt(addDataTable.vozvrat.v.b)>0) {
                        nakladnaya['vozvrat']['s']['b'] += checkInt(addDataTable.vozvrat.v.b)
                    }

                    if(checkInt(addDataTable.vydano.r.s02)>0) {
                        nakladnaya['vydano']['r']['sh02'] += checkInt(addDataTable.vydano.r.s02)
                    }
                    if(checkInt(addDataTable.vydano.r.s04)>0) {
                        nakladnaya['vydano']['r']['sh04'] += checkInt(addDataTable.vydano.r.s04)
                    }
                    if(checkInt(addDataTable.vydano.r.sl)>0) {
                        nakladnaya['vydano']['r']['l'] += checkInt(addDataTable.vydano.r.sl)
                    }
                    if(checkInt(addDataTable.vydano.r.b)>0) {
                        nakladnaya['vydano']['r']['b'] += checkInt(addDataTable.vydano.r.b)
                    }

                    if(checkInt(addDataTable.vydano.d1.s02)>0) {
                        nakladnaya['vydano']['d1']['sh02'] += checkInt(addDataTable.vydano.d1.s02)
                    }
                    if(checkInt(addDataTable.vydano.d1.s04)>0) {
                        nakladnaya['vydano']['d1']['sh04'] += checkInt(addDataTable.vydano.d1.s04)
                    }
                    if(checkInt(addDataTable.vydano.d1.sl)>0) {
                        nakladnaya['vydano']['d1']['l'] += checkInt(addDataTable.vydano.d1.sl)
                    }
                    if(checkInt(addDataTable.vydano.d1.b)>0) {
                        nakladnaya['vydano']['d1']['b'] += checkInt(addDataTable.vydano.d1.b)
                    }

                    if(checkInt(addDataTable.vydano.d2.s02)>0) {
                        nakladnaya['vydano']['d2']['sh02'] += checkInt(addDataTable.vydano.d2.s02)
                    }
                    if(checkInt(addDataTable.vydano.d2.s04)>0) {
                        nakladnaya['vydano']['d2']['sh04'] += checkInt(addDataTable.vydano.d2.s04)
                    }
                    if(checkInt(addDataTable.vydano.d2.sl)>0) {
                        nakladnaya['vydano']['d2']['l'] += checkInt(addDataTable.vydano.d2.sl)
                    }
                    if(checkInt(addDataTable.vydano.d2.b)>0) {
                        nakladnaya['vydano']['d2']['b'] += checkInt(addDataTable.vydano.d2.b)
                    }

                    if(checkInt(addDataTable.vydano.d3.s02)>0) {
                        nakladnaya['vydano']['d3']['sh02'] += checkInt(addDataTable.vydano.d3.s02)
                    }
                    if(checkInt(addDataTable.vydano.d3.s04)>0) {
                        nakladnaya['vydano']['d3']['sh04'] += checkInt(addDataTable.vydano.d3.s04)
                    }
                    if(checkInt(addDataTable.vydano.d3.sl)>0) {
                        nakladnaya['vydano']['d3']['l'] += checkInt(addDataTable.vydano.d3.sl)
                    }
                    if(checkInt(addDataTable.vydano.d3.b)>0) {
                        nakladnaya['vydano']['d3']['b'] += checkInt(addDataTable.vydano.d3.b)
                    }
                }
                nakladnaya['vydano']['i']['sh02'] = checkInt(nakladnaya['vydano']['r']['sh02']) + checkInt(nakladnaya['vydano']['d1']['sh02']) + checkInt(nakladnaya['vydano']['d2']['sh02']) + checkInt(nakladnaya['vydano']['d3']['sh02'])
                nakladnaya['vydano']['i']['sh04'] = checkInt(nakladnaya['vydano']['r']['sh04']) + checkInt(nakladnaya['vydano']['d1']['sh04']) + checkInt(nakladnaya['vydano']['d2']['sh04']) + checkInt(nakladnaya['vydano']['d3']['sh04'])
                nakladnaya['vydano']['i']['l'] = checkInt(nakladnaya['vydano']['r']['l']) + checkInt(nakladnaya['vydano']['d1']['l']) + checkInt(nakladnaya['vydano']['d2']['l']) + checkInt(nakladnaya['vydano']['d3']['l'])
                nakladnaya['vydano']['i']['b'] = checkInt(nakladnaya['vydano']['r']['b']) + checkInt(nakladnaya['vydano']['d1']['b']) + checkInt(nakladnaya['vydano']['d2']['b']) + checkInt(nakladnaya['vydano']['d3']['b'])

                nakladnaya['vozvrat']['iv']['sh02'] = checkInt(nakladnaya['vozvrat']['i']['sh02']) + checkInt(nakladnaya['vozvrat']['v']['sh02']) + checkInt(nakladnaya['vozvrat']['s']['sh02'])
                nakladnaya['vozvrat']['iv']['sh04'] = checkInt(nakladnaya['vozvrat']['i']['sh04']) + checkInt(nakladnaya['vozvrat']['v']['sh04']) + checkInt(nakladnaya['vozvrat']['s']['sh04'])
                nakladnaya['vozvrat']['iv']['l'] = checkInt(nakladnaya['vozvrat']['i']['l']) + checkInt(nakladnaya['vozvrat']['v']['l']) + checkInt(nakladnaya['vozvrat']['s']['l'])
                nakladnaya['vozvrat']['iv']['b'] = checkInt(nakladnaya['vozvrat']['i']['b']) + checkInt(nakladnaya['vozvrat']['v']['b']) + checkInt(nakladnaya['vozvrat']['s']['b'])

            }
        };
        let [disabled, setDisabled] = useState(false);
        let [id, setId] = useState('');
        let [nakladnaya, setNakladnaya] = useState({
            'vydano': {
                'r':
                    {'s02':'', 'sh02':'', 's04':'', 'sh04':'', 'l':'', 'b':'', 'pm':'', 'pv':'', 'o': false, 'p': false},
                'd1':
                    {'s02':'', 'sh02':'', 's04':'', 'sh04':'', 'l':'', 'b':'', 'pm':'', 'pv':'', 'o': false, 'p': false},
                'd2':
                    {'s02':'', 'sh02':'', 's04':'', 'sh04':'', 'l':'', 'b':'', 'pm':'', 'pv':'', 'o': false, 'p': false},
                'd3':
                    {'s02':'', 'sh02':'', 's04':'', 'sh04':'', 'l':'', 'b':'', 'pm':'', 'pv':'', 'o': false, 'p': false},
                'i':
                    {'s02':'', 'sh02':'', 's04':'', 'sh04':'', 'l':'', 'b':'', 'pm':'', 'pv':'', 'o': false, 'p': false},
            },
            'vozvrat': {
                'r':
                    {'s02':'', 'sh02':'', 's04':'', 'sh04':'', 'l':'', 'b':'', 'pm':'', 'pv':'', 'o': false, 'p': false},
                'd1':
                    {'s02':'', 'sh02':'', 's04':'', 'sh04':'', 'l':'', 'b':'', 'pm':'', 'pv':'', 'o': false, 'p': false},
                'd2':
                    {'s02':'', 'sh02':'', 's04':'', 'sh04':'', 'l':'', 'b':'', 'pm':'', 'pv':'', 'o': false, 'p': false},
                'd3':
                    {'s02':'', 'sh02':'', 's04':'', 'sh04':'', 'l':'', 'b':'', 'pm':'', 'pv':'', 'o': false, 'p': false},
                'i':
                    {'s02':'', 'sh02':'', 's04':'', 'sh04':'', 'l':'', 'b':'', 'pm':'', 'pv':'', 'o': false, 'p': false},
                'v':
                    {'s02':'', 'sh02':'', 's04':'', 'sh04':'', 'l':'', 'b':'', 'pm':'', 'pv':'', 'o': false, 'p': false},
                's':
                    {'s02':'', 's0502':'', 'sh02':'', 's04':'', 's0504':'', 'sh04':'', 'l':'', 'b':'', 'pm':'', 'pv':'', 'o': false, 'p': false},
                'iv':
                    {'s02':'', 'sh02':'', 's04':'', 'sh04':'', 'l':'', 'b':'', 'pm':'', 'pv':'', 'o': false, 'p': false},
            },
        });

        let handleLitr =  (event, where, type, what) => {
            if(!nakladnaya[where][type]['o']) {
                nakladnaya= {...nakladnaya}
                let litr = parseInt(event.target.value)
                if (isNaN(litr)) {
                    nakladnaya[where][type][what] = ''
                } else {
                    nakladnaya[where][type][what] = litr
                }
                /*if(type === 's'){
                    nakladnaya[where][type]['sh02'] = checkInt(nakladnaya[where][type]['s02']) * 50 + checkInt(nakladnaya['vozvrat']['s']['s0502'])
                    nakladnaya[where][type]['sh04'] = checkInt(nakladnaya[where][type]['s04']) * 25 + checkInt(nakladnaya['vozvrat']['s']['s0504'])
                } else */if(where==='vozvrat'&&type !== 's'){
                    nakladnaya[where][type]['sh02'] = checkInt(nakladnaya[where][type]['s02']) * 50
                    nakladnaya[where][type]['sh04'] = checkInt(nakladnaya[where][type]['s04']) * 25
                }
                nakladnaya[where]['i'][what] = checkInt(nakladnaya[where]['r'][what]) + checkInt(nakladnaya[where]['d1'][what]) + checkInt(nakladnaya[where]['d2'][what]) + checkInt(nakladnaya[where]['d3'][what])
                nakladnaya[where]['i']['sh02'] = checkInt(nakladnaya[where]['r']['sh02']) + checkInt(nakladnaya[where]['d1']['sh02']) + checkInt(nakladnaya[where]['d2']['sh02']) + checkInt(nakladnaya[where]['d3']['sh02'])
                nakladnaya[where]['i']['sh04'] = checkInt(nakladnaya[where]['r']['sh04']) + checkInt(nakladnaya[where]['d1']['sh04']) + checkInt(nakladnaya[where]['d2']['sh04']) + checkInt(nakladnaya[where]['d3']['sh04'])
                nakladnaya['vozvrat']['iv']['sh02'] = checkInt(nakladnaya['vozvrat']['i']['sh02']) + checkInt(nakladnaya['vozvrat']['v']['sh02']) + checkInt(nakladnaya['vozvrat']['s']['sh02'])
                nakladnaya['vozvrat']['iv']['sh04'] = checkInt(nakladnaya['vozvrat']['i']['sh04']) + checkInt(nakladnaya['vozvrat']['v']['sh04']) + checkInt(nakladnaya['vozvrat']['s']['sh04'])
                nakladnaya['vozvrat']['iv']['l'] = checkInt(nakladnaya['vozvrat']['i']['l']) + checkInt(nakladnaya['vozvrat']['v']['l']) + checkInt(nakladnaya['vozvrat']['s']['l'])
                nakladnaya['vozvrat']['iv']['b'] = checkInt(nakladnaya['vozvrat']['i']['b']) + checkInt(nakladnaya['vozvrat']['v']['b']) + checkInt(nakladnaya['vozvrat']['s']['b'])
                setNakladnaya(nakladnaya)
            }
        };
        let handlePodpis =  (event, where, type, what) => {
            nakladnaya= {...nakladnaya}
            nakladnaya[where][type][what] = event.target.checked
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
                <h1>Накладная склад №2</h1>
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
                        <Typography className={classes.heading}><b>Выдано</b></Typography>
                        <Typography className={classes.secondaryHeading}>
                            <div style={{display: 'inline-block'}}>С02: <b style={{color: 'black'}}>{nakladnaya.vydano.i.s02}</b>&nbsp;&nbsp;</div>
                            <div style={{display: 'inline-block'}}>Ш02: <b style={{color: 'black'}}>{nakladnaya.vydano.i.sh02}</b>&nbsp;&nbsp;</div>
                            <div style={{display: 'inline-block'}}>С04: <b style={{color: 'black'}}>{nakladnaya.vydano.i.s04}</b>&nbsp;&nbsp;</div>
                            <div style={{display: 'inline-block'}}>Ш04: <b style={{color: 'black'}}>{nakladnaya.vydano.i.sh04}</b>&nbsp;&nbsp;</div>
                            <div style={{display: 'inline-block'}}>Л: <b style={{color: 'black'}}>{nakladnaya.vydano.i.l}</b>&nbsp;&nbsp;</div>
                            <div style={{display: 'inline-block'}}>Б: <b style={{color: 'black'}}>{nakladnaya.vydano.i.b}</b>&nbsp;&nbsp;</div>
                            <div style={{display: 'inline-block'}}>ПМ: <b style={{color: 'black'}}>{nakladnaya.vydano.i.pm}</b>&nbsp;&nbsp;</div>
                            <div style={{display: 'inline-block'}}>ПВ: <b style={{color: 'black'}}>{nakladnaya.vydano.i.pv}</b>&nbsp;&nbsp;</div>
                        </Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanel>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography className={classes.heading}>Растановка</Typography>
                            <Typography className={classes.secondaryHeading}>
                                <div style={{display: 'inline-block'}}>С02: <b style={{color: 'black'}}>{nakladnaya.vydano.r.s02}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Ш02: <b style={{color: 'black'}}>{nakladnaya.vydano.r.sh02}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>С04: <b style={{color: 'black'}}>{nakladnaya.vydano.r.s04}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Ш04: <b style={{color: 'black'}}>{nakladnaya.vydano.r.sh04}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Л: <b style={{color: 'black'}}>{nakladnaya.vydano.r.l}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Б: <b style={{color: 'black'}}>{nakladnaya.vydano.r.b}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>ПМ: <b style={{color: 'black'}}>{nakladnaya.vydano.r.pm}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>ПВ: <b style={{color: 'black'}}>{nakladnaya.vydano.r.pv}</b>&nbsp;&nbsp;</div>
                            </Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Сосиска 0.2:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.vydano.r.o}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vydano.r.s02}
                                    onChange={(event)=>{handleLitr(event, 'vydano', 'r', 's02')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Стаканы 0.2:
                                </div>
                                &nbsp;{nakladnaya.vydano.r.sh02}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Сосиска 0.4:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.vydano.r.o}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vydano.r.s04}
                                    onChange={(event)=>{handleLitr(event, 'vydano', 'r', 's04')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Стаканы 0.4:
                                </div>
                                &nbsp;{nakladnaya.vydano.r.sh04}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Легенда:
                                </div>
                                &nbsp;{nakladnaya.vydano.r.l}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Бутылки:
                                </div>
                                &nbsp;{nakladnaya.vydano.r.b}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Пакеты для мусора:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.vydano.r.o}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vydano.r.pm}
                                    onChange={(event)=>{handleLitr(event, 'vydano', 'r', 'pm')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Пакеты для выноса:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.vydano.r.o}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vydano.r.pv}
                                    onChange={(event)=>{handleLitr(event, 'vydano', 'r', 'pv')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={nakladnaya.vydano.r.o}
                                            color='primary'
                                            disabled={status.role==='admin'?false:checkDate||nakladnaya.vydano.r.p||status.role!=='завсклада'}
                                            onChange={(event)=>{handlePodpis(event, 'vydano', 'r', 'o')}}
                                        />
                                    }
                                    label='Отпустил'
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={nakladnaya.vydano.r.p}
                                            color='primary'
                                            disabled={status.role==='admin'?false:checkDate||nakladnaya.vydano.r.p||disabled||!nakladnaya.vydano.r.o||status.role!=='организатор'}
                                            onChange={(event)=>{handlePodpis(event, 'vydano', 'r', 'p')}}
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
                                <div style={{display: 'inline-block'}}>С02: <b style={{color: 'black'}}>{nakladnaya.vydano.d1.s02}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Ш02: <b style={{color: 'black'}}>{nakladnaya.vydano.d1.sh02}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>С04: <b style={{color: 'black'}}>{nakladnaya.vydano.d1.s04}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Ш04: <b style={{color: 'black'}}>{nakladnaya.vydano.d1.sh04}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Л: <b style={{color: 'black'}}>{nakladnaya.vydano.d1.l}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Б: <b style={{color: 'black'}}>{nakladnaya.vydano.d1.b}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>ПМ: <b style={{color: 'black'}}>{nakladnaya.vydano.d1.pm}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>ПВ: <b style={{color: 'black'}}>{nakladnaya.vydano.d1.pv}</b>&nbsp;&nbsp;</div>
                            </Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Сосиска 0.2:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.vydano.d1.o}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vydano.d1.s02}
                                    onChange={(event)=>{handleLitr(event, 'vydano', 'd1', 's02')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Стаканы 0.2:
                                </div>
                                &nbsp;{nakladnaya.vydano.d1.sh02}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Сосиска 0.4:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.vydano.d1.o}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vydano.d1.s04}
                                    onChange={(event)=>{handleLitr(event, 'vydano', 'd1', 's04')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Стаканы 0.4:
                                </div>
                                &nbsp;{nakladnaya.vydano.d1.sh04}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Легенда:
                                </div>
                                &nbsp;{nakladnaya.vydano.d1.l}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Бутылки:
                                </div>
                                &nbsp;{nakladnaya.vydano.d1.b}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Пакеты для мусора:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.vydano.d1.o}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vydano.d1.pm}
                                    onChange={(event)=>{handleLitr(event, 'vydano', 'd1', 'pm')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Пакеты для выноса:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.vydano.d1.o}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vydano.d1.pv}
                                    onChange={(event)=>{handleLitr(event, 'vydano', 'd1', 'pv')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={nakladnaya.vydano.d1.o}
                                            color='primary'
                                            disabled={status.role==='admin'?false:checkDate||nakladnaya.vydano.d1.p||status.role!=='завсклада'}
                                            onChange={(event)=>{handlePodpis(event, 'vydano', 'd1', 'o')}}
                                        />
                                    }
                                    label='Отпустил'
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={nakladnaya.vydano.d1.p}
                                            color='primary'
                                            disabled={status.role==='admin'?false:checkDate||nakladnaya.vydano.d1.p||disabled||!nakladnaya.vydano.d1.o||status.role!=='организатор'}
                                            onChange={(event)=>{handlePodpis(event, 'vydano', 'd1', 'p')}}
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
                            <Typography className={classes.heading}>2-й долив</Typography>
                            <Typography className={classes.secondaryHeading}>
                                <div style={{display: 'inline-block'}}>С02: <b style={{color: 'black'}}>{nakladnaya.vydano.d2.s02}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Ш02: <b style={{color: 'black'}}>{nakladnaya.vydano.d2.sh02}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>С04: <b style={{color: 'black'}}>{nakladnaya.vydano.d2.s04}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Ш04: <b style={{color: 'black'}}>{nakladnaya.vydano.d2.sh04}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Л: <b style={{color: 'black'}}>{nakladnaya.vydano.d2.l}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Б: <b style={{color: 'black'}}>{nakladnaya.vydano.d2.b}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>ПМ: <b style={{color: 'black'}}>{nakladnaya.vydano.d2.pm}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>ПВ: <b style={{color: 'black'}}>{nakladnaya.vydano.d2.pv}</b>&nbsp;&nbsp;</div>
                            </Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Сосиска 0.2:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.vydano.d2.o}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vydano.d2.s02}
                                    onChange={(event)=>{handleLitr(event, 'vydano', 'd2', 's02')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Стаканы 0.2:
                                </div>
                                &nbsp;{nakladnaya.vydano.d2.sh02}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Сосиска 0.4:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.vydano.d2.o}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vydano.d2.s04}
                                    onChange={(event)=>{handleLitr(event, 'vydano', 'd2', 's04')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <br/>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Стаканы 0.4:
                                </div>
                                &nbsp;{nakladnaya.vydano.d2.sh04}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Легенда:
                                </div>
                                &nbsp;{nakladnaya.vydano.d2.l}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Бутылки:
                                </div>
                                &nbsp;{nakladnaya.vydano.d2.b}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Пакеты для мусора:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.vydano.d2.o}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vydano.d2.pm}
                                    onChange={(event)=>{handleLitr(event, 'vydano', 'd2', 'pm')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Пакеты для выноса:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.vydano.d2.o}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vydano.d2.pv}
                                    onChange={(event)=>{handleLitr(event, 'vydano', 'd2', 'pv')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={nakladnaya.vydano.d2.o}
                                            color='primary'
                                            disabled={status.role==='admin'?false:checkDate||nakladnaya.vydano.d2.p||status.role!=='завсклада'}
                                            onChange={(event)=>{handlePodpis(event, 'vydano', 'd2', 'o')}}
                                        />
                                    }
                                    label='Отпустил'
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={nakladnaya.vydano.d2.p}
                                            color='primary'
                                            disabled={status.role==='admin'?false:checkDate||nakladnaya.vydano.d2.p||disabled||!nakladnaya.vydano.d2.o||status.role!=='организатор'}
                                            onChange={(event)=>{handlePodpis(event, 'vydano', 'd2', 'p')}}
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
                                <div style={{display: 'inline-block'}}>С02: <b style={{color: 'black'}}>{nakladnaya.vydano.d3.s02}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Ш02: <b style={{color: 'black'}}>{nakladnaya.vydano.d3.sh02}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>С04: <b style={{color: 'black'}}>{nakladnaya.vydano.d3.s04}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Ш04: <b style={{color: 'black'}}>{nakladnaya.vydano.d3.sh04}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Л: <b style={{color: 'black'}}>{nakladnaya.vydano.d3.l}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Б: <b style={{color: 'black'}}>{nakladnaya.vydano.d3.b}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>ПМ: <b style={{color: 'black'}}>{nakladnaya.vydano.d3.pm}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>ПВ: <b style={{color: 'black'}}>{nakladnaya.vydano.d3.pv}</b>&nbsp;&nbsp;</div>
                            </Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Сосиска 0.2:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.vydano.d3.o}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vydano.d3.s02}
                                    onChange={(event)=>{handleLitr(event, 'vydano', 'd3', 's02')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Стаканы 0.2:
                                </div>
                                &nbsp;{nakladnaya.vydano.d3.sh02}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Сосиска 0.4:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.vydano.d3.o}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vydano.d3.s04}
                                    onChange={(event)=>{handleLitr(event, 'vydano', 'd3', 's04')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Стаканы 0.4:
                                </div>
                                &nbsp;{nakladnaya.vydano.d3.sh04}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Легенда:
                                </div>
                                &nbsp;{nakladnaya.vydano.d3.l}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Бутылки:
                                </div>
                                &nbsp;{nakladnaya.vydano.d3.b}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Пакеты для мусора:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.vydano.d3.o}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vydano.d3.pm}
                                    onChange={(event)=>{handleLitr(event, 'vydano', 'd3', 'pm')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Пакеты для выноса:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.vydano.d3.o}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vydano.d3.pv}
                                    onChange={(event)=>{handleLitr(event, 'vydano', 'd3', 'pv')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={nakladnaya.vydano.d3.o}
                                            color='primary'
                                            disabled={status.role==='admin'?false:checkDate||nakladnaya.vydano.d3.p||status.role!=='завсклада'}
                                            onChange={(event)=>{handlePodpis(event, 'vydano', 'd3', 'o')}}
                                        />
                                    }
                                    label='Отпустил'
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={nakladnaya.vydano.d3.p}
                                            color='primary'
                                            disabled={status.role==='admin'?false:checkDate||nakladnaya.vydano.d3.p||disabled||!nakladnaya.vydano.d3.o||status.role!=='организатор'}
                                            onChange={(event)=>{handlePodpis(event, 'vydano', 'd3', 'p')}}
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
                                <div style={{display: 'inline-block'}}>С02: <b style={{color: 'black'}}>{nakladnaya.vydano.i.s02}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Ш02: <b style={{color: 'black'}}>{nakladnaya.vydano.i.sh02}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>С04: <b style={{color: 'black'}}>{nakladnaya.vydano.i.s04}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Ш04: <b style={{color: 'black'}}>{nakladnaya.vydano.i.sh04}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Л: <b style={{color: 'black'}}>{nakladnaya.vydano.i.l}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Б: <b style={{color: 'black'}}>{nakladnaya.vydano.i.b}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>ПМ: <b style={{color: 'black'}}>{nakladnaya.vydano.i.pm}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>ПВ: <b style={{color: 'black'}}>{nakladnaya.vydano.i.pv}</b>&nbsp;&nbsp;</div>
                            </Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Сосиска 0.2:
                                </div>
                                &nbsp;{nakladnaya.vydano.i.s02}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Стаканы 0.2:
                                </div>
                                &nbsp;{nakladnaya.vydano.i.sh02}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Сосиска 0.4:
                                </div>
                                &nbsp;{nakladnaya.vydano.i.s04}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Стаканы 0.4:
                                </div>
                                &nbsp;{nakladnaya.vydano.i.sh04}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Легенда:
                                </div>
                                &nbsp;{nakladnaya.vydano.i.l}
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
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Пакеты для мусора:
                                </div>
                                &nbsp;{nakladnaya.vydano.i.pm}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Пакеты для выноса:
                                </div>
                                &nbsp;{nakladnaya.vydano.i.pv}
                            </center>
                        </ExpansionPanelDetails>
                        <br/>
                    </ExpansionPanel>

                    <br/>
                </ExpansionPanel>

                <ExpansionPanel>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography className={classes.heading}><b>Возврат</b></Typography>
                        <Typography className={classes.secondaryHeading}>
                            <div style={{display: 'inline-block'}}>С02: <b style={{color: 'black'}}>{nakladnaya.vozvrat.iv.s02}</b>&nbsp;&nbsp;</div>
                            <div style={{display: 'inline-block'}}>Ш02: <b style={{color: 'black'}}>{nakladnaya.vozvrat.iv.sh02}</b>&nbsp;&nbsp;</div>
                            <div style={{display: 'inline-block'}}>С04: <b style={{color: 'black'}}>{nakladnaya.vozvrat.iv.s04}</b>&nbsp;&nbsp;</div>
                            <div style={{display: 'inline-block'}}>Ш04: <b style={{color: 'black'}}>{nakladnaya.vozvrat.iv.sh04}</b>&nbsp;&nbsp;</div>
                            <div style={{display: 'inline-block'}}>Л: <b style={{color: 'black'}}>{nakladnaya.vozvrat.iv.l}</b>&nbsp;&nbsp;</div>
                            <div style={{display: 'inline-block'}}>Б: <b style={{color: 'black'}}>{nakladnaya.vozvrat.iv.b}</b>&nbsp;&nbsp;</div>
                            <div style={{display: 'inline-block'}}>ПМ: <b style={{color: 'black'}}>{nakladnaya.vozvrat.iv.pm}</b>&nbsp;&nbsp;</div>
                            <div style={{display: 'inline-block'}}>ПВ: <b style={{color: 'black'}}>{nakladnaya.vozvrat.iv.pv}</b>&nbsp;&nbsp;</div>
                        </Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanel>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography className={classes.heading}>Растановка</Typography>
                            <Typography className={classes.secondaryHeading}>
                                <div style={{display: 'inline-block'}}>С02: <b style={{color: 'black'}}>{nakladnaya.vozvrat.r.s02}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Ш02: <b style={{color: 'black'}}>{nakladnaya.vozvrat.r.sh02}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>С04: <b style={{color: 'black'}}>{nakladnaya.vozvrat.r.s04}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Ш04: <b style={{color: 'black'}}>{nakladnaya.vozvrat.r.sh04}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Л: <b style={{color: 'black'}}>{nakladnaya.vozvrat.r.l}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Б: <b style={{color: 'black'}}>{nakladnaya.vozvrat.r.b}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>ПМ: <b style={{color: 'black'}}>{nakladnaya.vozvrat.r.pm}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>ПВ: <b style={{color: 'black'}}>{nakladnaya.vozvrat.r.pv}</b>&nbsp;&nbsp;</div>
                            </Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Сосиска 0.2:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.vozvrat.r.o}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vozvrat.r.s02}
                                    onChange={(event)=>{handleLitr(event, 'vozvrat', 'r', 's02')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Стаканы 0.2:
                                </div>
                                &nbsp;{nakladnaya.vozvrat.r.sh02}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Сосиска 0.4:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.vozvrat.r.o}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vozvrat.r.s04}
                                    onChange={(event)=>{handleLitr(event, 'vozvrat', 'r', 's04')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Стаканы 0.4:
                                </div>
                                &nbsp;{nakladnaya.vozvrat.r.sh04}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Легенда:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.vozvrat.r.o}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vozvrat.r.l}
                                    onChange={(event)=>{handleLitr(event, 'vozvrat', 'r', 'l')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Бутылки:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.vozvrat.r.o}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vozvrat.r.b}
                                    onChange={(event)=>{handleLitr(event, 'vozvrat', 'r', 'b')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Пакеты для мусора:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.vozvrat.r.o}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vozvrat.r.pm}
                                    onChange={(event)=>{handleLitr(event, 'vozvrat', 'r', 'pm')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Пакеты для выноса:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.vozvrat.r.o}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vozvrat.r.pv}
                                    onChange={(event)=>{handleLitr(event, 'vozvrat', 'r', 'pv')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={nakladnaya.vozvrat.r.o}
                                            color='primary'
                                            disabled={status.role==='admin'?false:checkDate||nakladnaya.vozvrat.r.p||status.role!=='завсклада'}
                                            onChange={(event)=>{handlePodpis(event, 'vozvrat', 'r', 'o')}}
                                        />
                                    }
                                    label='Отпустил'
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={nakladnaya.vozvrat.r.p}
                                            color='primary'
                                            disabled={status.role==='admin'?false:checkDate||nakladnaya.vozvrat.r.p||disabled||!nakladnaya.vozvrat.r.o||status.role!=='организатор'}
                                            onChange={(event)=>{handlePodpis(event, 'vozvrat', 'r', 'p')}}
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
                                <div style={{display: 'inline-block'}}>С02: <b style={{color: 'black'}}>{nakladnaya.vozvrat.d1.s02}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Ш02: <b style={{color: 'black'}}>{nakladnaya.vozvrat.d1.sh02}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>С04: <b style={{color: 'black'}}>{nakladnaya.vozvrat.d1.s04}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Ш04: <b style={{color: 'black'}}>{nakladnaya.vozvrat.d1.sh04}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Л: <b style={{color: 'black'}}>{nakladnaya.vozvrat.d1.l}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Б: <b style={{color: 'black'}}>{nakladnaya.vozvrat.d1.b}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>ПМ: <b style={{color: 'black'}}>{nakladnaya.vozvrat.d1.pm}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>ПВ: <b style={{color: 'black'}}>{nakladnaya.vozvrat.d1.pv}</b>&nbsp;&nbsp;</div>
                            </Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Сосиска 0.2:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.vozvrat.d1.o}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vozvrat.d1.s02}
                                    onChange={(event)=>{handleLitr(event, 'vozvrat', 'd1', 's02')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Стаканы 0.2:
                                </div>
                                &nbsp;{nakladnaya.vozvrat.d1.sh02}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Сосиска 0.4:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.vozvrat.d1.o}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vozvrat.d1.s04}
                                    onChange={(event)=>{handleLitr(event, 'vozvrat', 'd1', 's04')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Стаканы 0.4:
                                </div>
                                &nbsp;{nakladnaya.vozvrat.d1.sh04}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Легенда:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.vozvrat.d1.o}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vozvrat.d1.l}
                                    onChange={(event)=>{handleLitr(event, 'vozvrat', 'd1', 'l')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Бутылки:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.vozvrat.d1.o}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vozvrat.d1.b}
                                    onChange={(event)=>{handleLitr(event, 'vozvrat', 'd1', 'b')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Пакеты для мусора:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.vozvrat.d1.o}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vozvrat.d1.pm}
                                    onChange={(event)=>{handleLitr(event, 'vozvrat', 'd1', 'pm')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Пакеты для выноса:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.vozvrat.d1.o}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vozvrat.d1.pv}
                                    onChange={(event)=>{handleLitr(event, 'vozvrat', 'd1', 'pv')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={nakladnaya.vozvrat.d1.o}
                                            color='primary'
                                            disabled={status.role==='admin'?false:checkDate||nakladnaya.vozvrat.d1.p||status.role!=='завсклада'}
                                            onChange={(event)=>{handlePodpis(event, 'vozvrat', 'd1', 'o')}}
                                        />
                                    }
                                    label='Отпустил'
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={nakladnaya.vozvrat.d1.p}
                                            color='primary'
                                            disabled={status.role==='admin'?false:checkDate||nakladnaya.vozvrat.d1.p||disabled||!nakladnaya.vozvrat.d1.o||status.role!=='организатор'}
                                            onChange={(event)=>{handlePodpis(event, 'vozvrat', 'd1', 'p')}}
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
                            <Typography className={classes.heading}>2-й долив</Typography>
                            <Typography className={classes.secondaryHeading}>
                                <div style={{display: 'inline-block'}}>С02: <b style={{color: 'black'}}>{nakladnaya.vozvrat.d2.s02}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Ш02: <b style={{color: 'black'}}>{nakladnaya.vozvrat.d2.sh02}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>С04: <b style={{color: 'black'}}>{nakladnaya.vozvrat.d2.s04}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Ш04: <b style={{color: 'black'}}>{nakladnaya.vozvrat.d2.sh04}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Л: <b style={{color: 'black'}}>{nakladnaya.vozvrat.d2.l}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Б: <b style={{color: 'black'}}>{nakladnaya.vozvrat.d2.b}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>ПМ: <b style={{color: 'black'}}>{nakladnaya.vozvrat.d2.pm}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>ПВ: <b style={{color: 'black'}}>{nakladnaya.vozvrat.d2.pv}</b>&nbsp;&nbsp;</div>
                            </Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Сосиска 0.2:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.vozvrat.d2.o}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vozvrat.d2.s02}
                                    onChange={(event)=>{handleLitr(event, 'vozvrat', 'd2', 's02')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Стаканы 0.2:
                                </div>
                                &nbsp;{nakladnaya.vozvrat.d2.sh02}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Сосиска 0.4:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.vozvrat.d2.o}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vozvrat.d2.s04}
                                    onChange={(event)=>{handleLitr(event, 'vozvrat', 'd2', 's04')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Стаканы 0.4:
                                </div>
                                &nbsp;{nakladnaya.vozvrat.d2.sh04}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Легенда:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.vozvrat.d2.o}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vozvrat.d2.l}
                                    onChange={(event)=>{handleLitr(event, 'vozvrat', 'd2', 'l')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Бутылки:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.vozvrat.d2.o}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vozvrat.d2.b}
                                    onChange={(event)=>{handleLitr(event, 'vozvrat', 'd2', 'b')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Пакеты для мусора:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.vozvrat.d2.o}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vozvrat.d2.pm}
                                    onChange={(event)=>{handleLitr(event, 'vozvrat', 'd2', 'pm')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Пакеты для выноса:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.vozvrat.d2.o}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vozvrat.d2.pv}
                                    onChange={(event)=>{handleLitr(event, 'vozvrat', 'd2', 'pv')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={nakladnaya.vozvrat.d2.o}
                                            color='primary'
                                            disabled={status.role==='admin'?false:checkDate||nakladnaya.vozvrat.d2.p||status.role!=='завсклада'}
                                            onChange={(event)=>{handlePodpis(event, 'vozvrat', 'd2', 'o')}}
                                        />
                                    }
                                    label='Отпустил'
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={nakladnaya.vozvrat.d2.p}
                                            color='primary'
                                            disabled={status.role==='admin'?false:checkDate||nakladnaya.vozvrat.d2.p||disabled||!nakladnaya.vozvrat.d2.o||status.role!=='организатор'}
                                            onChange={(event)=>{handlePodpis(event, 'vozvrat', 'd2', 'p')}}
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
                                <div style={{display: 'inline-block'}}>С02: <b style={{color: 'black'}}>{nakladnaya.vozvrat.d3.s02}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Ш02: <b style={{color: 'black'}}>{nakladnaya.vozvrat.d3.sh02}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>С04: <b style={{color: 'black'}}>{nakladnaya.vozvrat.d3.s04}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Ш04: <b style={{color: 'black'}}>{nakladnaya.vozvrat.d3.sh04}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Л: <b style={{color: 'black'}}>{nakladnaya.vozvrat.d3.l}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Б: <b style={{color: 'black'}}>{nakladnaya.vozvrat.d3.b}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>ПМ: <b style={{color: 'black'}}>{nakladnaya.vozvrat.d3.pm}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>ПВ: <b style={{color: 'black'}}>{nakladnaya.vozvrat.d3.pv}</b>&nbsp;&nbsp;</div>
                            </Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Сосиска 0.2:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.vozvrat.d3.o}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vozvrat.d3.s02}
                                    onChange={(event)=>{handleLitr(event, 'vozvrat', 'd3', 's02')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Стаканы 0.2:
                                </div>
                                &nbsp;{nakladnaya.vozvrat.d3.sh02}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Сосиска 0.4:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.vozvrat.d3.o}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vozvrat.d3.s04}
                                    onChange={(event)=>{handleLitr(event, 'vozvrat', 'd3', 's04')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Стаканы 0.4:
                                </div>
                                &nbsp;{nakladnaya.vozvrat.d3.sh04}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Легенда:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.vozvrat.d3.o}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vozvrat.d3.l}
                                    onChange={(event)=>{handleLitr(event, 'vozvrat', 'd3', 'l')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Бутылки:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.vozvrat.d3.o}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vozvrat.d3.b}
                                    onChange={(event)=>{handleLitr(event, 'vozvrat', 'd3', 'b')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Пакеты для мусора:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.vozvrat.d3.o}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vozvrat.d3.pm}
                                    onChange={(event)=>{handleLitr(event, 'vozvrat', 'd3', 'pm')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Пакеты для выноса:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.vozvrat.d3.o}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vozvrat.d3.pv}
                                    onChange={(event)=>{handleLitr(event, 'vozvrat', 'd3', 'pv')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={nakladnaya.vozvrat.d3.o}
                                            color='primary'
                                            disabled={status.role==='admin'?false:checkDate||nakladnaya.vozvrat.d3.p||status.role!=='завсклада'}
                                            onChange={(event)=>{handlePodpis(event, 'vozvrat', 'd3', 'o')}}
                                        />
                                    }
                                    label='Отпустил'
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={nakladnaya.vozvrat.d3.p}
                                            color='primary'
                                            disabled={status.role==='admin'?false:checkDate||nakladnaya.vozvrat.d3.p||disabled||!nakladnaya.vozvrat.d3.o||status.role!=='организатор'}
                                            onChange={(event)=>{handlePodpis(event, 'vozvrat', 'd3', 'p')}}
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
                                <div style={{display: 'inline-block'}}>С02: <b style={{color: 'black'}}>{nakladnaya.vozvrat.i.s02}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Ш02: <b style={{color: 'black'}}>{nakladnaya.vozvrat.i.sh02}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>С04: <b style={{color: 'black'}}>{nakladnaya.vozvrat.i.s04}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Ш04: <b style={{color: 'black'}}>{nakladnaya.vozvrat.i.sh04}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Л: <b style={{color: 'black'}}>{nakladnaya.vozvrat.i.l}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Б: <b style={{color: 'black'}}>{nakladnaya.vozvrat.i.b}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>ПМ: <b style={{color: 'black'}}>{nakladnaya.vozvrat.i.pm}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>ПВ: <b style={{color: 'black'}}>{nakladnaya.vozvrat.i.pv}</b>&nbsp;&nbsp;</div>
                            </Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Сосиска 0.2:
                                </div>
                                &nbsp;{nakladnaya.vozvrat.i.s02}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Стаканы 0.2:
                                </div>
                                &nbsp;{nakladnaya.vozvrat.i.sh02}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Сосиска 0.4:
                                </div>
                                &nbsp;{nakladnaya.vozvrat.i.s04}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Стаканы 0.4:
                                </div>
                                &nbsp;{nakladnaya.vozvrat.i.sh04}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Легенда:
                                </div>
                                &nbsp;{nakladnaya.vozvrat.i.l}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Бутылки:
                                </div>
                                &nbsp;{nakladnaya.vozvrat.i.b}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Пакеты для мусора:
                                </div>
                                &nbsp;{nakladnaya.vozvrat.i.pm}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Пакеты для выноса:
                                </div>
                                &nbsp;{nakladnaya.vozvrat.i.pv}
                            </center>
                        </ExpansionPanelDetails>
                        <br/>
                    </ExpansionPanel>
                    <ExpansionPanel>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography className={classes.heading}>Возврат вечером</Typography>
                            <Typography className={classes.secondaryHeading}>
                                <div style={{display: 'inline-block'}}>С02: <b style={{color: 'black'}}>{nakladnaya.vozvrat.v.s02}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Ш02: <b style={{color: 'black'}}>{nakladnaya.vozvrat.v.sh02}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>С04: <b style={{color: 'black'}}>{nakladnaya.vozvrat.v.s04}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Ш04: <b style={{color: 'black'}}>{nakladnaya.vozvrat.v.sh04}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Л: <b style={{color: 'black'}}>{nakladnaya.vozvrat.v.l}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Б: <b style={{color: 'black'}}>{nakladnaya.vozvrat.v.b}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>ПМ: <b style={{color: 'black'}}>{nakladnaya.vozvrat.v.pm}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>ПВ: <b style={{color: 'black'}}>{nakladnaya.vozvrat.v.pv}</b>&nbsp;&nbsp;</div>
                            </Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Сосиска 0.2:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.vozvrat.v.o}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vozvrat.v.s02}
                                    onChange={(event)=>{handleLitr(event, 'vozvrat', 'v', 's02')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Стаканы 0.2:
                                </div>
                                &nbsp;{nakladnaya.vozvrat.v.sh02}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Сосиска 0.4:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.vozvrat.v.o}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vozvrat.v.s04}
                                    onChange={(event)=>{handleLitr(event, 'vozvrat', 'v', 's04')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Стаканы 0.4:
                                </div>
                                &nbsp;{nakladnaya.vozvrat.v.sh04}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Легенда:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.vozvrat.v.o}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vozvrat.v.l}
                                    onChange={(event)=>{handleLitr(event, 'vozvrat', 'v', 'l')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Бутылки:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.vozvrat.v.o}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vozvrat.v.b}
                                    onChange={(event)=>{handleLitr(event, 'vozvrat', 'v', 'b')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Пакеты для мусора:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.vozvrat.v.o}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vozvrat.v.pm}
                                    onChange={(event)=>{handleLitr(event, 'vozvrat', 'v', 'pm')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Пакеты для выноса:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.vozvrat.v.o}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vozvrat.v.pv}
                                    onChange={(event)=>{handleLitr(event, 'vozvrat', 'v', 'pv')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={nakladnaya.vozvrat.v.o}
                                            color='primary'
                                            disabled={status.role==='admin'?false:checkDate||nakladnaya.vozvrat.v.p||status.role!=='завсклада'}
                                            onChange={(event)=>{handlePodpis(event, 'vozvrat', 'v', 'o')}}
                                        />
                                    }
                                    label='Отпустил'
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={nakladnaya.vozvrat.v.p}
                                            color='primary'
                                            disabled={status.role==='admin'?false:checkDate||nakladnaya.vozvrat.v.p||disabled||!nakladnaya.vozvrat.v.o||status.role!=='организатор'}
                                            onChange={(event)=>{handlePodpis(event, 'vozvrat', 'v', 'p')}}
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
                                <div style={{display: 'inline-block'}}>С02: <b style={{color: 'black'}}>{nakladnaya.vozvrat.s.s02}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>СНП02: <b style={{color: 'black'}}>{nakladnaya.vozvrat.s.s0502}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Ш02: <b style={{color: 'black'}}>{nakladnaya.vozvrat.s.sh02}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>С04: <b style={{color: 'black'}}>{nakladnaya.vozvrat.s.s04}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>СНП04: <b style={{color: 'black'}}>{nakladnaya.vozvrat.s.s0504}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Ш04: <b style={{color: 'black'}}>{nakladnaya.vozvrat.s.sh04}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Л: <b style={{color: 'black'}}>{nakladnaya.vozvrat.s.l}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Б: <b style={{color: 'black'}}>{nakladnaya.vozvrat.s.b}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>ПМ: <b style={{color: 'black'}}>{nakladnaya.vozvrat.s.pm}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>ПВ: <b style={{color: 'black'}}>{nakladnaya.vozvrat.s.pv}</b>&nbsp;&nbsp;</div>
                            </Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Сосиска 0.2:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.vozvrat.s.o}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vozvrat.s.s02}
                                    onChange={(event)=>{handleLitr(event, 'vozvrat', 's', 's02')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Сосиска неполная 0.2:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.vozvrat.s.o}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vozvrat.s.s0502}
                                    onChange={(event)=>{handleLitr(event, 'vozvrat', 's', 's0502')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Стаканы 0.2:
                                </div>
                                &nbsp;{nakladnaya.vozvrat.s.sh02}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Сосиска 0.4:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.vozvrat.s.o}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vozvrat.s.s04}
                                    onChange={(event)=>{handleLitr(event, 'vozvrat', 's', 's04')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Сосиска неполная 0.4:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.vozvrat.s.o}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vozvrat.s.s0504}
                                    onChange={(event)=>{handleLitr(event, 'vozvrat', 's', 's0504')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Стаканы 0.4:
                                </div>
                                &nbsp;{nakladnaya.vozvrat.s.sh04}
                            </center>
                        </ExpansionPanelDetails>
                        <br/>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Легенда:
                                </div>
                                &nbsp;{nakladnaya.vozvrat.s.l}
                            </center>
                        </ExpansionPanelDetails>
                        <br/>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Бутылки:
                                </div>
                                &nbsp;{nakladnaya.vozvrat.s.b}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Пакеты для мусора:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.vozvrat.s.o}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vozvrat.s.pm}
                                    onChange={(event)=>{handleLitr(event, 'vozvrat', 's', 'pm')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Пакеты для выноса:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.vozvrat.s.o}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vozvrat.s.pv}
                                    onChange={(event)=>{handleLitr(event, 'vozvrat', 's', 'pv')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={nakladnaya.vozvrat.s.o}
                                            color='primary'
                                            disabled={status.role==='admin'?false:checkDate||nakladnaya.vozvrat.s.p||status.role!=='завсклада'}
                                            onChange={(event)=>{handlePodpis(event, 'vozvrat', 's', 'o')}}
                                        />
                                    }
                                    label='Отпустил'
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={nakladnaya.vozvrat.s.p}
                                            color='primary'
                                            disabled={status.role==='admin'?false:checkDate||nakladnaya.vozvrat.s.p||disabled||!nakladnaya.vozvrat.s.o||status.role!=='организатор'}
                                            onChange={(event)=>{handlePodpis(event, 'vozvrat', 's', 'p')}}
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
                            <Typography className={classes.heading}>Итого возврат</Typography>
                            <Typography className={classes.secondaryHeading}>
                                <div style={{display: 'inline-block'}}>Ш02: <b style={{color: 'black'}}>{nakladnaya.vozvrat.iv.sh02}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Ш04: <b style={{color: 'black'}}>{nakladnaya.vozvrat.iv.sh04}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Л: <b style={{color: 'black'}}>{nakladnaya.vozvrat.iv.l}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Б: <b style={{color: 'black'}}>{nakladnaya.vozvrat.iv.b}</b>&nbsp;&nbsp;</div>
                            </Typography>
                        </ExpansionPanelSummary>
                       <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Стаканы 0.2:
                                </div>
                                &nbsp;{nakladnaya.vozvrat.iv.sh02}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Стаканы 0.4:
                                </div>
                                &nbsp;{nakladnaya.vozvrat.iv.sh04}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Легенда:
                                </div>
                                &nbsp;{nakladnaya.vozvrat.iv.l}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Бутылки:
                                </div>
                                &nbsp;{nakladnaya.vozvrat.iv.b}
                            </center>
                        </ExpansionPanelDetails>

                        <br/>
                    </ExpansionPanel>

                    <br/>
                </ExpansionPanel>

                <br/>
                <div>
                    <Link className='link' to={''}>
                        <Button variant='contained' color='primary' onClick={()=>{
                            if(guidRegion!=='lol'){
                                if(selected===-1)
                                    addData({search: '', sort: '', page: 0, name: 'Накладная склад №2', data: {
                                        dataTable: JSON.stringify(nakladnaya),
                                        data: date,
                                        organizator: organizator,
                                        region: region,
                                        guidOrganizator: guidOrganizator,
                                        guidRegion: guidRegion,
                                        disabled: disabled
                                    }});
                                else
                                    setData({id: id, search: '', sort: '', page: 0, name: status.role === 'admin'?name:'Накладная склад №2', data: {
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
