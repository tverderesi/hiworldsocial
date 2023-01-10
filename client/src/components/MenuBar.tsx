import { useState } from 'react';
import { Menu, MenuItemProps, Segment } from 'semantic-ui-react';

export default function MenuBar() {
  const [state, setState] = useState({ activeItem: 'home' });
  const { activeItem } = state;

  const handleItemClick = (
    e: React.SyntheticEvent<any, any>,
    { name }: MenuItemProps
  ) => (name ? setState({ activeItem: name }) : '');

  return (
    <div>
      <Menu
        pointing
        secondary
      >
        <Menu.Item
          name='home'
          active={activeItem === 'home'}
          onClick={handleItemClick}
        />
        <Menu.Item
          name='messages'
          active={activeItem === 'messages'}
          onClick={handleItemClick}
        />
        <Menu.Item
          name='friends'
          active={activeItem === 'friends'}
          onClick={handleItemClick}
        />
        <Menu.Menu position='right'>
          <Menu.Item
            name='logout'
            active={activeItem === 'logout'}
            onClick={handleItemClick}
          />
        </Menu.Menu>
      </Menu>

      <Segment></Segment>
    </div>
  );
}
