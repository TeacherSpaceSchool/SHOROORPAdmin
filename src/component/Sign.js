import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../redux/actions/mini_dialog'
import * as userActions from '../redux/actions/user'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import classNames from 'classnames';
import IconButton from '@material-ui/core/IconButton';

const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 200,
    },
    error_message: {
        marginTop: theme.spacing.unit,
        marginBottom: theme.spacing.unit,
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        color: 'red',
        fontWeight: 'bold'
    },
});

const Sign =  React.memo(
    (props) =>{
        let [login, setLogin] = useState('');
        let [pass, setPass] = useState('');
        let [hide, setHide] = useState('password');
        let handleHide =  () => {
            setHide(!hide)
        };
        const { error } = props.user;
        const { showMiniDialog } = props.mini_dialogActions;
        const { signin, logout } = props.userActions;
        let handlePass =  (event) => {
            setPass(event.target.value)
        };
        let handleLogin =  (event) => {
            setLogin(event.target.value)
        };
        const { classes } = props;
        return (
            <div>
                <TextField
                    id='standard-search'
                    label='Логин'
                    type='login'
                    className={classes.textField}
                    margin='normal'
                    value={login}
                    onChange={handleLogin}
                />
                <br/>
                <FormControl className={classNames(classes.margin, classes.textField)}>
                    <InputLabel htmlFor="adornment-password">Пароль</InputLabel>
                    <Input
                        id="adornment-password"
                        type={hide ? 'password' : 'text' }
                        value={pass}
                        onChange={handlePass}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton aria-label="Toggle password visibility" onClick={handleHide}>
                                    {hide ? <VisibilityOff />:<Visibility />  }
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                </FormControl>
                <br/>
                {error?
                    <div className={classes.error_message}>Неверный логин или пароль</div>
                    :
                    null
                }
                <div>
                    <Button variant="contained" color="primary" onClick={()=>{signin({email: login, password: pass})}} className={classes.button}>
                        Войти
                    </Button>
                    <Button variant="contained" color="secondary" onClick={()=>{showMiniDialog(false);}} className={classes.button}>
                        Отмена
                    </Button>
                </div>
            </div>
        );
    }
)

function mapStateToProps (state) {
    return {
        user: state.user,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        mini_dialogActions: bindActionCreators(mini_dialogActions, dispatch),
        userActions: bindActionCreators(userActions, dispatch),
    }
}

Sign.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Sign));