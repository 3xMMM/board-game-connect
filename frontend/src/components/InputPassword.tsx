import { useState } from "react";
import { Button, Input, InputGroup, InputRightElement } from "@chakra-ui/react";

export default function InputPassword(props: Record<string, unknown>) {
    const [show, setShow] = useState(false);
    const handleClick = () => setShow(!show);
 
    return (
        <InputGroup size='md'>
            <Input
                pr='4.5rem'
                type={show ? 'text' : 'password'}
                placeholder='Enter password'
                {...props}
            />
            <InputRightElement width='4.5rem'>
                <Button h='1.75rem' size='sm' onClick={handleClick} variant='ghost'>
                    {show ? 'Hide' : 'Show'}
                </Button>
            </InputRightElement>
        </InputGroup>
    );
}