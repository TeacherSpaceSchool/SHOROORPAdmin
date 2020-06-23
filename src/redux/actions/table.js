import {
    GET_DATA,
    SET_TYPE_STATISTIC,
    SET_SELECTED,
    SET_POINT,
    SET_DELETED_ID,
    SET_OLD_FILE,
    SET_SELECTED_POINT,
    SET_SELECTED_REGION,
    SET_SELECTED_POINT_GEO,
    SET_SELECTED_REGION_GEO
} from '../constants/table'
import {
    showSnackBar
} from '../actions/snackbar'
import {
    skip
} from '../constants/other'
import axios from 'axios';
import FormData from 'form-data';
import {
    store
} from '../../index'
import {
    putGetSimpleByIndex, getGetSimpleByIndex
} from '../../service/idb/getSimple'

axios.interceptors.response.use(response => {
    return response;
}, error => {
    if(error.response.data.includes('to be unique')){
        store.dispatch(showSnackBar('Значение не должно повторяться'))
    } else if(error.response.data.includes('Could not proxy request')){
        store.dispatch(showSnackBar('Проверьте соединение с интернетом'))
    } else if(error.response.data.includes('No such user')){
        store.dispatch(showSnackBar('Пользователь не найден'))
    } else if(error.response.data.includes('Login failed')){
        store.dispatch(showSnackBar('Пользователь не найден'))
    } else if(error.response.data.includes('is required')){
        store.dispatch(showSnackBar('Все поля должны быть заполнены'))
    } else {
        console.log(error.response.data)
        store.dispatch(showSnackBar(error.response.data))
    }
    return error;
});

function tac(name, data) {
     let data1 = []
    if (name === 'Реализатор') {
        for (let i = 0; i < data.length; i++)
            data1[i] = [data[i][0], data[i][1], data[i][2]]
    }
    else if (name === 'Организатор') {
        for (let i = 0; i < data.length; i++)
            data1[i] = [data[i][0], data[i][1]]
    }
    else if (name === 'Организатор') {
        for (let i = 0; i < data.length; i++)
            data1[i] = [data[i][0], data[i][1]]
    }
    else if (['Отчет организатора', 'Отчет реализатора', 'Накладная на вечерний возврат', 'Накладная на пустую тару', 'Накладная склад №1', 'Накладная склад №2'].includes(name.replace(' сегодня', ''))) {
        for (let i = 0; i < data.length; i++)
            data1[i] = [data[i][0], data[i][1]]
    }
    else if (name === 'Блог') {
        for (let i = 0; i < data.length; i++) {
            let text = data[i][2].substring(0, 200) + '...'
            data1[i] = [data[i][0], data[i][1], text, data[i][3]]
        }
    }
    else {
        data1 = JSON.parse(JSON.stringify(data))
    }
    return data1
}

export function setData(payload) {
    let name = payload.name+payload.search+payload.sort+JSON.stringify(payload.page*skip)
    if(payload.region!==undefined){
        name += payload.region
    }
    else if(store.getState().table.region!==undefined) {
        name += store.getState().table.region
    }
    if(payload.point!==undefined) {
        name += payload.point
    }
    else if(store.getState().table.point!==undefined) {
        name += store.getState().table.point
    }
    if(navigator.onLine) {
        return async (dispatch) => {
            try {
                const data = new FormData();
                let _headers;
                data.append('id', payload.id);
                data.append('search', payload.search);
                data.append('sort', payload.sort);
                data.append('skip', JSON.stringify(payload.page * skip));
                data.append('name', payload.name);
                data.append('new', JSON.stringify(payload.data));
                if (store.getState().table.region !== undefined)
                    data.append('region', store.getState().table.region);
                if (store.getState().table.point !== undefined)
                    data.append('point', store.getState().table.point);
                if (payload.oldFile != undefined) {
                    data.append('oldFile', payload.oldFile);
                }
                if (payload.oldFileWhatermark != undefined) {
                    data.append('oldFileWhatermark', payload.oldFileWhatermark);
                }
                if (payload.file != undefined) {
                    data.append('fileLength', payload.file.length);
                    for (let i = 0; i < payload.file.length; i++) {
                        data.append('file' + i, payload.file[i]);
                        data.append('fileName' + i, payload.file[i].name);
                    }
                    _headers = {
                        'accept': 'application/json',
                        'Accept-Language': 'en-US,en;q=0.8',
                        'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
                        'X-Requested-With': 'XMLHttpRequest',
                        'Authorization': 'Bearer ' + localStorage.userShoroAdmin,
                    }
                } else {
                    _headers = {
                        'accept': 'application/json',
                        'Accept-Language': 'en-US,en;q=0.8',
                        'X-Requested-With': 'XMLHttpRequest',
                        'Authorization': 'Bearer ' + localStorage.userShoroAdmin,
                    }
                }
                const res = await axios.post(
                    '/data/add',
                    data,
                    {headers: _headers});
                if(res!==undefined&&res.data!==undefined){
                    let row = [];
                    for (let i = 0; i < res.data.row.length; i++) {
                        row.push({
                            name: res.data.row[i],
                            options: {
                                filter: true,
                                sort: true,
                            }
                        })
                    }
                    let data1 = await tac(payload.name, res.data.data)
                    row.unshift('№')
                    for (let i = 0; i < res.data.data.length; i++) {
                        data1[i].unshift((payload.page * skip + i + 1).toString())
                    }
                    payload = {
                        count: res.data.count,
                        page: payload.page,
                        data: res.data.data,
                        data1: data1,
                        row: row,
                        search: payload.search,
                        name: payload.name,
                        sort: payload.sort
                    }
                    putGetSimpleByIndex(name, payload)
                }
                else {
                    let res = await getGetSimpleByIndex(name)
                    if(res!==undefined) {
                        payload = res.data
                    }
                }
                dispatch({
                    type: GET_DATA,
                    payload: payload
                })
            } catch (error) {
                console.error(error)
                let payload = await getGetSimpleByIndex(name)
                if(payload!==undefined) {
                    dispatch({
                        type: GET_DATA,
                        payload: payload.data
                    })
                }
            }
        };
    }
    else {
        //store.dispatch(showSnackBar('Проверьте соединение с интернетом'))
        return async (dispatch) => {
            let payload = (await getGetSimpleByIndex(name))
            if(payload!==undefined) {
                dispatch({
                    type: GET_DATA,
                    payload: payload.data
                })
            }
        };
    }
}

export function addData(payload) {
    let name = payload.name+payload.search+payload.sort+JSON.stringify(payload.page*skip)
    if(payload.region!==undefined){
        name += payload.region
    }
    else if(store.getState().table.region!==undefined) {
        name += store.getState().table.region
    }
    if(payload.point!==undefined) {
        name += payload.point
    }
    else if(store.getState().table.point!==undefined) {
        name += store.getState().table.point
    }
    if(navigator.onLine) {
        return async (dispatch) => {
            try {
                const data = new FormData();
                let _headers;
                data.append('search', payload.search);
                data.append('sort', payload.sort);
                data.append('skip', JSON.stringify(payload.page * skip));
                data.append('name', payload.name);
                data.append('new', JSON.stringify(payload.data));
                if (store.getState().table.region !== undefined)
                    data.append('region', store.getState().table.region);
                if (store.getState().table.point !== undefined)
                    data.append('point', store.getState().table.point);
                if (payload.file != undefined) {
                    data.append('fileLength', payload.file.length);
                    for (let i = 0; i < payload.file.length; i++) {
                        data.append('file' + i, payload.file[i]);
                        data.append('fileName' + i, payload.file[i].name);
                    }
                    _headers = {
                        'accept': 'application/json',
                        'Accept-Language': 'en-US,en;q=0.8',
                        'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
                        'X-Requested-With': 'XMLHttpRequest',
                        'Authorization': 'Bearer ' + localStorage.userShoroAdmin
                    }
                } else {
                    _headers = {
                        'accept': 'application/json',
                        'Accept-Language': 'en-US,en;q=0.8',
                        'X-Requested-With': 'XMLHttpRequest',
                        'Authorization': 'Bearer ' + localStorage.userShoroAdmin,
                    }
                }
                const res = await axios.post(
                    '/data/add',
                    data,
                    {headers: _headers});
                if(res!==undefined&&res.data!==undefined){
                    let row = [];
                    for (let i = 0; i < res.data.row.length; i++) {
                        row.push({
                            name: res.data.row[i],
                            options: {
                                filter: true,
                                sort: true,
                            }
                        })
                    }
                    let data1 = await tac(payload.name, res.data.data)
                    row.unshift('№')
                    for (let i = 0; i < res.data.data.length; i++) {
                        data1[i].unshift((payload.page * skip + i + 1).toString())
                    }
                    payload = {
                        count: res.data.count,
                        page: payload.page,
                        data: res.data.data,
                        data1: data1,
                        row: row,
                        search: payload.search,
                        name: payload.name,
                        sort: payload.sort
                    }
                    putGetSimpleByIndex(name, payload)
                }
                else {
                    //store.dispatch(showSnackBar('Проверьте соединение с интернетом'))
                    let res = await getGetSimpleByIndex(name)
                    if(res!==undefined) {
                        payload = res.data
                    }
                }
                dispatch({
                    type: GET_DATA,
                    payload: payload
                })
            } catch (error) {
                //store.dispatch(showSnackBar('Проверьте соединение с интернетом'))
                console.error(error)
                let payload = await getGetSimpleByIndex(name)
                if(payload!==undefined) {
                    dispatch({
                        type: GET_DATA,
                        payload: payload.data
                    })
                }
            }
        };
    } else {
        //store.dispatch(showSnackBar('Проверьте соединение с интернетом'))
        return async (dispatch) => {
            let payload = (await getGetSimpleByIndex(name))
            if(payload!==undefined) {
                dispatch({
                    type: GET_DATA,
                    payload: payload.data
                })
            }
        };
    }
}

export function setSelected(payload) {
    return {
        type: SET_SELECTED,
        payload: payload
    }
}

export function setTypeStatistic(payload) {
    return {
        type: SET_TYPE_STATISTIC,
        payload: payload
    }
}

export function setPoint(payload) {
    return {
        type: SET_POINT,
        payload: payload
    }
}

export function setSelectedPoint(payload) {
    return {
        type: SET_SELECTED_POINT,
        payload: payload
    }
}

export function setSelectedRegion(payload) {
    return {
        type: SET_SELECTED_REGION,
        payload: payload
    }
}

export function setSelectedPointGeo(payload) {
    return {
        type: SET_SELECTED_POINT_GEO,
        payload: payload
    }
}

export function setSelectedRegionGeo(payload) {
    return {
        type: SET_SELECTED_REGION_GEO,
        payload: payload
    }
}

export function setDeletedId(payload) {
    return {
        type: SET_DELETED_ID,
        payload: payload
    }
}

export function setOldFile(payload) {
    return {
        type: SET_OLD_FILE,
        payload: payload
    }
}

/*export function getIds(payload) {
    return async (dispatch) => {
        let res = {data: undefined}
        let name = payload
        try {
            const data = new FormData();
            data.append('name', payload);
            if(navigator.onLine){
                res = await axios.post(
                '/data/getIds',
                data,
                {headers: {
                    'accept': 'application/json',
                    'Accept-Language': 'en-US,en;q=0.8',
                    'X-Requested-With': 'XMLHttpRequest',
                    'Authorization':'Bearer '+localStorage.userShoroAdmin,
                }});
                if((res===undefined||res.data===undefined)&&await getGetSimpleByIndex(name)!==undefined) {
                    res = await getGetSimpleByIndex(name)
                }
                putGetSimpleByIndex(name, res.data)
            } else {
                res = await getGetSimpleByIndex(name)
            }
            dispatch({
                type: GET_IDS,
                payload: res.data
            })
        } catch(error) {
            console.error(error)
            let res = await getGetSimpleByIndex(name)
            if(res!==undefined) {
                return res.data
            }
        }
    };
}
*/
export function getData(payload) {
    return async (dispatch) => {
        let name = payload.name+payload.search+payload.sort+JSON.stringify(payload.page*skip)
        const data = new FormData();
        data.append('search', payload.search);
        data.append('sort', payload.sort);
        data.append('skip', JSON.stringify(payload.page*skip));
        data.append('name', payload.name);
        if(payload.region!==undefined){
            data.append('region', payload.region);
            name += payload.region
        }
        else if(store.getState().table.region!==undefined) {
            data.append('region', store.getState().table.region);
            name += store.getState().table.region
        }
        if(payload.point!==undefined) {
            data.append('point', payload.point);
            name += payload.point
        }
        else if(store.getState().table.point!==undefined) {
            data.append('point', store.getState().table.point);
            name += store.getState().table.point
        }
        try {
            if(payload.name===''){
                payload = {
                    count: 0,
                    page: 0,
                    data: [],
                    data1: [],
                    row: [],
                    search: payload.search,
                    name: payload.name,
                    sort: payload.sort
                }
                dispatch({
                    type: GET_DATA,
                    payload: payload
                })
            }
            else {
                if(navigator.onLine){
                    const res = await axios.post(
                        '/data/get',
                        data,
                        {headers: {
                            'accept': 'application/json',
                            'Accept-Language': 'en-US,en;q=0.8',
                            'X-Requested-With': 'XMLHttpRequest',
                            'Authorization':'Bearer '+localStorage.userShoroAdmin,
                        }});
                    if(res!==undefined&&res.data!==undefined) {
                        let row = [];
                        for (let i = 0; i < res.data.row.length; i++) {
                            row.push({
                                name: res.data.row[i],
                                options: {
                                    filter: true,
                                    sort: true,
                                }
                            })
                        }
                        let data1 = await tac(payload.name, res.data.data)
                        row.unshift('№')
                        for (let i = 0; i < res.data.data.length; i++) {
                            data1[i].unshift((payload.page * skip + i + 1).toString())
                        }
                        payload = {
                            count: res.data.count,
                            page: payload.page,
                            data: res.data.data,
                            data1: data1,
                            row: row,
                            search: payload.search,
                            name: payload.name,
                            region: payload.region,
                            point: payload.point,
                            sort: payload.sort
                        }
                        putGetSimpleByIndex(name, payload)
                    }
                    else if(await getGetSimpleByIndex(name)!==undefined) {
                        //store.dispatch(showSnackBar('Проверьте соединение с интернетом'))
                        let res = await getGetSimpleByIndex(name)
                        if(res!==undefined) {
                            payload = res.data
                        }
                    }
                }
                else {
                     //store.dispatch(showSnackBar('Проверьте соединение с интернетом'))
                     let res = await getGetSimpleByIndex(name)
                     if(res!==undefined) {
                         payload = res.data
                     }
                 }
                if(payload!==undefined) {
                    dispatch({
                        type: GET_DATA,
                        payload: payload
                    })
                }
            }
        } catch(error) {
            let res = await getGetSimpleByIndex(name)
            if(res!==undefined) {
                dispatch({
                    type: GET_DATA,
                    payload: res.data
                })
            }
        }
    };
}

export const getDataSimple = async (payload) => {
        let res = {data: undefined}
        let name = payload.name
        const data = new FormData();
        data.append('name', payload.name);
        if(payload.data!==undefined) {
            data.append('data', JSON.stringify(payload.data));
            name += JSON.stringify(payload.data);
        }
        try {
             if(navigator.onLine){
                res = await axios.post(
                    '/data/get',
                    data,
                    {headers: {
                        'accept': 'application/json',
                        'Accept-Language': 'en-US,en;q=0.8',
                        'X-Requested-With': 'XMLHttpRequest',
                        'Authorization':'Bearer '+localStorage.userShoroAdmin,
                    }});
                if((res===undefined||res.data===undefined)&&await getGetSimpleByIndex(name)!==undefined) {
                    res = await getGetSimpleByIndex(name)
                }
                putGetSimpleByIndex(name, res.data)
            } else {
                 //store.dispatch(showSnackBar('Проверьте соединение с интернетом'))
                res = await getGetSimpleByIndex(name)
            }
            if(res!==undefined)
                return res.data
        } catch(error) {
            let res = await getGetSimpleByIndex(name)
            if(res!==undefined) {
                return res.data
            }
        }
}

export function deleteData(payload) {
    let name = payload.name+payload.search+payload.sort+JSON.stringify(payload.page*skip)
    if(payload.region!==undefined){
        name += payload.region
    }
    else if(store.getState().table.region!==undefined) {
        name += store.getState().table.region
    }
    if(payload.point!==undefined) {
        name += payload.point
    }
    else if(store.getState().table.point!==undefined) {
        name += store.getState().table.point
    }
    if(navigator.onLine) {
        return async (dispatch) => {
            try {
                const data = new FormData();
                data.append('search', payload.search);
                data.append('sort', payload.sort);
                data.append('skip', JSON.stringify(payload.page * skip));
                data.append('name', payload.name);
                data.append('deleted', payload.deleted);
                if (store.getState().table.region !== undefined)
                    data.append('region', store.getState().table.region);
                if (store.getState().table.point !== undefined)
                    data.append('point', store.getState().table.point);
                if (payload.oldFile != undefined && payload.oldFile.length > 0) {
                    data.append('oldFile', payload.oldFile);
                }
                const res = await axios.post(
                    '/data/delete',
                    data,
                    {
                        headers: {
                            'accept': 'application/json',
                            'Accept-Language': 'en-US,en;q=0.8',
                            'X-Requested-With': 'XMLHttpRequest',
                            'Authorization': 'Bearer ' + localStorage.userShoroAdmin,
                        }
                    });
                if(res!==undefined&&res.data!==undefined){
                    let row = [];
                    for (let i = 0; i < res.data.row.length; i++) {
                        row.push({
                            name: res.data.row[i],
                            options: {
                                filter: true,
                                sort: true,
                            }
                        })
                    }
                    let data1 = await tac(payload.name, res.data.data)
                    row.unshift('№')
                    for (let i = 0; i < res.data.data.length; i++) {
                        data1[i].unshift((payload.page * skip + i + 1).toString())
                    }
                    payload = {
                        count: res.data.count,
                        page: payload.page,
                        data: res.data.data,
                        data1: data1,
                        row: row,
                        search: payload.search,
                        name: payload.name,
                        sort: payload.sort
                    }
                    putGetSimpleByIndex(name, payload)
                }
                else {
                    //store.dispatch(showSnackBar('Проверьте соединение с интернетом'))
                    let res = await getGetSimpleByIndex(name)
                    if(res!==undefined) {
                        payload = res.data
                    }
                }
                if(payload!==undefined) {
                    dispatch({
                        type: GET_DATA,
                        payload: payload
                    })
                }
            } catch (error) {
                let payload = await getGetSimpleByIndex(name)
                if(payload!==undefined) {
                    dispatch({
                        type: GET_DATA,
                        payload: payload.data
                    })
                }
            }
        };
    } else {
        //store.dispatch(showSnackBar('Проверьте соединение с интернетом'))
        return async (dispatch) => {
                let payload = (await getGetSimpleByIndex(name))
                if(payload!==undefined) {
                    dispatch({
                        type: GET_DATA,
                        payload: payload.data
                    })
                }
        };
    }
}