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
import { month, getYesterday, checkInt } from '../redux/constants/other'
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
                /*if (!(status.status==='active'&&['admin', 'организатор', 'завсклада'].includes(status.role))) {
                    props.history.push('/')
                }*/
                if(selected===-1) {
                    let _data = await tableActions.getDataSimple({name: 'ОрганизаторПоID'})
                    if(_data!==undefined){
                        let date = new Date()
                        date = JSON.stringify(date).split('-')
                        date = date[2].split('T')[0]+' '+month[parseInt(date[1])-1]+' '+date[0].replace('"', '')
                        let _data1 = await tableActions.getDataSimple({name: 'Накладная склад №1 по данным', data:
                            {data: date, organizator: _data.guid, region: _data.guidRegion}})
                        if(_data1!==undefined&&_data1!==''){
                            setDate(_data1.data)
                            setOrganizator(_data1.organizator)
                            setRegion(_data1.region)
                            setNakladnaya(JSON.parse(_data1.dataTable))
                            setGuidOrganizator(_data1.guidOrganizator)
                            setGuidRegion(_data1.guidRegion)
                            setId(_data1._id)
                        }
                        else {
                            setRegion(_data.region)
                            setOrganizator(_data.name)
                            setGuidOrganizator(_data.guid)
                            setGuidRegion(_data.guidRegion)
                            let date = new Date()
                            date = JSON.stringify(date).split('-')
                            date = date[2].split('T')[0]+' '+month[parseInt(date[1])-1]+' '+date[0].replace('"', '')
                            setDate(date)
                            nakladnaya = {...nakladnaya}
                            let _data1 = await tableActions.getDataSimple({
                                name: 'Все отчеты реализаторов по дате',
                                data: {data: date, organizator: _data.guid, region: _data.guidRegion}
                            })
                            if (_data1 != undefined) {

                                nakladnaya['vydano']['r']['ml'] = 0
                                nakladnaya['vydano']['r']['chl'] = 0
                                nakladnaya['vydano']['r']['kl'] = 0

                                nakladnaya['vydano']['d1']['ml'] = 0
                                nakladnaya['vydano']['d1']['chl'] = 0
                                nakladnaya['vydano']['d1']['kl'] = 0

                                nakladnaya['vydano']['d2']['ml'] = 0
                                nakladnaya['vydano']['d2']['chl'] = 0
                                nakladnaya['vydano']['d2']['kl'] = 0

                                nakladnaya['vydano']['d3']['ml'] = 0
                                nakladnaya['vydano']['d3']['chl'] = 0
                                nakladnaya['vydano']['d3']['kl'] = 0

                                nakladnaya['vozvrat']['n']['ch25'] = 0
                                nakladnaya['vozvrat']['n']['ch10'] = 0
                                nakladnaya['vozvrat']['n']['chl'] = 0

                                nakladnaya['vozvrat']['s']['ml'] = 0
                                nakladnaya['vozvrat']['s']['chl'] = 0
                                nakladnaya['vozvrat']['s']['kl'] = 0
                                nakladnaya['vozvrat']['s']['m25'] = 0
                                nakladnaya['vozvrat']['s']['ch25'] = 0
                                nakladnaya['vozvrat']['s']['ch10'] = 0
                                nakladnaya['vozvrat']['s']['k10'] = 0

                                for(let i = 0; i<_data1.length; i++){
                                    let addDataTable = JSON.parse(_data1[i].dataTable)
                                    if(checkInt(addDataTable.vozvrat.v.chl)>0){
                                        nakladnaya['vozvrat']['s']['chl'] += checkInt(addDataTable.vozvrat.v.chl)
                                        nakladnaya['vozvrat']['n']['chl'] += checkInt(addDataTable.vozvrat.v.chl)
                                        if(addDataTable.vozvrat.v.chn25.length>0){
                                            nakladnaya['vozvrat']['n']['ch25'] += 1
                                            nakladnaya['vozvrat']['s']['ch25'] += 1
                                        }
                                        if(addDataTable.vozvrat.v.chn10.length>0){
                                            nakladnaya['vozvrat']['n']['ch10'] += 1
                                            nakladnaya['vozvrat']['s']['ch10'] += 1
                                        }
                                    }
                                    if(checkInt(addDataTable.vozvrat.v.chl1)>0){
                                        nakladnaya['vozvrat']['s']['chl'] += checkInt(addDataTable.vozvrat.v.chl1)
                                        nakladnaya['vozvrat']['n']['chl'] += checkInt(addDataTable.vozvrat.v.chl1)
                                        if(addDataTable.vozvrat.v.chn251.length>0){
                                            nakladnaya['vozvrat']['n']['ch25'] += 1
                                            nakladnaya['vozvrat']['s']['ch25'] += 1
                                        }
                                        if(addDataTable.vozvrat.v.chn101.length>0){
                                            nakladnaya['vozvrat']['n']['ch10'] += 1
                                            nakladnaya['vozvrat']['s']['ch10'] += 1
                                        }
                                    }
                                    if(checkInt(addDataTable.vozvrat.v.ml)>0) {
                                        nakladnaya['vozvrat']['s']['ml'] += checkInt(addDataTable.vozvrat.v.ml)
                                        if(addDataTable.vozvrat.v.mn.length>0){
                                            nakladnaya['vozvrat']['s']['m25'] += 1
                                        }
                                    }
                                    if(checkInt(addDataTable.vozvrat.v.ml1)>0) {
                                        nakladnaya['vozvrat']['s']['ml'] += checkInt(addDataTable.vozvrat.v.ml1)
                                        if(addDataTable.vozvrat.v.mn1.length>0){
                                            nakladnaya['vozvrat']['s']['m25'] += 1
                                        }
                                    }
                                    if(checkInt(addDataTable.vozvrat.v.kl)>0) {
                                        nakladnaya['vozvrat']['s']['kl'] += checkInt(addDataTable.vozvrat.v.kl)
                                        if(addDataTable.vozvrat.v.kn.length>0){
                                            nakladnaya['vozvrat']['s']['k10'] += 1
                                        }
                                    }
                                    if(checkInt(addDataTable.vozvrat.v.kl1)>0) {
                                        nakladnaya['vozvrat']['s']['kl'] += checkInt(addDataTable.vozvrat.v.kl1)
                                        if(addDataTable.vozvrat.v.kn1.length>0){
                                            nakladnaya['vozvrat']['s']['k10'] += 1
                                        }
                                    }

                                    if(checkInt(addDataTable.vydano.r.ml)>0) {
                                        nakladnaya['vydano']['r']['ml'] += checkInt(addDataTable.vydano.r.ml)
                                    }
                                    if(checkInt(addDataTable.vydano.r.chl)>0) {
                                        nakladnaya['vydano']['r']['chl'] += checkInt(addDataTable.vydano.r.chl)
                                    }
                                    if(checkInt(addDataTable.vydano.r.kl)>0) {
                                        nakladnaya['vydano']['r']['kl'] += checkInt(addDataTable.vydano.r.kl)
                                    }

                                    if(checkInt(addDataTable.vydano.d1.ml)>0) {
                                        nakladnaya['vydano']['d1']['ml'] += checkInt(addDataTable.vydano.d1.ml)
                                    }
                                    if(checkInt(addDataTable.vydano.d1.chl)>0) {
                                        nakladnaya['vydano']['d1']['chl'] += checkInt(addDataTable.vydano.d1.chl)
                                    }
                                    if(checkInt(addDataTable.vydano.d1.kl)>0) {
                                        nakladnaya['vydano']['d1']['kl'] += checkInt(addDataTable.vydano.d1.kl)
                                    }

                                    if(checkInt(addDataTable.vydano.d2.ml)>0) {
                                        nakladnaya['vydano']['d2']['ml'] += checkInt(addDataTable.vydano.d2.ml)
                                    }
                                    if(checkInt(addDataTable.vydano.d2.chl)>0) {
                                        nakladnaya['vydano']['d2']['chl'] += checkInt(addDataTable.vydano.d2.chl)
                                    }
                                    if(checkInt(addDataTable.vydano.d2.kl)>0) {
                                        nakladnaya['vydano']['d2']['kl'] += checkInt(addDataTable.vydano.d2.kl)
                                    }

                                    if(checkInt(addDataTable.vydano.d3.ml)>0) {
                                        nakladnaya['vydano']['d3']['ml'] += checkInt(addDataTable.vydano.d3.ml)
                                    }
                                    if(checkInt(addDataTable.vydano.d3.chl)>0) {
                                        nakladnaya['vydano']['d3']['chl'] += checkInt(addDataTable.vydano.d3.chl)
                                    }
                                    if(checkInt(addDataTable.vydano.d3.kl)>0) {
                                        nakladnaya['vydano']['d3']['kl'] += checkInt(addDataTable.vydano.d3.kl)
                                    }
                                }
                                nakladnaya['vydano']['i']['ml'] = checkInt(nakladnaya['vydano']['n']['ml']) + checkInt(nakladnaya['vydano']['r']['ml']) + checkInt(nakladnaya['vydano']['d1']['ml']) + checkInt(nakladnaya['vydano']['d2']['ml']) + checkInt(nakladnaya['vydano']['d3']['ml'])
                                nakladnaya['vydano']['i']['kl'] = checkInt(nakladnaya['vydano']['n']['kl']) + checkInt(nakladnaya['vydano']['r']['kl']) + checkInt(nakladnaya['vydano']['d1']['kl']) + checkInt(nakladnaya['vydano']['d2']['kl']) + checkInt(nakladnaya['vydano']['d3']['kl'])
                                nakladnaya['vydano']['i']['chl'] = checkInt(nakladnaya['vydano']['n']['chl']) + checkInt(nakladnaya['vydano']['r']['chl']) + checkInt(nakladnaya['vydano']['d1']['chl']) + checkInt(nakladnaya['vydano']['d2']['chl']) + checkInt(nakladnaya['vydano']['d3']['chl'])
                                nakladnaya['vozvrat']['i']['ml'] = checkInt(nakladnaya['vozvrat']['s']['ml']) + checkInt(nakladnaya['vozvrat']['n']['ml']) + checkInt(nakladnaya['vozvrat']['r']['ml']) + checkInt(nakladnaya['vozvrat']['d1']['ml']) + checkInt(nakladnaya['vozvrat']['d2']['ml']) + checkInt(nakladnaya['vozvrat']['d3']['ml'])
                                nakladnaya['vozvrat']['i']['kl'] = checkInt(nakladnaya['vozvrat']['s']['kl']) + checkInt(nakladnaya['vozvrat']['n']['kl']) + checkInt(nakladnaya['vozvrat']['r']['kl']) + checkInt(nakladnaya['vozvrat']['d1']['kl']) + checkInt(nakladnaya['vozvrat']['d2']['kl']) + checkInt(nakladnaya['vozvrat']['d3']['kl'])
                                nakladnaya['vozvrat']['i']['chl'] = checkInt(nakladnaya['vozvrat']['r']['chl']) + checkInt(nakladnaya['vozvrat']['d1']['chl']) + checkInt(nakladnaya['vozvrat']['d2']['chl']) + checkInt(nakladnaya['vozvrat']['d3']['chl']) + checkInt(nakladnaya['vozvrat']['s']['chl'])
                                nakladnaya['vozvrat']['i']['ch10'] = checkInt(nakladnaya['vozvrat']['r']['ch10']) + checkInt(nakladnaya['vozvrat']['d1']['ch10']) + checkInt(nakladnaya['vozvrat']['d2']['ch10']) + checkInt(nakladnaya['vozvrat']['d3']['ch10']) + checkInt(nakladnaya['vozvrat']['s']['ch10'])
                                nakladnaya['vozvrat']['i']['ch25'] = checkInt(nakladnaya['vozvrat']['r']['ch25']) + checkInt(nakladnaya['vozvrat']['d1']['ch25']) + checkInt(nakladnaya['vozvrat']['d2']['ch25']) + checkInt(nakladnaya['vozvrat']['d3']['ch25']) + checkInt(nakladnaya['vozvrat']['s']['ch25'])


                            }

                            date = getYesterday(date)
                            _data1 = await tableActions.getDataSimple({
                                name: 'Все отчеты реализаторов по дате',
                                data: {data: date, organizator: _data.guid, region: _data.guidRegion}
                            })
                            if (_data1 != undefined) {
                                nakladnaya['vydano']['n']['ch25'] = 0
                                nakladnaya['vydano']['n']['ch10'] = 0
                                nakladnaya['vydano']['n']['chl'] = 0

                                for(let i = 0; i<_data1.length; i++){
                                    let addDataTable = JSON.parse(_data1[i].dataTable)
                                    if(checkInt(addDataTable.vozvrat.v.chl)>0){
                                        nakladnaya['vydano']['n']['chl'] += checkInt(addDataTable.vozvrat.v.chl)
                                        if(addDataTable.vozvrat.v.chn25.length>0){
                                            nakladnaya['vydano']['n']['ch25'] += 1

                                        }
                                        if(addDataTable.vozvrat.v.chn10.length>0){
                                            nakladnaya['vydano']['n']['ch10'] += 1

                                        }
                                    }
                                    if(checkInt(addDataTable.vozvrat.v.chl1)>0){
                                        nakladnaya['vydano']['n']['chl'] += checkInt(addDataTable.vozvrat.v.chl1)
                                        if(addDataTable.vozvrat.v.chn251.length>0){
                                            nakladnaya['vydano']['n']['ch25'] += 1

                                        }
                                        if(addDataTable.vozvrat.v.chn101.length>0){
                                            nakladnaya['vydano']['n']['ch10'] += 1

                                        }
                                    }
                                }
                                nakladnaya['vydano']['i']['chl'] = checkInt(nakladnaya['vydano']['n']['chl']) + checkInt(nakladnaya['vydano']['r']['chl']) + checkInt(nakladnaya['vydano']['d1']['chl']) + checkInt(nakladnaya['vydano']['d2']['chl']) + checkInt(nakladnaya['vydano']['d3']['chl'])
                                nakladnaya['vydano']['i']['ch10'] = checkInt(nakladnaya['vydano']['n']['ch10']) + checkInt(nakladnaya['vydano']['r']['ch10']) + checkInt(nakladnaya['vydano']['d1']['ch10']) + checkInt(nakladnaya['vydano']['d2']['ch10']) + checkInt(nakladnaya['vydano']['d3']['ch10'])
                                nakladnaya['vydano']['i']['ch25'] = checkInt(nakladnaya['vydano']['n']['ch25']) + checkInt(nakladnaya['vydano']['r']['ch25']) + checkInt(nakladnaya['vydano']['d1']['ch25']) + checkInt(nakladnaya['vydano']['d2']['ch25']) + checkInt(nakladnaya['vydano']['d3']['ch25'])

                            }
                            setNakladnaya(nakladnaya)
                        }
                    }
                }
                else {
                    let _data = await tableActions.getDataSimple({name: 'Накладная склад №1 по данным',
                        data: {data: data[selected][1], organizator: data[selected][2], region: data[selected][3]}})
                    if(_data!==undefined){
                        setDate(_data.data)
                        setOrganizator(_data.organizator)
                        setRegion(_data.region)
                        setGuidOrganizator(_data.guidOrganizator)
                        setGuidRegion(_data.guidRegion)
                        setNakladnaya(JSON.parse(_data.dataTable))
                        setId(_data._id)
                        let date1 = new Date()
                        date1 = JSON.stringify(date1).split('-')
                        date1 = date1[2].split('T')[0]+' '+month[parseInt(date1[1])-1]+' '+date1[0].replace('"', '')
                        setCheckDate(date1!==_data.data)
                    }
                }
            }
            fetchData();
        },[])
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
            setDate1(date)
            date = JSON.stringify(date).split('-')
            date = date[2].split('T')[0]+' '+month[parseInt(date[1])-1]+' '+date[0].replace('"', '')
            setDate(date)
            nakladnaya = {
                'vydano': {
                    'n':
                        {'m25':'', 'ml':'', 'ch25':'', 'ch10':'', 'chl':'', 'k25':'', 'k10':'', 'kl':'', 'o': false, 'p': false},
                    'r':
                        {'m25':'', 'ml':'', 'ch25':'', 'ch10':'', 'chl':'', 'k25':'', 'k10':'', 'kl':'', 'o': false, 'p': false},
                    'd1':
                        {'m25':'', 'ml':'', 'ch25':'', 'ch10':'', 'chl':'', 'k25':'', 'k10':'', 'kl':'', 'o': false, 'p': false},
                    'd2':
                        {'m25':'', 'ml':'', 'ch25':'', 'ch10':'', 'chl':'', 'k25':'', 'k10':'', 'kl':'', 'o': false, 'p': false},
                    'd3':
                        {'m25':'', 'ml':'', 'ch25':'', 'ch10':'', 'chl':'', 'k25':'', 'k10':'', 'kl':'', 'o': false, 'p': false},
                    'i':
                        {'m25':'', 'ml':'', 'ch25':'', 'ch10':'', 'chl':'', 'k25':'', 'k10':'', 'kl':'', 'o': false, 'p': false},
                },
                'vozvrat': {
                    'n':
                        {'m25':'', 'ml':'', 'ch25':'', 'ch10':'', 'chl':'', 'k25':'', 'k10':'', 'kl':'', 'o': false, 'p': false},
                    'r':
                        {'m25':'', 'ml':'', 'ch25':'', 'ch10':'', 'chl':'', 'k25':'', 'k10':'', 'kl':'', 'o': false, 'p': false},
                    'd1':
                        {'m25':'', 'ml':'', 'ch25':'', 'ch10':'', 'chl':'', 'k25':'', 'k10':'', 'kl':'', 'o': false, 'p': false},
                    'd2':
                        {'m25':'', 'ml':'', 'ch25':'', 'ch10':'', 'chl':'', 'k25':'', 'k10':'', 'kl':'', 'o': false, 'p': false},
                    'd3':
                        {'m25':'', 'ml':'', 'ch25':'', 'ch10':'', 'chl':'', 'k25':'', 'k10':'', 'kl':'', 'o': false, 'p': false},
                    's':
                        {'m25':'', 'ml':'', 'ch25':'', 'ch10':'', 'chl':'', 'k25':'', 'k10':'', 'kl':'', 'o': false, 'p': false},
                    'i':
                        {'m25':'', 'ml':'', 'ch25':'', 'ch10':'', 'chl':'', 'k25':'', 'k10':'', 'kl':'', 'o': false, 'p': false},
                },
            };
                setId('')

            let _data1 = await tableActions.getDataSimple({
                name: 'Все отчеты реализаторов по дате',
                data: {data: date, organizator: guidOrganizator, region: guidRegion}
            })
            if (_data1 != undefined) {

                nakladnaya['vydano']['r']['ml'] = 0
                nakladnaya['vydano']['r']['chl'] = 0
                nakladnaya['vydano']['r']['kl'] = 0

                nakladnaya['vydano']['d1']['ml'] = 0
                nakladnaya['vydano']['d1']['chl'] = 0
                nakladnaya['vydano']['d1']['kl'] = 0

                nakladnaya['vydano']['d2']['ml'] = 0
                nakladnaya['vydano']['d2']['chl'] = 0
                nakladnaya['vydano']['d2']['kl'] = 0

                nakladnaya['vydano']['d3']['ml'] = 0
                nakladnaya['vydano']['d3']['chl'] = 0
                nakladnaya['vydano']['d3']['kl'] = 0

                nakladnaya['vozvrat']['n']['ch25'] = 0
                nakladnaya['vozvrat']['n']['ch10'] = 0
                nakladnaya['vozvrat']['n']['chl'] = 0

                nakladnaya['vozvrat']['s']['ml'] = 0
                nakladnaya['vozvrat']['s']['chl'] = 0
                nakladnaya['vozvrat']['s']['kl'] = 0
                nakladnaya['vozvrat']['s']['m25'] = 0
                nakladnaya['vozvrat']['s']['ch25'] = 0
                nakladnaya['vozvrat']['s']['ch10'] = 0
                nakladnaya['vozvrat']['s']['k10'] = 0

                for(let i = 0; i<_data1.length; i++){
                    let addDataTable = JSON.parse(_data1[i].dataTable)
                    if(checkInt(addDataTable.vozvrat.v.chl)>0){
                        nakladnaya['vozvrat']['s']['chl'] += checkInt(addDataTable.vozvrat.v.chl)
                        nakladnaya['vozvrat']['n']['chl'] += checkInt(addDataTable.vozvrat.v.chl)
                        if(addDataTable.vozvrat.v.chn25.length>0){
                            nakladnaya['vozvrat']['n']['ch25'] += 1
                            nakladnaya['vozvrat']['s']['ch25'] += 1
                        }
                        if(addDataTable.vozvrat.v.chn10.length>0){
                            nakladnaya['vozvrat']['n']['ch10'] += 1
                            nakladnaya['vozvrat']['s']['ch10'] += 1
                        }
                    }
                    if(checkInt(addDataTable.vozvrat.v.chl1)>0){
                        nakladnaya['vozvrat']['s']['chl'] += checkInt(addDataTable.vozvrat.v.chl1)
                        nakladnaya['vozvrat']['n']['chl'] += checkInt(addDataTable.vozvrat.v.chl1)
                        if(addDataTable.vozvrat.v.chn251.length>0){
                            nakladnaya['vozvrat']['n']['ch25'] += 1
                            nakladnaya['vozvrat']['s']['ch25'] += 1
                        }
                        if(addDataTable.vozvrat.v.chn101.length>0){
                            nakladnaya['vozvrat']['n']['ch10'] += 1
                            nakladnaya['vozvrat']['s']['ch10'] += 1
                        }
                    }
                    if(checkInt(addDataTable.vozvrat.v.ml)>0) {
                        nakladnaya['vozvrat']['s']['ml'] += checkInt(addDataTable.vozvrat.v.ml)
                        if(addDataTable.vozvrat.v.mn.length>0){
                            nakladnaya['vozvrat']['s']['m25'] += 1
                        }
                    }
                    if(checkInt(addDataTable.vozvrat.v.ml1)>0) {
                        nakladnaya['vozvrat']['s']['ml'] += checkInt(addDataTable.vozvrat.v.ml1)
                        if(addDataTable.vozvrat.v.mn1.length>0){
                            nakladnaya['vozvrat']['s']['m25'] += 1
                        }
                    }
                    if(checkInt(addDataTable.vozvrat.v.kl)>0) {
                        nakladnaya['vozvrat']['s']['kl'] += checkInt(addDataTable.vozvrat.v.kl)
                        if(addDataTable.vozvrat.v.kn.length>0){
                            nakladnaya['vozvrat']['s']['k10'] += 1
                        }
                    }
                    if(checkInt(addDataTable.vozvrat.v.kl1)>0) {
                        nakladnaya['vozvrat']['s']['kl'] += checkInt(addDataTable.vozvrat.v.kl1)
                        if(addDataTable.vozvrat.v.kn1.length>0){
                            nakladnaya['vozvrat']['s']['k10'] += 1
                        }
                    }

                    if(checkInt(addDataTable.vydano.r.ml)>0) {
                        nakladnaya['vydano']['r']['ml'] += checkInt(addDataTable.vydano.r.ml)
                    }
                    if(checkInt(addDataTable.vydano.r.chl)>0) {
                        nakladnaya['vydano']['r']['chl'] += checkInt(addDataTable.vydano.r.chl)
                    }
                    if(checkInt(addDataTable.vydano.r.kl)>0) {
                        nakladnaya['vydano']['r']['kl'] += checkInt(addDataTable.vydano.r.kl)
                    }

                    if(checkInt(addDataTable.vydano.d1.ml)>0) {
                        nakladnaya['vydano']['d1']['ml'] += checkInt(addDataTable.vydano.d1.ml)
                    }
                    if(checkInt(addDataTable.vydano.d1.chl)>0) {
                        nakladnaya['vydano']['d1']['chl'] += checkInt(addDataTable.vydano.d1.chl)
                    }
                    if(checkInt(addDataTable.vydano.d1.kl)>0) {
                        nakladnaya['vydano']['d1']['kl'] += checkInt(addDataTable.vydano.d1.kl)
                    }

                    if(checkInt(addDataTable.vydano.d2.ml)>0) {
                        nakladnaya['vydano']['d2']['ml'] += checkInt(addDataTable.vydano.d2.ml)
                    }
                    if(checkInt(addDataTable.vydano.d2.chl)>0) {
                        nakladnaya['vydano']['d2']['chl'] += checkInt(addDataTable.vydano.d2.chl)
                    }
                    if(checkInt(addDataTable.vydano.d2.kl)>0) {
                        nakladnaya['vydano']['d2']['kl'] += checkInt(addDataTable.vydano.d2.kl)
                    }

                    if(checkInt(addDataTable.vydano.d3.ml)>0) {
                        nakladnaya['vydano']['d3']['ml'] += checkInt(addDataTable.vydano.d3.ml)
                    }
                    if(checkInt(addDataTable.vydano.d3.chl)>0) {
                        nakladnaya['vydano']['d3']['chl'] += checkInt(addDataTable.vydano.d3.chl)
                    }
                    if(checkInt(addDataTable.vydano.d3.kl)>0) {
                        nakladnaya['vydano']['d3']['kl'] += checkInt(addDataTable.vydano.d3.kl)
                    }
                }
                nakladnaya['vydano']['i']['ml'] = checkInt(nakladnaya['vydano']['n']['ml']) + checkInt(nakladnaya['vydano']['r']['ml']) + checkInt(nakladnaya['vydano']['d1']['ml']) + checkInt(nakladnaya['vydano']['d2']['ml']) + checkInt(nakladnaya['vydano']['d3']['ml'])
                nakladnaya['vydano']['i']['kl'] = checkInt(nakladnaya['vydano']['n']['kl']) + checkInt(nakladnaya['vydano']['r']['kl']) + checkInt(nakladnaya['vydano']['d1']['kl']) + checkInt(nakladnaya['vydano']['d2']['kl']) + checkInt(nakladnaya['vydano']['d3']['kl'])
                nakladnaya['vydano']['i']['chl'] = checkInt(nakladnaya['vydano']['n']['chl']) + checkInt(nakladnaya['vydano']['r']['chl']) + checkInt(nakladnaya['vydano']['d1']['chl']) + checkInt(nakladnaya['vydano']['d2']['chl']) + checkInt(nakladnaya['vydano']['d3']['chl'])
                nakladnaya['vozvrat']['i']['ml'] = checkInt(nakladnaya['vozvrat']['s']['ml']) + checkInt(nakladnaya['vozvrat']['r']['ml']) + checkInt(nakladnaya['vozvrat']['d1']['ml']) + checkInt(nakladnaya['vozvrat']['d2']['ml']) + checkInt(nakladnaya['vozvrat']['d3']['ml'])
                nakladnaya['vozvrat']['i']['kl'] = checkInt(nakladnaya['vozvrat']['s']['kl']) + checkInt(nakladnaya['vozvrat']['r']['kl']) + checkInt(nakladnaya['vozvrat']['d1']['kl']) + checkInt(nakladnaya['vozvrat']['d2']['kl']) + checkInt(nakladnaya['vozvrat']['d3']['kl'])
                nakladnaya['vozvrat']['i']['chl'] = checkInt(nakladnaya['vozvrat']['r']['chl']) + checkInt(nakladnaya['vozvrat']['d1']['chl']) + checkInt(nakladnaya['vozvrat']['d2']['chl']) + checkInt(nakladnaya['vozvrat']['d3']['chl']) + checkInt(nakladnaya['vozvrat']['s']['chl'])
                nakladnaya['vozvrat']['i']['ch10'] = checkInt(nakladnaya['vozvrat']['r']['ch10']) + checkInt(nakladnaya['vozvrat']['d1']['ch10']) + checkInt(nakladnaya['vozvrat']['d2']['ch10']) + checkInt(nakladnaya['vozvrat']['d3']['ch10']) + checkInt(nakladnaya['vozvrat']['s']['ch10'])
                nakladnaya['vozvrat']['i']['ch25'] = checkInt(nakladnaya['vozvrat']['r']['ch25']) + checkInt(nakladnaya['vozvrat']['d1']['ch25']) + checkInt(nakladnaya['vozvrat']['d2']['ch25']) + checkInt(nakladnaya['vozvrat']['d3']['ch25']) + checkInt(nakladnaya['vozvrat']['s']['ch25'])

            }

            date = getYesterday(date)
            _data1 = await tableActions.getDataSimple({
                name: 'Все отчеты реализаторов по дате',
                data: {data: date, organizator: guidOrganizator, region: guidRegion}
            })
            if (_data1 != undefined) {
                nakladnaya['vydano']['n']['ch25'] = 0
                nakladnaya['vydano']['n']['ch10'] = 0
                nakladnaya['vydano']['n']['chl'] = 0

                for(let i = 0; i<_data1.length; i++){
                    let addDataTable = JSON.parse(_data1[i].dataTable)
                    if(checkInt(addDataTable.vozvrat.v.chl)>0){
                        nakladnaya['vydano']['n']['chl'] += checkInt(addDataTable.vozvrat.v.chl)
                        if(addDataTable.vozvrat.v.chn25.length>0){
                            nakladnaya['vydano']['n']['ch25'] += 1

                        }
                        if(addDataTable.vozvrat.v.chn10.length>0){
                            nakladnaya['vydano']['n']['ch10'] += 1

                        }
                    }

                    if(checkInt(addDataTable.vozvrat.v.chl1)>0){
                        nakladnaya['vydano']['n']['chl'] += checkInt(addDataTable.vozvrat.v.chl1)
                        if(addDataTable.vozvrat.v.chn251.length>0){
                            nakladnaya['vydano']['n']['ch25'] += 1

                        }
                        if(addDataTable.vozvrat.v.chn101.length>0){
                            nakladnaya['vydano']['n']['ch10'] += 1

                        }
                    }
                }
                nakladnaya['vydano']['i']['chl'] = checkInt(nakladnaya['vydano']['n']['chl']) + checkInt(nakladnaya['vydano']['r']['chl']) + checkInt(nakladnaya['vydano']['d1']['chl']) + checkInt(nakladnaya['vydano']['d2']['chl']) + checkInt(nakladnaya['vydano']['d3']['chl'])
                nakladnaya['vydano']['i']['ch10'] = checkInt(nakladnaya['vydano']['n']['ch10']) + checkInt(nakladnaya['vydano']['r']['ch10']) + checkInt(nakladnaya['vydano']['d1']['ch10']) + checkInt(nakladnaya['vydano']['d2']['ch10']) + checkInt(nakladnaya['vydano']['d3']['ch10'])
                nakladnaya['vydano']['i']['ch25'] = checkInt(nakladnaya['vydano']['n']['ch25']) + checkInt(nakladnaya['vydano']['r']['ch25']) + checkInt(nakladnaya['vydano']['d1']['ch25']) + checkInt(nakladnaya['vydano']['d2']['ch25']) + checkInt(nakladnaya['vydano']['d3']['ch25'])

            }
            setNakladnaya(nakladnaya)

        };
        let [disabled, setDisabled] = useState(false);
        let [id, setId] = useState('');
        let [checkDate, setCheckDate] = useState(false);
        let [nakladnaya, setNakladnaya] = useState({
            'vydano': {
                'n':
                    {'m25':'', 'ml':'', 'ch25':'', 'ch10':'', 'chl':'', 'k25':'', 'k10':'', 'kl':'', 'o': false, 'p': false},
                'r':
                    {'m25':'', 'ml':'', 'ch25':'', 'ch10':'', 'chl':'', 'k25':'', 'k10':'', 'kl':'', 'o': false, 'p': false},
                'd1':
                    {'m25':'', 'ml':'', 'ch25':'', 'ch10':'', 'chl':'', 'k25':'', 'k10':'', 'kl':'', 'o': false, 'p': false},
                'd2':
                    {'m25':'', 'ml':'', 'ch25':'', 'ch10':'', 'chl':'', 'k25':'', 'k10':'', 'kl':'', 'o': false, 'p': false},
                'd3':
                    {'m25':'', 'ml':'', 'ch25':'', 'ch10':'', 'chl':'', 'k25':'', 'k10':'', 'kl':'', 'o': false, 'p': false},
                'i':
                    {'m25':'', 'ml':'', 'ch25':'', 'ch10':'', 'chl':'', 'k25':'', 'k10':'', 'kl':'', 'o': false, 'p': false},
            },
            'vozvrat': {
                'n':
                    {'m25':'', 'ml':'', 'ch25':'', 'ch10':'', 'chl':'', 'k25':'', 'k10':'', 'kl':'', 'o': false, 'p': false},
                'r':
                    {'m25':'', 'ml':'', 'ch25':'', 'ch10':'', 'chl':'', 'k25':'', 'k10':'', 'kl':'', 'o': false, 'p': false},
                'd1':
                    {'m25':'', 'ml':'', 'ch25':'', 'ch10':'', 'chl':'', 'k25':'', 'k10':'', 'kl':'', 'o': false, 'p': false},
                'd2':
                    {'m25':'', 'ml':'', 'ch25':'', 'ch10':'', 'chl':'', 'k25':'', 'k10':'', 'kl':'', 'o': false, 'p': false},
                'd3':
                    {'m25':'', 'ml':'', 'ch25':'', 'ch10':'', 'chl':'', 'k25':'', 'k10':'', 'kl':'', 'o': false, 'p': false},
                's':
                    {'m25':'', 'ml':'', 'ch25':'', 'ch10':'', 'chl':'', 'k25':'', 'k10':'', 'kl':'', 'o': false, 'p': false},
                'i':
                    {'m25':'', 'ml':'', 'ch25':'', 'ch10':'', 'chl':'', 'k25':'', 'k10':'', 'kl':'', 'o': false, 'p': false},
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
                if(type !== 's'&&where==='vozvrat'){
                    nakladnaya[where][type]['ml'] = checkInt(nakladnaya[where][type]['m25']) * 24
                    nakladnaya[where][type]['chl'] = checkInt(nakladnaya[where][type]['ch25']) * 24 + checkInt(nakladnaya[where][type]['ch10']) * 10
                    nakladnaya[where][type]['kl'] = checkInt(nakladnaya[where][type]['k25']) * 24 + checkInt(nakladnaya[where][type]['k10']) * 10
                }/* else if(type !== 'n'&&type !== 'r'&&type !== 'd1'&&where==='vydano'){
                    nakladnaya[where][type]['ml'] = checkInt(nakladnaya[where][type]['m25']) * 24
                    nakladnaya[where][type]['chl'] = checkInt(nakladnaya[where][type]['ch25']) * 24 + checkInt(nakladnaya[where][type]['ch10']) * 10
                    nakladnaya[where][type]['kl'] = checkInt(nakladnaya[where][type]['k25']) * 24 + checkInt(nakladnaya[where][type]['k10']) * 10
                }*/
                
                let s = nakladnaya[where]['s']!==undefined?checkInt(nakladnaya[where]['s'][what]):0
                nakladnaya[where]['i'][what] = checkInt(nakladnaya[where]['n'][what]) + checkInt(nakladnaya[where]['r'][what]) + checkInt(nakladnaya[where]['d1'][what]) + checkInt(nakladnaya[where]['d2'][what]) + checkInt(nakladnaya[where]['d3'][what]) + s
                
                s = nakladnaya[where]['s']!==undefined?checkInt(nakladnaya[where]['s']['ml']):0
                nakladnaya[where]['i']['ml'] = checkInt(nakladnaya[where]['n']['ml']) + checkInt(nakladnaya[where]['r']['ml']) + checkInt(nakladnaya[where]['d1']['ml']) + checkInt(nakladnaya[where]['d2']['ml']) + checkInt(nakladnaya[where]['d3']['ml']) + s
                
                s = nakladnaya[where]['s']!==undefined?checkInt(nakladnaya[where]['s']['chl']):0
                nakladnaya[where]['i']['chl'] = checkInt(nakladnaya[where]['n']['chl']) + checkInt(nakladnaya[where]['r']['chl']) + checkInt(nakladnaya[where]['d1']['chl']) + checkInt(nakladnaya[where]['d2']['chl']) + checkInt(nakladnaya[where]['d3']['chl']) + s
                
                s = nakladnaya[where]['s']!==undefined?checkInt(nakladnaya[where]['s']['kl']):0
                nakladnaya[where]['i']['kl'] = checkInt(nakladnaya[where]['n']['kl']) + checkInt(nakladnaya[where]['r']['kl']) + checkInt(nakladnaya[where]['d1']['kl']) + checkInt(nakladnaya[where]['d2']['kl']) + checkInt(nakladnaya[where]['d3']['kl']) + s
                
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
                <h1>Накладная склад №1</h1>
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
                            <div style={{display: 'inline-block'}}>М25: <b style={{color: 'black'}}>{nakladnaya.vydano.i.m25}</b>&nbsp;&nbsp;</div>
                            <div style={{display: 'inline-block'}}>МЛ: <b style={{color: 'black'}}>{nakladnaya.vydano.i.ml}</b>&nbsp;&nbsp;</div>
                            <div style={{display: 'inline-block'}}>Ч25: <b style={{color: 'black'}}>{nakladnaya.vydano.i.ch25}</b>&nbsp;&nbsp;</div>
                            <div style={{display: 'inline-block'}}>Ч10: <b style={{color: 'black'}}>{nakladnaya.vydano.i.ch10}</b>&nbsp;&nbsp;</div>
                            <div style={{display: 'inline-block'}}>ЧЛ: <b style={{color: 'black'}}>{nakladnaya.vydano.i.chl}</b>&nbsp;&nbsp;</div>
                            <div style={{display: 'inline-block'}}>К10: <b style={{color: 'black'}}>{nakladnaya.vydano.i.k10}</b>&nbsp;&nbsp;</div>
                            <div style={{display: 'inline-block'}}>КЛ: <b style={{color: 'black'}}>{nakladnaya.vydano.i.kl}</b>&nbsp;&nbsp;</div>
                        </Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanel>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography className={classes.heading}>Неполный</Typography>

                            <Typography className={classes.secondaryHeading}>
                                <div style={{display: 'inline-block'}}>Ч25: <b style={{color: 'black'}}>{nakladnaya.vydano.n.ch25}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Ч10: <b style={{color: 'black'}}>{nakladnaya.vydano.n.ch10}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>ЧЛ: <b style={{color: 'black'}}>{nakladnaya.vydano.n.chl}</b>&nbsp;&nbsp;</div>
                            </Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Чалап 25:
                                </div>
                                &nbsp;{nakladnaya.vydano.n.ch25}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Чалап 10:
                                </div>
                                &nbsp;{nakladnaya.vydano.n.ch10}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Чалап литр:
                                </div>
                                &nbsp;{nakladnaya.vydano.n.chl}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={nakladnaya.vydano.n.o}
                                            color='primary'
                                            disabled={status.role==='admin'?false:checkDate||nakladnaya.vydano.n.p||status.role!=='завсклада'}
                                            onChange={(event)=>{handlePodpis(event, 'vydano', 'n', 'o')}}
                                        />
                                    }
                                    label='Отпустил'
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={nakladnaya.vydano.n.p}
                                            color='primary'
                                            disabled={status.role==='admin'?false:checkDate||nakladnaya.vydano.n.p||disabled||!nakladnaya.vydano.n.o||status.role!=='организатор'}
                                            onChange={(event)=>{handlePodpis(event, 'vydano', 'n', 'p')}}
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
                            <Typography className={classes.heading}>Растановка</Typography>
                            <Typography className={classes.secondaryHeading}>
                                <div style={{display: 'inline-block'}}>М25: <b style={{color: 'black'}}>{nakladnaya.vydano.r.m25}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>МЛ: <b style={{color: 'black'}}>{nakladnaya.vydano.r.ml}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Ч25: <b style={{color: 'black'}}>{nakladnaya.vydano.r.ch25}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Ч10: <b style={{color: 'black'}}>{nakladnaya.vydano.r.ch10}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>ЧЛ: <b style={{color: 'black'}}>{nakladnaya.vydano.r.chl}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>К10: <b style={{color: 'black'}}>{nakladnaya.vydano.r.k10}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>КЛ: <b style={{color: 'black'}}>{nakladnaya.vydano.r.kl}</b>&nbsp;&nbsp;</div>
                            </Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Максым 25:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.vydano.r.o}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vydano.r.m25}
                                    onChange={(event)=>{handleLitr(event, 'vydano', 'r', 'm25')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Максым литр:
                                </div>
                                &nbsp;{nakladnaya.vydano.r.ml}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Чалап 25:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.vydano.r.o}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vydano.r.ch25}
                                    onChange={(event)=>{handleLitr(event, 'vydano', 'r', 'ch25')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Чалап 10:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.vydano.r.o}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vydano.r.ch10}
                                    onChange={(event)=>{handleLitr(event, 'vydano', 'r', 'ch10')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Чалап литр:
                                </div>
                                &nbsp;{nakladnaya.vydano.r.chl}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Квас 10:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.vydano.r.o}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vydano.r.k10}
                                    onChange={(event)=>{handleLitr(event, 'vydano', 'r', 'k10')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Квас литр:
                                </div>
                                &nbsp;{nakladnaya.vydano.r.kl}
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
                                <div style={{display: 'inline-block'}}>М25: <b style={{color: 'black'}}>{nakladnaya.vydano.d1.m25}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>МЛ: <b style={{color: 'black'}}>{nakladnaya.vydano.d1.ml}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Ч25: <b style={{color: 'black'}}>{nakladnaya.vydano.d1.ch25}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Ч10: <b style={{color: 'black'}}>{nakladnaya.vydano.d1.ch10}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>ЧЛ: <b style={{color: 'black'}}>{nakladnaya.vydano.d1.chl}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>К10: <b style={{color: 'black'}}>{nakladnaya.vydano.d1.k10}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>КЛ: <b style={{color: 'black'}}>{nakladnaya.vydano.d1.kl}</b>&nbsp;&nbsp;</div>
                            </Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Максым 25:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.vydano.d1.o}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vydano.d1.m25}
                                    onChange={(event)=>{handleLitr(event, 'vydano', 'd1', 'm25')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Максым литр:
                                </div>
                                &nbsp;{nakladnaya.vydano.d1.ml}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Чалап 25:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.vydano.d1.o}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vydano.d1.ch25}
                                    onChange={(event)=>{handleLitr(event, 'vydano', 'd1', 'ch25')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Чалап 10:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.vydano.d1.o}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vydano.d1.ch10}
                                    onChange={(event)=>{handleLitr(event, 'vydano', 'd1', 'ch10')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Чалап литр:
                                </div>
                                &nbsp;{nakladnaya.vydano.d1.chl}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Квас 10:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.vydano.d1.o}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vydano.d1.k10}
                                    onChange={(event)=>{handleLitr(event, 'vydano', 'd1', 'k10')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Квас литр:
                                </div>
                                &nbsp;{nakladnaya.vydano.d1.kl}
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
                                <div style={{display: 'inline-block'}}>М25: <b style={{color: 'black'}}>{nakladnaya.vydano.d2.m25}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>МЛ: <b style={{color: 'black'}}>{nakladnaya.vydano.d2.ml}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Ч25: <b style={{color: 'black'}}>{nakladnaya.vydano.d2.ch25}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Ч10: <b style={{color: 'black'}}>{nakladnaya.vydano.d2.ch10}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>ЧЛ: <b style={{color: 'black'}}>{nakladnaya.vydano.d2.chl}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>К10: <b style={{color: 'black'}}>{nakladnaya.vydano.d2.k10}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>КЛ: <b style={{color: 'black'}}>{nakladnaya.vydano.d2.kl}</b>&nbsp;&nbsp;</div>
                            </Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Максым 25:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.vydano.d2.o}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vydano.d2.m25}
                                    onChange={(event)=>{handleLitr(event, 'vydano', 'd2', 'm25')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Максым литр:
                                </div>
                                &nbsp;{nakladnaya.vydano.d2.ml}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Чалап 25:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.vydano.d2.o}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vydano.d2.ch25}
                                    onChange={(event)=>{handleLitr(event, 'vydano', 'd2', 'ch25')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Чалап 10:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.vydano.d2.o}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vydano.d2.ch10}
                                    onChange={(event)=>{handleLitr(event, 'vydano', 'd2', 'ch10')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Чалап литр:
                                </div>
                                &nbsp;{nakladnaya.vydano.d2.chl}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Квас 10:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.vydano.d2.o}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vydano.d2.k10}
                                    onChange={(event)=>{handleLitr(event, 'vydano', 'd2', 'k10')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Квас литр:
                                </div>
                                &nbsp;{nakladnaya.vydano.d2.kl}
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
                                <div style={{display: 'inline-block'}}>М25: <b style={{color: 'black'}}>{nakladnaya.vydano.d3.m25}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>МЛ: <b style={{color: 'black'}}>{nakladnaya.vydano.d3.ml}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Ч25: <b style={{color: 'black'}}>{nakladnaya.vydano.d3.ch25}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Ч10: <b style={{color: 'black'}}>{nakladnaya.vydano.d3.ch10}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>ЧЛ: <b style={{color: 'black'}}>{nakladnaya.vydano.d3.chl}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>К10: <b style={{color: 'black'}}>{nakladnaya.vydano.d3.k10}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>КЛ: <b style={{color: 'black'}}>{nakladnaya.vydano.d3.kl}</b>&nbsp;&nbsp;</div>
                            </Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Максым 25:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.vydano.d3.o}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vydano.d3.m25}
                                    onChange={(event)=>{handleLitr(event, 'vydano', 'd3', 'm25')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Максым литр:
                                </div>
                                &nbsp;{nakladnaya.vydano.d3.ml}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Чалап 25:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.vydano.d3.o}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vydano.d3.ch25}
                                    onChange={(event)=>{handleLitr(event, 'vydano', 'd3', 'ch25')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Чалап 10:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.vydano.d3.o}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vydano.d3.ch10}
                                    onChange={(event)=>{handleLitr(event, 'vydano', 'd3', 'ch10')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Чалап литр:
                                </div>
                                &nbsp;{nakladnaya.vydano.d3.chl}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Квас 10:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.vydano.d3.o}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vydano.d3.k10}
                                    onChange={(event)=>{handleLitr(event, 'vydano', 'd3', 'k10')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Квас литр:
                                </div>
                                &nbsp;{nakladnaya.vydano.d3.kl}
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
                                <div style={{display: 'inline-block'}}>М25: <b style={{color: 'black'}}>{nakladnaya.vydano.i.m25}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>МЛ: <b style={{color: 'black'}}>{nakladnaya.vydano.i.ml}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Ч25: <b style={{color: 'black'}}>{nakladnaya.vydano.i.ch25}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Ч10: <b style={{color: 'black'}}>{nakladnaya.vydano.i.ch10}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>ЧЛ: <b style={{color: 'black'}}>{nakladnaya.vydano.i.chl}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>К10: <b style={{color: 'black'}}>{nakladnaya.vydano.i.k10}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>КЛ: <b style={{color: 'black'}}>{nakladnaya.vydano.i.kl}</b>&nbsp;&nbsp;</div>
                            </Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Максым 25:
                                </div>
                                &nbsp;{nakladnaya.vydano.i.m25}
                              </center>
                        </ExpansionPanelDetails>
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
                                    Чалап 25:
                                </div>
                                &nbsp;{nakladnaya.vydano.i.ch25}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Чалап 10:
                                </div>
                                &nbsp;{nakladnaya.vydano.i.ch10}
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
                                    Квас 10:
                                </div>
                                &nbsp;{nakladnaya.vydano.i.k10}
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
                        <br/>
                    </ExpansionPanel>
                    <br/>
                </ExpansionPanel>

                <ExpansionPanel>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography className={classes.heading}><b>Возврат</b></Typography>
                        <Typography className={classes.secondaryHeading}>
                            <div style={{display: 'inline-block'}}>М25: <b style={{color: 'black'}}>{nakladnaya.vozvrat.i.m25}</b>&nbsp;&nbsp;</div>
                            <div style={{display: 'inline-block'}}>МЛ: <b style={{color: 'black'}}>{nakladnaya.vozvrat.i.ml}</b>&nbsp;&nbsp;</div>
                            <div style={{display: 'inline-block'}}>Ч25: <b style={{color: 'black'}}>{nakladnaya.vozvrat.i.ch25}</b>&nbsp;&nbsp;</div>
                            <div style={{display: 'inline-block'}}>Ч10: <b style={{color: 'black'}}>{nakladnaya.vozvrat.i.ch10}</b>&nbsp;&nbsp;</div>
                            <div style={{display: 'inline-block'}}>ЧЛ: <b style={{color: 'black'}}>{nakladnaya.vozvrat.i.chl}</b>&nbsp;&nbsp;</div>
                            <div style={{display: 'inline-block'}}>К10: <b style={{color: 'black'}}>{nakladnaya.vozvrat.i.k10}</b>&nbsp;&nbsp;</div>
                            <div style={{display: 'inline-block'}}>КЛ: <b style={{color: 'black'}}>{nakladnaya.vozvrat.i.kl}</b>&nbsp;&nbsp;</div>
                        </Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanel>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography className={classes.heading}>Неполный</Typography>
                            <Typography className={classes.secondaryHeading}>
                                <div style={{display: 'inline-block'}}>Ч25: <b style={{color: 'black'}}>{nakladnaya.vozvrat.n.ch25}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Ч10: <b style={{color: 'black'}}>{nakladnaya.vozvrat.n.ch10}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>ЧЛ: <b style={{color: 'black'}}>{nakladnaya.vozvrat.n.chl}</b>&nbsp;&nbsp;</div>
                            </Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Чалап 25:
                                </div>
                                &nbsp;{nakladnaya.vozvrat.n.ch25}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Чалап 10:
                                </div>
                                &nbsp;{nakladnaya.vozvrat.n.ch10}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Чалап литр:
                                </div>
                                &nbsp;{nakladnaya.vozvrat.n.chl}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={nakladnaya.vozvrat.n.o}
                                            color='primary'
                                            disabled={status.role==='admin'?false:checkDate||nakladnaya.vozvrat.n.p||status.role!=='завсклада'}
                                            onChange={(event)=>{handlePodpis(event, 'vozvrat', 'n', 'o')}}
                                        />
                                    }
                                    label='Отпустил'
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={nakladnaya.vozvrat.n.p}
                                            color='primary'
                                            disabled={status.role==='admin'?false:checkDate||nakladnaya.vozvrat.n.p||disabled||!nakladnaya.vozvrat.n.o||status.role!=='организатор'}
                                            onChange={(event)=>{handlePodpis(event, 'vozvrat', 'n', 'p')}}
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
                            <Typography className={classes.heading}>Растановка</Typography>
                            <Typography className={classes.secondaryHeading}>
                                <div style={{display: 'inline-block'}}>М25: <b style={{color: 'black'}}>{nakladnaya.vozvrat.r.m25}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>МЛ: <b style={{color: 'black'}}>{nakladnaya.vozvrat.r.ml}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Ч25: <b style={{color: 'black'}}>{nakladnaya.vozvrat.r.ch25}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Ч10: <b style={{color: 'black'}}>{nakladnaya.vozvrat.r.ch10}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>ЧЛ: <b style={{color: 'black'}}>{nakladnaya.vozvrat.r.chl}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>К10: <b style={{color: 'black'}}>{nakladnaya.vozvrat.r.k10}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>КЛ: <b style={{color: 'black'}}>{nakladnaya.vozvrat.r.kl}</b>&nbsp;&nbsp;</div>
                            </Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Максым 25:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.vozvrat.r.o}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vozvrat.r.m25}
                                    onChange={(event)=>{handleLitr(event, 'vozvrat', 'r', 'm25')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Максым литр:
                                </div>
                                &nbsp;{nakladnaya.vozvrat.r.ml}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Чалап 25:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.vozvrat.r.o}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vozvrat.r.ch25}
                                    onChange={(event)=>{handleLitr(event, 'vozvrat', 'r', 'ch25')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Чалап 10:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.vozvrat.r.o}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vozvrat.r.ch10}
                                    onChange={(event)=>{handleLitr(event, 'vozvrat', 'r', 'ch10')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Чалап литр:
                                </div>
                                &nbsp;{nakladnaya.vozvrat.r.chl}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Квас 10:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.vozvrat.r.o}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vozvrat.r.k10}
                                    onChange={(event)=>{handleLitr(event, 'vozvrat', 'r', 'k10')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Квас литр:
                                </div>
                                &nbsp;{nakladnaya.vozvrat.r.kl}
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
                                <div style={{display: 'inline-block'}}>М25: <b style={{color: 'black'}}>{nakladnaya.vozvrat.d1.m25}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>МЛ: <b style={{color: 'black'}}>{nakladnaya.vozvrat.d1.ml}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Ч25: <b style={{color: 'black'}}>{nakladnaya.vozvrat.d1.ch25}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Ч10: <b style={{color: 'black'}}>{nakladnaya.vozvrat.d1.ch10}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>ЧЛ: <b style={{color: 'black'}}>{nakladnaya.vozvrat.d1.chl}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>К10: <b style={{color: 'black'}}>{nakladnaya.vozvrat.d1.k10}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>КЛ: <b style={{color: 'black'}}>{nakladnaya.vozvrat.d1.kl}</b>&nbsp;&nbsp;</div>
                            </Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Максым 25:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.vozvrat.d1.o}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vozvrat.d1.m25}
                                    onChange={(event)=>{handleLitr(event, 'vozvrat', 'd1', 'm25')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Максым литр:
                                </div>
                                &nbsp;{nakladnaya.vozvrat.d1.ml}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Чалап 25:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.vozvrat.d1.o}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vozvrat.d1.ch25}
                                    onChange={(event)=>{handleLitr(event, 'vozvrat', 'd1', 'ch25')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Чалап 10:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.vozvrat.d1.o}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vozvrat.d1.ch10}
                                    onChange={(event)=>{handleLitr(event, 'vozvrat', 'd1', 'ch10')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Чалап литр:
                                </div>
                                &nbsp;{nakladnaya.vozvrat.d1.chl}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Квас 10:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.vozvrat.d1.o}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vozvrat.d1.k10}
                                    onChange={(event)=>{handleLitr(event, 'vozvrat', 'd1', 'k10')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Квас литр:
                                </div>
                                &nbsp;{nakladnaya.vozvrat.d1.kl}
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
                                <div style={{display: 'inline-block'}}>М25: <b style={{color: 'black'}}>{nakladnaya.vozvrat.d2.m25}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>МЛ: <b style={{color: 'black'}}>{nakladnaya.vozvrat.d2.ml}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Ч25: <b style={{color: 'black'}}>{nakladnaya.vozvrat.d2.ch25}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Ч10: <b style={{color: 'black'}}>{nakladnaya.vozvrat.d2.ch10}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>ЧЛ: <b style={{color: 'black'}}>{nakladnaya.vozvrat.d2.chl}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>К10: <b style={{color: 'black'}}>{nakladnaya.vozvrat.d2.k10}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>КЛ: <b style={{color: 'black'}}>{nakladnaya.vozvrat.d2.kl}</b>&nbsp;&nbsp;</div>
                            </Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Максым 25:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.vozvrat.d2.o}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vozvrat.d2.m25}
                                    onChange={(event)=>{handleLitr(event, 'vozvrat', 'd2', 'm25')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Максым литр:
                                </div>
                                &nbsp;{nakladnaya.vozvrat.d2.ml}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Чалап 25:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.vozvrat.d2.o}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vozvrat.d2.ch25}
                                    onChange={(event)=>{handleLitr(event, 'vozvrat', 'd2', 'ch25')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Чалап 10:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.vozvrat.d2.o}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vozvrat.d2.ch10}
                                    onChange={(event)=>{handleLitr(event, 'vozvrat', 'd2', 'ch10')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Чалап литр:
                                </div>
                                &nbsp;{nakladnaya.vozvrat.d2.chl}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Квас 10:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.vozvrat.d2.o}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vozvrat.d2.k10}
                                    onChange={(event)=>{handleLitr(event, 'vozvrat', 'd2', 'k10')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Квас литр:
                                </div>
                                &nbsp;{nakladnaya.vozvrat.d2.kl}
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
                                <div style={{display: 'inline-block'}}>М25: <b style={{color: 'black'}}>{nakladnaya.vozvrat.d3.m25}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>МЛ: <b style={{color: 'black'}}>{nakladnaya.vozvrat.d3.ml}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Ч25: <b style={{color: 'black'}}>{nakladnaya.vozvrat.d3.ch25}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Ч10: <b style={{color: 'black'}}>{nakladnaya.vozvrat.d3.ch10}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>ЧЛ: <b style={{color: 'black'}}>{nakladnaya.vozvrat.d3.chl}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>К10: <b style={{color: 'black'}}>{nakladnaya.vozvrat.d3.k10}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>КЛ: <b style={{color: 'black'}}>{nakladnaya.vozvrat.d3.kl}</b>&nbsp;&nbsp;</div>
                            </Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Максым 25:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.vozvrat.d3.o}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vozvrat.d3.m25}
                                    onChange={(event)=>{handleLitr(event, 'vozvrat', 'd3', 'm25')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Максым литр:
                                </div>
                                &nbsp;{nakladnaya.vozvrat.d3.ml}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Чалап 25:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.vozvrat.d3.o}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vozvrat.d3.ch25}
                                    onChange={(event)=>{handleLitr(event, 'vozvrat', 'd3', 'ch25')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Чалап 10:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.vozvrat.d3.o}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vozvrat.d3.ch10}
                                    onChange={(event)=>{handleLitr(event, 'vozvrat', 'd3', 'ch10')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Чалап литр:
                                </div>
                                &nbsp;{nakladnaya.vozvrat.d3.chl}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Квас 10:
                                </div>
                                <TextField
                                    disabled={status.role==='admin'?false:checkDate||status.role!=='организатор'||nakladnaya.vozvrat.d3.o}
                                    style={{display: 'inline-block', width: '70px', verticalAlign: 'middle'}}
                                    type="number"
                                    margin='normal'
                                    value={nakladnaya.vozvrat.d3.k10}
                                    onChange={(event)=>{handleLitr(event, 'vozvrat', 'd3', 'k10')}}
                                />
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Квас литр:
                                </div>
                                &nbsp;{nakladnaya.vozvrat.d3.kl}
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
                            <Typography className={classes.heading}>Съем</Typography>
                            <Typography className={classes.secondaryHeading}>
                                <div style={{display: 'inline-block'}}>М25: <b style={{color: 'black'}}>{nakladnaya.vozvrat.s.m25}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>МЛ: <b style={{color: 'black'}}>{nakladnaya.vozvrat.s.ml}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Ч25: <b style={{color: 'black'}}>{nakladnaya.vozvrat.s.ch25}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Ч10: <b style={{color: 'black'}}>{nakladnaya.vozvrat.s.ch10}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>ЧЛ: <b style={{color: 'black'}}>{nakladnaya.vozvrat.s.chl}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>К10: <b style={{color: 'black'}}>{nakladnaya.vozvrat.s.k10}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>КЛ: <b style={{color: 'black'}}>{nakladnaya.vozvrat.s.kl}</b>&nbsp;&nbsp;</div>
                            </Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Максым 25:
                                </div>
                                &nbsp;{nakladnaya.vozvrat.s.m25}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Максым литр:
                                </div>
                                &nbsp;{nakladnaya.vozvrat.s.ml}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Чалап 25:
                                </div>
                                &nbsp;{nakladnaya.vozvrat.s.ch25}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Чалап 10:
                                </div>
                                &nbsp;{nakladnaya.vozvrat.s.ch10}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Чалап литр:
                                </div>
                                &nbsp;{nakladnaya.vozvrat.s.chl}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Квас 10:
                                </div>
                                &nbsp;{nakladnaya.vozvrat.s.k10}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Квас литр:
                                </div>
                                &nbsp;{nakladnaya.vozvrat.s.kl}
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
                            <Typography className={classes.heading}>Итого</Typography>
                            <Typography className={classes.secondaryHeading}>
                                <div style={{display: 'inline-block'}}>М25: <b style={{color: 'black'}}>{nakladnaya.vozvrat.i.m25}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>МЛ: <b style={{color: 'black'}}>{nakladnaya.vozvrat.i.ml}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Ч25: <b style={{color: 'black'}}>{nakladnaya.vozvrat.i.ch25}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>Ч10: <b style={{color: 'black'}}>{nakladnaya.vozvrat.i.ch10}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>ЧЛ: <b style={{color: 'black'}}>{nakladnaya.vozvrat.i.chl}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>К10: <b style={{color: 'black'}}>{nakladnaya.vozvrat.i.k10}</b>&nbsp;&nbsp;</div>
                                <div style={{display: 'inline-block'}}>КЛ: <b style={{color: 'black'}}>{nakladnaya.vozvrat.i.kl}</b>&nbsp;&nbsp;</div>
                            </Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Максым 25:
                                </div>
                                &nbsp;{nakladnaya.vozvrat.i.m25}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Максым литр:
                                </div>
                                &nbsp;{nakladnaya.vozvrat.i.ml}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Чалап 25:
                                </div>
                                &nbsp;{nakladnaya.vozvrat.i.ch25}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Чалап 10:
                                </div>
                                &nbsp;{nakladnaya.vozvrat.i.ch10}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Чалап литр:
                                </div>
                                &nbsp;{nakladnaya.vozvrat.i.chl}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Квас 10:
                                </div>
                                &nbsp;{nakladnaya.vozvrat.i.k10}
                            </center>
                        </ExpansionPanelDetails>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <center style={{width: '100%'}}>
                                <div style={{display: 'inline-block', marginRight: '10px', verticalAlign: 'middle', fontWeight: 'bold'}}>
                                    Квас литр:
                                </div>
                                &nbsp;{nakladnaya.vozvrat.i.kl}
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
                                    addData({search: '', sort: '', page: 0, name: 'Накладная склад №1', data: {
                                        dataTable: JSON.stringify(nakladnaya),
                                        data: date,
                                        organizator: organizator,
                                        region: region,
                                        guidOrganizator: guidOrganizator,
                                        guidRegion: guidRegion,
                                        disabled: disabled
                                    }});
                                else
                                    setData({id: id, search: '', sort: '', page: 0, name: status.role === 'admin'?name:'Накладная склад №1', data: {
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
