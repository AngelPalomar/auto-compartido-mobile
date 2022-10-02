import IPunto from "./punto.interface"

export default interface IRuta {
    idDoc?: string,
    activo: boolean,
    descripcion: string,
    estado: 'creado' | 'preparacion' | 'curso' | 'terminado'
    horaSalida: string,
    idAuthConductor: string,
    lugarDestino: string,
    lugarInicio: string,
    pasajeros: Array<{
        idDoc: string,
        idAuth: string,
        nombres: string,
        apellidos: string,
    }>,
    puntos: Array<IPunto>
}