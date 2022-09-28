import React, { useState, useEffect } from 'react';
import { theme } from 'native-base';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Center, Spinner } from 'native-base';
import { SafeAreaView } from 'react-native-safe-area-context'

import initFirebase from '../../../firebase/init';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

import IUsuario from '../../../interfaces/usuario.interface';
import PasajeroMenu from '../pasajero/PasajeroMenu';
import Perfil from '../perfil/Perfil';
import ConductorMenu from '../conductor/ConductorMenu';
import Viajes from '../viajes/Viajes';

const Tab = createBottomTabNavigator<RootStackParamList>();

const Inicio = () => {
    const db = getFirestore(initFirebase);
    const auth = getAuth(initFirebase);
    const usuariosRef = collection(db, "usuarios");
    const q = query(usuariosRef, where("idAuth", "==", auth.currentUser?.uid));
    const [usuario, setUsuario] = useState<Partial<IUsuario>>({});
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        getUsuarioDoc();
    }, []);

    const getUsuarioDoc = () => {
        getDocs(q).then(querySnapshot => {
            querySnapshot.forEach(doc => {
                setUsuario(doc.data() as IUsuario);
                setIsLoading(false);
            })
        }).catch(err => {
            console.error(err);
            setIsLoading(false);
        })
    }

    if (isLoading) {
        return (
            <SafeAreaView>
                <Center>
                    <Spinner size={'lg'} mt={4} />
                </Center>
            </SafeAreaView>
        );
    }

    return (
        <Tab.Navigator>
            {
                usuario.rol === 'conductor' ?
                    <Tab.Screen name='ConductorMenu' component={ConductorMenu} options={{
                        title: 'Menú',
                        headerStyle: {
                            backgroundColor: theme.colors.cyan[500]
                        },
                        headerTintColor: '#FFFFFF'
                    }} />
                    : usuario.rol === 'pasajero' ?
                        <Tab.Screen name='PasajeroMenu' component={PasajeroMenu} options={{
                            title: 'Menú',
                            headerStyle: {
                                backgroundColor: theme.colors.darkBlue[800]
                            },
                            headerTintColor: '#FFFFFF'
                        }} /> : null
            }
            <Tab.Screen name='Viajes' component={Viajes} options={{
                title: 'Mis viajes',
                headerStyle: {
                    backgroundColor: theme.colors.darkBlue[500]
                },
                headerTintColor: '#FFFFFF'
            }} />
            <Tab.Screen name='Perfil' component={Perfil} options={{
                title: 'Mi perfil',
                headerStyle: {
                    backgroundColor: theme.colors.darkBlue[500]
                },
                headerTintColor: '#FFFFFF'
            }} />
        </Tab.Navigator>
    )
}

export default Inicio