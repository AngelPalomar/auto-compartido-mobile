import { getAuth } from 'firebase/auth';
import { collection, DocumentData, getDocs, getFirestore, onSnapshot, Query, query, where } from 'firebase/firestore'
import { Box, Heading, HStack, VStack, Text, theme, IconButton, Icon, Center, Spinner } from 'native-base'
import React, { useState, useEffect, useContext } from 'react'
import initFirebase from '../../firebase/init';
import IUsuario from '../../interfaces/usuario.interface';
import IViaje from '../../interfaces/viaje.interface';
import { AntDesign } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { es_DateName } from '../../utils/functions/dateFormat';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UsuarioDocContext } from '../../hooks/useUsuarioDocContext';

export default function HistorialViajes() {
    const usuario = useContext(UsuarioDocContext);

    const db = getFirestore(initFirebase);
    const auth = getAuth(initFirebase);
    const usuariosRef = collection(db, 'usuarios');

    const viajesRef = collection(db, 'viajes');
    const [viajes, setViajes] = useState<IViaje[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        getViajesDocs(usuario as IUsuario);
    }, [])

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
                    viajes?.length === 0 ?
                        <React.Fragment>
                            <Text color={'gray.500'}>No hay viajes</Text>
                        </React.Fragment> :
                        <React.Fragment>
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
                                                    <IconButton icon={<Icon as={MaterialIcons} name="sentiment-very-dissatisfied" color={'gray.500'} />} />
                                                    <IconButton icon={<Icon as={MaterialIcons} name="sentiment-dissatisfied" color={'gray.500'} />} />
                                                    <IconButton icon={<Icon as={MaterialIcons} name="sentiment-satisfied" color={'gray.500'} />} />
                                                    <IconButton icon={<Icon as={MaterialIcons} name="sentiment-satisfied-alt" color={'gray.500'} />} />
                                                    <IconButton icon={<Icon as={MaterialIcons} name="sentiment-very-satisfied" color={'gray.500'} />} />
                                                </HStack>
                                            )
                                        }
                                    </VStack>
                                ))
                            }
                        </React.Fragment>
                }
            </Box>
        </Box>
    )
}