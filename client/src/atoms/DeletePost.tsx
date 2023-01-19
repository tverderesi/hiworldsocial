import { Button } from 'semantic-ui-react';

export function DeletePost(user: any, username: any) {
  return (
    <div style={{ width: '40px' }}>
      {user && user.username === username && (
        <Button
          color='purple'
          icon='trash'
          style={{ position: 'absolute' }}
        />
      )}
    </div>
  );
}
