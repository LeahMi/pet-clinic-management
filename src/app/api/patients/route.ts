import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Patient from '@/models/Patient';
import Pet from '@/models/Pet';
import { patientSchema } from '@/validation/patient.schema';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const typesParam = searchParams.get('types');
    const types = typesParam ? typesParam.split(',') : [];

    const skip = (page - 1) * limit;

    const pipeline: any[] = [
      {
        $lookup: {
          from: 'pets', 
          localField: 'pet',
          foreignField: '_id',
          as: 'pet'
        }
      },
      { $unwind: '$pet' },
      {
        $match: {
          $and: [
            types.length > 0 ? { 'pet.type': { $in: types } } : {},
            search ? {
              $or: [
                { name: { $regex: search, $options: 'i' } },
                { 'pet.name': { $regex: search, $options: 'i' } }
              ]
            } : {}
          ]
        }
      }
    ];

    const countResult = await Patient.aggregate([...pipeline, { $count: 'total' }]);
    // תיקון: גישה לאינדקס 0 של התוצאה
    const total = countResult.length > 0 ? countResult[0].total : 0;

    const data = await Patient.aggregate([
      ...pipeline,
      { $sort: { createdAt: -1 } }, 
      { $skip: skip },
      { $limit: limit }
    ]);

    return NextResponse.json({
      data,
      page,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: 'Failed to fetch patients' }, { status: 500 });
  }
}

// הוספת פונקציית ה-POST שחסרה ומחוללת את שגיאת 405
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();

    // וולידציה
    const result = patientSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues }, { status: 400 });
    }

    const data = result.data;

    // 1. יצירת חיה
    const pet = await Pet.create({
      name: data.petName,
      dateOfBirth: new Date(data.dateOfBirth),
      type: data.petType,
    });

    // 2. יצירת מטופל מקושר
    const patient = await Patient.create({
      name: data.name,
      phone: data.phone,
      pet: pet._id,
    });

    const populatedPatient = await Patient.findById(patient._id).populate('pet');
    return NextResponse.json(populatedPatient, { status: 201 });

  } catch (error: any) {
    console.error("POST API Error:", error);
    return NextResponse.json({ error: 'Failed to create patient' }, { status: 500 });
  }
}
