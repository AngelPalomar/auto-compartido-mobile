import IRuta from "./ruta.interface";

export default interface IViaje {
    idDoc?: string,
    fecha: string,
    ruta: IRuta,
    calificacion: 1 | 2 | 3 | 4 | 5
}