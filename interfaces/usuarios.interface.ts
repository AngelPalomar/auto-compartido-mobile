export default interface IUsuario {
    activo: boolean,
    apellidos: string,
    asegurado: boolean,
    fotoLicencia: string | null,
    idAuth: string,
    matricula: string | null,
    nombres: string,
    rol: 'admin' | 'conductor' | 'pasajero',
    vehiculo: {
        color: string,
        modelo: string,
        numeroPlaca: string
    } | null
}