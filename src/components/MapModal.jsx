import {
    Spinner,
    Modal, ModalCloseButton, ModalContent, ModalOverlay,
    useDisclosure, ModalHeader, Button
} from "@chakra-ui/react";
import Map from "./Map";
import credentials from "../credentials";

export default function MapModal(props){
    const {isOpen, onOpen, onClose} = useDisclosure()
    return (
        <>
        <Button
            isDisabled={props.isDisabled}
            onClick={onOpen}
            mt={4}
        >Abrir mapa 🗺</Button>

        <Modal isOpen={isOpen} onClose={onClose} size={'6xl'}>
            <ModalOverlay/>
            <ModalContent>
                {/*<ModalHeader>Mapa</ModalHeader>*/}
                {/*<ModalCloseButton/>*/}
                <Map
                    centerPoint={{
                        lat:props.latitude,
                        lon:props.longitude
                    }}
                    markers={props.cities}
                    googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&key=${credentials.mapsKey}`}
                    containerElement={<div style={{height:'550px'}}/>}
                    mapElement={<div style={{ height: `100%` }} />}
                    loadingElement={<Spinner/>}
                />
            </ModalContent>
        </Modal>
        </>
    )
}