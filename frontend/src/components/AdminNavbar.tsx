import { Heading, HStack, Tab, TabList, Tabs } from '@chakra-ui/react';
import { Link, Outlet, useLocation } from 'react-router-dom';

interface AdminNavbarTabLink {
    label: string
    to: string
}

export default function AdminNavbar() {
    const location = useLocation();
    const tabLinks: AdminNavbarTabLink[] = [
        { label: 'Dashboard', to: '/admin/dashboard' },
        { label: 'Tags', to: '/admin/tags' },
    ];

    return (
        <div id='AdminNavbar'>
            <HStack borderBottom='2px' borderColor='gray.200' spacing='8' padding='3'>
                <Heading as='h1' size='md'>Board Game Connect</Heading>
                <Tabs variant='soft-rounded' colorScheme='purple' defaultIndex={tabLinks.findIndex(tabLink => tabLink.to === location.pathname)} marginBottom='-2px'>
                    {
                        location.pathname !== '/admin/login' &&
                        <TabList>
                            { tabLinks.map(tabLink => <Link to={tabLink.to} key={tabLink.label}><Tab>{tabLink.label}</Tab></Link>) }
                        </TabList>
                    }
                </Tabs>
            </HStack>
            <Outlet/>
        </div>
    );
}