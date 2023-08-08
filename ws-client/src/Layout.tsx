// @ts-check
import './Main.css';
import { ReactNode } from 'react';
import { Flowbite, Dropdown, Navbar, Avatar } from 'flowbite-react';
import Logo from './logo.png';

const customTheme = {
  button: {
    color: {
      primary: 'bg-red-500 hover:bg-red-600',
    },
  },
};

export const Layout = ({
  children,
  user,
}: {
  children: ReactNode;
  user: string;
}) => {
  return (
    <Flowbite theme={{ theme: customTheme }}>
      <div className='p-8'>
        <Navbar fluid rounded>
          <Navbar.Brand href='https://flowbite-react.com'>
            <img alt='Flowbite React Logo' className='mr-3 h-6 sm:h-9' src={Logo} />
            <span className='self-center whitespace-nowrap text-xl font-semibold dark:text-white'>
              Undecisive Fox App
            </span>
          </Navbar.Brand>
          {!!user && (
            <div className='flex md:order-2'>
              <Dropdown
                inline
                label={
                  <Avatar
                    alt='User settings'
                    img={`https://xsgames.co/randomusers/avatar.php?g=female&username=${user}`}
                    rounded
                  />
                }
              >
                <Dropdown.Header>
                  <span className='block text-sm'>{user}</span>
                </Dropdown.Header>
                <Dropdown.Item>Dashboard</Dropdown.Item>
                <Dropdown.Item>Settings</Dropdown.Item>
                <Dropdown.Divider />
              </Dropdown>
              <Navbar.Toggle />
            </div>
          )}
        </Navbar>
        <div className='grid place-items-center mt-8'>{children}</div>
      </div>
    </Flowbite>
  );
};
