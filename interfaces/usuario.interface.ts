import IVehiculo from "./vehiculo.interface";

export default interface IUsuario {
    activo: boolean,
    apellidos: string,
    asegurado: boolean,
    fotoLicencia: string | null,
    idAuth: string,
    matricula: string | null,
    nombres: string,
    telefono: string,
    rol: 'admin' | 'conductor' | 'pasajero',
    vehiculo: IVehiculo | null
}