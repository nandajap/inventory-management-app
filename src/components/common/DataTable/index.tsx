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
