import { Patient } from "@/types/Patient";

export interface PatientsResponse {
  data: Patient[];
  page: number;
  total: number;
  totalPages: number;
}

export const fetchPatients = async (
  page: number,
  search = "",
  types: string[] = [],
  ownerName = "",
  petName = "",
) => {
  const params = new URLSearchParams({
    page: String(page),
    search: search,
    ownerName,
    petName,
    types: types.join(","),
  });
  const res = await fetch(`/api/patients?${params.toString()}`);
  return res.json();
};

export const addPatient = async (data: {
  name: string;
  phone: string;
  petName: string;
  dateOfBirth: string;
  petType: "dog" | "cat" | "parrot";
}): Promise<PatientsResponse> => {
  const res = await fetch("/api/patients", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to add patient");
  return res.json();
};

export const editPatient = async ({
  id,
  data,
}: {
  id: string;
  data: {
    name: string;
    phone: string;
    petName: string;
    dateOfBirth: string;
    petType: "dog" | "cat" | "parrot";
  };
}): Promise<Patient> => {
  const res = await fetch(`/api/patients/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorBody = await res.text();
    console.error(
      `Failed to edit patient. Status: ${res.status}, Body:`,
      errorBody,
    );
    throw new Error(`Failed to edit patient: ${res.status}`);
  }
  return res.json();
};

export const deletePatient = async (id: string): Promise<void> => {
  const res = await fetch(`/api/patients/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete patient");
};
