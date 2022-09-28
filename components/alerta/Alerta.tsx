import { Alert, VStack, HStack, Text, Box } from 'native-base'
import React from 'react'

interface AlertaProps {
    status: "info" | "warning" | "success" | "error",
    title: string,
    description: string
}

export default function Alerta(props: AlertaProps) {
    return (
        <Alert maxW="400" status={props.status} colorScheme="info">
            <VStack space={2} flexShrink={1} w="100%">
                <HStack flexShrink={1} space={2} alignItems="center" justifyContent="space-between">
                    <HStack flexShrink={1} space={2} alignItems="center">
                        <Alert.Icon />
                        <Text fontSize="md" fontWeight="medium" color="coolGray.800">
                            {props.title}
                        </Text>
                    </HStack>
                </HStack>
                <Box pl="6" _text={{
                    color: "coolGray.600"
                }}>
                    {props.description}
                </Box>
            </VStack>
        </Alert>
    )
}