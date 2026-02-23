import React from "react";

interface DataTableHeaderProps {
    children: React.ReactNode;
}

export default function DataTableHeader({children}: DataTableHeaderProps) {

    return (
            <thead className="bg-gray-50">
                <tr>
                    {children}
                </tr>
            </thead>
    );
}