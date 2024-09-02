export interface UserType {
  Id: number,
  FirstName: string,
  LastName: string,
  Email: string,
  Phone: string,
  Address: string,
  City: string,
  State: string,
  Zip: string,
  Role: { Id?: number; Role: string } | null;
  ActivationStatus?: boolean
}