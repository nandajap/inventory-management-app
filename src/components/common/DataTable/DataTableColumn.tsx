import React from "react";

interface DataTableColumnProps{
    children : React.ReactNode;
}

// Column component (for HEADERS)
export default function DataTableColumn({children}: DataTableColumnProps){
    return(
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            {children}
        </th>
    );
}