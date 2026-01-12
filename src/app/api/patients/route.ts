import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Patient from '@/models/Patient';
import Pet from '@/models/Pet';
import { patientSchema } from '@/validation/patient.schema';
import { ZodError } from 'zod';


export async function GET() {
  try {
    await dbConnect();
    const patients = await Patient.find({}).populate('pet');
    return NextResponse.json(patients);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch patients' }, { status: 500 });
  }
}


export async function POST(request: NextRequest) {
   try {
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
    const pet = new Pet({
      name: data.petName,
      dateOfBirth: new Date(data.dateOfBirth),
      type: data.petType,
    });

    await pet.save();

    const patient = new Patient({
      name: data.name,
      phone: data.phone,
      pet: pet._id,
    });

    await patient.save();

    const populatedPatient = await Patient.findById(patient._id).populate('pet');
    return NextResponse.json(populatedPatient, { status: 201 });
  }catch(err){
    console.error('Error creating patient:', err);
    return NextResponse.json({ error: 'Failed to create patient' }, { status: 500 });
  }
}

