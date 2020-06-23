import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../redux/actions/mini_dialog'
import * as tableActions from '../../redux/actions/table'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import * as snackbarActions from '../../redux/actions/snackbar'
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
    urls: {
        margin: theme.spacing.unit,
        width: width,
        maxHeight: 100,
        overflow: 'auto'
    },
});

const Sign =  React.memo(
    (props) =>{
        const { showMiniDialog } = props.mini_dialogActions;
        const { showSnackBar } = props.snackbarActions;
        const { setSelected, addData, setData } = props.tableActions;
        const { selected, data, page, search, sort } = props.table;
        let [title, setTitle] = useState(selected!==-1?data[selected][1]:'');
        let handleTitle =  (event) => {
            setTitle(event.target.value)
        };
        let [text, setText] = useState(selected!==-1?data[selected][2]:'');
        let handleText =  (event) => {
            setText(event.target.value)
        };
        let [file, setFile] = useState([]);
        let [fileNames, setFileNames] = useState(selected!==-1?data[selected][0]:'');
        let handleChangeFile = (async (event) => {
            setFile(event.target.files)
            let fileNames='';
            for(let i=0; i<event.target.files.length; i++){
                if(i!==0)
                    fileNames+=', '
                fileNames+=event.target.files[i].name+','
            }
            setFileNames(fileNames)
        })

        const { classes } = props;
        return (
            <div>
                <TextField
                    label='заголовок'
                    type='login'
                    className={classes.textField}
                    margin='normal'
                    value={title}
                    onChange={handleTitle}
                />
                <br/>
                <TextField
                    multiline
                    rowsMax='4'
                    label='текст'
                    type='login'
                    className={classes.textField}
                    margin='normal'
                    value={text}
                    onChange={handleText}
                />
                <br/>
                <div className={classes.urls}>
                    {fileNames}
                </div>
                <br/>
                <label htmlFor='contained-button-file'>
                    <Button variant='contained' color={fileNames.length>0?'primary':''} component='span' className={classes.button}>
                        Загрузить изображение
                    </Button>
                </label>
                <br/>
                <div>
                    <Button variant='contained' color='primary' onClick={()=>{
                        if(selected===-1) {
                            if((file[0].type).split('/')[0]==='image'||(file[0].type).split('/')[0]==='video'||(file[0].type).split('/')[0]==='audio'){
                                addData({
                                    search: search,
                                    sort: sort,
                                    page: page,
                                    name: 'Блог',
                                    file: file,
                                    data: {type: (file[0].type).split('/')[0], text: text.trim(), name: title.trim()}
                                });
                                setSelected(-1)
                                showMiniDialog(false)
                            }
                            else
                                showSnackBar('Тип файла не поддерживается')
                        } else {
                            if(file.length===0||(file[0].type).split('/')[0]==='image'||(file[0].type).split('/')[0]==='video'||(file[0].type).split('/')[0]==='audio'){
                                let type = file.length===0?data[selected][4]:(file[0].type).split('/')[0]
                                setData({
                                    id: data[selected][1],
                                    search: search,
                                    sort: sort,
                                    page: page,
                                    name: 'Блог',
                                    oldFile: data[selected][0],
                                    oldFileWhatermark: data[selected][1],
                                    file: file,
                                    data: {type: type, text: text.trim(), name: title.trim()}
                                });

                                setSelected(-1)
                                showMiniDialog(false)
                            } else
                                showSnackBar('Тип файла не поддерживается')
                        }}} className={classes.button}>
                        Сохранить
                    </Button>
                    <Button variant='contained' color='secondary' onClick={()=>{setSelected(-1); showMiniDialog(false)}} className={classes.button}>
                        Отмена
                    </Button>
                </div>
                <input
                    accept='media_type'
                    style={{ display: 'none' }}
                    id='contained-button-file'
                    type='file'
                    onChange={handleChangeFile}
                />
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
        snackbarActions: bindActionCreators(snackbarActions, dispatch),
        tableActions: bindActionCreators(tableActions, dispatch),
    }
}

Sign.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Sign));