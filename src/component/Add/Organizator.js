import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../redux/actions/mini_dialog'
import * as tableActions from '../../redux/actions/table'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import { mainWindow } from '../../App'
const width = mainWindow===undefined||mainWindow.current.offsetWidth>800? 500: (mainWindow.current.offsetWidth-144);

const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: width,
    },
    error_message: {
        marginTop: theme.spacing.unit,
        marginBottom: theme.spacing.unit,
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        color: 'red',
        fontWeight: 'bold'
    },
    urls: {
        margin: theme.spacing.unit,
        width: width,
        maxHeight: 100,
        overflow: 'auto'
    },
    menu: {
        width: 200,
    }
});

const Sign =  React.memo(
    (props) =>{
        useEffect( ()=>{
            async function fetchData() {
                let _data = await tableActions.getDataSimple({name: 'РегионИмя'})
                setRegions(_data)
                if(selected!==-1){
                    _data = await tableActions.getDataSimple({name: 'ОрганизаторПоИмени', data: {phone: data[selected][2]}})
                    setStatus(_data.status);
                    setName(_data.name);
                    setPhone(_data.phone);
                    setRegion(_data.region);
                    setRegionGuid(_data.guidRegion);
                    setId(_data._id)
                    setUser(_data.user)
                }
            }
            fetchData();
        },[])
        const { showMiniDialog } = props.mini_dialogActions;
        const { setSelected, addData, setData } = props.tableActions;
        const { selected, data, page, search, sort } = props.table;
        let [name, setName] = useState(selected!==-1?data[selected][0]:'');
        let handleName =  (event) => {
            setName(event.target.value)
        };
        let [phone, setPhone] = useState(selected!==-1?data[selected][2]:'');
        let handlePhone =  (event) => {
            setPhone(event.target.value)
        };
        let [regions, setRegions] = useState([]);
        let [regionGuid, setRegionGuid] = useState(selected!==-1?data[selected][4]:'');
        let [region, setRegion] = useState(selected!==-1?data[selected][1]:'');
        let handleRegion =  (event) => {
            setRegionGuid(event.target.value)
            setRegion((regions.find((element)=>{return element.guid===event.target.value})).name)
        };
        let [password, setPassword] = useState('');
        let handlePassword =  (event) => {
            setPassword(event.target.value)
        };
        let [id, setId] = useState('');
        let statuses = ['active', 'inactive']
        let [status, setStatus] = useState('');
        let handleStatus =  (event) => {
            setStatus(event.target.value)
        };
        let [user, setUser] = useState('');
        const { classes } = props;
        return (
            <div>
                <TextField
                    label='имя'
                    type='login'
                    className={classes.textField}
                    margin='normal'
                    value={name}
                    onChange={handleName}
                    InputProps={{
                        readOnly: true,
                    }}
                />
                <br/>
                <TextField
                    label='телефон'
                    type='login'
                    className={classes.textField}
                    margin='normal'
                    value={phone}
                    onChange={handlePhone}
                />
                <br/>
                <TextField
                    select
                    label='регион'
                    className={classes.textField}
                    value={regionGuid}
                    onChange={handleRegion}
                    SelectProps={{
                        MenuProps: {
                            className: classes.menu,
                        },
                    }}
                    margin='normal'
                >
                    {regions.map(option => (
                        <MenuItem key={option.guid} value={option.guid}>
                            {option.name}
                        </MenuItem>
                    ))
                    }
                </TextField>
                <br/>
                <TextField
                    label='пароль'
                    type='login'
                    className={classes.textField}
                    margin='normal'
                    value={password}
                    onChange={handlePassword}
                />
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
                    className={classes.textField}
                    margin='normal'
                    value={status}
                    onChange={handleStatus}
                >
                    {statuses != undefined?
                        statuses.map(option => (
                            <MenuItem key={option} value={option}>
                                {option}
                            </MenuItem>
                        ))
                        :
                        null
                    }
                </TextField>
                <br/>
                <div>
                    <Button variant='contained' color='primary' onClick={()=>{
                        if(selected===-1)
                            addData({search: search, sort: sort, page: page, name: 'Организатор', data: {name:name.trim(), phone: phone.trim(), status: status, region: region, password: password}});
                        else
                            setData({id: id, search: search, sort: sort, page: page, name: 'Организатор', data: {user: user, name:name.trim(), status: status, phone: phone.trim(), guidRegion: regionGuid, region: region, password: password}});
                        setSelected(-1)
                        showMiniDialog(false)}} className={classes.button}>
                        Сохранить
                    </Button>
                    <Button variant='contained' color='secondary' onClick={()=>{setSelected(-1); showMiniDialog(false)}} className={classes.button}>
                        Отмена
                    </Button>
                </div>
            </div>
        );
    }
)

function mapStateToProps (state) {
    return {
        mini_dialog: state.mini_dialog,
        table: state.table,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        mini_dialogActions: bindActionCreators(mini_dialogActions, dispatch),
        tableActions: bindActionCreators(tableActions, dispatch),
    }
}

Sign.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Sign));