import React from "react";

interface DataTableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement>{
    children : React.ReactNode;
}

// Column component (for HEADERS)
export default function DataTableCell({children, ...props}: DataTableCellProps){
    return(
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600" {...props}>
                {children}
        </td>
    );
}