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

  const style: React.CSSProperties = {
    fontWeight: 'bold',
    alignSelf: 'center',
    justifySelf: 'center',
    position: 'absolute',
    left: '45vw',
    width: '130px',
    textAlign: 'center',
  };

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
        active
        onClick={handleItemClick}
        as={Link}
        to='/'
      />
      <div style={style}>Hi World! 🌎</div>

      <Menu.Menu position='right'>
        <Menu.Item
          name='logout'
          onClick={logout}
          as={Link}
          to='/login'
          style={{ fontWeight: 'bold' }}
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
      <div style={style}>Hi World! 🌎</div>
      <Menu.Menu position='right'>
        <Menu.Item
          name='login'
          active={activeItem === 'login'}
          onClick={handleItemClick}
          as={Link}
          to='/login'
          style={{ fontWeight: 'bold' }}
        />
        <Menu.Item
          name='register'
          active={activeItem === 'register'}
          onClick={handleItemClick}
          as={Link}
          to='/register'
          style={{ fontWeight: 'bold' }}
        />
      </Menu.Menu>
    </Menu>
  );
}
