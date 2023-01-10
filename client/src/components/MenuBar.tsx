import path from 'path';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { Menu, MenuItemProps } from 'semantic-ui-react';

export default function MenuBar() {
  const [state, setState] = useState({ activeItem: 'home' });
  const { activeItem } = state;
  const pathname = window.location.pathname;
  const path = '/' ? 'home' : pathname.substring(1);

  const handleItemClick = (
    e: React.SyntheticEvent<any, any>,
    { name }: MenuItemProps
  ) => (name ? setState({ activeItem: name }) : '');

  return (
    <Menu
      pointing
      secondary
      size='massive'
      color='purple'
    >
      <Menu.Item
        name='home'
        active={activeItem === 'home'}
        onClick={handleItemClick}
        as={Link}
        to='/'
      />

      <Menu.Menu position='right'>
        <Menu.Item
          name='Login'
          active={activeItem === 'login'}
          onClick={handleItemClick}
          as={Link}
          to='/login'
        />
        <Menu.Item
          name='Register'
          active={activeItem === 'register'}
          onClick={handleItemClick}
          as={Link}
          to='/register'
        />
      </Menu.Menu>
    </Menu>
  );
}
