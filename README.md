# Real Estate App

A full-stack real-estate platform with a React + Vite frontend and an Express + MongoDB backend. The app provides property listings, property detail pages with media, role-based dashboards (admin, agent, tenant), inquiries, and authentication.

## Features

- Property browsing and search
- Property detail pages with media gallery and inquiry forms
- Agent: add properties, view rent roll, occupancy, expenses and inquiries
- Admin: manage users and properties
- Tenant: view assigned units, submit complaints and payments
- Authentication and role-based access control

## Repo layout

- client/ — React frontend (Vite)
- server/ — Express backend (MongoDB + Mongoose)
- config/ — shared configuration (database, cloudinary)

## Prerequisites

- Node.js (v16+ recommended)
- npm or yarn
- MongoDB (local or a hosted connection string)

## Environment

Create `.env` files for the server (and client if needed). Typical variables:

- `MONGO_URI` — MongoDB connection string
- `JWT_SECRET` — secret for signing JWTs
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` — for media uploads
- `PORT` — backend port (default 5000)

See `server/config/db.js` and `server/config/cloudinary.js` for how variables are consumed.

## Install

Install dependencies for both client and server:

```bash
# from the repo root
cd client && npm install
cd ../server && npm install
```

## Run (development)

Start the backend and frontend in separate terminals:

```bash
# Backend
cd server
npm run dev

# Frontend
cd client
npm run dev
```

The frontend uses Vite (typically at http://localhost:5173) and proxies API calls to the backend as configured in `client/package.json` / `vite.config.js`.

## Seed the database

If you need sample data, run the seed scripts in the `server` folder (if present):

```bash
cd server
node seedUsers.js
node seed.js
```

## Build and Deploy

Build the frontend for production:

```bash
cd client
npm run build
```

Serve the `dist` output with a static host or integrate into the server for a full-stack deployment.

## Scripts (quick reference)

- `client`: `npm run dev`, `npm run build`, `npm run preview`
- `server`: `npm run dev` (uses nodemon), `npm start`

## Contributing

Contributions are welcome. Typical workflow:

1. Fork the repo
2. Create a feature branch
3. Open a PR with a clear description

Please run linting and tests (if added) before opening a PR.

## License

This project does not include a license file. Add one if you intend to open-source the repository.

---

Updated README with setup, env, and run instructions.
# Real-Estate-Management-System
