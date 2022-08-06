import { Role } from 'src/common/consts/enum';

export interface RegisterJwtPayload {
  phoneNumber: string;
}

export interface AccessJwtPayload {
  phoneNumber: string;
  name: string;
  id: number;
  role: Role;
}
