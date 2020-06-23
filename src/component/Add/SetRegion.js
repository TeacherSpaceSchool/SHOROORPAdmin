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
    list: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: width,
        maxHeight: '400px',
        overflow: 'scroll'
    },
    menu: {
        width: 200,
    }
});

const Sign =  React.memo(
    (props) =>{
        const { classes } = props;
        const { showMiniDialog } = props.mini_dialogActions;
        const { setSelectedRegionGeo, setSelectedPointGeo } = props.tableActions;
        let [list, setList] = useState([]);
        let [search, setSearch] = useState('');
        let handleSearch =  (event) => {
            setSearch(event.target.value)
        };
        useEffect(()=>{
            async function fetchData() {
                let data = [];
                let _data = await tableActions.getDataSimple({name: 'РегионИмя'})
                console.log(_data)
                if (_data!==undefined) {
                    data = _data
                    data.unshift({name: 'ВСЕ', guid: ''})
                }
                setList(data)
            }
            fetchData();
        },[])
        return (
            <div>
                <TextField
                    label='Поиск'
                    type='login'
                    className={classes.textField}
                    margin='normal'
                    value={search}
                    onChange={handleSearch}
                />
                <br/>
                <div className={classes.list}>
                    {list!=undefined&&list.length>0?
                        list.map((element, idx)=> {
                            if(element.name.toLowerCase().includes(search.toLowerCase()))
                                return (
                                    <Button key={idx} variant="outlined" onClick={()=>{
                                        setSelectedRegionGeo({name: element.name, guid: element.guid});
                                        setSelectedPointGeo({name: 'ВСЕ', guid: ''});
                                        showMiniDialog(false)}} className={classes.button}>
                                        {element.name}
                                    </Button>
                                )
                        }):null
                    }
                </div>
                <div>
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