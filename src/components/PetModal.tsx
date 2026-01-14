import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Select, MenuItem, FormControl,
  InputLabel, IconButton, Box
} from '@mui/material';
import { Delete, Close } from '@mui/icons-material';
import { Patient } from '@/types/Patient';
import { patientSchema } from '@/validation/patient.schema';

interface PetModalProps {
  open: boolean;
  onClose: () => void;
  patient?: Patient;
  onSave: (data: any) => void;
  onDelete: (id: string) => void; // הוספנו כחובה
}

export default function PetModal({ open, onClose, patient, onSave, onDelete }: PetModalProps) {
  const [formData, setFormData] = useState({
    name: '', phone: '', petName: '', dateOfBirth: '', petType: 'dog' as 'dog' | 'cat' | 'parrot',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (patient && open) {
      setFormData({
        name: patient.name,
        phone: patient.phone,
        petName: patient.pet.name,
        dateOfBirth: new Date(patient.pet.dateOfBirth).toISOString().split('T')[0],
        petType: patient.pet.type,
      });
    } else {
      setFormData({ name: '', phone: '', petName: '', dateOfBirth: '', petType: 'dog' });
    }
    setErrors({});
  }, [patient, open]);

  const handleSave = () => {
    const result = patientSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach(issue => {
        if (issue.path[0]) fieldErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }
    onSave(result.data);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <span className="font-bold">{patient ? 'Edit Patient' : 'Add New Patient'}</span>
          <Box>
            {patient && (
              <IconButton color="error" onClick={() => onDelete(patient._id)} title="Delete Patient">
                <Delete />
              </IconButton>
            )}
            <IconButton onClick={onClose} size="small">
              <Close />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>
      
      <DialogContent dividers>
        <div className="flex flex-col gap-4 py-2">
          <TextField label="Owner Name" name="name" fullWidth size="small"
            value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
            error={!!errors.name} helperText={errors.name} />
          
          <TextField label="Phone Number" name="phone" fullWidth size="small"
            value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})}
            error={!!errors.phone} helperText={errors.phone} />

          <TextField label="Pet Name" name="petName" fullWidth size="small"
            value={formData.petName} onChange={(e) => setFormData({...formData, petName: e.target.value})}
            error={!!errors.petName} helperText={errors.petName} />

          <TextField label="Pet Date of Birth" type="date" fullWidth size="small"
            InputLabelProps={{ shrink: true }}
            value={formData.dateOfBirth} onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
            error={!!errors.dateOfBirth} helperText={errors.dateOfBirth} />

          <FormControl fullWidth size="small">
            <InputLabel>Pet Type</InputLabel>
            <Select label="Pet Type" value={formData.petType} 
              onChange={(e) => setFormData({...formData, petType: e.target.value as any})}>
              <MenuItem value="dog">Dog</MenuItem>
              <MenuItem value="cat">Cat</MenuItem>
              <MenuItem value="parrot">Parrot</MenuItem>
            </Select>
          </FormControl>
        </div>
      </DialogContent>

      <DialogActions sx={{ p: 2, justifyContent: 'center', gap: 2 }}>
        <Button onClick={onClose} variant="outlined" color="inherit" sx={{ borderRadius: '8px', flex: 1 }}>
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained" sx={{ borderRadius: '8px', flex: 1 }}>
          {patient ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
