import IVehiculo from "./vehiculo.interface";

/**
 * Interfaz para mapear los datos del usuario
 */
export default interface IUsuario {
    idDoc?: string,
    activo: boolean,
    apellidos: string,
    asegurado: boolean,
    fotoLicencia: string | null,
    idAuth: string,
    matricula: string | null,
    nombres: string,
    telefono: string,
    rol: 'admin' | 'conductor' | 'pasajero',
    vehiculo: IVehiculo | null,
    verificado: boolean,
    rutaActiva?: boolean,
    rutaInfo?: IRutaUsuarioInfo | null
}

/**
 * Interfaz para mapear los datos principales de 
 * la ruta del conductor
 * 
 * Esta interfaz solo se usa para mostrar el texto
 * de la ruta en el componente ConductorCard.tsx
 */
export interface IRutaUsuarioInfo {
    lugarInicio: string,
    lugarDestino: string
    hora: string
}