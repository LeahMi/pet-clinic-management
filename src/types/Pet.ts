export const PET_TYPES = ["dog", "cat", "parrot"] as const;

export type PetType = (typeof PET_TYPES)[number];

export interface Pet {
  _id: string;
  name: string;
  dateOfBirth: string;
  type: PetType;
  createdAt: string;
  updatedAt: string;
}
