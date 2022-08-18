import React from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScrollView, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Text, Center, VStack, Box, Heading, Input, Button, Icon } from 'native-base'

//Iconos
import { SimpleLineIcons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<RootStackParamList, 'RegistrarseConductor'>

export default function RegistrarseConductor(props: Props) {
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
                            <Input px={3} mb={3} placeholder={'Nombres'} width={'80%'} keyboardType='default' variant={'rounded'} />
                            <Input px={3} mb={3} placeholder={'Apellidos'} width={'80%'} keyboardType='default' variant={'rounded'} />
                            <Input px={3} mb={3} placeholder={'Correo electrónico'} width={'80%'} keyboardType='email-address' variant={'rounded'} />
                            <Input px={3} mb={3} placeholder={'Teléfono celular'} width={'80%'} keyboardType='phone-pad' variant={'rounded'} />
                            <Input px={3} mb={3} placeholder={'Contraseña'} width={'80%'} keyboardType='default' variant={'rounded'} secureTextEntry />
                            <Input px={3} mb={3} placeholder={'Confirmar contraseña'} width={'80%'} keyboardType='default' variant={'rounded'} secureTextEntry />
                            <Text mb={2} color={'cyan.800'}>
                                ¿Eres un alumno de la UTEQ? Ingresa tu matrícula
                            </Text>
                            <Input px={3} mb={5} placeholder={'Matrícula'} width={'80%'} keyboardType='number-pad' variant={'rounded'} />
                            <Button colorScheme={'cyan'} rightIcon={<Icon as={<SimpleLineIcons />} name={'arrow-right'} color={'white'} />}
                                onPress={() => props.navigation.navigate('RegistrarVehiculo')}>
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