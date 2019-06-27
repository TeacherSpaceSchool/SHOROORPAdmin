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
        const { classes } = props;
        const { showMiniDialog } = props.mini_dialogActions;
        const { setPoint } = props.tableActions;
        let [realizators, setRealizators] = useState([]);
        let [realizator, setRealizator] = useState('');
        let handleRealizator =  (event) => {
            setRealizator(event.target.value)
        };
        useEffect(async ()=>{
            let _data
            _data = await tableActions.getDataSimple({name: 'ТочкаВсе'})
            setRealizators(_data)
        },[])
        return (
            <div>
                <TextField
                    select
                    label='точка'
                    className={classes.textField}
                    value={realizator}
                    onChange={handleRealizator}
                    SelectProps={{
                        MenuProps: {
                            className: classes.menu,
                        },
                    }}
                    margin='normal'
                >
                    {realizators.map(option => (
                        <MenuItem key={option} value={option}>
                            {option}
                        </MenuItem>
                    ))
                    }
                </TextField>
                <br/>
                <div>
                    <Button variant='contained' color='primary' onClick={async()=>{
                        if(realizator!==''){
                            let _data = await tableActions.getDataSimple({name: 'РеализаторПоТочке', data: {point: realizator}})
                            setPoint(_data)
                        }
                        showMiniDialog(false)
                    }} className={classes.button}>
                        Сохранить
                    </Button>
                    <Button variant='contained' color='secondary' onClick={()=>{showMiniDialog(false)}} className={classes.button}>
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