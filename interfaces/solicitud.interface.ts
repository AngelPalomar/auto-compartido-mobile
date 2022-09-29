import IUsuario from "./usuario.interface";

export default interface ISolicitud {
    idDoc?: string,
    idAuthConductor: string,
    pasajero: Partial<IUsuario>,
    fechaHora: string,
    status: 'pendiente' | 'aceptada' | 'rechazada'
}