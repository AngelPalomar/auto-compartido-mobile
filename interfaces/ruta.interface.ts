import IPunto from "./punto.interface"
import IUsuario from "./usuario.interface"

export default interface IRuta {
    idDoc?: string,
    activo: boolean,
    descripcion: string
    horaSalida: string,
    idAuthConductor: string,
    conductor: Partial<IUsuario>,
    lugarInicio: string,
    lugarDestino: string,
    pasajeros: Partial<IUsuario>[],
    puntos: Array<IPunto>,
    status: 'creada' | 'inactiva' | 'preparacion' | 'curso' | 'terminado'
}