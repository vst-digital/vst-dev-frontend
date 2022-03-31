import {SET_NOTIFICATION} from "../actions/actionTypes";

const initialState = {
    notification: {
        show: false,
        type: 'info',
        variant: 'filled',
        message: '',
        onClose: null,
        autoHideDuration: 5000,
        originVertical: 'bottom',
        originHorizontal: 'right'
    }
};

const configReducer = (state = initialState, action) => {
    if(action.type === SET_NOTIFICATION) {
        return {...state, notification: {...state.notification, ...action.data}};
    } else {
        return state;
    }
};

export default configReducer;
