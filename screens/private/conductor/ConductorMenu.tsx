import { ScrollView, VStack, Heading, Box, Text } from 'native-base';
import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';

import initFirebase from '../../../firebase/init';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ISolicitud from '../../../interfaces/solicitud.interface';
import SolicitudCard from '../../../components/solicitud_card/SolicitudCard';
import { getAuth } from 'firebase/auth';

type Props = NativeStackScreenProps<RootStackParamList, 'PasajeroMenu'>;

export default function ConductorMenu(props: Props) {
    const db = getFirestore(initFirebase);
    const auth = getAuth(initFirebase);
    const solicitudRef = collection(db, "solicitudes");
    const q = query(solicitudRef, where("idAuthConductor", "==", auth.currentUser?.uid));
    const [solicitudes, setSolicitudes] = useState<Array<ISolicitud>>([]);

    useEffect(() => {
        getSolicitudesDocs();
    }, []);

    const getSolicitudesDocs = () => {
        getDocs(q).then(querySnapshot => {
            let solc: Array<ISolicitud> = [];
            querySnapshot.forEach((doc) => {
                solc.push({ ...doc.data(), idDoc: doc.id } as ISolicitud);
            });

            setSolicitudes(solc);
        }).catch(err => {
            console.error(err);
        })
    }

    return (
        <ScrollView>
            <VStack mx={4} my={2}>
                <Heading>Solicitudes</Heading>
                <Text>
                    Se muestra una lista con las solicitudes de pasajeros que les
                    interesa tu ruta.
                </Text>
                <Box mt={4}>
                    {
                        solicitudes.map((value: ISolicitud, index: number) => (
                            <Box key={index} mb={4}>
                                <Box backgroundColor={'white'} p={4} borderRadius={10} shadow={'4'}>
                                    <SolicitudCard solicitud={value} />
                                </Box>
                            </Box>
                        ))
                    }
                </Box>
            </VStack>
        </ScrollView>
    )
}