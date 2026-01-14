'use client';

import React, { useState } from 'react';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, Pagination, CircularProgress, Box } from '@mui/material';
import { Add } from '@mui/icons-material';
import PetTable from '@/components/PetTable';
import PetModal from '@/components/PetModal';
import { Patient } from '@/types/Patient';
import { usePatients } from '../hooks/usePatients';

export default function Home() {
  const { 
    patients, isLoading, error, totalPages, page, setPage, 
    search, setSearch, types, setTypes,
    addPatient, editPatient, deletePatient 
  } = usePatients();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | undefined>();
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);

  const showMsg = (message: string, severity: 'success' | 'error') => {
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
      editPatient({ id: editingPatient._id, data }, {
        onSuccess: () => {
          showMsg('Patient updated successfully', 'success');
          setModalOpen(false);
        },
        onError: () => showMsg('Failed to update patient', 'error')
      });
    } else {
      addPatient(data, {
        onSuccess: () => {
          showMsg('Patient added successfully', 'success');
          setModalOpen(false);
        },
        onError: () => showMsg('Failed to add patient', 'error')
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
          showMsg('Patient deleted successfully', 'success');
          setDeleteDialogOpen(false);
          setModalOpen(false); // סוגר את המודאל אם המחיקה בוצעה מתוכו
        },
        onError: () => showMsg('Failed to delete patient', 'error')
      });
    }
  };

  if (error) return <div className="p-8 text-red-500 text-center font-bold">Error loading patients. Please try again.</div>;

  return (
    <div className="p-4 md:p-8 min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Pet Clinic</h1>
        <Button variant="contained" startIcon={<Add />} onClick={handleAdd}>
          Add Patient
        </Button>
      </div>

      {isLoading ? (
        <Box display="flex" justifyContent="center" py={10}><CircularProgress /></Box>
      ) : (
        <>
          <PetTable 
            data={patients} 
            onEdit={handleEdit} 
            onDelete={handleDeleteRequest}
            globalFilter={search}
            setGlobalFilter={setSearch}
            selectedTypes={types}
            setSelectedTypes={setTypes}
          />

          <div className="flex justify-center mt-8 pb-10">
            <Pagination 
              count={totalPages} 
              page={page} 
              onChange={(_, v) => setPage(v)} 
              color="primary" 
              size="large"
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

      {/* הודעות אישור/שגיאה */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert variant="filled" severity={snackbar.severity} sx={{ width: '100%' }} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* דיאלוג אישור מחיקה */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle className="font-bold">Delete Patient</DialogTitle>
        <DialogContent>
          Are you sure you want to delete <strong>{patientToDelete?.name}</strong>?<br/>
          This action cannot be undone.
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} variant="outlined">Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
