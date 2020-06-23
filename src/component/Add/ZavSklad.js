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
    menu: {
        width: 200,
    }
});

const Sign =  React.memo(
    (props) =>{
        useEffect(()=>{
            async function fetchData() {
                if(selected!==-1){
                    let _data = await tableActions.getDataSimple({name: 'ЗавскладаПоИмени', data: {phone: data[selected][1]}})
                    setStatus(_data.status);
                    setName(_data.name);
                    setPhone(_data.phone);
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
        let [phone, setPhone] = useState(selected!==-1?data[selected][1]:'');
        let handlePhone =  (event) => {
            setPhone(event.target.value)
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
                <div>
                    <Button variant='contained' color='primary' onClick={()=>{
                        if(selected===-1)
                            addData({search: search, sort: sort, page: page, name: 'Завсклада', data: {name:name.trim(), phone: phone.trim(), status: status, password: password}});
                        else
                            setData({id: id, search: search, sort: sort, page: page, name: 'Завсклада', data: {user: user, name:name.trim(), status: status, phone: phone.trim(), password: password}});
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