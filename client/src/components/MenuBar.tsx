import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';

import { Menu, MenuItemProps } from 'semantic-ui-react';
import { AuthContext } from '../context/auth';

export default function MenuBar() {
  const { user, logout } = useContext(AuthContext);

  const pathname = window.location.pathname;
  const path = '/' ? 'home' : pathname.substring(1);
  const [state, setState] = useState({ activeItem: path });
  const { activeItem } = state;
  const handleItemClick = (
    e: React.SyntheticEvent<any, any>,
    { name }: MenuItemProps
  ) => (name ? setState({ activeItem: name }) : '');

  return user ? (
    <Menu
      pointing
      secondary
      size='massive'
      color='purple'
    >
      <Menu.Item
        //@ts-ignore
        name={user.username}
        //@ts-ignore
        active={activeItem === user.username}
        onClick={handleItemClick}
        as={Link}
        to='/'
      />

      <Menu.Menu position='right'>
        <Menu.Item
          name='logout'
          active={activeItem === 'logout'}
          onClick={logout}
          as={Link}
          to='/login'
        />
      </Menu.Menu>
    </Menu>
  ) : (
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
          name='login'
          active={activeItem === 'login'}
          onClick={handleItemClick}
          as={Link}
          to='/login'
        />
        <Menu.Item
          name='register'
          active={activeItem === 'register'}
          onClick={handleItemClick}
          as={Link}
          to='/register'
        />
      </Menu.Menu>
    </Menu>
  );
}
