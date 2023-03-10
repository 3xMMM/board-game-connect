import {
    Button,
    Container,
    FormControl,
    FormLabel,
    Heading,
    Input,
    StackDivider,
    Text,
    VStack
} from "@chakra-ui/react";
import InputPassword from "../components/InputPassword";
import { FormEvent, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../auth/AdminAuthContext";
import ApiFetch from "../services/ApiFetch";
import { AdminUser } from '../spa';
import Cookie from '../services/Cookie';

interface SessionCheckResponse {
    sessionIsValid: boolean,
    user: AdminUser | {}
}

export default function AdminLoginPage() {
    const location = useLocation();
    const auth = useAdminAuth();
    const navigate = useNavigate();
    const from = location.state?.from?.pathname || '/admin/dashboard';

    useEffect(() => {
        if (Cookie.getCookie('loggedIn')) {
            ApiFetch.get<SessionCheckResponse>('/api/admin/authentication/session-check')
                .then(response => {
                    if (response && response.sessionIsValid && Object.keys(response.user).length > 0) {
                        auth.setUser(response.user as AdminUser);
                        Cookie.setCookie('loggedIn', '1', 3);
                    }
                });
        }
    }, []);

    useEffect(() => {
        if (auth.user !== null) {
            navigate('/admin/dashboard', { replace: true });
        }
    }, [auth]);

    const [inputs, setInputs] = useState({
        username: '',
        password: '',
    });
    const [isError, setIsError] = useState(false);

    const handleChange = (e: { target: { name: any; value: any; }; }) => setInputs(prevState => ({ ...prevState, [e.target.name]: e.target.value }));

    async function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsError(false);
        auth.login(inputs.username, inputs.password, (wasError) => {
            setIsError(wasError);
            if (!wasError) {
                navigate(from, { replace: true });
            }
        });
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
                    {isError &&
                        <Text fontSize='md' color='red.600'>Could not login with the provided credentials. Please double-check your credentials and try again.</Text>
                    }
                </VStack>
            </form>
        </Container>
    );
}