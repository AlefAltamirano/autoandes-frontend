export interface ErrorResponse {
  mensaje: string;
  campos?: { [key: string]: string };
}
