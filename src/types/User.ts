export interface User {
  id: string;
  accountId: number;
  name: string;
  birthdate: string;
  gender: string;
  bio: string;
  avatar: string;
  photos: string[];
  hobbyIds?: number[];
}
