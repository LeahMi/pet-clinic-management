import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Patient from '@/models/Patient';
import Pet from '@/models/Pet';
import { patientSchema } from '@/validation/patient.schema';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await dbConnect();
    const patient = await Patient.findById(id).populate('pet');
    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }
    return NextResponse.json(patient);
  } catch (error) {
    console.error('Error fetching patient:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await dbConnect();

    const body = await request.json();

    const result = patientSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues },
        { status: 400 }
      );
    }
    const data = result.data;

    const patient = await Patient.findById(id).populate('pet');
    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    // עדכון patient
    patient.name = data.name;
    patient.phone = data.phone;
    await patient.save();

    // עדכון pet
    const pet = await Pet.findById(patient.pet._id);
    if (pet) {
      pet.name = data.petName;
      pet.dateOfBirth = new Date(data.dateOfBirth);
      pet.type = data.petType;
      await pet.save();
    }

    const updatedPatient = await Patient.findById(id).populate('pet');
    return NextResponse.json(updatedPatient);

  } catch (error) {
    console.error('Error updating patient:', error);
    return NextResponse.json({ error: 'Failed to update patient' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await dbConnect();
    const patient = await Patient.findById(id);
    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    // Delete the associated pet
    await Pet.findByIdAndDelete(patient.pet);

    // Delete the patient
    await Patient.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Patient and pet deleted successfully' });
  } catch (error) {
    console.error('Error deleting patient:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
