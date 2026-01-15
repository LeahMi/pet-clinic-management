import React from "react";
import { IconButton } from "@mui/material";
import { Edit, Delete, Pets, Event, Phone } from "@mui/icons-material";
import { Patient } from "@/types/Patient";
import styles from "./PetMobileCard.module.css";

interface PetMobileCardProps {
  patient: Patient;
  onEdit: (patient: Patient) => void;
  onDelete: (id: string) => void;
}

export const PetMobileCard = ({
  patient,
  onEdit,
  onDelete,
}: PetMobileCardProps) => {
  return (
    <div className={styles.mobileCard}>
      <div className="flex justify-between items-start">
        <div className="space-y-2 text-left">
          <div className={styles.ownerName}>{patient.name}</div>

          <div className={styles.petName}>
            <Pets sx={{ fontSize: 16 }} />
            <span>{patient.pet.name}</span>
            <span className={styles.petBadge}>{patient.pet.type}</span>
          </div>

          <div className={styles.infoRow}>
            <Event sx={{ fontSize: 14 }} />
            <span>
              {new Date(patient.pet.dateOfBirth).toLocaleDateString("he-IL")}
            </span>
          </div>

          <div className={styles.infoRow}>
            <Phone sx={{ fontSize: 14 }} />
            <span>{patient.phone}</span>
          </div>
        </div>

        <div className={styles.actionGroup}>
          <IconButton
            size="small"
            onClick={() => onEdit(patient)}
            sx={{ color: "#BF9673" }}
          >
            <Edit fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => onDelete(patient._id)}
            sx={{ color: "#A6775B" }}
          >
            <Delete fontSize="small" />
          </IconButton>
        </div>
      </div>
    </div>
  );
};
