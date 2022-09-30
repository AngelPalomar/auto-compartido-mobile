type RootStackParamList = {
    IniciarSesion: undefined,
    RegistrarsePasajero: undefined,
    RegistrarseConductor: undefined,
    RegistrarVehiculo: {
        nombres: string,
        apellidos: string,
        correoElectronico: string,
        telefono: string,
        contrasena: string,
        confirmarContrasena: string,
        matricula: string | null
    },
    RegistrarLicencia: {
        nombres: string,
        apellidos: string,
        correoElectronico: string,
        telefono: string,
        contrasena: string,
        confirmarContrasena: string,
        matricula: string | null,
        modelo: string,
        color: string,
        numeroPlaca: string,
        asientosDisponibles: number,
        tipoVehiculo: 'automovil' | 'motocicleta'
    },
    Inicio: undefined,
    PasajeroMenu: undefined,
    VerConductor: {
        idDoc: string | undefined
    },
    ConductorMenu: undefined,
    CrearRuta: undefined,
    Viajes: undefined,
    Perfil: undefined
};