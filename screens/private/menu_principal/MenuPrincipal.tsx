import { View, Text } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Center, Spinner } from 'native-base';
import { SafeAreaView } from 'react-native-safe-area-context'

import initFirebase from '../../../firebase/init';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

import IUsuario from '../../../interfaces/usuario.interface';
import Conductor from '../conductor/Conductor';
import Pasajero from '../pasajero/Pasajero';

export default function MenuPrincipal() {
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
                    <Spinner size={'lg'} />
                </Center>
            </SafeAreaView>
        );
    } else {
        if (usuario.rol === 'conductor') {
            return <Conductor />
        } else {
            return <Pasajero />
        }
    }
}