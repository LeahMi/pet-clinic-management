import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
  Box,
} from "@mui/material";
import { Delete, Close } from "@mui/icons-material";
import { Patient } from "@/types/Patient";
import { patientSchema } from "@/validation/patient.schema";
import styles from "./PetModal.module.css";

interface PetModalProps {
  open: boolean;
  onClose: () => void;
  patient?: Patient;
  onSave: (data: any) => void;
  onDelete: (id: string) => void;
}

type PatientFormData = {
  name: string;
  phone: string;
  petName: string;
  dateOfBirth: string;
  petType: "dog" | "cat" | "parrot";
};

export default function PetModal({
  open,
  onClose,
  patient,
  onSave,
  onDelete,
}: PetModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      name: "",
      phone: "",
      petName: "",
      dateOfBirth: "",
      petType: "dog",
    },
  });

  useEffect(() => {
    if (open) {
      if (patient) {
        reset({
          name: patient.name,
          phone: patient.phone,
          petName: patient.pet.name,
          dateOfBirth: new Date(patient.pet.dateOfBirth)
            .toISOString()
            .split("T")[0],
          petType: patient.pet.type,
        });
      } else {
        reset({
          name: "",
          phone: "",
          petName: "",
          dateOfBirth: "",
          petType: "dog",
        });
      }
    }
  }, [patient, open, reset]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: { overflow: "hidden" },
      }}
    >
      <DialogTitle>
        <Box className={styles.titleWrapper}>
          <span className={styles.titleText}>
            {patient ? "Edit Patient" : "Add Patient"}
          </span>
          <Box>
            {patient && (
              <IconButton
                className={styles.deleteIcon}
                onClick={() => onDelete(patient._id)}
              >
                <Delete />
              </IconButton>
            )}
            <IconButton
              onClick={onClose}
              size="small"
              className={styles.closeIcon}
            >
              <Close />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSave)}>
        <DialogContent className={styles.content}>
          <div className={styles.fieldGroup}>
            <TextField
              {...register("name")}
              label="Owner Name"
              fullWidth
              size="small"
              className={styles.inputField}
              error={!!errors.name}
              helperText={errors.name?.message}
            />

            <TextField
              {...register("phone")}
              label="Phone Number"
              fullWidth
              size="small"
              className={styles.inputField}
              error={!!errors.phone}
              helperText={errors.phone?.message}
            />

            <TextField
              {...register("petName")}
              label="Pet Name"
              fullWidth
              size="small"
              className={styles.inputField}
              error={!!errors.petName}
              helperText={errors.petName?.message}
            />

            <TextField
              {...register("dateOfBirth")}
              label="Pet Birth Date"
              type="date"
              fullWidth
              size="small"
              InputLabelProps={{ shrink: true }}
              className={styles.inputField}
              error={!!errors.dateOfBirth}
              helperText={errors.dateOfBirth?.message}
            />

            <FormControl
              fullWidth
              size="small"
              className={styles.inputField}
              error={!!errors.petType}
            >
              <InputLabel>Pet Type</InputLabel>
              <Select
                {...register("petType")}
                label="Pet Type"
                defaultValue={patient?.pet?.type || "dog"}
              >
                <MenuItem value="dog">Dog</MenuItem>
                <MenuItem value="cat">Cat</MenuItem>
                <MenuItem value="parrot">Parrot</MenuItem>
              </Select>
              {errors.petType && (
                <p className={styles.errorText}>{errors.petType.message}</p>
              )}
            </FormControl>
          </div>
        </DialogContent>

        <DialogActions className={styles.actions}>
          <Button
            onClick={onClose}
            variant="outlined"
            className={styles.cancelBtn}
          >
            Cancel
          </Button>
          <Button type="submit" variant="contained" className={styles.saveBtn}>
            {patient ? "Save Changes" : "Add Patient"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
