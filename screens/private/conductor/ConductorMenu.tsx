import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { getAuth } from 'firebase/auth';
import {
    collection, getFirestore, onSnapshot, query, where,
    updateDoc, doc, arrayUnion
} from 'firebase/firestore';
import { Box, Heading, ScrollView, Text, VStack, useToast } from 'native-base';
import React, { useEffect, useState } from 'react';
import SolicitudCard from '../../../components/solicitud_card/SolicitudCard';
import initFirebase from '../../../firebase/init';
import IRuta from '../../../interfaces/ruta.interface';
import ISolicitud from '../../../interfaces/solicitud.interface';
import IUsuario from '../../../interfaces/usuario.interface';

type Props = NativeStackScreenProps<RootStackParamList, 'PasajeroMenu'>;

export default function ConductorMenu(props: Props) {
    const db = getFirestore(initFirebase);
    const auth = getAuth(initFirebase);

    const rutasRef = collection(db, 'rutas');
    const qRutaActual = query(rutasRef, where("activo", "==", true), where("idAuthConductor", "==", auth.currentUser?.uid));
    const [rutaActual, setRutaActual] = useState<Partial<IRuta> | null>(null);

    const solicitudRef = collection(db, "solicitudes");
    const qSolicitud = query(solicitudRef, where("idAuthConductor", "==", auth.currentUser?.uid), where('status', '==', 'pendiente'));
    const [solicitudes, setSolicitudes] = useState<Array<ISolicitud>>([]);

    const toast = useToast();

    useEffect(() => {
        getSolicitudesDocs();
        getRutaActual();
    }, []);

    const getSolicitudesDocs = () => {
        onSnapshot(qSolicitud, querySnapshot => {
            let solc: Array<ISolicitud> = [];

            querySnapshot.forEach((doc) => {
                solc.push({ ...doc.data(), idDoc: doc.id } as ISolicitud);
            });

            setSolicitudes(solc);
        });
    }

    const getRutaActual = () => {
        onSnapshot(qRutaActual, querySnapshot => {
            let rts: IRuta[] = [];
            querySnapshot.forEach(doc => {
                rts.push({ ...doc.data(), idDoc: doc.id } as IRuta);
            })

            if (rts.length > 0)
                setRutaActual(rts[0]);
            else
                setRutaActual(null);
        });
    }

    //Función que acepta la solicitud y añade el pasajero a la ruta
    const aceptarRechazarSolicitud = (idDoc: string, status: 'aceptada' | 'rechazada', pasajero?: Partial<IUsuario>): void => {
        const solicitudRef = doc(db, 'solicitudes', idDoc);
        const rutaActualRef = doc(db, 'rutas', rutaActual?.idDoc as string);

        //Actualiza la solicitud
        updateDoc(solicitudRef, {
            status: status
        }).then(() => {
            if (status === 'aceptada') {
                //Añade el pasajero a la ruta
                updateDoc(rutaActualRef, {
                    pasajeros: arrayUnion(pasajero)
                })

                toast.show({ description: 'Solicitud aceptada.' });
            } else {
                toast.show({ description: 'Solicitud rechazada.' });
            }
        }).catch(err => {
            toast.show({ description: 'Ocurrió un error.' });
        });
    }

    return (
        <Box flex={1} bg={'white'}>
            <ScrollView>
                <VStack mx={4} my={2}>
                    <Heading>Solicitudes</Heading>
                    <Text>
                        Se muestra una lista con las solicitudes de pasajeros que les
                        interesa tu ruta.
                    </Text>
                    <Box mt={4}>
                        {
                            solicitudes.length === 0 ?
                                <VStack my={4}>
                                    <Heading color='blue.500' fontWeight={'light'} textAlign={'center'}>
                                        No hay solicitudes
                                    </Heading>
                                </VStack> :
                                <React.Fragment>
                                    {
                                        solicitudes.map((value: ISolicitud, index: number) => (
                                            <Box key={index} mb={4}>
                                                <Box bg={'blue.100'} p={4} borderRadius={10}>
                                                    <SolicitudCard
                                                        solicitud={value}
                                                        aceptar={() => aceptarRechazarSolicitud(value.idDoc as string, 'aceptada', value.pasajero)}
                                                        rechazar={() => aceptarRechazarSolicitud(value.idDoc as string, 'rechazada')}
                                                        rutaActiva={rutaActual !== null ? true : false} />
                                                </Box>
                                            </Box>
                                        ))
                                    }
                                </React.Fragment>
                        }
                    </Box>
                </VStack>
            </ScrollView>
        </Box>
    )
}