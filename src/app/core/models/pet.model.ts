export interface Pet {
  id: string;
  name: string;
  breed: string;
  age: number;
  description: string;
  imageUrl: string;
  isAdopted: boolean;
  species?: string;
  isApproved?: boolean;
  ownerId?: string | null;
  ownerPhone?: string | null;
  user?: {
    phone?: string | null;
  };
  adoptionDate?: string | null;
  createdAt?: string | null;
}
