import React, { useState } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
    ScrollView, Image, NativeSyntheticEvent, TextInputChangeEventData
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
    Text, Center, VStack, Box, Heading, Input, Button, Icon,
    Select,
    useToast
} from 'native-base'

//Iconos
import { SimpleLineIcons } from '@expo/vector-icons';
import { minLenghtValidation } from '../../../utils/functions/formValidation';

//nav
type Props = NativeStackScreenProps<RootStackParamList, 'RegistrarVehiculo'>

export default function RegistrarVehiculo(props: Props) {
    //Estado temporal para ir guardando los datos entre la navegacion
    const [conductor, setConductor] = useState<{
        nombres: string,
        apellidos: string,
        correoElectronico: string,
        telefono: string,
        contrasena: string,
        confirmarContrasena: string,
        matricula: string | null,
        modelo: string,
        color: string,
        numeroPlaca: string,
        asientosDisponibles: number,
        tipoVehiculo: 'automovil' | 'motocicleta'
    }>({
        ...props.route.params,
        modelo: '',
        color: '',
        numeroPlaca: '',
        asientosDisponibles: 0,
        tipoVehiculo: 'automovil'
    });
    const toast = useToast();
    type input = NativeSyntheticEvent<TextInputChangeEventData>;

    const validarCampos = () => {
        const cdt = conductor;
        if (!minLenghtValidation(cdt.modelo.trim(), 3)) {
            toast.show({
                description: "Ingrese el modelo de su vehículo."
            });
            return;
        }

        if (!minLenghtValidation(cdt.color.trim(), 3)) {
            toast.show({
                description: "Ingrese el color de su vehículo."
            });
            return;
        }

        if (!minLenghtValidation(cdt.numeroPlaca.trim(), 4)) {
            toast.show({
                description: "Ingrese el número/código de placa de su vehículo."
            });
            return;
        }

        if (!minLenghtValidation(cdt.asientosDisponibles.toString().trim(), 1)) {
            toast.show({
                description: "Ingrese el número de asientos disponibles de tu vehículo."
            });
            return;
        }

        if (!minLenghtValidation(cdt.tipoVehiculo.trim(), 1)) {
            toast.show({
                description: "Ingrese el modelo de su vehículo."
            });
            return;
        }
    }

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
                            <Input px={3} mb={3} placeholder={'Modelo (Marca, modelo)'} width={'80%'} keyboardType='default' variant={'rounded'}
                                onChange={(e: input): void => setConductor({ ...conductor, modelo: e.nativeEvent.text })} />
                            <Input px={3} mb={3} placeholder={'Color (Rojo, Verde, Azul, etc.)'} width={'80%'} keyboardType='default' variant={'rounded'}
                                onChange={(e: input): void => setConductor({ ...conductor, color: e.nativeEvent.text })} />
                            <Input px={3} mb={3} placeholder={'No. de placa'} width={'80%'} keyboardType='default' variant={'rounded'} autoCapitalize={'characters'}
                                onChange={(e: input): void => setConductor({ ...conductor, numeroPlaca: e.nativeEvent.text })} />
                            <Input px={3} mb={3} placeholder={'Asientos disponibles'} width={'80%'} keyboardType='numeric' variant={'rounded'}
                                onChange={(e: input): void => setConductor({ ...conductor, asientosDisponibles: parseInt(e.nativeEvent.text) })} />
                            <Select px={3} mb={3} placeholder={'Tipo de vehículo'} accessibilityLabel={'Tipo de vehículo'} width={'80%'} variant={'rounded'}
                                onValueChange={(itemValue: string) => setConductor({ ...conductor, tipoVehiculo: itemValue as 'automovil' | 'motocicleta' })}
                                defaultValue={conductor.tipoVehiculo}
                                _selectedItem={{
                                    bg: "cyan.500"
                                }}>
                                <Select.Item label='Automóvil' value='automovil' />
                                <Select.Item label='Motocicleta' value='motocicleta' />
                            </Select>
                            <Button colorScheme={'cyan'} rightIcon={<Icon as={<SimpleLineIcons />} name={'arrow-right'} color={'white'} />}
                                onPress={() => props.navigation.navigate('RegistrarLicencia', conductor)}>
                                SIGUIENTE
                            </Button>
                        </Box>
                    </VStack>
                </Center>
            </ScrollView>
        </SafeAreaView>
    )
}