import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useHistory} from 'react-router-dom';
import {CssBaseline, ThemeProvider} from '@material-ui/core';
import {MuiPickersUtilsProvider} from "@material-ui/pickers";
import {Chart} from 'react-chartjs-2';

import theme from './assets/muiTheme';
import GlobalStyles from './assets/GlobalStyles';
import {draw} from './mixins/chartjs';
import Routes from './routes/index';
import LocalizedDateFnsUtils from "./mixins/LocalizedDateFnsUtils";
import {MainLayout, MinimalLayout} from "./layouts";
import {Notification, Spinner} from "./components";
import {authCheckState} from "./store/actions/auth.actions";

Chart.helpers.extend(Chart.elements.Rectangle.prototype, {draw: draw});

const App = () => {
    const history = useHistory();
    const isAuthenticated = useSelector(store => store.auth.isAuthenticated);
    const isLoading = useSelector(store => store.auth.loading);
    const notification = useSelector(store => store.config.notification);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(authCheckState(history));
    }, [dispatch]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <GlobalStyles/>
            <MuiPickersUtilsProvider utils={LocalizedDateFnsUtils}>
                <>
                    <Spinner open={isLoading}/>
                    <Notification {...notification}/>
                    {isAuthenticated !== null && (
                        isAuthenticated ?
                            <MainLayout history={history}><Routes isAuthenticated={isAuthenticated}/></MainLayout> :
                            <MinimalLayout><Routes isAuthenticated={isAuthenticated}/></MinimalLayout>
                    )}
                </>
            </MuiPickersUtilsProvider>
        </ThemeProvider>
    );

};

export default App;
