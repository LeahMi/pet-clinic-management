export interface Pet {
  _id: string;
  name: string;
  dateOfBirth: string;
  type: 'dog' | 'cat' | 'parrot';
  createdAt: string;
  updatedAt: string;
}