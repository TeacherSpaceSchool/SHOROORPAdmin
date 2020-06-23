import React, { useState } from 'react';
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
        const { showMiniDialog } = props.mini_dialogActions;
        const { setSelected } = props.tableActions;
        const { selected, data } = props.table;
        let names = ['Максым', 'Чалап', 'Квас', 'Стакан Легенда']
        let [name, setName] = useState(selected!==-1?data[selected][0]:'');
        let handleName =  (event) => {
            setName(event.target.value)
        };
        let [price, setPrice] = useState(selected!==-1?data[selected][1]:'');
        let handlePrice =  (event) => {
            setPrice(event.target.value)
        };
        const { classes } = props;
        return (
            <div>
                <TextField
                    select
                    InputProps={{
                        readOnly: true,
                    }}
                    label='название'
                    className={classes.textField}
                    value={name}
                    onChange={handleName}
                    SelectProps={{
                        MenuProps: {
                            className: classes.menu,
                        },
                    }}
                    margin='normal'
                >
                    {names.map((option, idx) => (
                        <MenuItem key={idx} value={option}>
                            {option}
                        </MenuItem>
                    ))
                    }
                </TextField>
                <br/>
                <TextField
                    InputProps={{
                        readOnly: true,
                    }}
                    label='цена'
                    type='login'
                    className={classes.textField}
                    margin='normal'
                    value={price}
                    onChange={handlePrice}
                />
                <br/>
                <div>
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