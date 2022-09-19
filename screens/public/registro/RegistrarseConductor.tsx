import React, { useState } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScrollView, Image, NativeSyntheticEvent, TextInputChangeEventData } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Text, Center, VStack, Box, Heading, Input, Button, Icon } from 'native-base'

//Iconos
import { SimpleLineIcons } from '@expo/vector-icons';

//Nav
type Props = NativeStackScreenProps<RootStackParamList, 'RegistrarseConductor'>

export default function RegistrarseConductor(props: Props) {

    //Estado temporal para ir guardando los datos entre la navegacion
    const [conductor, setConductor] = useState<{
        nombres: string,
        apellidos: string,
        correoElectronico: string,
        telefono: string,
        contrasena: string,
        confirmarContrasena: string,
        matricula: string | null
    }>({
        nombres: '',
        apellidos: '',
        correoElectronico: '',
        telefono: '',
        contrasena: '',
        confirmarContrasena: '',
        matricula: null
    });
    type input = NativeSyntheticEvent<TextInputChangeEventData>;

    return (
        <SafeAreaView>
            <ScrollView>
                <Center mb={10}>
                    <VStack space={5} alignItems="center">
                        <Box>
                            <Heading textAlign={'center'}>
                                Ser conductor UTEQ
                            </Heading>
                            <Text alignItems="center" color={'cyan.800'}>Todos los campo son requeridos.</Text>
                        </Box>
                        <Box alignItems={'center'}>
                            <Text mb={2}>Datos personales</Text>
                            <Input px={3} mb={3} placeholder={'Nombres'} width={'80%'} keyboardType='default' variant={'rounded'}
                                onChange={(e: input): void => setConductor({ ...conductor, nombres: e.nativeEvent.text })} />
                            <Input px={3} mb={3} placeholder={'Apellidos'} width={'80%'} keyboardType='default' variant={'rounded'}
                                onChange={(e: input): void => setConductor({ ...conductor, apellidos: e.nativeEvent.text })} />
                            <Input px={3} mb={3} placeholder={'Correo electrónico'} width={'80%'} keyboardType='email-address' variant={'rounded'}
                                onChange={(e: input): void => setConductor({ ...conductor, correoElectronico: e.nativeEvent.text })} />
                            <Input px={3} mb={3} placeholder={'Teléfono celular'} width={'80%'} keyboardType='phone-pad' variant={'rounded'}
                                onChange={(e: input): void => setConductor({ ...conductor, telefono: e.nativeEvent.text })} />
                            <Input px={3} mb={3} placeholder={'Contraseña'} width={'80%'} keyboardType='default' variant={'rounded'} secureTextEntry
                                onChange={(e: input): void => setConductor({ ...conductor, contrasena: e.nativeEvent.text })} />
                            <Input px={3} mb={3} placeholder={'Confirmar contraseña'} width={'80%'} keyboardType='default' variant={'rounded'} secureTextEntry
                                onChange={(e: input): void => setConductor({ ...conductor, confirmarContrasena: e.nativeEvent.text })} />
                            <Text mb={2} color={'cyan.800'}>
                                ¿Eres un alumno de la UTEQ? Ingresa tu matrícula
                            </Text>
                            <Input px={3} mb={5} placeholder={'Matrícula'} width={'80%'} keyboardType='number-pad' variant={'rounded'} />
                            <Button colorScheme={'cyan'} rightIcon={<Icon as={<SimpleLineIcons />} name={'arrow-right'} color={'white'} />}
                                onPress={() => props.navigation.navigate('RegistrarVehiculo', conductor)}>
                                SIGUIENTE
                            </Button>
                        </Box>
                    </VStack>
                </Center>
                <Image
                    source={{ uri: 'http://dtai.uteq.edu.mx/~crupal192/imagenes/regis-conductor.jpg' }}
                    style={{
                        width: '100%',
                        height: 220,
                        borderTopLeftRadius: 18,
                        borderTopRightRadius: 18
                    }}
                />
            </ScrollView>
        </SafeAreaView>
    )
}