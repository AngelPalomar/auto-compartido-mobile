import React from 'react'
import { Modal } from 'native-base'
import { Image } from 'react-native'

interface ModalLicenciaProps {
    isOpen: boolean,
    onClose: () => void,
    urlFoto?: string
}

export default function ModalLicencia({ isOpen, onClose, urlFoto }: ModalLicenciaProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} size={'md'}>
            <Modal.Content minH={'200px'}>
                <Modal.CloseButton />
                <Modal.Header>Licencia de conducir</Modal.Header>
                <Modal.Body>
                    <Image
                        source={{ uri: urlFoto }}
                        style={{
                            width: '100%',
                            height: 180
                        }} />
                </Modal.Body>
            </Modal.Content>
        </Modal>
    )
}