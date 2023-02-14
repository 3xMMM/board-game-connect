import {
    Table,
    Thead,
    Tbody,
    Text,
    Tr,
    Th,
    Td,
    TableContainer, Heading, Container, Button, Flex, Divider, useDisclosure
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { Tag } from '../../spa';
import ApiFetch from '../../services/ApiFetch';
import AdminTagAddModal from './AdminTagAddModal';

export default function AdminTagsView() {
    let [tags, setTags] = useState<Tag[]>([]);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const addTagButtonRef = useRef(null);

    useEffect(() => {
        ApiFetch.get<Tag[]>('/api/tags').then(tags => {
            if (tags) {
                setTags(tags);
            }
        });
    }, []);

    return (
        <div>
            <Container id='AdminTagsView' maxW='container.xl'>
                <Heading as='h1' my='4'>Tags</Heading>
                <Text mb='5'><strong>Tags</strong> are used to assign categories and taxonomies to <strong>Games</strong>. A <strong>Game</strong> can have many <strong>Tags</strong>.</Text>
                <Divider/>
                <Flex justifyContent='space-between' alignItems='center'>
                    <Text display='inline-flex'><strong><em>{tags.length} tag(s)</em></strong></Text>
                    <Button ref={addTagButtonRef} my='4' onClick={onOpen}>Add Tag</Button>
                    <AdminTagAddModal isOpen={isOpen} onClose={onClose} finalFocusRef={addTagButtonRef}/>
                </Flex>
                <TableContainer>
                    <Table variant='striped' colorScheme='primary' size='sm'>
                        <Thead>
                            <Tr>
                                <Th>Tag Name</Th>
                                <Th>Games w/ Tag</Th>
                                <Th>Action</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {
                                tags.map(tag => {
                                    return (
                                        <Tr key={tag.name}>
                                            <Td>{ tag.name }</Td>
                                            <Td>TBD</Td>
                                            <Td>TBD</Td>
                                        </Tr>
                                    );
                                })
                            }
                        </Tbody>
                    </Table>
                </TableContainer>
            </Container>
        </div>
    );
}
