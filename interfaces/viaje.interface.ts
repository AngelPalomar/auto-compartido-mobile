import IRuta from "./ruta.interface";
import IUsuario from "./usuario.interface";

export default interface IViaje {
    idDoc?: string,
    fechaInicio: string,
    fechaFinal: string,
    ruta: IRuta,
    estado: 'curso' | 'terminado'
    pasajeros: Partial<IUsuario>
    calificacion: 1 | 2 | 3 | 4 | 5
}