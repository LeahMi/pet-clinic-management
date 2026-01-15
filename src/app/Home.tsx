"use client";

import { useState } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Pagination,
  CircularProgress,
  Box,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import PetTable from "@/components/PetTable";
import PetModal from "@/components/PetModal";
import { Patient } from "@/types/Patient";
import { usePatients } from "@/hooks/usePatients";
import styles from "./Home.module.css";

export default function Home() {
  const {
    patients,
    isLoading,
    error,
    totalPages,
    page,
    setPage,
    globalFilter,
    setGlobalFilter,
    filters,
    setFilters,
    types,
    setTypes,
    addPatient,
    editPatient,
    deletePatient,
  } = usePatients();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | undefined>();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);

  const showMsg = (message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleAdd = () => {
    setEditingPatient(undefined);
    setModalOpen(true);
  };

  const handleEdit = (patient: Patient) => {
    setEditingPatient(patient);
    setModalOpen(true);
  };

  const handleSave = (data: any) => {
    if (editingPatient) {
      editPatient(
        { id: editingPatient._id, data },
        {
          onSuccess: () => {
            showMsg("Patient updated successfully", "success");
            setModalOpen(false);
          },
          onError: () => showMsg("Failed to update patient", "error"),
        },
      );
    } else {
      addPatient(data, {
        onSuccess: () => {
          showMsg("Patient added successfully", "success");
          setModalOpen(false);
        },
        onError: () => showMsg("Failed to add patient", "error"),
      });
    }
  };

  const handleDeleteRequest = (id: string) => {
    const patient = patients.find((p: Patient) => p._id === id);
    if (patient) {
      setPatientToDelete(patient);
      setDeleteDialogOpen(true);
    }
  };

  const handleConfirmDelete = () => {
    if (patientToDelete) {
      deletePatient(patientToDelete._id, {
        onSuccess: () => {
          showMsg("Patient deleted successfully", "success");
          setDeleteDialogOpen(false);
          setModalOpen(false);
        },
        onError: () => showMsg("Failed to delete patient", "error"),
      });
    }
  };

  if (error)
    return (
      <div className="p-8 text-red-500 text-center font-bold italic">
        Error loading patients. Please check your connection.
      </div>
    );

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <span className={styles.titleAccent}>Management System</span>
          <h1 className={styles.title}>Pet Clinic</h1>
        </div>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAdd}
          className={styles.addButton}
        >
          Add Patient
        </Button>
      </header>

      {isLoading ? (
        <Box display="flex" justifyContent="center" py={15}>
          <CircularProgress sx={{ color: "#265573" }} size={60} thickness={5} />
        </Box>
      ) : (
        <>
          <PetTable
            data={patients}
            filters={filters}
            setFilters={setFilters}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            selectedTypes={types}
            setSelectedTypes={setTypes}
            onEdit={handleEdit}
            onDelete={handleDeleteRequest}
          />

          <div className={styles.paginationWrapper}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, v) => setPage(v)}
              color="primary"
              size="large"
              sx={{
                "& .Mui-selected": { backgroundColor: "#265573 !important" },
              }}
            />
          </div>
        </>
      )}

      <PetModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        patient={editingPatient}
        onSave={handleSave}
        onDelete={handleDeleteRequest}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          variant="filled"
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{
            width: "100%",
            borderRadius: "12px",
            fontWeight: 600,
            backgroundColor:
              snackbar.severity === "success"
                ? "var(--success-color)"
                : "var(--error-color)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        className={styles.deleteDialog}
      >
        <DialogTitle className={styles.deleteTitle}>Delete Patient</DialogTitle>
        <DialogContent sx={{ py: 1 }}>
          Are you sure you want to delete{" "}
          <strong>{patientToDelete?.name}</strong>?<br />
          <span style={{ fontSize: "0.85rem", color: "#64748b" }}>
            This action is permanent and cannot be undone.
          </span>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            variant="text"
            className={styles.cancelBtn}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            className={styles.confirmDeleteBtn}
          >
            Confirm Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
