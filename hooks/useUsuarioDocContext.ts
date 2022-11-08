import React from 'react';
import IUsuario from '../interfaces/usuario.interface';

const UsuarioDocContext = React.createContext<Partial<IUsuario>>({});

export { UsuarioDocContext };