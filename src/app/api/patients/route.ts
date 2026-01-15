import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/mongodb";
import Patient from "@/models/Patient";
import Pet from "@/models/Pet";
import { patientSchema } from "@/validation/patient.schema";

export async function POST(request: NextRequest) {
  await dbConnect();
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const body = await request.json();
    const result = patientSchema.safeParse(body);
    if (!result.success)
      return NextResponse.json({ error: result.error.issues }, { status: 400 });

    const data = result.data;

    const [pet] = await Pet.create(
      [
        {
          name: data.petName,
          dateOfBirth: new Date(data.dateOfBirth),
          type: data.petType,
        },
      ],
      { session },
    );

    const [patient] = await Patient.create(
      [
        {
          name: data.name,
          phone: data.phone,
          pet: pet._id,
        },
      ],
      { session },
    );

    await session.commitTransaction();

    const populated = await patient.populate("pet");
    return NextResponse.json(populated, { status: 201 });
  } catch (error) {
    await session.abortTransaction();
    return NextResponse.json(
      { error: "Failed to create patient" },
      { status: 500 },
    );
  } finally {
    session.endSession();
  }
}

export async function GET(request: NextRequest) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

  const search = searchParams.get("search") || "";
  const ownerName = searchParams.get("ownerName") || "";
  const petName = searchParams.get("petName") || "";
  const types = searchParams.get("types")?.split(",").filter(Boolean) || [];

  const skip = (page - 1) * limit;

  const result = await Patient.aggregate([
    {
      $lookup: {
        from: "pets",
        localField: "pet",
        foreignField: "_id",
        as: "pet",
      },
    },
    { $unwind: "$pet" },
    {
      $match: {
        $and: [
          types.length > 0 ? { "pet.type": { $in: types } } : {},

          search
            ? {
                $or: [
                  { name: { $regex: search, $options: "i" } },
                  { "pet.name": { $regex: search, $options: "i" } },
                ],
              }
            : {},

          ownerName ? { name: { $regex: ownerName, $options: "i" } } : {},
          petName ? { "pet.name": { $regex: petName, $options: "i" } } : {},
        ],
      },
    },
    {
      $facet: {
        metadata: [{ $count: "total" }],
        data: [
          { $sort: { createdAt: -1 } },
          { $skip: skip },
          { $limit: limit },
        ],
      },
    },
  ]);

  const total = result[0]?.metadata[0]?.total || 0;
  return NextResponse.json({
    data: result[0]?.data || [],
    page,
    total,
    totalPages: Math.ceil(total / limit),
  });
}
