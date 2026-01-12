import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
} from '@mui/material';
import { Patient } from '@/types/Patient';
import { patientSchema } from '@/validation/patient.schema';
import { ZodError } from 'zod';
import { Delete } from '@mui/icons-material';


interface PetModalProps {
  open: boolean;
  onClose: () => void;
  patient?: Patient;
  onSave: (data: { name: string; phone: string; petName: string; dateOfBirth: string; petType: 'dog' | 'cat' | 'parrot' }) => void;
  onDelete?: (patientId: string) => void;
}

export default function PetModal({ open, onClose, patient, onSave, onDelete }: PetModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    petName: '',
    dateOfBirth: '',
    petType: 'dog' as 'dog' | 'cat' | 'parrot',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (patient) {
      setFormData({
        name: patient.name,
        phone: patient.phone,
        petName: patient.pet.name,
        dateOfBirth: new Date(patient.pet.dateOfBirth).toISOString().split('T')[0],
        petType: patient.pet.type,
      });
    } else {
      setFormData({
        name: '',
        phone: '',
        petName: '',
        dateOfBirth: '',
        petType: 'dog',
      });
    }
  }, [patient, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePetTypeChange = (e: any) => {
    setFormData({ ...formData, petType: e.target.value });
  };

  const handleSave = () => {
  const result = patientSchema.safeParse(formData);

  if (!result.success) {
    const fieldErrors: Record<string, string> = {};

    result.error.issues.forEach(issue => {
      const field = issue.path[0];
      if (field) {
        fieldErrors[field as string] = issue.message;
      }
    });

    setErrors(fieldErrors);
    return;
  }

  setErrors({});
  onSave(result.data);
};

 const handleDeleteClick = () => {
  if (patient && onDelete) {
    onDelete(patient._id); 
  }
};

  
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{
    className: 'mx-2 sm:mx-0'
  }}>
      <DialogTitle className="font-semibold" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {patient ? 'Edit Patient' : 'Add Patient'}
        {patient && onDelete && (
          <IconButton color="error" onClick={handleDeleteClick}>
            <Delete />
          </IconButton>
        )}
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="name"
          label="Name"
          type="text"
          fullWidth
          value={formData.name}
          onChange={handleChange}
          required
          error={!!errors.name}
          helperText={errors.name}
        />
        <TextField
          margin="dense"
          name="phone"
          label="Phone"
          type="tel"
          fullWidth
          value={formData.phone}
          onChange={handleChange}
          required
          error={!!errors.phone}
          helperText={errors.phone}
        />
        <TextField
          margin="dense"
          name="petName"
          label="Pet Name"
          type="text"
          fullWidth
          value={formData.petName}
          onChange={handleChange}
          required
          error={!!errors.petName}
          helperText={errors.petName}
        />
        <TextField
          margin="dense"
          name="dateOfBirth"
          label="Pet's Date of Birth"
          type="date"
          fullWidth
          value={formData.dateOfBirth}
          onChange={handleChange}
          required
          InputLabelProps={{
            shrink: true,
          }}
          error={!!errors.dateOfBirth}
          helperText={errors.dateOfBirth}
        />
        <FormControl fullWidth margin="dense">
          <InputLabel>Pet Type</InputLabel>
          <Select
            value={formData.petType}
            onChange={handlePetTypeChange}
            label="Pet Type"
            required
          >
            <MenuItem value="dog">Dog</MenuItem>
            <MenuItem value="cat">Cat</MenuItem>
            <MenuItem value="parrot">Parrot</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center">

        <Button variant='outlined' onClick={onClose}>
            Cancel
        </Button>

        <Button onClick={handleSave} variant="contained">
            {patient ? 'Save' : 'Add'}
        </Button>
      </DialogActions>

    </Dialog>
  );
}