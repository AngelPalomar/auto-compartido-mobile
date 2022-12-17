import { ScrollView, VStack, Heading, Box, Text, Center, Spinner } from 'native-base';
import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, query, where, onSnapshot } from 'firebase/firestore';

import initFirebase from '../../../firebase/init';
import IUsuario, { IRutaUsuarioInfo } from '../../../interfaces/usuario.interface';
import ConductorCard from '../../../components/conductor_card/ConductorCard';
import { RefreshControl, TouchableHighlight } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { getAuth } from 'firebase/auth';
import IRuta from '../../../interfaces/ruta.interface';

type Props = NativeStackScreenProps<RootStackParamList, 'PasajeroMenu'>;

export default function PasajeroMenu(props: Props) {

    const db = getFirestore(initFirebase);
    const auth = getAuth(initFirebase);
    const usuariosRef = collection(db, "usuarios");
    const q = query(usuariosRef, where("rol", "==", "conductor"), where('verificado', '==', true), where('rutaActiva', '==', true));
    const rutasRef = collection(db, "rutas");
    const [conductores, setConductores] = useState<IUsuario[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isRefreshing, setIsRefreshing] = useState(true);

    useEffect(() => {
        getConductoresDocs();
        setIsRefreshing(false);
    }, [isRefreshing]);

    useEffect(() => {
        console.log("Conductores", conductores);
    }, [conductores])

    const getConductoresDocs = () => {
        //Detiene recarga
        setIsRefreshing(false);

        onSnapshot(q, querySnapshot => {
            const condts: IUsuario[] = [];

            //Recorre todos los datos del firebase
            querySnapshot.forEach((doc) => {
                console.log("doc", doc.data());

                let c: IUsuario = { ...doc.data(), idDoc: doc.id } as IUsuario;

                //Si tiene ruta activa
                condts.push(c);
            });

            //Guarda los conductores
            setConductores(condts);

            //Detiene carga
            setIsLoading(false);
        });
    }

    if (isLoading) {
        return (
            <Center>
                <Spinner size={'lg'} mt={4} />
            </Center>
        )
    }

    return (
        <Box flex={1} bg={'white'}>
            <ScrollView refreshControl={
                <RefreshControl refreshing={isRefreshing} onRefresh={() => setIsRefreshing(true)} />
            }>
                <VStack mx={4} my={2}>
                    <Heading>Conductores compartidos</Heading>
                    <Text>
                        Lista de todos los conductores compartidos.
                    </Text>
                    <Box mt={4}>
                        {
                            conductores.length === 0 ?
                                <React.Fragment>
                                    <Center my={4}>
                                        <Heading fontWeight={'light'} textAlign={'center'} color={'lightBlue.500'}>
                                            No hay condcutores compartidos disponibles
                                        </Heading>
                                    </Center>
                                </React.Fragment> :
                                <React.Fragment>
                                    {
                                        conductores.map((value: IUsuario, index: number) => (
                                            <Box key={index} mb={4}>
                                                <TouchableHighlight
                                                    style={{ borderRadius: 10 }}
                                                    underlayColor={'rgba(0, 0, 0, 0.08)'}
                                                    onPress={() => props.navigation.navigate("VerConductor", { idDoc: value.idDoc, idAuth: value.idAuth })}>
                                                    <Box bg={'blue.100'} p={4} borderRadius={10}>
                                                        <ConductorCard conductor={value} />
                                                    </Box>
                                                </TouchableHighlight>
                                            </Box>
                                        ))}
                                </React.Fragment>
                        }
                    </Box>
                </VStack>
            </ScrollView>
        </Box>
    )
}