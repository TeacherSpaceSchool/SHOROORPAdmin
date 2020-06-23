import {
    GET_DATA,
    GET_IDS,
    SET_SELECTED,
    SET_POINT,
    SET_OLD_FILE,
    SET_DELETED_ID,
    SET_TYPE_STATISTIC,
    SET_SELECTED_POINT,
    SET_SELECTED_REGION,
    SET_SELECTED_POINT_GEO,
    SET_SELECTED_REGION_GEO
} from '../constants/table'

const initialState = {
    count: 0,
    page: 0,
    data: [],
    data1: [],
    row: [],
    search: '',
    name: '',
    sort: '',
    selected: -1,
    ids: {},
    point1: {},
    deletedId: '',
    oldFile: '',
    region: 'region',
    point: 'point',
    regionGeo: {name: 'ВСЕ', guid: ''},
    pointGeo: {name: 'ВСЕ', guid: ''},
    typeStatistic: {what: '', name: 'Выбрать'}
}

export default function user(state = initialState, action) {
    switch (action.type) {

        case GET_IDS:
            return {
                ...state,
                ids: action.payload
            };

        case SET_SELECTED:
            return {
                ...state,
                selected: action.payload
            };

        case GET_DATA:
            let a = {
                ...state,
                count: action.payload.count,
                page: action.payload.page,
                data: action.payload.data,
                data1: action.payload.data1,
                row: action.payload.row,
                search: action.payload.search,
                name: action.payload.name,
                sort: action.payload.sort
            }
            if(action.payload.region!==undefined){
                a.region = action.payload.region
            }
            if(action.payload.point!==undefined){
                a.point = action.payload.point
            }

            return a;

        case SET_POINT:
            return {
                ...state,
                point1: action.payload,
            };

        case SET_OLD_FILE:
            return {
                ...state,
                oldFile: action.payload,
            };

        case SET_DELETED_ID:
            return {
                ...state,
                deletedId: action.payload,
            };

        case SET_TYPE_STATISTIC:
            return {
                ...state,
                typeStatistic: action.payload,
            };

        case SET_SELECTED_POINT:
            return {
                ...state,
                point: action.payload,
            };

        case SET_SELECTED_REGION:
            return {
                ...state,
                region: action.payload,
            };

        case SET_SELECTED_POINT_GEO:
            return {
                ...state,
                pointGeo: action.payload,
            };

        case SET_SELECTED_REGION_GEO:
            return {
                ...state,
                regionGeo: action.payload,
            };

        default:
            return state

    }
}