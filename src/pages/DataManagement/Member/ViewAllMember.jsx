import {useState} from "react";
import {Button, makeStyles, Menu, MenuItem, SvgIcon} from "@material-ui/core";
import AddRounded from "@material-ui/icons/AddRounded";
import MoreIcon from "@material-ui/icons/MoreVert";
import EditIcon from "@material-ui/icons/Edit";
import ViewIcon from "@material-ui/icons/Visibility";

import {useHttp} from "hooks";
import {Container, IndexTable} from "components";
import {getMembers2} from "shared/services";
import {Member} from "shared/models";
import {MemberSchema} from "shared/utilities/dataGridSchema";

const useStyles = makeStyles(theme => ({
    moreBtn: {
        cursor: "pointer",
        "&:hover": {color: theme.palette.primary.dark}
    },
    actionIcon: {
        "& > :not(:last-child)": {
            marginRight: theme.spacing(1.5),
            fontSize: theme.spacing(2.5)
        }
    }
}));

const ViewAllMember = ({history}) => {
    const classes = useStyles();
    const {requestHandler} = useHttp();
    const [anchorElList, setAnchorElList] = useState([]);

    const renderActions = (row) => (<>
        <SvgIcon component={MoreIcon} className={classes.moreBtn} onClick={e => setAnchorElement(e, row.id)}/>
        <Menu
            anchorEl={anchorElList[row.id]}
            keepMounted
            open={Boolean(anchorElList[row.id])}
            onClose={() => clearAnchorElement(row.id)}
            getContentAnchorEl={null}
            anchorOrigin={{vertical: "bottom", horizontal: "left"}}
            transformOrigin={{vertical: "top", horizontal: "left"}}
        >
            <MenuItem onClick={() => editHandler(row)} className={classes.actionIcon}>
                <EditIcon color={"action"}/> Edit Member
            </MenuItem>
            <MenuItem onClick={() => viewHandler(row)} className={classes.actionIcon}>
                <ViewIcon color={"action"}/> View Member
            </MenuItem>
        </Menu>
    </>);

    const setAnchorElement = (e, index) => {
        e.stopPropagation();
        let newAnchorElList = [...anchorElList];
        newAnchorElList[index] = e.currentTarget;
        setAnchorElList(newAnchorElList);
    };

    const clearAnchorElement = (index) => {
        let newAnchorElList = [...anchorElList];
        newAnchorElList[index] = null;
        setAnchorElList(newAnchorElList);
    };

    const getMemberList = ({filter, per_page, page_no, sort}) => new Promise(async (resolve) => {
        const params = {
            filter, per_page, page_no, sort,
            include: 'driver_license,profile_picture,passport_attachments,id_card_attachment,' +
                'medical_attachments,national_id_attachment,pdp_attachment,vehicles'
        };
        try {
            const res = await requestHandler(getMembers2(params));
            const data = res.data;
            const count = res.meta.pagination.count;
            resolve({data, count});
        } catch (e) {
            console.error(e);
            resolve({data: [], count: 0});
        }
    });

    const onAddClick = () => history.push(`/member/new`, {data: {action: 'Add', member: new Member()}});

    const editHandler = (row) => row && row.id && history.push(`/member/edit`, {
        data: {action: 'Edit', member: new Member(row)}
    });

    const viewHandler = (row) => row && row.id && history.push(`/member/view`, {member: new Member(row)});

    return (
        <Container title="Team Management" actions={
            <Button variant="contained" color="primary" startIcon={<AddRounded/>} onClick={onAddClick}>
                Add Member
            </Button>
        }>
            <IndexTable
                columns={[
                    {
                        name: 'actions', header: '', defaultWidth: 60, textAlign: 'center',
                        render: ({data}) => renderActions(data)
                    },
                    ...MemberSchema.columns
                ]}
                defaultFilterValue={MemberSchema.filter}
                loadData={getMemberList}
            />
        </Container>
    );
};

export default ViewAllMember;
