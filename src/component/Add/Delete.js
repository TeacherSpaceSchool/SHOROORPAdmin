import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../redux/actions/mini_dialog'
import * as tableActions from '../../redux/actions/table'
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
        const { classes } = props;
        const { showMiniDialog } = props.mini_dialogActions;
        const { page, name, search, sort, deletedId, oldFile } = props.table;
        const { deleteData } = props.tableActions;
        return (
            <div>
                <div>
                    <Button variant='contained' color='primary' onClick={async()=>{
                        deleteData({oldFile: oldFile, search: search, sort: sort, page: page, name: name, deleted: deletedId})
                        showMiniDialog(false)
                    }} className={classes.button}>
                        Удалить
                    </Button>
                    <Button variant='contained' color='secondary' onClick={()=>{
                        deleteData({oldFile: [], search: search, sort: sort, page: page, name: name, deleted: JSON.stringify([])})
                        showMiniDialog(false)
                    }} className={classes.button}>
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