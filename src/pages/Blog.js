import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux'
import * as tableActions from '../redux/actions/table'
import Button from '@material-ui/core/Button';
import { mainWindow } from '../App'
import renderHTML from 'react-render-html';
export const datePicker = React.createRef();

const width = mainWindow===undefined||mainWindow.current.offsetWidth>800? 500: 240;
const styles = theme => ({
    button: {
        width: '200px',
        margin: theme.spacing.unit,
    },
    urls: {
        margin: theme.spacing.unit,
        width: width,
        maxHeight: 100,
        overflow: 'auto'
    },
});

const Plan = React.memo(
    (props) =>{
        let handleScroll =  async () => {
            if(window.pageYOffset+window.outerHeight>document.documentElement.offsetHeight-100) {
                let _data = await tableActions.getDataSimple({name: 'Блог', skip: list.length})
                setList(_data)
            }
        }
        const { classes } = props;
        let [list, setList] = useState([]);
        const { status } = props.user;
        useEffect(()=>{
            window.addEventListener('scroll', handleScroll);
            return ()=>{
                window.removeEventListener('scroll', handleScroll);
            }
        });
        useEffect(()=>{
            async function fetchData() {
                if (!(status.status==='active'&&['admin', 'организатор', 'реализатор'].includes(status.role))) {
                    props.history.push('/')
                }
                let _data = await tableActions.getDataSimple({name: 'Блог', skip: list.length})
                if(_data!==undefined)
                    setList(_data)
            }
            fetchData();
        },[])
        let show = (id, show)=> {
            list[id].show = show
            setList([...list])
        }

         return (
            <div>
                <br/>
                <h1>Новости</h1>
                {
                    list!=undefined&&list.length>0?
                        list.map((element, idx)=> {
                            return(
                                <center key={idx}>
                                    <div className='blog'>
                                        {element.type==='image'?
                                            <img className='blog-image' src={element.image}/>
                                            :null}
                                        {element.type==='audio'?
                                            <audio className='blog-image' controls src={element.image}/>
                                            :null}
                                        {element.type==='video'?
                                            <video className='blog-image' controls>
                                                <source src={element.image} type='video/mp4'/>
                                            </video>
                                            :null}
                                        <b className="blog-title">
                                            {element.name}
                                        </b>
                                        <div>
                                            {element.text!==undefined&&element.show!==undefined&&element.show?
                                                <>
                                                <div className='blog-text'>
                                                    {renderHTML(element.text)}
                                                </div>
                                                <Button variant='outlined' onClick={()=>{show(idx, false)}} className={classes.button}>
                                                    спрятать
                                                </Button>
                                                </>
                                                :
                                                <Button variant='outlined' onClick={()=>{show(idx, true)}} className={classes.button}>
                                                    показать
                                                </Button>
                                            }
                                        </div>
                                    </div>
                                    <br/>
                                </center>
                            )
                        }):
                        null
                }
            </div>
        );
  })

function mapStateToProps (state) {
    return {
        user: state.user,
    }
}

function mapDispatchToProps() {
    return {
    }
}

Event.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Plan));
