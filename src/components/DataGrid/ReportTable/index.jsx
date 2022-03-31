import {useLayoutEffect, useState} from "react";

import ReactDataGrid from "@inovua/reactdatagrid-community";
import '@inovua/reactdatagrid-community/index.css';

import {computeHeight} from "../../../shared/utilities/common.util";

const gridStyle = {borderRadius: '4px', overflow: 'hidden'};

const DataGridTable = (
    {
        rowHeight = 40,
        adjustHeight = 264,
        data = [],
        columns = [],
        showColumnMenuTool = false,
        setGridRef = null
    }
) => {
    const [height, setHeight] = useState(computeHeight(adjustHeight));

    useLayoutEffect(() => {
        const handleResize = () => {
            const maxHeight = computeHeight(adjustHeight);
            let dataLength = data.length || 0;
            let calcHeight = rowHeight * ((dataLength || 3) + 1);
            (calcHeight > maxHeight) && (calcHeight = maxHeight);
            setHeight(calcHeight);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [data]);

    return (
        <ReactDataGrid
            idProperty="id"
            style={{...gridStyle, height, minHeight: height}}
            rowHeight={rowHeight}
            columns={columns}
            dataSource={data}
            handle={setGridRef}
            showZebraRows={false}
            showColumnMenuTool={showColumnMenuTool}
            showColumnMenuSortOptions={false}
            showColumnMenuLockOptions={false}
            showColumnMenuGroupOptions={false}
        />
    );
};

export default DataGridTable;
