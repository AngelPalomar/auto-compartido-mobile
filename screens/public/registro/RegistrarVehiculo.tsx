import React from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScrollView, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
    Text, Center, VStack, Box, Heading, Input, Button, Icon,
    Select
} from 'native-base'

//Iconos
import { SimpleLineIcons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<RootStackParamList, 'RegistrarVehiculo'>

export default function RegistrarVehiculo(props: Props) {
    return (
        <SafeAreaView>
            <ScrollView>
                <Center>
                    <VStack space={5} alignItems="center">
                        <Box>
                            <Heading textAlign={'center'}>
                                Ser conductor UTEQ
                            </Heading>
                            <Text alignItems="center" color={'cyan.800'}>Todos los campo son requeridos.</Text>
                        </Box>
                        <Box alignItems={'center'}>
                            <Text mb={2}>Datos de tu vehículo</Text>
                            <Input px={3} mb={3} placeholder={'Modelo (Marca, modelo)'} width={'80%'} keyboardType='default' variant={'rounded'} />
                            <Input px={3} mb={3} placeholder={'Color (Rojo, Verde, Azul, etc.)'} width={'80%'} keyboardType='default' variant={'rounded'} />
                            <Input px={3} mb={3} placeholder={'No. de placa'} width={'80%'} keyboardType='default' variant={'rounded'} autoCapitalize={'characters'} />
                            <Input px={3} mb={3} placeholder={'Asientos disponibles'} width={'80%'} keyboardType='numeric' variant={'rounded'} />
                            <Select px={3} mb={3} placeholder={'Tipo de vehículo'} accessibilityLabel={'Tipo de vehículo'} width={'80%'} variant={'rounded'}
                                _selectedItem={{
                                    bg: "cyan.500"
                                }}>
                                <Select.Item label='Automóvil' value='automovil' />
                                <Select.Item label='Motocicleta' value='motocicleta' />
                            </Select>
                            <Button colorScheme={'cyan'} rightIcon={<Icon as={<SimpleLineIcons />} name={'arrow-right'} color={'white'} />}
                                onPress={() => props.navigation.navigate('RegistrarLicencia')}>
                                SIGUIENTE
                            </Button>
                        </Box>
                    </VStack>
                </Center>
            </ScrollView>
        </SafeAreaView>
    )
}