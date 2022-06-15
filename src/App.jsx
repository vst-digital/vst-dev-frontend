import { CssBaseline, ThemeProvider } from "@material-ui/core";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { useEffect } from "react";
import { Chart } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import GlobalStyles from "./assets/GlobalStyles";
import theme from "./assets/muiTheme";
import { Notification, Spinner } from "./components";
import { MainLayout, MinimalLayout } from "./layouts";
import { draw } from "./mixins/chartjs";
import LocalizedDateFnsUtils from "./mixins/LocalizedDateFnsUtils";
import Routes from "./routes/index";
import { authCheckState } from "./store/actions/auth.actions";

Chart.helpers.extend(Chart.elements.Rectangle.prototype, { draw: draw });

const App = () => {
  const history = useHistory();
  const isAuthenticated = useSelector((store) => store.auth.isAuthenticated);
  const isLoading = useSelector((store) => store.auth.loading);
  const notification = useSelector((store) => store.config.notification);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(authCheckState(history));
  }, [dispatch]);

  // // Adding event listener on tab close event
  // useEffect(() => {
  //   window.addEventListener("beforeunload", alertUser);
  //   window.addEventListener("unload", handleTabClosing);

  //   // Removing event listener on tab close
  //   return () => {
  //     window.removeEventListener("beforeunload", alertUser);
  //     window.removeEventListener("unload", handleTabClosing);
  //   };
  // });

  // const handleTabClosing = () => {
  //   dispatch(authLogout());
  // };

  // const alertUser = (event) => {
  //   event.preventDefault();
  //   event.returnValue = "If you close the tab, you will log out!!";
  // };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles />
      <MuiPickersUtilsProvider utils={LocalizedDateFnsUtils}>
        <>
          <Spinner open={isLoading} />
          <Notification {...notification} />
          {isAuthenticated !== null &&
            (isAuthenticated ? (
              <MainLayout history={history}>
                <Routes isAuthenticated={isAuthenticated} />
              </MainLayout>
            ) : (
              <MinimalLayout>
                <Routes isAuthenticated={isAuthenticated} />
              </MinimalLayout>
            ))}
        </>
      </MuiPickersUtilsProvider>
    </ThemeProvider>
  );
};

export default App;
