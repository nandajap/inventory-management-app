import React from "react";

interface DataTableBodyProps{
    children : React.ReactNode;
}

function DataTableBody({children}: DataTableBodyProps){
    return(
        <tbody className="bg-white divide-y divide-gray-200">
            {children}
        </tbody>
    );
}

export default DataTableBody;