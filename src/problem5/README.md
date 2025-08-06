# Configuration

This repository contains a full-stack application with a backend built using ExpressJS and MongoDB, and a frontend built using ReactJS and Redux Toolkit.

---

## Backend

## API Routes

### User Routes

Base URL: `/api/v1.0/users`

| Method | Endpoint | Description         |
| ------ | -------- | ------------------- |
| GET    | `/`      | Fetch all users     |
| POST   | `/`      | Create a new user   |
| GET    | `/:id`   | Fetch a user by ID  |
| PUT    | `/:id`   | Update a user by ID |
| DELETE | `/:id`   | Delete a user by ID |

### Prerequisites

-   Node.js installed (^v23.x.x)
-   MongoDB running locally or a connection string to a MongoDB instance

### Setup

1. Navigate to the `backend_service` directory:

```bash
   cd backend_service
```

2. Install dependencies:

```bash
    npm install
```

3. Create a .env file in the backend directory and configure the following:

```env
DB_USER=<your-db-user>
DB_PASSWORD=<your-db-password>
```

4. Start the backend server:

```bash
    npm run dev
```

## Frontend

### Prerequisites

-   Node.js installed (^v23.x.x)

### Setup

1. Navigate to the frontend directory:

```bash
    cd frontend
```

2. Install dependencies:

```bash
    npm install
```

3. Start the application:

```
    npm run dev
```

## Notes

-   Ensure the backend server is running before starting the frontend for proper API communication.
