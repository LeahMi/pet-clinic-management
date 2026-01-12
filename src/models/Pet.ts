import mongoose from 'mongoose';

const PetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  type: { type: String, required: true, enum: ['dog', 'cat', 'parrot'] },
}, {
  timestamps: true,
});

export default mongoose.models.Pet || mongoose.model('Pet', PetSchema);