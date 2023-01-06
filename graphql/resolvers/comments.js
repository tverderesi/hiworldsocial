const { UserInputError } = require('apollo-server');
const Post = require('../../models/Post');
const checkAuth = require('../../utils/checkAuth');

module.exports = {
  Mutation: {
    createComment: async (_, { postId, body }, context) => {
      const { username } = checkAuth(context);

      if (body.trim() === '') {
        throw new UserInputError('Empty comment.', {
          errors: { body: 'Comment body must not be empty.' },
        });
      }
      if (!username) {
        throw new Error(`user not found. ${username}`);
      }
      const post = await Post.findById(postId);

      if (post) {
        post.comments.unshift({
          body,
          username,
          createdAt: new Date().toISOString(),
        });
        await post.save();
        return post;
      } else throw new UserInputError('Post not found!');
    },
  },
};
