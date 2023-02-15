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
import { Tag } from '../../spa';
import { RefObject } from 'react';
import { useForm } from 'react-hook-form';
import ApiFetch from '../../services/ApiFetch';

interface FocusableElement {
    focus(options?: FocusOptions): void;
}

export interface AdminTagAddModalProps {
    isOpen: boolean
    onClose: () => void
    finalFocusRef: RefObject<FocusableElement>
    getTags: () => void
}

interface FormData {
    tagsToAdd: string
}

export default function AdminTagAddModal(props: AdminTagAddModalProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        setError,
    } = useForm<FormData>();

    const handleFormSubmit = (data: FormData) => {
        ApiFetch.post<Tag[]>('/api/tags', data)
            .then(() => {
                setValue('tagsToAdd', '');
                props.onClose();
                props.getTags();
            })
            .catch(e => {
                setError('tagsToAdd', { type: 'custom', message: e.message });
            });
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
                            <FormErrorMessage>{errors.tagsToAdd?.message}</FormErrorMessage>
                            <FormHelperText>Note: <em>Tags must be unique.</em> You can add multiple tags by separating them with a comma (any whitespace between commas will be trimmed).</FormHelperText>
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
