import { Button, Container, FormControl, FormLabel, Heading, Input, StackDivider, VStack } from "@chakra-ui/react";
import InputPassword from "../components/InputPassword";
import { FormEvent, useState } from "react";

export default function AdminLogin() {
    const url = `${process.env.REACT_APP_API_URL}/api/admin/login`;
    const [inputs, setInputs] = useState({
        username: '',
        password: '',
    });
    const handleChange = (e: { target: { name: any; value: any; }; }) => setInputs(prevState => ({ ...prevState, [e.target.name]: e.target.value }));


    async function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(inputs),
        });

        if (response.status === 200) {

        }
    }

    return (
        <Container
            as='main'
            id='admin-login'
            centerContent
            w='container.sm'
            mt='4'
        >
            <Heading as='h1'>Admin Login</Heading>
            <form onSubmit={handleFormSubmit}>
                <VStack mt='2' w='400px'>
                    <FormControl isRequired>
                        <FormLabel requiredIndicator={<span></span>}>Username</FormLabel>
                        <Input type='text' name='username' value={inputs.username} onChange={handleChange}/>
                    </FormControl>
                    <FormControl isRequired> 
                        <FormLabel requiredIndicator={<span></span>}>Password</FormLabel>
                        <InputPassword name='password' value={inputs.password} onChange={handleChange}/>
                    </FormControl>
                    <StackDivider/>
                    <Button type='submit' width='full' mt='8'>Login</Button>
                </VStack>
            </form>
        </Container>
    );
}