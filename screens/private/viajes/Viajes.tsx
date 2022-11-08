import { AntDesign } from '@expo/vector-icons';
import { getAuth } from 'firebase/auth';
import { collection, DocumentData, getDocs, getFirestore, onSnapshot, Query, query, updateDoc, where, doc, addDoc } from 'firebase/firestore';
import { Box, Button, Center, Heading, HStack, Icon, ScrollView, Spinner, Text, theme, useToast, VStack } from 'native-base';
import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import BadgeStatusRuta from '../../../components/badge_status_ruta/BadgeStatusRuta';
import HistorialViajes from '../../../components/historial_viajes/HistorialViajes';
import initFirebase from '../../../firebase/init';
import { UsuarioDocContext } from '../../../hooks/useUsuarioDocContext';
import IRuta from '../../../interfaces/ruta.interface';
import IUsuario from '../../../interfaces/usuario.interface';
import IViaje from '../../../interfaces/viaje.interface';

export default function Viajes() {
    const usuario = useContext(UsuarioDocContext);

    const db = getFirestore(initFirebase);
    const auth = getAuth(initFirebase);

    const usuariosRef = collection(db, 'usuarios');

    const [rutaActual, setRutaActual] = useState<Partial<IRuta> | null>(null);
    const [fechaInicio, setFechaInicio] = useState<string | null>(null);
    const rutasRef = collection(db, "rutas");

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isCambiandoStatusViaje, setIsCambiandoStatusViaje] = useState<boolean>(false);
    const toast = useToast();

    useEffect(() => {
        getRutaActual();
    }, [isLoading]);

    const getRutaActual = () => {
        let qRutaActual: Query<DocumentData> | null = null;

        if (usuario.rol === 'conductor') {
            qRutaActual = query(rutasRef, where("activo", "==", true), where("idAuthConductor", "==", usuario.idAuth));
        } else {
            qRutaActual = query(rutasRef, where("activo", "==", true), where("pasajeros", "array-contains", {
                nombres: usuario.nombres,
                apellidos: usuario.apellidos,
                idAuth: usuario.idAuth,
                telefono: usuario.telefono
            }));
        }

        onSnapshot(qRutaActual, querySnapshot => {
            let rts: IRuta[] = [];
            querySnapshot.forEach(doc => {
                rts.push({ ...doc.data(), idDoc: doc.id } as IRuta);
            })

            if (rts.length > 0) {
                setRutaActual(rts[0]);
                setIsLoading(false);
            } else {
                setRutaActual(null);
                setIsLoading(false);
            }
        });
    }

    const iniciarViaje = () => {
        const rutaRefViaje = doc(db, 'rutas', rutaActual?.idDoc as string);
        //Inicia carga
        setIsCambiandoStatusViaje(true);
        updateDoc(rutaRefViaje, {
            status: 'curso'
        }).then(() => {
            //Guarda la fecha de inicio
            setFechaInicio(new Date().toISOString());
            toast.show({ description: "Ruta en curso." })
            setIsCambiandoStatusViaje(false);
        }).catch(err => {
            toast.show({ description: "Ocurrió un error, vuelva a intentarlo." })
            setIsCambiandoStatusViaje(false);
        })
    }

    const terminarViaje = () => {
        const rutaRefViaje = doc(db, 'rutas', rutaActual?.idDoc as string);
        //Inicia carga
        setIsCambiandoStatusViaje(true);
        updateDoc(rutaRefViaje, {
            status: 'terminado'
        }).then(() => {
            //Guarda el historial del viaje
            const calfs: {
                idAuth: string,
                calificacion: null | 1 | 2 | 3 | 4 | 5
            }[] = [];

            rutaActual?.pasajeros?.forEach((v: Partial<IUsuario>) => {
                calfs.push({ idAuth: v.idAuth as string, calificacion: null });
            });

            const viaje: IViaje = {
                fechaInicio: fechaInicio as string,
                fechaFinal: new Date().toISOString(),
                calificacionesPasajeros: calfs,
                ruta: rutaActual as IRuta
            }

            addDoc(collection(db, 'viajes'), viaje).then(() => {
                toast.show({ description: "Ruta terminada" })
                setIsCambiandoStatusViaje(false);
            });
        }).catch(err => {
            toast.show({ description: "Ocurrió un error, vuelva a intentarlo." })
            setIsCambiandoStatusViaje(false);
        })
    }

    const desactivarRuta = () => {
        const rutaRefViaje = doc(db, 'rutas', rutaActual?.idDoc as string);
        //Inicia carga
        setIsCambiandoStatusViaje(true);
        updateDoc(rutaRefViaje, {
            activo: false,
            status: 'inactiva',
            pasajeros: []
        }).then(() => {
            toast.show({ description: "Ruta desactivada" })
            setIsCambiandoStatusViaje(false);
        }).catch(err => {
            toast.show({ description: "Ocurrió un error, vuelva a intentarlo." })
            setIsCambiandoStatusViaje(false);
        })
    }

    if (isLoading) {
        return (
            <SafeAreaView>
                <Center>
                    <Spinner size={'lg'} mt={4} />
                </Center>
            </SafeAreaView>
        )
    }

    return (
        <Box flex={1} bg={'white'}>
            <ScrollView>
                <VStack mx={4} my={2}>
                    <Heading>Viajes</Heading>
                    {
                        usuario?.rol === 'conductor' ?
                            <VStack my={2} bg={'blue.100'} p={4} rounded={'sm'}>
                                {
                                    !rutaActual ?
                                        <React.Fragment>
                                            <Heading fontWeight={'light'} mb={2}>
                                                No tienes una ruta activa
                                            </Heading>
                                            <Text color={'darkBlue.500'}>
                                                Activa una de tus rutas para recibir solicitudes e iniciar viajes.
                                            </Text>
                                        </React.Fragment> :
                                        <React.Fragment>
                                            <Heading fontWeight={'light'}>
                                                Ruta activa seleccionada
                                            </Heading>
                                            <HStack mb={4} alignItems={'center'} space={2}>
                                                <Text fontWeight={'light'}>
                                                    {rutaActual.lugarInicio?.trim()}
                                                </Text>
                                                <AntDesign name={'arrowright'} color={theme.colors.blue[500]} size={20} />
                                                <Text fontWeight={'light'}>
                                                    {rutaActual.lugarDestino?.trim()}
                                                </Text>
                                            </HStack>
                                            <Center mb={2} rounded={'md'}>
                                                <BadgeStatusRuta ruta={rutaActual as IRuta} />
                                            </Center>
                                            <Text color={'darkBlue.500'} mb={2}>
                                                Pasajeros
                                            </Text>
                                            {
                                                rutaActual.pasajeros?.length === 0 ?
                                                    <Text color={'gray.500'}>
                                                        No hay pasajeros
                                                    </Text> :
                                                    <Box>
                                                        {
                                                            rutaActual.pasajeros?.map((value: Partial<IUsuario>, index: number) => (
                                                                <HStack alignItems={'center'} space={3} key={index}>
                                                                    <AntDesign name={'user'} size={20} color={theme.colors.blue[500]} />
                                                                    <Text fontSize={'md'} color={'gray.500'}>
                                                                        {`${value.nombres?.trim()} ${value.apellidos?.trim()}`}
                                                                    </Text>
                                                                </HStack>
                                                            ))
                                                        }
                                                        {
                                                            rutaActual.status === 'preparacion' ?
                                                                <Button mt={4} colorScheme={'emerald'} size={'lg'} height={'16'} leftIcon={<Icon as={<AntDesign name='car' />} />} onPress={iniciarViaje} isLoading={isCambiandoStatusViaje}>
                                                                    INICIAR VIAJE
                                                                </Button> :
                                                                rutaActual.status === 'curso' ?
                                                                    <Button mt={4} colorScheme={'red'} size={'lg'} height={'16'} leftIcon={<Icon as={<AntDesign name='car' />} />} onPress={terminarViaje} isLoading={isCambiandoStatusViaje}>
                                                                        TERMINAR VIAJE
                                                                    </Button> :
                                                                    rutaActual.status === 'terminado' ?
                                                                        <Button mt={4} colorScheme={'blue'} size={'lg'} height={'16'} leftIcon={<Icon as={<AntDesign name='car' />} />} onPress={desactivarRuta} isLoading={isCambiandoStatusViaje}>
                                                                            DESACTIVAR RUTA
                                                                        </Button> : null
                                                        }
                                                    </Box>
                                            }
                                        </React.Fragment>
                                }
                            </VStack> :
                            <VStack my={2} bg={'blue.100'} p={4} rounded={'sm'}>
                                {
                                    !rutaActual ?
                                        <React.Fragment>
                                            <Heading fontWeight={'light'} mb={2}>
                                                No estás en una ruta
                                            </Heading>
                                            <Text color={'darkBlue.500'}>
                                                Envía una solicitud a un conductor para que te agrege a su ruta
                                            </Text>
                                        </React.Fragment> :
                                        <React.Fragment>
                                            <Heading fontWeight={'light'}>
                                                Estás en una ruta
                                            </Heading>
                                            <HStack mb={4} alignItems={'center'} space={2}>
                                                <Text fontWeight={'light'}>
                                                    {rutaActual.lugarInicio?.trim()}
                                                </Text>
                                                <AntDesign name={'arrowright'} color={theme.colors.blue[500]} size={20} />
                                                <Text fontWeight={'light'}>
                                                    {rutaActual.lugarDestino?.trim()}
                                                </Text>
                                            </HStack>
                                            <Center mb={2} rounded={'md'}>
                                                <BadgeStatusRuta ruta={rutaActual as IRuta} />
                                            </Center>
                                            <Text color={'darkBlue.500'} mb={2}>
                                                Conductor
                                            </Text>
                                            <HStack alignItems={'center'} space={3}>
                                                <AntDesign name={'car'} size={20} color={theme.colors.blue[500]} />
                                                <Text fontSize={'md'} color={'gray.500'}>
                                                    {`${rutaActual.conductor?.nombres?.trim()} ${rutaActual.conductor?.apellidos?.trim()}`}
                                                </Text>
                                            </HStack>
                                        </React.Fragment>
                                }
                            </VStack>
                    }
                    <Box mt={2}>
                        <HistorialViajes />
                    </Box>
                </VStack>
            </ScrollView>
        </Box>
    )
}