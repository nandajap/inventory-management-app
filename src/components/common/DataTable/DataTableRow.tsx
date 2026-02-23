import React from "react";

interface DataTableRowProps{
    children : React.ReactNode;
}

function DataTableRow({children}: DataTableRowProps){
    return(
        <tr className="hover:bg-gray-50 transition-colors">
            {children}
        </tr>
    );
}

export default DataTableRow;