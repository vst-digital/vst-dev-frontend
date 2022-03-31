import {SET_NOTIFICATION} from "./actionTypes";

export const setNotification = data => ({type: SET_NOTIFICATION, data});

export const clearNotification = () => ({
    type: SET_NOTIFICATION,
    data: {
        show: false,
        type: 'info',
        variant: 'filled',
        message: '',
        onClose: null,
        autoHideDuration: 5000,
        originVertical: 'bottom',
        originHorizontal: 'right'
    }
});
