import * as React from "react";
import { Avatar, Card, CardContent, Grid, makeStyles, Typography } from '@material-ui/core';
import { FeaturedPlayList } from '@material-ui/icons';
import { Button } from "@material-ui/core"
import {
    errorMessage,
    getProjectLabel,
    getFullName,
    getNumberRoundToOneDecimal,
    getOptionLabel,
    getSelectDataSource,
    hasError
} from "shared/utilities/common.util";
import { TextField, AsyncSelect } from "components";
import { useFormik } from "formik";
import { Project_Validation } from "shared/utilities/validationSchema.util";
import { Project } from "shared/models";
import { getProjects } from "shared/services";
import { useHttp } from "hooks";
import { useState } from "react";


const useStyles = makeStyles(theme => ({
    root: {
        height: '100%',
        boxShadow: theme.shadows[2]
    },
    content: {
        alignItems: 'center',
        display: 'flex'
    },
    title: { fontWeight: 700 },
    avatar: {
        backgroundColor: theme.palette.error.main,
        height: 56,
        width: 56
    },
    icon: {
        height: 32,
        width: 32
    },
    difference: {
        marginTop: theme.spacing(2),
        display: 'flex',
        alignItems: 'center'
    },
    differenceIcon: {
        color: theme.palette.error.dark
    },
    differenceValue: {
        color: theme.palette.error.dark,
        marginRight: theme.spacing(1)
    }
}));



const AvailableProject = ({ history, location }) => {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    let selected_project = {
        id: localStorage.getItem('project_id'),
        title: localStorage.getItem('project_title'),
        status: localStorage.getItem('project_status'),
        project_description: localStorage.getItem('project_description')
    }
    const project = new Project(selected_project);

    const { notify, requestHandler } = useHttp();

    const onProjectChange = (project_instance) => {
        localStorage.removeItem('project_id');
        localStorage.removeItem('project_title');
        localStorage.removeItem('project_status');
        localStorage.removeItem('project_description');
        localStorage.setItem('project_id', project_instance.id);
        localStorage.setItem('project_title', project_instance.title);
        localStorage.setItem('project_status', project_instance.status);
        localStorage.setItem('project_description', project_instance.project_description);
        history.push('/home');
    };

    const getProjectsList = () => new Promise((resolve, reject) => {
        const params = { per_page: 500, page_no: 1, sort: 'created_at.desc' };
        getSelectDataSource(requestHandler, getProjects(params))
            .then(res => resolve(res.data))
            .catch(error => reject(error));
    });

    const onConfirm = async () => {
        try {
            localStorage.setItem('project_id', values.id);
            history.push('/home');
        } catch (e) {
            notify({ msg: 'Not able to set this. Something went wrong!!', type: 'error' });
        }
    };

    const { values, touched, errors, handleChange, handleSubmit, setValues, setFieldError } = useFormik({
        initialValues: project,
        validationSchema: Project_Validation,
        onSubmit: onConfirm
    });



    return (
        <Card className={classes.root}>
            <CardContent>
                <Grid container justifyContent="space-between">
                    <Grid item>
                        <Typography className={classes.title} variant="h3" color="textSecondary" gutterBottom >
                            Projects
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Avatar className={classes.avatar}>
                            <FeaturedPlayList className={classes.icon} />
                        </Avatar>
                    </Grid>
                </Grid>
                <div className={classes.root}>
                    <AsyncSelect
                        id={"projects"}
                        getOptionLabel={getProjectLabel}
                        loadingMethod={getProjectsList}
                        value={values}
                        onChange={onProjectChange}
                    />
                </div>
            </CardContent>
        </Card>
    );
};

export default AvailableProject;