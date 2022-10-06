import { getAuth } from 'firebase/auth';
import { collection, DocumentData, getDocs, getFirestore, onSnapshot, Query, query, where } from 'firebase/firestore'
import { Box, Heading, HStack, VStack, Text, theme, IconButton, Icon, Center, Spinner } from 'native-base'
import React, { useState, useEffect } from 'react'
import initFirebase from '../../firebase/init';
import IUsuario from '../../interfaces/usuario.interface';
import IViaje from '../../interfaces/viaje.interface';
import { AntDesign } from '@expo/vector-icons';
import { es_DateName } from '../../utils/functions/dateFormat';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HistorialViajes() {
    const db = getFirestore(initFirebase);
    const auth = getAuth(initFirebase);
    const usuariosRef = collection(db, 'usuarios');
    const [usuario, setUsuario] = useState<IUsuario | null>(null);

    const viajesRef = collection(db, 'viajes');
    const [viajes, setViajes] = useState<IViaje[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        getUsuarioDoc();
    }, [])


    const getUsuarioDoc = () => {
        const qUsuario = query(usuariosRef, where("idAuth", "==", auth.currentUser?.uid));
        getDocs(qUsuario).then(querySnapshot => {
            querySnapshot.forEach(doc => {
                const dataUsuario: IUsuario = doc.data() as IUsuario;
                setUsuario(dataUsuario);
                getViajesDocs(dataUsuario);
            })
        }).catch(err => {
            console.error(err);
            setIsLoading(false);
        })
    }

    const getViajesDocs = (usuarioData: IUsuario) => {
        let qViajes: Query<DocumentData> | null = null;

        if (usuarioData.rol === 'conductor') {
            qViajes = query(viajesRef, where("ruta.idAuthConductor", "==", auth.currentUser?.uid));
        } else {
            qViajes = query(viajesRef, where("ruta.pasajeros", "array-contains", {
                nombres: usuarioData.nombres,
                apellidos: usuarioData.apellidos,
                idAuth: auth.currentUser?.uid,
                telefono: usuarioData.telefono
            }));
        }

        onSnapshot(qViajes, querySnapshot => {
            let vjs: IViaje[] = [];

            querySnapshot.forEach(doc => {
                vjs.push({ ...doc.data(), idDoc: doc.id } as IViaje);
            });

            if (vjs.length > 0) {
                setViajes(vjs);
                setIsLoading(false);
            } else {
                setViajes(null);
                setIsLoading(false);
            }
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
        <Box>
            <Heading fontWeight={'light'} size={'md'} mb={2}>
                Historial de viajes
            </Heading>
            <Box>
                {
                    viajes?.map((value: IViaje, index: number) => (
                        <VStack key={index} mb={2} bg={'gray.100'} p={2} rounded={'sm'}>
                            <VStack>
                                <HStack alignItems={'center'} space={2}>
                                    <Text fontSize={'lg'}>{value.ruta.lugarInicio}</Text>
                                    <AntDesign name={'arrowright'} size={20} color={theme.colors.blue[500]} />
                                    <Text fontSize={'lg'}>{value.ruta.lugarDestino}</Text>
                                </HStack>
                                <VStack>
                                    {
                                        usuario?.rol === 'pasajero' && (
                                            <HStack alignItems={'center'} mb={1}>
                                                <AntDesign name={'car'} size={12} color={theme.colors.gray[500]} />
                                                <Text fontSize={'xs'} ml={1}>Conductor: </Text>
                                                <Text fontSize={'xs'} bold>{`${value.ruta.conductor.nombres?.trim()} ${value.ruta.conductor.apellidos?.trim()}`}</Text>
                                            </HStack>
                                        )
                                    }
                                    <HStack alignItems={'center'}>
                                        <AntDesign name={'clockcircle'} size={12} color={theme.colors.gray[500]} />
                                        <Text fontSize={'xs'} ml={1}>Fecha y hora de inicio: </Text>
                                        <Text fontSize={'xs'} bold>{es_DateName(new Date(value.fechaInicio))}</Text>
                                    </HStack>
                                    <HStack alignItems={'center'}>
                                        <AntDesign name={'clockcircle'} size={12} color={theme.colors.gray[500]} />
                                        <Text fontSize={'xs'} ml={1}>Fecha y hora de llegada: </Text>
                                        <Text fontSize={'xs'} bold>{es_DateName(new Date(value.fechaFinal))}</Text>
                                    </HStack>
                                </VStack>
                            </VStack>
                            {
                                usuario?.rol === 'pasajero' && (
                                    <HStack justifyContent={'center'}>
                                        <IconButton icon={<Icon as={AntDesign} name="star" color={'yellow.500'} />} _hover={{ bg: "yellow.600:alpha20" }} />
                                        <IconButton icon={<Icon as={AntDesign} name="star" color={'yellow.500'} />} _hover={{ bg: "yellow.600:alpha20" }} />
                                        <IconButton icon={<Icon as={AntDesign} name="star" color={'yellow.500'} />} _hover={{ bg: "yellow.600:alpha20" }} />
                                        <IconButton icon={<Icon as={AntDesign} name="star" color={'yellow.500'} />} _hover={{ bg: "yellow.600:alpha20" }} />
                                        <IconButton icon={<Icon as={AntDesign} name="star" color={'yellow.500'} />} _hover={{ bg: "yellow.600:alpha20" }} />
                                    </HStack>
                                )
                            }
                        </VStack>
                    ))
                }
            </Box>
        </Box>
    )
}