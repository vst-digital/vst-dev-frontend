import {useCallback, useLayoutEffect, useState} from "react";
import Paper from "@material-ui/core/Paper";

import ReactDataGrid from "@inovua/reactdatagrid-community";
import '@inovua/reactdatagrid-community/index.css';

import {computeHeight, getFilters} from "shared/utilities/common.util";

const DataGridTable = (
    {
        rowHeight = 44,
        adjustHeight = 176,
        columns = [],
        loadData = null,
        renderRowContextMenu,
        defaultFilterValue = [],
        setGridRef = null
    }
) => {
    const [height, setHeight] = useState(computeHeight(adjustHeight));

    const dataSource = useCallback(({skip, limit, sortInfo, filterValue}) => {
        const per_page = limit;
        const page_no = (skip / limit) + 1;
        const filter = filterValue ? getFilters(filterValue) : {};
        const sort = sortInfo ? (sortInfo.dir === 1 ? sortInfo.id : sortInfo.id + '.desc') : '';
        return loadData({filter, per_page, page_no, sort});
    }, []);

    useLayoutEffect(() => {
        const handleResize = () => setHeight(computeHeight(adjustHeight));
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <Paper elevation={2} style={{padding: 8}}>
            <ReactDataGrid
                idProperty="id"
                style={{border: 'none', height}}
                showZebraRows={false}
                rowHeight={rowHeight}
                columns={columns}
                dataSource={dataSource}
                pagination
                handle={setGridRef}
                showColumnMenuTool={false}
                showColumnMenuSortOptions={false}
                showColumnMenuLockOptions={false}
                showColumnMenuGroupOptions={false}
                renderRowContextMenu={renderRowContextMenu}
                defaultFilterValue={defaultFilterValue}
            />
        </Paper>
    );
};

export default DataGridTable;
