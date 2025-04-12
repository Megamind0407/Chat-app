# Chat Application

## About the Project

This is a **Real-Time Chat Application** built using the **MERN stack** (MongoDB, Express.js, React, Node.js) and **Socket.io** for bi-directional communication between clients and the server. The application allows users to join rooms, send messages in real time, and display all active users.

---

## Features

- 🗣 **Real-Time Messaging:** Users can send and receive messages instantly.
- 💬 **User Authentication:** Login using JWT (JSON Web Tokens).
- 🏠 **Private & Group Chats:** Join and leave chat rooms seamlessly.
- 🔐 **User Authentication:** User login/logout with JWT.
- 🔔 **Notifications:** Real-time notifications when a user sends a message.
- 💾 **Message History:** All chat messages are stored in MongoDB and can be accessed later.
- 🖥 **Responsive Design:** Works on both mobile and desktop devices.

---

## Technologies Used

- **MongoDB** - NoSQL database to store messages and user data.
- **Express.js** - Web framework for Node.js to handle server-side logic.
- **React** - Frontend library for building the user interface.
- **Node.js** - JavaScript runtime environment for backend services.
- **Socket.io** - Enables real-time, bidirectional communication.
- **JWT** - Used for secure user authentication.

---

## Getting Started

### Prerequisites

Ensure you have the following installed on your machine:

- Node.js (v16 or later)
- MongoDB
- NPM or Yarn

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/YourUsername/chat-app-mern.git
   cd chat-app
   ```
2. **Install Dependencies:**

   ```bash
   npm install
   ```
3. **Setup MongoDB:**

 - Install and run MongoDB locally, or use a cloud service like MongoDB Atlas.
 - Configure the MongoDB connection URI in the `backend/db/db.js` file.

---

## Run Application

**Start Server**
```
cd backend
npm run server
```
**Start Client**
```
cd frontend
npm run dev
```

**Open the app in your browser at `http://localhost:3000`**

## API Endpoints
- POST `/api/auth/login` : Logs a user in and returns a JWT token for authentication.
- POST `/api/auth/signup` : Registers a new user.
- POST `/api/auth/logout` : Logout user and returns JWT token.
- GET  `/api/users` : Fetch all registered users.
- GET `/api/messages` : Fetch all messages from a user.
- POST `/api/messages/send/:id` : Send a new Message to user with the help of user_id.
- GET `/api/messages/:id` : Fetch a message for a specific user with user_id.
---

## Usage
- Register or Login: Enter your username, password and join the chat.
- Send Messages: Type messages and hit Enter to send them to others.
- Real-Time Updates: Messages will appear instantly for a user as a notification.
- Set Online Status for online-users

## Contributing
We welcome contributions to this project! Please follow the steps below:

- **Fork the repository.**
- **Create a new branch: `git checkout -b feature/your-feature-name`.**
- **Make your changes.**
- **Commit your changes: `git commit -m 'Add feature'`.**
- **Push your changes: `git push origin feature/your-feature-name`.**
- **Open a pull request.**
