export interface RegisterJwtPayload {
  phoneNumber: string;
}

export interface AccessJwtPayload {
  phoneNumber: string;
  name: string;
  id: number;
}
