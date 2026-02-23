import React from "react";

interface DataTableProps{
    children: React.ReactNode;
}

export default function DataTableRoot({children}: DataTableProps){
    return(
        <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                {children}
            </table>
        </div>
    );
}