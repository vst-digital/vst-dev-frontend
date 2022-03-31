import {createStore, applyMiddleware, combineReducers} from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

import authReducer from './reducers/auth.reducer';
import configReducer from "./reducers/config.reducer";

const rootReducer = combineReducers({
    auth: authReducer,
    config: configReducer
});

let store = process.env.NODE_ENV === 'development' ?
    createStore(rootReducer, applyMiddleware(thunk, logger)) :
    createStore(rootReducer, applyMiddleware(thunk));

export default store;