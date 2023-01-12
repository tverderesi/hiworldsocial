import { Card, Icon, Label, Image, Button } from 'semantic-ui-react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import React from 'react';
export default function Post({
  post: { body, createdAt, username, likeCount, commentCount, likes, id },
}: {
  post: any;
}) {
  const likePost = (e: React.SyntheticEvent) => {
    e.preventDefault();
  };
  return (
    <>
      <Card fluid>
        <Card.Content color='black'>
          <Image
            floated='right'
            size='mini'
            src='https://react.semantic-ui.com/images/avatar/large/molly.png'
          />
          <Card.Header>{username}</Card.Header>
          <Card.Meta
            as={Link}
            to={`/posts/${id}`}
          >
            {moment(createdAt).fromNow(true)}
          </Card.Meta>
          <Card.Description>{body}</Card.Description>
        </Card.Content>
        <Card.Content extra>
          <Button
            basic={!commentCount ? true : false}
            color='blue'
            icon='comment alternate'
            label={{
              basic: true,
              color: 'blue',
              content: commentCount,
            }}
          />

          <Button
            basic={!likeCount ? true : false}
            color='red'
            icon='heart'
            label={{
              basic: true,
              color: 'red',
              content: likeCount,
            }}
            onClick={likePost}
          />
        </Card.Content>
      </Card>
    </>
  );
}
