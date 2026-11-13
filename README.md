# Contact-App

A MERN contact manager: register, log in, and manage a list of contacts with photos,
favourites, search, bulk delete and Excel export.

## Tech stack

- **Frontend:** React (Vite), React Router, plain CSS, react-icons, xlsx
- **Backend:** Node.js, Express, Mongoose, JWT auth, bcrypt, Multer
- **Database:** MongoDB

## Project structure

```
Contact_App/
|- backend/     Express API (routes, schemas, middleware, uploads)
|- frontend/    React app (pages, components, css)
|- infra/       CloudFormation template for the EC2 deployment
|- docs/        Setup and deployment guides
|- .github/     GitHub Actions deploy workflow
```

## Local development

Start the backend:

```
cd backend
npm install
npm run dev
```

Start the frontend (in another terminal):

```
cd frontend
npm install
npm run dev
```

The frontend runs on http://localhost:5173 and talks to the API on http://localhost:8000.
Open the site and register an account to get started.

### Environment variables

The backend reads `backend/.env`:

```
PORT=8000
DB_URL=mongodb://localhost:27017/contactManager
JWT_SECRET=some-long-random-string
BASE_URL=http://localhost:8000
```

`BASE_URL` is the prefix the backend adds to uploaded photo URLs. Locally it points at the
backend (`http://localhost:8000`) so photos load directly. In production it is left empty so
photos are served from the same origin through nginx.

## Tests and lint

```
cd frontend
npm run lint
npm test
```

## Deployment

The app deploys to AWS EC2 automatically with GitHub Actions. See:

- [docs/01-setup-github-secrets.md](docs/01-setup-github-secrets.md) - add AWS and JWT secrets
- [docs/02-deploy.md](docs/02-deploy.md) - how the deployment works
