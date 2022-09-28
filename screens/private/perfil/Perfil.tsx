import React, { useState, useEffect } from 'react'
import { Avatar, Box, Center, ScrollView, VStack, Heading } from 'native-base'
import { collection, getFirestore, where, query, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import initFirebase from '../../../firebase/init';
import IUsuario from '../../../interfaces/usuario.interface';

export default function Perfil() {
    const db = getFirestore(initFirebase);
    const auth = getAuth(initFirebase);
    const usuariosRef = collection(db, "usuarios");
    const q = query(usuariosRef, where("idAuth", "==", auth.currentUser?.uid));
    const [usuario, setUsuario] = useState<Partial<IUsuario>>({});
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        getUsuarioDoc();
    }, [])


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

    return (
        <ScrollView>
            <VStack my={4}>
                <Center>
                    <Avatar size={'xl'} mb={2} />
                    <Heading fontWeight={'light'}>
                        {`${usuario.nombres?.trim()} ${usuario.apellidos?.trim()}`}
                    </Heading>
                </Center>
            </VStack>
        </ScrollView>
    )
}