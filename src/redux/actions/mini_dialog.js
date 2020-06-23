import { SET_MINI_DIALOG, SHOW_MINI_DIALOG } from '../constants/mini_dialog'
import React from 'react'
import {
    store
} from '../../index'
import Blog from '../../component/Add/Blog';
import Car from '../../component/Add/Car';
import Point from '../../component/Add/Point';
import Region from '../../component/Add/Region';
import Realizator from '../../component/Add/Realizator';
import Realizators from '../../component/Add/Realizators';
import Organizator from '../../component/Add/Organizator';
import ZavSklad from '../../component/Add/ZavSklad';
import Price from '../../component/Add/Price';
import Delete from '../../component/Add/Delete';
import Statistic from '../../component/Add/Statistic';
import FAQ from '../../component/Add/FAQ';
import SetRegion from '../../component/Add/SetRegion';
import SetPoint from '../../component/Add/SetPoint';

export function setMiniDialog(title,child) {
    return {
        type: SET_MINI_DIALOG,
        payload: {title: title, child: child}
    }
}

export function showAddMiniDialog() {
    return async (dispatch) => {
        if(store.getState().table.name!=''){
            let child;
            if(store.getState().table.name=='Блог')
                child = <Blog/>
            else if(store.getState().table.name=='Машина')
                child = <Car/>
            else if(store.getState().table.name=='Реализатор')
                child = <Realizator/>
            else if(store.getState().table.name=='Точка')
                child = <Point/>
            else if(store.getState().table.name=='Регион')
                child = <Region/>
            else if(store.getState().table.name=='Организатор')
                child = <Organizator/>
            else if(store.getState().table.name=='Завсклада')
                child = <ZavSklad/>
            else if(store.getState().table.name=='Цена')
                child = <Price/>
            else if(store.getState().table.name=='FAQ')
                child = <FAQ/>
            dispatch ({
                type: SET_MINI_DIALOG,
                payload: {title: store.getState().table.name, child: child}
            })
            dispatch ({
                type: SHOW_MINI_DIALOG,
                payload: true
            })
        }
    }
}


export function showSelectRealizators() {
    return async (dispatch) => {
        let child = <Realizators/>
        dispatch ({
            type: SET_MINI_DIALOG,
            payload: {title: 'Реализатор', child: child}
        })
        dispatch ({
            type: SHOW_MINI_DIALOG,
            payload: true
        })
    }
}


export function showSelectRegion() {
    return async (dispatch) => {
        let child = <SetRegion/>
        dispatch ({
            type: SET_MINI_DIALOG,
            payload: {title: 'Регион', child: child}
        })
        dispatch ({
            type: SHOW_MINI_DIALOG,
            payload: true
        })
    }
}


export function showSelectPoint() {
    return async (dispatch) => {
        let child = <SetPoint/>
        dispatch ({
            type: SET_MINI_DIALOG,
            payload: {title: 'Точка', child: child}
        })
        dispatch ({
            type: SHOW_MINI_DIALOG,
            payload: true
        })
    }
}


export function showSelectStatistic() {
    return async (dispatch) => {
        let child = <Statistic/>
        dispatch ({
            type: SET_MINI_DIALOG,
            payload: {title: 'Статистика', child: child}
        })
        dispatch ({
            type: SHOW_MINI_DIALOG,
            payload: true
        })
    }
}


export function showDelete() {
    return async (dispatch) => {
        let child = <Delete/>
        dispatch ({
            type: SET_MINI_DIALOG,
            payload: {title: 'Удалить?', child: child}
        })
        dispatch ({
            type: SHOW_MINI_DIALOG,
            payload: true
        })
    }
}

export function showMiniDialog(show) {
    return {
        type: SHOW_MINI_DIALOG,
        payload: show
    }
}
