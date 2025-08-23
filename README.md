
# Roxiler Assignment-Ratings App

## 🛠 Tech Stack
- **Frontend**: [React.js](https://react.dev/) with [Vite](https://vitejs.dev/)

- **Backend**: [Node.js](https://nodejs.org/) with [Express.js](https://expressjs.com/)  
- **Database**: [PostgreSQL](https://www.postgresql.org/)  
- **Authentication & Security**: JSON Web Tokens (JWT), bcrypt 

---

## API + Frontend Setup Guide

### 1. Clone Repository

```sh
git clone <your-repo-url>
cd <your-repo-folder>
```

---

### 2. Environment Files

* Convert `.env.example` files into `.env` for **both API and Frontend**

```sh
mv api/.env.example api/.env
mv frontend/.env.example frontend/.env
```

⚠️ **Important**:

* If you are running **without Docker Compose**, set

```env
HOST=localhost
```

inside **api/.env** instead of `db`.

---

### 3. Run with Docker Compose (Recommended)

```sh
docker compose up --build
```

---

### 4. Run without Docker Compose

#### Start Database (Postgres)
    - add a new database `ratings_app_db`
    - add new user `roxiler` with password `roxiler`
    - Run the ./db/initite_db.sql to configure the database
    - or you may change env variable in ./api/.env as per your db

#### Start API

```sh
npm i
node src/index.js
```

#### Start Frontend

```sh
npm i
npm run dev
```

---
### 5. Aceessing the appilication
- At `http://localhost:5173` the react frontend will be running 
- At `http://localhost:3000` the backend express API will be running

## API Endpoints

### Public

* `GET /` → Check if API is running
* `POST /auth/register` → Register new user
* `POST /auth/login` → Login user

### Authenticated (Login Required)

* `POST /auth/logout` → Logout
* `POST /auth/update-password` → Update user password
* `GET /auth/user-details` → Get logged-in user details

### Admin Only

* `POST /admin/add-store` → Create new store
* `POST /admin/add-user` → Add new user
* `GET /admin/users` → Get all users
* `GET /admin/dashboard-metrics` → Get dashboard metrics

### Stores (Authenticated)

* `GET /stores/` → Fetch stores (**admin, user**)
* `GET /stores/ratings` → Fetch store ratings (**owner**)
* `POST /stores/ratings/upsert` → Add/update rating (**user**)

