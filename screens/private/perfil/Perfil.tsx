import React, { useState, useEffect } from 'react'
import {
    Avatar, Box, Center, ScrollView, VStack, Heading, Spinner, Button, Text,
    useToast, useColorMode, HStack, Switch, Icon, theme
} from 'native-base'
import {
    collection, getFirestore, where, query, getDocs,
    doc, updateDoc, onSnapshot
} from 'firebase/firestore';
import { getAuth, signOut } from 'firebase/auth';
import initFirebase from '../../../firebase/init';
import IUsuario from '../../../interfaces/usuario.interface';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AntDesign } from '@expo/vector-icons';
import IRuta from '../../../interfaces/ruta.interface';
import Alerta from '../../../components/alerta/Alerta';

type Props = NativeStackScreenProps<RootStackParamList, 'Perfil'>;

export default function Perfil(props: Props) {
    const db = getFirestore(initFirebase);
    const auth = getAuth(initFirebase);
    const usuariosRef = collection(db, "usuarios");
    const rutasRef = collection(db, 'rutas');
    const qUsuario = query(usuariosRef, where("idAuth", "==", auth.currentUser?.uid));
    const qRuta = query(rutasRef, where("idAuthConductor", "==", auth.currentUser?.uid));
    const [usuario, setUsuario] = useState<Partial<IUsuario>>({});
    const [rutas, setRutas] = useState<Array<IRuta>>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const toast = useToast();

    useEffect(() => {
        getUsuarioDoc();
    }, [])


    const getUsuarioDoc = () => {
        getDocs(qUsuario).then(querySnapshot => {
            querySnapshot.forEach(doc => {
                const dataUsuario: IUsuario = doc.data() as IUsuario;
                setUsuario(dataUsuario);

                //Trae las rutas
                if (dataUsuario.rol === 'conductor') {
                    getRutasDocs();
                } else {
                    setIsLoading(false);
                }
            })
        }).catch(err => {
            console.error(err);
            setIsLoading(false);
        })
    }

    const getRutasDocs = () => {
        onSnapshot(qRuta, (querySnapshot) => {
            const rts: IRuta[] = [];

            querySnapshot.forEach(doc => {
                rts.push({ ...doc.data(), idDoc: doc.id } as IRuta);
            })

            setRutas(rts);
            setIsLoading(false);
        })
    }

    const activarRuta = (idDoc: string, value: boolean) => {
        const rutaRef = doc(db, 'rutas', idDoc);

        updateDoc(rutaRef, {
            activo: value
        }).then(() => {
            toast.show({ description: value ? "Ruta activada" : "Ruta desactivada" });
        }).catch(() => {
            toast.show({ description: "Ocurrió un error." });
        });
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
        <Box flex={1} bg={'white'}>
            <ScrollView>
                <VStack my={2} p={4}>
                    <VStack mb={8}>
                        <Center>
                            <Avatar size={'xl'} mb={2} />
                            <Heading fontWeight={'light'}>
                                {`${usuario.nombres?.trim()} ${usuario.apellidos?.trim()}`}
                            </Heading>
                            <Text color={'gray.500'}>{auth.currentUser?.email}</Text>
                            <HStack space={3} my={4}>
                                <Button colorScheme={'lightBlue'}
                                    leftIcon={<Icon as={<AntDesign name='edit' />} />}>
                                    EDITAR PERFIL
                                </Button>
                            </HStack>
                        </Center>
                        {
                            !auth.currentUser?.emailVerified && (
                                <Center>
                                    <Box my={2}>
                                        <Alerta
                                            title={'Correo electrónico no verificado'}
                                            description={'Tu dirección de correo electrónico no ha sido verificada; presiona para verificarla. De lo contrario, si eres conductor, no aparecerás en la lista de conductores compartidos.'}
                                            status={'warning'} />
                                    </Box>
                                    <Button colorScheme={'warning'} size={'sm'}>
                                        VERIFICAR CORREO ELECTRÓNICO
                                    </Button>
                                </Center>
                            )
                        }
                        <Box mt={4}>
                            <Heading fontWeight={'light'} color={'gray.500'}>
                                Información
                            </Heading>
                            <Box my={2}>
                                <Heading size={'sm'} fontWeight={'light'}>
                                    Número telefónico
                                </Heading>
                                <Text color={'gray.500'}>{usuario.telefono}</Text>
                            </Box>
                            <Box my={2}>
                                <Heading size={'sm'} fontWeight={'light'}>
                                    Matrícula UTEQ
                                </Heading>
                                <Text color={'gray.500'}>{usuario.matricula || usuario.matricula === '' ? usuario.matricula : 'No hay matrícula'}</Text>
                            </Box>
                        </Box>
                    </VStack>
                    {
                        usuario.rol === 'conductor' && (
                            <Box mb={8}>
                                <Heading fontWeight={'light'}>Mis rutas</Heading>
                                <Text mb={4}>
                                    Selecciona una ruta para activarla y empezar el recorrido
                                </Text>
                                <Button colorScheme={'lightBlue'}
                                    mb={4}
                                    variant={'solid'}
                                    leftIcon={<Icon as={<AntDesign name='plus' />} />}
                                    onPress={() => props.navigation.navigate('CrearRuta')}>
                                    AGREGAR RUTA
                                </Button>
                                {
                                    rutas.map((value: IRuta, index: number) => (
                                        <Box key={index} mb={2} bg={'blue.100'} p={4} width={'full'} flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'}>
                                            <HStack alignItems={'center'} space={2}>
                                                <Text color={'gray.500'} fontSize={'lg'}>
                                                    {`[${value.horaSalida}]`}
                                                </Text>
                                                <Text color={'darkBlue.800'} fontSize={'lg'}>
                                                    {value.lugarInicio.trim()}
                                                </Text>
                                                <AntDesign name={'arrowright'} color={theme.colors.darkBlue[500]}
                                                    size={24} />
                                                <Text color={'darkBlue.800'} fontSize={'lg'}>
                                                    {value.lugarDestino.trim()}
                                                </Text>
                                            </HStack>
                                            <Switch defaultIsChecked={value.activo} colorScheme={'darkBlue'} onValueChange={(swt: boolean) => activarRuta(value.idDoc as string, swt)} />
                                        </Box>
                                    ))
                                }
                            </Box>
                        )
                    }
                    <Box>
                        <Button colorScheme={'blue'}
                            onPress={cerrarSesion}
                            variant={'link'}
                            leftIcon={<Icon as={<AntDesign name='poweroff' />} />}>
                            Cerrar sesión
                        </Button>
                    </Box>
                </VStack>
            </ScrollView>
        </Box>
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