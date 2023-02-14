import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton, Button,
    FormControl, FormLabel, Textarea, FormHelperText, Highlight, FormErrorMessage
} from '@chakra-ui/react';
import { RefObject } from 'react';
import { useForm } from 'react-hook-form';

interface FocusableElement {
    focus(options?: FocusOptions): void;
}

export interface AdminTagAddModalProps {
    isOpen: boolean
    onClose: () => void
    finalFocusRef: RefObject<FocusableElement>
}

interface FormData {
    tagsToAdd: string
}

export default function AdminTagAddModal(props: AdminTagAddModalProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>();

    const handleFormSubmit = (data: FormData) => {
        console.log(data);
    };

    return(
        <Modal isOpen={props.isOpen} onClose={props.onClose} finalFocusRef={props.finalFocusRef}>
            <ModalOverlay/>
            <ModalContent>
                <form onSubmit={handleSubmit(handleFormSubmit)}>
                    <ModalHeader>Add a Tag</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        <FormControl isInvalid={!!errors.tagsToAdd}>
                            <FormLabel>Tag(s) to Add</FormLabel>
                            <Textarea {...register('tagsToAdd', { required: true })}></Textarea>
                            <FormErrorMessage>This field is required.</FormErrorMessage>
                            <FormHelperText>Tip: You can add multiple tags by separating them with a comma (any whitespace between commas will be trimmed).</FormHelperText>
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={props.onClose} variant='outline' mr='2'>Close</Button>
                        <Button type='submit'>Submit</Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    );
}
