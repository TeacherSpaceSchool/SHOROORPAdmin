import React, { useState, } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../redux/actions/mini_dialog'
import * as tableActions from '../../redux/actions/table'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
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
});

const Sign =  React.memo(
    (props) =>{
        const { showMiniDialog } = props.mini_dialogActions;
        const { setSelected, addData, setData } = props.tableActions;
        const { selected, data, page, search, sort } = props.table;
        let [name, setName] = useState(selected!==-1?data[selected][0]:'');
        let handleName =  (event) => {
            let value = event.target.value
            value = value.replace(' - ', '-')
            setName(value)
        };
        let [region, setRegion] = useState(selected!==-1?data[selected][1]:'');
        const { classes } = props;
        return (
            <div>
                <TextField
                    label='название'
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
                    label='регион'
                    type='login'
                    className={classes.textField}
                    margin='normal'
                    value={region}
                    InputProps={{
                        readOnly: true,
                    }}/>
                <br/>
                <div>
                    <Button variant='contained' color='primary' onClick={()=>{
                        if(selected===-1)
                            addData({search: search, sort: sort, page: page, name: 'Точка',  data: {name: name.trim(), region: region}});
                        else
                            setData({id: data[selected][0], search: search, sort: sort, page: page, name: 'Точка', data: {name: name.trim(), region: region}});
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