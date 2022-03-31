import {useCallback} from "react";
import {useDispatch} from "react-redux";

import {instance as axios} from "../../shared/services/config.service";
import {startSpinner, stopSpinner} from "../../store/actions/auth.actions";
import {clearNotification, setNotification} from "../../store/actions/config.actions";

const useHttp = () => {
    const dispatch = useDispatch();

    const notify = useCallback(({msg, ...rest}) => dispatch(setNotification({
        onClose: () => dispatch(clearNotification()),
        show: true,
        message: msg,
        ...rest
    })), []);

    const requestHandler = useCallback((config, options = {}) => new Promise((resolve, reject) => {
        const {loader} = options;
        loader && dispatch(startSpinner());
        axios(config).then(res => {
            loader && dispatch(stopSpinner());
            resolve(res);
        }).catch(error => {
            loader && dispatch(stopSpinner());
            console.error(error);
            reject(error);
        });
    }), []);

    return {requestHandler, notify};
};

export default useHttp;
