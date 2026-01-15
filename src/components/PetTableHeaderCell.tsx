import React from "react";
import { flexRender, Header } from "@tanstack/react-table";
import { IconButton, TextField } from "@mui/material";
import { FilterList } from "@mui/icons-material";
import { Patient } from "@/types/Patient";
import styles from "./PetTableHeaderCell.module.css";

interface HeaderCellProps {
  header: Header<Patient, unknown>;
  selectedTypes: string[];
  onFilterClick: (el: HTMLElement) => void;
  searchValue: string;
  onSearchChange: (val: string) => void;
}

export const PetTableHeaderCell = ({
  header,
  selectedTypes,
  onFilterClick,
  searchValue,
  onSearchChange,
}: HeaderCellProps) => {
  const col = header.column;
  const searchable = ["name", "pet.name"].includes(col.id);

  return (
    <div className={styles.headerContainer}>
      <div className={styles.titleRow}>
        {flexRender(col.columnDef.header, header.getContext())}
        {col.id === "pet.type" && (
          <IconButton
            size="small"
            onClick={(e) => onFilterClick(e.currentTarget)}
          >
            <FilterList
              fontSize="small"
              sx={{ color: selectedTypes.length > 0 ? "#265573" : "inherit" }}
            />
          </IconButton>
        )}
      </div>

      {searchable ? (
        <TextField
          size="small"
          placeholder={`Search ${col.id === "name" ? "owner" : "pet"}...`}
          className={styles.searchInput}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      ) : (
        <div className={styles.spacer} />
      )}
    </div>
  );
};
