import { Form } from 'react-router-dom';
import { Button, Container, FormControl, FormLabel, Heading, Input, StackDivider, VStack } from "@chakra-ui/react";
import InputPassword from "../components/InputPassword";

export default function AdminLogin() {
    return (
        <Container
            as='main'
            id='admin-login'
            centerContent
            w='container.sm'
            mt='4'
        >
            <Heading as='h1'>Admin Login</Heading>
            <Form>
                <VStack mt='2' w='400px'>
                    <FormControl isRequired>
                        <FormLabel requiredIndicator={<span></span>}>Username</FormLabel>
                        <Input type='text' name='username'/>
                    </FormControl>
                    <FormControl isRequired> 
                        <FormLabel requiredIndicator={<span></span>}>Password</FormLabel>
                        <InputPassword name='password'/>
                    </FormControl>
                    <StackDivider/>
                    <Button type='submit' width='full' mt='8'>Login</Button>
                </VStack>
            </Form>
        </Container>
    );
}