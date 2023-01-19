import { Link } from 'react-router-dom';

export function Logo() {
  const style: React.CSSProperties = {
    fontWeight: 'bold',
    alignSelf: 'center',
    justifySelf: 'center',
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
  };
  return (
    <Link
      to={'/'}
      style={style}
      className='logo'
    >
      Hi World! 🌎
    </Link>
  );
}
