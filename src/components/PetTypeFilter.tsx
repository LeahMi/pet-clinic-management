import React from "react";
import { Popover, FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import { PET_TYPES } from "@/types/Pet";
import styles from "./PetTypeFilter.module.css";

interface PetTypeFilterProps {
  anchor: HTMLElement | null;
  onClose: () => void;
  selectedTypes: string[];
  onToggle: (type: string) => void;
}

export const PetTypeFilter = ({
  anchor,
  onClose,
  selectedTypes,
  onToggle,
}: PetTypeFilterProps) => (
  <Popover
    open={Boolean(anchor)}
    anchorEl={anchor}
    onClose={onClose}
    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    PaperProps={{ className: styles.popoverPaper }}
  >
    <div className={styles.filterTitle}>Filter by Pet Type</div>
    <FormGroup>
      {PET_TYPES.map((type) => (
        <FormControlLabel
          key={type}
          control={
            <Checkbox
              size="small"
              checked={selectedTypes.includes(type)}
              onChange={() => onToggle(type)}
              className={styles.checkboxRoot}
            />
          }
          label={<span className={styles.labelSpan}>{type}</span>}
        />
      ))}
    </FormGroup>
  </Popover>
);
