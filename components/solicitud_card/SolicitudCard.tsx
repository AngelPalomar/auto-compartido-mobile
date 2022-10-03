import { HStack, Box, Avatar, VStack, Text, Button, Icon } from 'native-base'
import React from 'react'
import ISolicitud from '../../interfaces/solicitud.interface'
import { SimpleLineIcons } from '@expo/vector-icons';

interface SolicitudCardProps {
    solicitud: ISolicitud,
    aceptar: () => void,
    rechazar: () => void,
    rutaActiva?: boolean
}

export default function SolicitudCard({ solicitud, aceptar, rechazar, rutaActiva }: SolicitudCardProps) {
    return (
        <HStack>
            <Box mr={4}>
                <Avatar />
            </Box>
            <Box>
                <VStack>
                    <Text fontSize={'lg'} color={'darkBlue.700'}>
                        {`${solicitud.pasajero.nombres?.trim()} ${solicitud.pasajero.apellidos?.trim()}`}
                    </Text>
                    <Text>
                        Quiere unirse a tu ruta.
                    </Text>
                    <Text fontSize={'sm'} color={'gray.500'} mb={4}>
                        {solicitud.fechaHora}
                    </Text>
                </VStack>
                <HStack justifyContent={'flex-end'} w={{ base: '90%' }} space={3}>
                    <Button colorScheme={'lightBlue'} size={'sm'}
                        leftIcon={<Icon as={<SimpleLineIcons name='check' />} />}
                        onPress={aceptar}
                        isDisabled={rutaActiva ? false : true}>
                        Aceptar
                    </Button>
                    <Button colorScheme={'purple'} size={'sm'}
                        leftIcon={<Icon as={<SimpleLineIcons name='close' />} />}
                        onPress={rechazar}>
                        Rechazar
                    </Button>
                </HStack>
            </Box>
        </HStack>
    )
}