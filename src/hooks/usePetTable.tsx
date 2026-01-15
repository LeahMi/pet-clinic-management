import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { IconButton } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { Patient } from "@/types/Patient";

export const usePetTable = (
  data: Patient[],
  onEdit: (p: Patient) => void,
  onDelete: (id: string) => void,
) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );

  const columns: ColumnDef<Patient>[] = React.useMemo(
    () => [
      { id: "name", accessorKey: "name", header: "Owner Name" },
      { id: "phone", accessorKey: "phone", header: "Phone" },
      { id: "pet.name", accessorKey: "pet.name", header: "Pet Name" },
      {
        id: "pet.dateOfBirth",
        accessorKey: "pet.dateOfBirth",
        header: "Pet DOB",
        cell: ({ getValue }) =>
          new Date(getValue() as string).toLocaleDateString(),
      },
      { id: "pet.type", accessorKey: "pet.type", header: "Pet Type" },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex gap-1">
            <IconButton size="small" onClick={() => onEdit(row.original)}>
              <Edit fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              color="error"
              onClick={() => onDelete(row.original._id)}
            >
              <Delete fontSize="small" />
            </IconButton>
          </div>
        ),
      },
    ],
    [onEdit, onDelete],
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return { table };
};
