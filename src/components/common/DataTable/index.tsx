/**
 * DataTable Component
 * 
 * A reusable compound component for displaying tabular data.
 * Supports sorting, pagination, and custom column rendering.
 * 
 * Usage:
 * <DataTable>
 *   <DataTable.Header>
 *     <DataTable.HeaderCell sortable onSort={...}>Name</DataTable.HeaderCell>
 *   </DataTable.Header>
 *   <DataTable.Row>
 *     <DataTable.Cell>John Doe</DataTable.Cell>
 *   </DataTable.Row>
 * </DataTable>
 */

import DataTableRoot from "./DataTableRoot";
import DataTableHeader from "./DataTableHeader";
import DataTableBody from "./DataTableBody";
import DataTableRow from "./DataTableRow";
import DataTableColumn from "./DataTableColumn";
import DataTableCell from "./DataTableCell";

const DataTable = Object.assign(DataTableRoot, {
    Header: DataTableHeader,
    Body: DataTableBody,
    Row: DataTableRow,
    Column: DataTableColumn,
    Cell: DataTableCell,
});

export default DataTable
