import IPunto from "./punto.interface"

export default interface IRuta {
    activo: boolean,
    descripcion: string,
    estado: 'preparacion' | 'curso' | 'terminado'
    horaSalida: string,
    idUsuario: string,
    lugarDestino: string,
    lugarInicio: string,
    lugaresDisponibles: number,
    pasajeros: Array<string>,
    puntos: Array<IPunto>
}