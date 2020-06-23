import React from 'react';
import MUIDataTable from 'mui-datatables';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as tableActions from '../redux/actions/table'
import {skip} from '../redux/constants/other'
import * as mini_dialogActions from '../redux/actions/mini_dialog'
import 'react-image-gallery/styles/css/image-gallery.css';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { mainWindow } from '../App'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import logo from '../logo.png';
import gora from '../gora.jpg';

const message = mainWindow===undefined||mainWindow.current.offsetWidth>800?
    <>
        ОРП
        <br/>
        <i style={{fontWeight: '500', fontSize: '18px'}}>Для начала выберите пункт в боковом меню</i>
    </>
    :
    <>
    ОРП
        <br/>
        <i style={{fontWeight: '500', fontSize: '18px'}}>Для начала нажмите значок и выберите пункт в боковом меню</i>
    </>;
const width = mainWindow===undefined||mainWindow.current.offsetWidth>800? 500: 240;
const styles = theme => ({
    mainMessage: {
        backgroundImage: "url('"+gora+"')",
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    message: {
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: '20px',
        width: width,
        marginTop: theme.spacing.unit,
        marginBottom: theme.spacing.unit,
        marginLeft: 'calc((100% - '+width+'px)/2)',
        marginRight: 'calc((100% - '+width+'px)/2)'
    }
});

const Table = React.memo(
    (props) => {
        const { classes } = props;
        let getMuiTheme = () => createMuiTheme({
            overrides: {
                MUIDataTableBodyCell: {
                    root: {
                        textOverflow: 'ellipsis',
                        maxHeight: '500px',
                        maxWidth: '200px',
                        overflow: 'hidden',
                        wordWrap: 'break-word'
                    }
                },
                MUIDataTableSelectCell: {
                    root: {
                        display: 'inherit !important'
                    }
                }

            }
        })
        const { row, count, page, data, data1, name, search, sort } = props.table;
        const { getData, setSelected, setOldFile, setDeletedId } = props.tableActions;
        const { showAddMiniDialog, showDelete } = props.mini_dialogActions;
        const { authenticated, status, reiting } = props.user;
        const options = {
            serverSide: true,
            filterType: 'checkbox',
            filter: false,
            print: false,
            downloadOptions: false,
            rowsPerPage: skip,
            count: count,
            page: page,
            responsive: 'scroll',
            rowsPerPageOptions: false,
            onColumnSortChange: (changedColumn, direction) => {
                getData({search: search, sort: [changedColumn, direction], page: page, name: name})
                setSelected(-1)
            },
            onSearchChange: (searchText) => {
                getData({search: searchText, sort: '', page: 0, name: name})
                setSelected(-1)
            },
            onChangePage: (currentPage) => {
                getData({search: search, sort: sort, page: currentPage, name: name})
                setSelected(-1)
            },
            onRowsDelete: (rowsDeleted) => {
                let deletedId = [], oldFile = '';
                for(let i=0; i<rowsDeleted.data.length; i++){
                    if(name === 'Блог'){
                        deletedId.push(data[rowsDeleted.data[i].index][1])
                    } else if(name === 'FAQ'){
                        deletedId.push(data[rowsDeleted.data[i].index][0])
                    } else if(name === 'Машина'){
                        deletedId.push(data[rowsDeleted.data[i].index][0])
                    } else if(name === 'Организатор'){
                        deletedId.push(data[rowsDeleted.data[i].index][2])
                    } else if(name === 'Реализатор'){
                        deletedId.push(data[rowsDeleted.data[i].index][3])
                    } else if(name === 'Точка'){
                        deletedId.push(data[rowsDeleted.data[i].index][0]+'|'+data[rowsDeleted.data[i].index][1])
                    } else if(name === 'Регион'){
                        deletedId.push(data[rowsDeleted.data[i].index][0])
                    } else if(name === 'Завсклада'){
                        deletedId.push(data[rowsDeleted.data[i].index][1])
                    } else if(name === 'План'){
                        deletedId.push(data[rowsDeleted.data[i].index][0])
                    } else if(name === 'Цена'){
                        deletedId.push(data[rowsDeleted.data[i].index][0])
                    } else if(name === 'Накладная на пустую тару'||name === 'Накладная склад №1'||name === 'Накладная склад №2'||name === 'Накладная на вечерний возврат'||name === 'Отчет организатора'||name === 'Накладная на пустую тару сегодня'||name === 'Накладная склад №1 сегодня'||name === 'Накладная склад №2 сегодня'||name === 'Накладная на вечерний возврат сегодня'||name === 'Отчет организатора сегодня'){
                        deletedId.push('|'+data[rowsDeleted.data[i].index][2]+': '+data[rowsDeleted.data[i].index][3]+'|'+data[rowsDeleted.data[i].index][1])
                    } else if(name === 'Отчет реализатора'||name === 'Отчет реализатора сегодня'){
                        deletedId.push(data[rowsDeleted.data[i].index][4]+'|'+data[rowsDeleted.data[i].index][2]+'|'+data[rowsDeleted.data[i].index][3]+'|'+data[rowsDeleted.data[i].index][1])
                    } else
                        deletedId.push(data[rowsDeleted.data[i].index][data[rowsDeleted.data[i].index].length-1])
                    if(data[rowsDeleted.data[i].index][0]!=undefined&&
                        (data[rowsDeleted.data[i].index][0].substring(0, 1).includes('/')||data[rowsDeleted.data[i].index][0].includes('http')||data[rowsDeleted.data[i].index][0].includes('https')))
                        oldFile += '\n' + data[rowsDeleted.data[i].index][0]
                }
                showDelete()
                setOldFile(oldFile)
                setDeletedId(JSON.stringify(deletedId))
                setSelected(-1)
            },
            onCellClick: (colData, colMeta) => {
                colData = colData.toString()
                if(colData!=undefined) {
                    setSelected(colMeta.rowIndex)
                    if(name === 'План'){
                        props.history.push('/plan')
                    } else if(name === 'Накладная на пустую тару'){
                        props.history.push('/nnpt')
                    } else if(name === 'Накладная склад №1'){
                        props.history.push('/ns1')
                    } else if(name === 'Накладная склад №2'){
                        props.history.push('/ns2')
                    } else if(name === 'Накладная на вечерний возврат'){
                        props.history.push('/nnvv')
                    } else if(name === 'Отчет реализатора'){
                        props.history.push('/or')
                    } else if(name === 'Отчет организатора'){
                        props.history.push('/oo')
                    } else if(name === 'Накладная на пустую тару сегодня'){
                        props.history.push('/nnpt')
                    } else if(name === 'Накладная склад №1 сегодня'){
                        props.history.push('/ns1')
                    } else if(name === 'Накладная склад №2 сегодня'){
                        props.history.push('/ns2')
                    } else if(name === 'Накладная на вечерний возврат сегодня'){
                        props.history.push('/nnvv')
                    } else if(name === 'Отчет реализатора сегодня'){
                        props.history.push('/or')
                    } else if(name === 'Отчет организатора сегодня'){
                        props.history.push('/oo')
                    } else {
                        showAddMiniDialog()
                    }
                }
            },
            onTableChange: (action, tableState) => {
                if(action==='search'&&tableState.searchText===null){
                    getData({search: '', sort: '', page: 0, name: name})
                    setSelected(-1)
                }
            }
        };
        const { profile } = props.app;
        return (
                <>
                    {authenticated&&name!==''?
                        <MuiThemeProvider theme={getMuiTheme()}>
                            <MUIDataTable
                                title={name}
                                data={data1}
                                columns={row}
                                options={options}
                            />
                        </MuiThemeProvider>
                        :
                        <div className={classes.mainMessage}>
                            <div className={classes.message}>
                                <img style={{width:'200px'}} src={logo} /><br/>
                                <br/>
                                {!authenticated||status.role===undefined||status.role==='admin'||status.role==='завсклада'?
                                    message
                                    :
                                    <div style={{background: '#ffffff8f', color: 'black', paddingTop: '20px', paddingBottom: '20px', borderRadius: '20px', fontWeight: '600'}}>
                                        <h2 style={{margin: '0px'}}>{profile.name}</h2>
                                        <br/>
                                        <b>Роль:</b>&nbsp;{status.role}
                                        <br/>
                                        <b>Регион:</b>&nbsp;{profile.region}&nbsp;{status.role==='реализатор'?<><b>Точка:</b>&nbsp;{profile.point}</>: null}
                                        <br/>
                                        <b>Рейтинг:</b>&nbsp;{reiting.number}
                                        <br/>
                                        <b>Выполнение плана:</b>&nbsp;{reiting.score}
                                    </div>
                                }
                            </div>
                        </div>
                    }
                </>
            );
        }
)

function mapStateToProps (state) {
    return {
        table: state.table,
        user: state.user,
        app: state.app
    }
}

function mapDispatchToProps(dispatch) {
    return {
        mini_dialogActions: bindActionCreators(mini_dialogActions, dispatch),
        tableActions: bindActionCreators(tableActions, dispatch),
    }
}

Table.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Table));