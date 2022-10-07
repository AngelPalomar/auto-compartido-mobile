import { ScrollView, VStack, Heading, Box, Text, Center, Spinner } from 'native-base';
import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, query, where, onSnapshot } from 'firebase/firestore';

import initFirebase from '../../../firebase/init';
import IUsuario from '../../../interfaces/usuario.interface';
import ConductorCard from '../../../components/conductor_card/ConductorCard';
import { RefreshControl, TouchableHighlight } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { getAuth } from 'firebase/auth';
import IRuta from '../../../interfaces/ruta.interface';

type Props = NativeStackScreenProps<RootStackParamList, 'PasajeroMenu'>;
type ConductorCard = {
    conductor: IUsuario,
    ruta: null | IRuta
}

export default function PasajeroMenu(props: Props) {

    const db = getFirestore(initFirebase);
    const auth = getAuth(initFirebase);
    const usuariosRef = collection(db, "usuarios");
    const q = query(usuariosRef, where("rol", "==", "conductor"), where('verificado', '==', true));
    const rutasRef = collection(db, "rutas");
    const [conductores, setConductores] = useState<ConductorCard[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        getConductoresDocs();
    }, [isLoading]);

    const getConductoresDocs = () => {
        onSnapshot(q, querySnapshot => {
            let condts: ConductorCard[] = [];

            querySnapshot.forEach((doc) => {
                let c: IUsuario = { ...doc.data(), idDoc: doc.id } as IUsuario;

                getRutaActual(c).then(resultRuta => {
                    condts.push({
                        conductor: c,
                        ruta: resultRuta
                    });

                    setConductores(condts);
                    setIsLoading(false);
                })
            });
        });
    }

    const getRutaActual = (condc: IUsuario): Promise<IRuta | null> => {
        let result = null;
        const qRuta = query(rutasRef, where('idAuthConductor', '==', condc.idAuth), where('activo', '==', true));

        result = getDocs(qRuta).then(qS => {
            let rts: IRuta[] = [];

            qS.forEach(doc => {
                rts.push(doc.data() as IRuta);
            })

            if (rts.length > 0)
                return rts[0];
            else
                return null;
        });

        return result;
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
                <RefreshControl refreshing={isLoading} onRefresh={() => setIsLoading(true)} />
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
                                        conductores.map((value: ConductorCard, index: number) => {
                                            if (value.ruta) {
                                                return (
                                                    <Box key={index} mb={4}>
                                                        <TouchableHighlight
                                                            style={{ borderRadius: 10 }}
                                                            underlayColor={'rgba(0, 0, 0, 0.08)'}
                                                            onPress={() => props.navigation.navigate("VerConductor", { idDoc: value.conductor.idDoc, idAuth: value.conductor.idAuth })}>
                                                            <Box bg={'blue.100'} p={4} borderRadius={10}>
                                                                <ConductorCard conductor={value.conductor} ruta={value.ruta} />
                                                            </Box>
                                                        </TouchableHighlight>
                                                    </Box>
                                                )
                                            } else {
                                                return (
                                                    <React.Fragment key={index}>
                                                        <Center my={4}>
                                                            <Heading fontWeight={'light'} textAlign={'center'} color={'lightBlue.500'}>
                                                                No hay conductores compartidos disponibles
                                                            </Heading>
                                                        </Center>
                                                    </React.Fragment>
                                                );
                                            }
                                        })}
                                </React.Fragment>
                        }
                    </Box>
                </VStack>
            </ScrollView>
        </Box>
    )
}