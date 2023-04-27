import { Image } from 'semantic-ui-react';
import { getPictureURL } from '../util/profilePictureDictionary';

export function LikePictures({ post }) {
  console.log(post.likes);
  const likeLength = post.likes.length;

  return (
    <>
      {likeLength >> 0 ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row-reverse',
            marginRight: '.5rem',
          }}
        >
          {post.likes?.slice(0, 3).map((like, count) => (
            <>
              <Image
                src={getPictureURL(like.profilePicture)}
                style={{
                  width: '30px',
                  position: 'relative',
                  left: count === 0 ? '0' : count === 1 ? '15px' : '30px',
                  borderRadius: '50%',
                  boxShadow: '0 1px 3px 0 #d4d4d5,0 0 0 1px #d4d4d5',
                }}
                inline
              />
            </>
          ))}
        </div>
      ) : (
        ' Nobody liked this.'
      )}
    </>
  );
}
