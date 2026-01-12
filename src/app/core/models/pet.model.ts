export interface Pet {
  id: string;
  name: string;
  breed: string;
  age: number;
  description: string;
  imageUrl: string;
  isAdopted: boolean;
  isApproved?: boolean;
  ownerId?: string | null;
  adoptionDate?: string | null;
  createdAt?: string | null;
}
