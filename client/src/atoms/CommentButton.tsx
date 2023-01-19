import { Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

export function CommentButton({ id, commentCount, showLabel = true }) {
  return showLabel ? (
    <Button
      as={Link}
      to={`/posts/${id}`}
      basic={!commentCount ? true : false}
      color='blue'
      icon='comment alternate'
      label={{
        basic: true,
        color: 'blue',
        content: commentCount,
      }}
    />
  ) : (
    <Button
      as={Link}
      to={`/posts/${id}`}
      basic={!commentCount ? true : false}
      color='blue'
      icon='comment alternate'
    />
  );
}
