# ShopT1 - In-Game Item Marketplace

ShopT1 is a web application for buying and selling in-game items. Users can browse listings, create their own listings, and purchase items from other users. The application also includes an admin panel for managing users, listings, and transactions.

## Features

*   **User Authentication:** Users can register and log in to their accounts.
*   **Admin Authentication:** A separate login for administrators.
*   **Browse Listings:** Users can browse and search for game account listings.
*   **Create Listings:** Authenticated users can create new listings to sell their in-game items.
*   **Image Uploads:** Users can upload images for their listings.
*   **Admin Dashboard:** An admin panel for managing users and listings.

## Technologies Used

### Frontend

*   [Next.js](https://nextjs.org/) - React framework for server-side rendering and static site generation.
*   [React](https://reactjs.org/) - A JavaScript library for building user interfaces.
*   [TypeScript](https://www.typescriptlang.org/) - A typed superset of JavaScript.
*   [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework.
*   [axios](https://axios-http.com/) - A promise-based HTTP client for the browser and Node.js.

### Backend

*   [Node.js](https://nodejs.org/) - A JavaScript runtime built on Chrome's V8 JavaScript engine.
*   [Express.js](https://expressjs.com/) - A fast, unopinionated, minimalist web framework for Node.js.
*   [MongoDB](https://www.mongodb.com/) - A cross-platform document-oriented database program.
*   [Mongoose](https://mongoosejs.com/) - An Object Data Modeling (ODM) library for MongoDB and Node.js.
*   [JSON Web Tokens (JWT)](https://jwt.io/) - For user and admin authentication.
*   [bcryptjs](https://www.npmjs.com/package/bcryptjs) - For password hashing.
*   [multer](https://www.npmjs.com/package/multer) - For handling file uploads.
*   [cors](https://www.npmjs.com/package/cors) - For enabling Cross-Origin Resource Sharing.

## Getting Started

### Prerequisites

*   Node.js and npm
*   MongoDB

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    ```

2.  **Install backend dependencies:**
    ```bash
    cd backend
    npm install
    ```

3.  **Install frontend dependencies:**
    ```bash
    cd ../frontend-new
    npm install
    ```

### Running the application

1.  **Run the backend server:**
    ```bash
    cd backend
    npm start
    ```
    The backend server will start on `http://localhost:5000`.

2.  **Run the frontend development server:**
    ```bash
    cd frontend-new
    npm run dev
    ```
    The frontend server will start on `http://localhost:3000`.
