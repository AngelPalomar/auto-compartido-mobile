import React from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScrollView, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
    Text, Center, VStack, Box, Heading, Button, Icon,
    Radio
} from 'native-base'

//Iconos
import { SimpleLineIcons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<RootStackParamList, 'RegistrarLicencia'>

const RegistrarLicencia = (props: Props) => {
    console.log(props.route.params);
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
                            <Text mb={2}>Datos de tu licencia</Text>
                            <Box alignItems={'center'}>
                                <Text mb={2} color={'cyan.800'}>Sube una foto de tu licencia de conducir</Text>
                                <Box
                                    width={250}
                                    height={350}
                                    borderStyle={'dotted'}
                                    borderColor={'cyan.500'}
                                    borderWidth={3}
                                    justifyContent={'center'}
                                    p={6}
                                    borderRadius={12}
                                    textAlign={'center'}
                                    mb={3}>
                                    <Button leftIcon={<Icon as={<SimpleLineIcons />} name={'camera'} color={'white'} />} >
                                        ABRIR GALERÍA
                                    </Button>
                                </Box>
                                <Icon as={<SimpleLineIcons />} name={'info'} color={'info.500'} size={4} />
                                <Text mb={2} color={'cyan.800'} textAlign={'center'}>¿Estás asegurado?</Text>
                                <Text mb={2} textAlign={'center'}>Esta información se le mostrará a los conductores interesados</Text>
                                <Box mb={4}>
                                    <Radio.Group name='aseguradoGroup' accessibilityLabel={'¿Estás asegurado?'}>
                                        <Radio value={'si'} my={2}>
                                            Sí, estoy asegurado.
                                        </Radio>
                                        <Radio value={'no'} my={2}>
                                            No, no estoy asegurado.
                                        </Radio>
                                    </Radio.Group>
                                </Box>
                                <Button colorScheme={'cyan'} mb={10}>
                                    CREA CUENTA AHORA
                                </Button>
                            </Box>
                        </Box>
                    </VStack>
                </Center>
            </ScrollView>
        </SafeAreaView>
    )
}

export default RegistrarLicencia