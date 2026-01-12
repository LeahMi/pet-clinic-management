import { Pet } from "./Pet";

export interface Patient {
  _id: string;
  name: string;
  phone: string;
  pet: Pet;
  createdAt: string;
  updatedAt: string;
}
