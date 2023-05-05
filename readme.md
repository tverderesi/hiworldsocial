# Hey World Social Network

Hey World is a social network web application built with React, Node.js, and MongoDB. The project allows users to create profiles, post messages, comment on messages, and edit their profiles. The application is designed to be simple and easy to use, with a clean and intuitive user interface.

## Features

- User registration and authentication
- User profiles with avatars
- Posting messages
- Commenting on messages
- deleting meesages
- editing profile

## Database
Hey World uses MongoDB as its database system. The application has one database called **merng**, which contains two collections:

**users**: stores user profile information including usernames, email addresses, passwords, and profile pictures.
**messages**: stores message data including the message content, user who posted it, and comments on the message.

Before running the application, make sure to create the merng database and its collections in your local or remote MongoDB instance. You can use the following commands to create the collections in the MongoDB shell:

```
use merng
db.createCollection("users")
db.createCollection("messages")
```

Once you have created the collections, you can set the MongoDB URI in the .env file and start the development server to begin using the application.

## Getting Started

1. Clone the repository to your local machine:

```
git clone https://github.com/<username>/hey-world.git
```

2. Install the required dependencies:

```
npm run install-deps
```
3. Create a `.env` file in the root directory with the following variables:
```
   MONGODB=<your-mongodb-uri>
   SECRET_KEY=<your-secret-key>
   ```

4. Start the development server:

```
npm run dev
```

5. Open the application in your web browser at `http://localhost:3000`.

## Features Pipeline

- [x] User registration and authentication
- [x] User profiles with avatars
- [x] Posting messages
- [x] Commenting on messages
- [x] Deleting messages
- [ ] Editing profiles (In progress)
- [ ] Deleting profile
- [x] Deployement

## Technologies Used

- React
- Node.js
- Express
- MongoDB
- GraphQL
- Apollo Server/Client
- Semantic UI React

## Contributing

Contributions to Hey World are welcome and encouraged! If you find a bug, have a feature request, or want to contribute code, please submit an issue or pull request.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for more details.
