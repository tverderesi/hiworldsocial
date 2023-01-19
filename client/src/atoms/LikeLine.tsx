export function LikeLine(post: any) {
  const likeLength = post.likes?.length;

  return (
    <>
      {post.likes?.slice(0, 3).map((like, count) => (
        <>
          <span style={{ fontWeight: 'bold' }}>{like.username}</span>
          {likeLength > 2 && count < likeLength - 1 ? ', ' : ''}
          {likeLength === 2
            ? ' and '
            : likeLength === 3 && count === 1
            ? 'and '
            : ''}
        </>
      ))}{' '}
      {likeLength > 3
        ? `${' and '}
      ${likeLength - 3} more ${likeLength - 3 === 1 ? 'user' : 'users'}`
        : ''}
      {post.likes.length >> 0 ? ' liked this.' : ' Nobody liked this.'}
    </>
  );
}
