import { SHOW_DRAWER, SET_PROFILE } from '../constants/app'

export function setProfile(profile) {
    return {
        type: SET_PROFILE,
        payload: profile
    }
}

export function showDrawer(show) {
    return {
        type: SHOW_DRAWER,
        payload: show
    }
}

