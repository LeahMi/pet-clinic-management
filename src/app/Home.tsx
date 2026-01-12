'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, Typography } from '@mui/material';
import { Add } from '@mui/icons-material';
import PetTable from '@/components/PetTable';
import PetModal from '@/components/PetModal';
import { Patient } from '@/types/Patient';

const fetchPatients = async (): Promise<Patient[]> => {
  const res = await fetch('/api/patients');
  if (!res.ok) throw new Error('Failed to fetch patients');
  return res.json();
};

const addPatient = async (data: { name: string; phone: string; petName: string; dateOfBirth: string; petType: 'dog' | 'cat' | 'parrot' }): Promise<Patient> => {
  const res = await fetch('/api/patients', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to add patient');
  return res.json();
};

const editPatient = async ({ id, data }: { id: string; data: { name: string; phone: string; petName: string; dateOfBirth: string; petType: 'dog' | 'cat' | 'parrot' } }): Promise<Patient> => {
  const res = await fetch(`/api/patients/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorBody = await res.text();
    console.error(`Failed to edit patient. Status: ${res.status}, Body:`, errorBody);
    throw new Error(`Failed to edit patient: ${res.status}`);
  }
  return res.json();
};

const deletePatient = async (id: string): Promise<void> => {
  const res = await fetch(`/api/patients/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete patient');
};

export default function Home() {
  const queryClient = useQueryClient();
  const { data: patients, isLoading, error } = useQuery({ queryKey: ['patients'], queryFn: fetchPatients });
  const addMutation = useMutation({ 
    mutationFn: addPatient, 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      setModalOpen(false);
    },
    onError: (error) => console.error('Error adding patient:', error)
  });
  const editMutation = useMutation({ 
    mutationFn: editPatient, 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      setModalOpen(false);
      setEditingPatient(undefined);
    },
    onError: (error) => console.error('Error editing patient:', error)
  });
  const deleteMutation = useMutation({ 
    mutationFn: deletePatient, 
    onSuccess: () =>{
      queryClient.invalidateQueries({ queryKey: ['patients'] })
      setSnackbar({ open: true, message: 'Patient deleted successfully', severity: 'success' });
    },
    onError: (error) => {
      console.error('Error deleting patient:', error)
      setSnackbar({ open: true, message: 'Failed to delete patient', severity: 'error' });
    }
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | undefined>();
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);

  const handleAdd = () => {
    setEditingPatient(undefined);
    setModalOpen(true);
  };

  const handleEdit = (patient: Patient) => {
    setEditingPatient(patient);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
  const patient = patients?.find(p => p._id === id);
  if (!patient) return;

  setPatientToDelete(patient);
  setDeleteDialogOpen(true);
};

const handleConfirmDelete = () => {
  if (patientToDelete) {
    deleteMutation.mutate(patientToDelete._id);
    setDeleteDialogOpen(false);
    setModalOpen(false); 
  }
};


  const handleSave = (data: { name: string; phone: string; petName: string; dateOfBirth: string; petType: 'dog' | 'cat' | 'parrot' }) => {
    if (editingPatient) {
      editMutation.mutate({ id: editingPatient._id, data });
    } else {
      addMutation.mutate(data);
    }
  };
  
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };


  if (isLoading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4">Error loading patients</div>;

  return (
    <div className="p-4 md:p-8 min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Pet Clinic Management</h1>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAdd}
          sx={{
            backgroundColor: '#2563eb',
            fontWeight: 'bold',
            padding: '10px 20px',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            '&:hover': {
              boxShadow: '0 6px 8px rgba(0, 0, 0, 0.15)',
              backgroundColor: '#1d4ed8'
            }
          }}
        >
          Add Patient
        </Button>
      </div>
      <div className="mt-4">
        <PetTable data={patients || []} onEdit={handleEdit} onDelete={handleDelete} />
      </div>
      <PetModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        patient={editingPatient}
        onSave={handleSave}
        onDelete={handleDelete} 
      />
      <Dialog
  open={deleteDialogOpen}
  onClose={() => setDeleteDialogOpen(false)}
  maxWidth="xs"
  fullWidth
>
  <DialogTitle>Delete Patient</DialogTitle>
  <DialogContent>
    <Typography>
      Are you sure you want to delete <strong>{patientToDelete?.name}</strong>?<br />
      This action cannot be undone.
    </Typography>
  </DialogContent>
  <DialogActions sx={{ justifyContent: 'center', gap: 2 }}>
    <Button
      onClick={() => setDeleteDialogOpen(false)}
      variant="outlined"
      color="primary"
    >
      Cancel
    </Button>
    <Button
      onClick={handleConfirmDelete}
      variant="contained"
      color="error"
    >
      Delete
    </Button>
  </DialogActions>
</Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
