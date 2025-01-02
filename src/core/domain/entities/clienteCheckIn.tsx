export interface IClienteCheckIn {
  clienteID?: number;
  dataCheckIn?: Date;
  dataCheckOut?: Date;
  checkInLatitude?: number;
  checkInLongitude?: number;
  checkOutLatitude?: number;
  checkOutLongitude?: number;
  ordemServico?: number;
}