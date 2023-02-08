import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer, Heading, Container
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Tag } from '../spa';
import ApiFetch from '../services/ApiFetch';

export default function AdminTagsView() {
    let [tags, setTags] = useState<Tag[]>([]);
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
                <Heading as='h1'>Tags</Heading>
                <TableContainer>
                    <Table variant='striped' colorScheme='primary'>
                        <Thead>
                            <Tr>
                                <Th>Tag Name</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {
                                tags.map(tag => {
                                    return (
                                        <Tr key={tag.name}>
                                            <Td>{ tag.name }</Td>
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
