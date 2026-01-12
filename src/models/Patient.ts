import mongoose from 'mongoose';

const PatientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  pet: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet', required: true },
}, {
  timestamps: true,
});

export default mongoose.models.Patient || mongoose.model('Patient', PatientSchema);