import DataTable from "react-data-table-component";
import { DraggableDataTableProps } from "../../../../../types/FacilityTypes";
import { useState } from "react";

const DraggableDataTable = ({ columns, data, onRowDrop }: DraggableDataTableProps) => {
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const handleDragStart = (index: number) => {
        setDraggedIndex(index);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
    };

    const handleDrop = (index: number) => {
        if (draggedIndex !== null) {
            onRowDrop(draggedIndex, index);
            setDraggedIndex(null);
        }
    };

    return (
        <DataTable
            columns={columns.map((column: any) => ({
                ...column,
                cell: (row: any, index: number) => (
                    <div
                        draggable
                        onDragStart={() => handleDragStart(index)}
                        onDragEnd={handleDragEnd}
                        onDrop={() => handleDrop(index)}
                    >
                        {column.cell(row)}
                    </div>
                ),
            }))}
            data={data}
        />
    );
};

export default DraggableDataTable;