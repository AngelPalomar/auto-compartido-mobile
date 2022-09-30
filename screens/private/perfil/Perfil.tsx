import React, { useState, useEffect } from 'react'
import {
    Avatar, Box, Center, ScrollView, VStack, Heading, Spinner, Button, Text,
    useToast, useColorMode, HStack, Switch, Icon
} from 'native-base'
import { collection, getFirestore, where, query, getDocs } from 'firebase/firestore';
import { getAuth, signOut } from 'firebase/auth';
import initFirebase from '../../../firebase/init';
import IUsuario from '../../../interfaces/usuario.interface';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AntDesign } from '@expo/vector-icons';

type Props = NativeStackScreenProps<RootStackParamList, 'Perfil'>;

export default function Perfil(props: Props) {
    const db = getFirestore(initFirebase);
    const auth = getAuth(initFirebase);
    const usuariosRef = collection(db, "usuarios");
    const q = query(usuariosRef, where("idAuth", "==", auth.currentUser?.uid));
    const [usuario, setUsuario] = useState<Partial<IUsuario>>({});
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const toast = useToast();

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

    const cerrarSesion = () => {
        signOut(auth).then(() => {
            //Sale del menú
            props.navigation.navigate('IniciarSesion');

            toast.show({
                description: "Has cerrado sesión."
            });
        }).catch((err) => {
            toast.show({
                description: "No se pudo cerrar sesión, inténtalo de nuevo"
            });
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
        <ScrollView>
            <Box bg={'white'} m={4} p={8} rounded='sm' shadow={'4'}>
                <VStack>
                    <Center>
                        <Avatar size={'xl'} mb={2} />
                        <Heading fontWeight={'light'}>
                            {`${usuario.nombres?.trim()} ${usuario.apellidos?.trim()}`}
                        </Heading>
                        <Text color={'gray.500'}>{auth.currentUser?.email}</Text>
                        <HStack space={3}>
                            <Button colorScheme={'blue'} my={2}
                                leftIcon={<Icon as={<AntDesign name='edit' />} />}>
                                EDITAR PERFIL
                            </Button>
                            {
                                usuario.rol === 'conductor' && (
                                    <Button colorScheme={'cyan'} my={2}
                                        leftIcon={<Icon as={<AntDesign name='plus' />} />}
                                        onPress={() => props.navigation.navigate('CrearRuta')}>
                                        AGREGAR RUTA
                                    </Button>
                                )
                            }
                        </HStack>
                    </Center>
                    <Box my={4}>
                        <Heading>Información</Heading>
                        <Box my={2}>
                            <Heading size={'md'} fontWeight={'light'}>
                                Número telefónico
                            </Heading>
                            <Text color={'gray.500'}>{usuario.telefono}</Text>
                        </Box>
                        <Box my={2}>
                            <Heading size={'md'} fontWeight={'light'}>
                                Matrícula UTEQ
                            </Heading>
                            <Text color={'gray.500'}>{usuario.matricula ? usuario.matricula : 'No hay matrícula'}</Text>
                        </Box>
                        <Box my={2}>
                            <Button variant={'link'} colorScheme={'red'} size={'lg'}
                                onPress={cerrarSesion}
                                leftIcon={<Icon as={<AntDesign name='poweroff' />} />}>
                                Cerrar sesión
                            </Button>
                        </Box>
                    </Box>
                </VStack>
            </Box>
        </ScrollView>
    )
}

// Color Switch Component
function ToggleDarkMode() {
    const { colorMode, toggleColorMode } = useColorMode();
    return (
        <HStack space={2} alignItems="center">
            <Text>Dark</Text>
            <Switch
                isChecked={colorMode === "light"}
                onToggle={toggleColorMode}
                aria-label={
                    colorMode === "light" ? "switch to dark mode" : "switch to light mode"
                }
            />
            <Text>Light</Text>
        </HStack>
    );
}