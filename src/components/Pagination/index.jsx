import {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import IconButton from '@material-ui/core/IconButton';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';

import NavigateBeforeRounded from '@material-ui/icons/NavigateBeforeRounded';
import NavigateNextRounded from '@material-ui/icons/NavigateNextRounded';

const useStyle = makeStyles(theme => ({
    root: {
        display: 'flex',
        alignItems: 'center',
        '& > :not(:last-child)': {
            marginRight: theme.spacing(1)
        }
    },
    justify_start: {justifyContent: 'flex-start'},
    justify_center: {justifyContent: 'center'},
    justify_end: {justifyContent: 'flex-end'}
}));

const Pagination = ({page, recordPerPage, totalRecord, justify, onChange}) => {
    const classes = useStyle();

    const [state, setState] = useState({
        currPage: page,
        totalPage: 1,
        startIndex: 1,
        endIndex: 1
    });

    useEffect(() => {
        const totalPage = Math.ceil(totalRecord / recordPerPage);
        const currPage = page > totalPage ? totalPage : page;
        const {startIndex, endIndex} = getPageIndex(currPage)
        setState({...state, currPage, totalPage, startIndex, endIndex})
    }, [page]);

    const getPageIndex = (page) => {
        const startIndex = ((page-1) * recordPerPage) + 1;
        const computedEndIndex = (page * recordPerPage);
        const endIndex = computedEndIndex > totalRecord ? totalRecord : computedEndIndex;

        return {startIndex, endIndex};
    }

    const onPrev = () => {
        const currPageNo = (state.currPage > 1) ? state.currPage - 1 : state.currPage;
        onChange(currPageNo);
    }

    const onNext = () => {
        const currPageNo = (state.currPage < state.totalPage) ? state.currPage + 1 : state.currPage;
        onChange(currPageNo)
    }

    return (
        <div className={cn(classes.root, {
            [classes.justify_center]: !justify || justify === 'center',
            [classes.justify_start]: justify === 'start',
            [classes.justify_end]: justify === 'end'
        })}>
            <IconButton onClick={onPrev} disabled={state.currPage <= 1}>
                <NavigateBeforeRounded/>
            </IconButton>

            <Typography variant="body1">
                {state.startIndex} - {state.endIndex} of {totalRecord}
            </Typography>

            <IconButton onClick={onNext} disabled={state.endIndex === totalRecord}>
                <NavigateNextRounded/>
            </IconButton>
        </div>
    );
};

Pagination.propTypes = {
    page: PropTypes.number.isRequired,
    recordPerPage: PropTypes.number,
    totalRecord: PropTypes.number.isRequired,
    justify: PropTypes.oneOf(['start', 'end', 'center']),
    onChange: PropTypes.func.isRequired
}

Pagination.defaultProps = {
    recordPerPage: 10
}

export default Pagination;
