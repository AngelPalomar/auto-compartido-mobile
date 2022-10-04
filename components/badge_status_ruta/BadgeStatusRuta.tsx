import { Text } from 'native-base';
import React from 'react'
import IRuta from '../../interfaces/ruta.interface'

interface BadgeStatusRutaProps {
    ruta: IRuta
}

export default function BadgeStatusRuta({ ruta }: BadgeStatusRutaProps) {
    switch (ruta.status) {
        default:
        case 'creada':
            return (
                <Text color={'darkBlue.500'} bold fontSize={'md'}>
                    RUTA CREADA
                </Text>
            )
        case 'curso':
            return (
                <Text color={'darkBlue.500'} bold fontSize={'md'}>
                    RUTA EN CURSO
                </Text>
            )
        case 'inactiva':
            return (
                <Text color={'darkBlue.500'} bold fontSize={'md'}>
                    RUTA INACTIVA
                </Text>
            )
        case 'preparacion':
            return (
                <Text color={'darkBlue.500'} bold fontSize={'md'}>
                    RUTA EN PREPARACIÓN
                </Text>
            )

        case 'terminado':
            return (
                <Text color={'darkBlue.500'} bold fontSize={'md'}>
                    RUTA TERMINADA
                </Text>
            )

    }
}