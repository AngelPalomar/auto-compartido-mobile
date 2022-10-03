import IPunto from "./punto.interface"
import IUsuario from "./usuario.interface"

export default interface IRuta {
    idDoc?: string,
    activo: boolean,
    descripcion: string
    horaSalida: string,
    idAuthConductor: string,
    lugarDestino: string,
    lugarInicio: string,
    pasajeros: Partial<IUsuario>[],
    puntos: Array<IPunto>
}