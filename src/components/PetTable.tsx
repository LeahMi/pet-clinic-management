import React, { useState } from "react";
import { flexRender } from "@tanstack/react-table";
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  TextField,
  InputAdornment,
  IconButton,
  Box,
} from "@mui/material";
import { Search, FilterList } from "@mui/icons-material";
import { Patient } from "@/types/Patient";
import { usePetTable } from "@/hooks/usePetTable";
import { PetMobileCard } from "./PetMobileCard";
import { PetTypeFilter } from "./PetTypeFilter";
import { PetTableHeaderCell } from "./PetTableHeaderCell";
import styles from "./PetTable.module.css";

interface PetTableProps {
  data: Patient[];
  onEdit: (patient: Patient) => void;
  onDelete: (id: string) => void;
  filters: { ownerName: string; petName: string };
  setFilters: React.Dispatch<
    React.SetStateAction<{ ownerName: string; petName: string }>
  >;

  globalFilter: string;
  setGlobalFilter: (val: string) => void;
  selectedTypes: string[];
  setSelectedTypes: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function PetTable({
  data = [],
  onEdit,
  onDelete,
  filters = { ownerName: "", petName: "" },
  setFilters,
  globalFilter = "",
  setGlobalFilter,
  selectedTypes = [],
  setSelectedTypes,
}: PetTableProps) {
  const { table } = usePetTable(data, onEdit, onDelete);
  const [typeAnchor, setTypeAnchor] = useState<null | HTMLElement>(null);

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  return (
    <div className="w-full space-y-4">
      <Box className="md:hidden flex gap-2 items-center px-1">
        <TextField
          fullWidth
          size="small"
          placeholder="Search owner or pet..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search fontSize="small" sx={{ color: "#265573" }} />
              </InputAdornment>
            ),
            sx: { borderRadius: "14px", backgroundColor: "white" },
          }}
        />
        <IconButton
          onClick={(e) => setTypeAnchor(e.currentTarget)}
          sx={{
            p: "10px",
            backgroundColor: "white",
            border: "1px solid #CCD4D9",
            borderRadius: "12px",
          }}
        >
          <FilterList
            sx={{ color: selectedTypes.length > 0 ? "#265573" : "#011826" }}
          />
        </IconButton>
      </Box>

      <TableContainer
        component={Paper}
        className={`${styles.tableWrapper} hidden md:block`}
      >
        <Table stickyHeader>
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableCell key={header.id} className={styles.headerCell}>
                    <PetTableHeaderCell
                      header={header}
                      selectedTypes={selectedTypes}
                      onFilterClick={setTypeAnchor}
                      searchValue={
                        header.column.id === "name"
                          ? filters.ownerName
                          : filters.petName
                      }
                      onSearchChange={(val) => {
                        if (header.column.id === "name")
                          setFilters((prev) => ({ ...prev, ownerName: val }));
                        else if (header.column.id === "pet.name")
                          setFilters((prev) => ({ ...prev, petName: val }));
                      }}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className={styles.row}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} sx={{ verticalAlign: "top", pt: 2 }}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div className="md:hidden flex flex-col gap-2">
        {table.getRowModel().rows.map((row) => (
          <PetMobileCard
            key={row.id}
            patient={row.original}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      <PetTypeFilter
        anchor={typeAnchor}
        onClose={() => setTypeAnchor(null)}
        selectedTypes={selectedTypes}
        onToggle={toggleType}
      />
    </div>
  );
}
