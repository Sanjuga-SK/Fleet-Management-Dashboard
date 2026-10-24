# Bytebeam Fleet Management Dashboard

A fleet operations dashboard built with **React, TypeScript, Vite, and Supabase** for the Bytebeam Frontend Engineer Intern assignment.

The application helps operations teams monitor vehicles, inspect vehicle locations and historical movement, review trips, and identify operational alerts through an interactive map-based interface.

## 1. Project Overview

### Features

- **Fleet Dashboard:** Fleet KPIs, vehicle status, recent trip activity, alerts, and utilization insights.
- **Interactive Fleet Map:** Vehicle locations, status filters, vehicle details, movement history, and trip routes using Leaflet and OpenStreetMap.
- **Vehicle Registry:** Search, sorting, vehicle information, and telematics diagnostics.
- **Trip History:** Trip details, distance and speed metrics, and route visualization.
- **Operational Alerts:** Review alerts by severity and update alert status.
- **Authentication:** Supabase Auth with protected application routes.
- **Persistent Data:** Supabase PostgreSQL tables for vehicles, locations, trips, alerts, and user profiles.
- **Sample Telemetry:** Realistic simulated fleet data for evaluation.

### Design Decisions

- An operations-focused dashboard rather than a marketing landing page.
- Green (`#15803D`) for active fleet status, orange (`#F97316`) for attention states, and red for critical alerts.
- Historical GPS points stored separately to support movement-history visualization.
- Simulated telemetry used instead of requiring physical vehicle devices.
- Supabase used directly for authentication and database operations, avoiding an unnecessary separate API server.

### User Workflow

1. Sign in through the application.
2. Review the fleet overview and alerts.
3. Inspect vehicle locations and movement history on the map.
4. Search vehicle details and review telematics.
5. Examine trips and replay routes.
6. Review and update operational alert statuses.

## 2. Live Demo

- **Application URL:** [Replace with your deployed application URL]
- **Demo login:** [Provide a test account only if required and available]
- **Demo mode:** [Document the demo mode only if it exists in the final application]

Do not include personal account passwords or secret credentials in this README.

## 3. Technology Stack

| Technology | Purpose |
|---|---|
| React | Frontend UI |
| TypeScript | Type safety |
| Vite | Development server and build tooling |
| Tailwind CSS | Styling |
| Supabase Auth | Authentication |
| Supabase PostgreSQL | Persistent data storage |
| Leaflet / React-Leaflet | Interactive maps |
| OpenStreetMap | Map tiles |
| Recharts | Dashboard charts |
| Vitest | Automated tests |

## 4. Local Setup

### Prerequisites

- Node.js 18 or later
- npm 9 or later
- A Supabase project for backend-connected functionality

### Install dependencies

Open a terminal in the project root:

```bash
cd frontend
npm install
```

### Configure environment variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Run this command from `frontend/`. If your shell or file layout differs, copy `frontend/.env.example` to `frontend/.env.local` manually.

Configure the variables supported by the application:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-publishable-or-anon-key
```

Use the variable names expected by the actual frontend configuration. Never put a Supabase service-role key or other secret key in frontend environment variables.

### Start the development server

```bash
npm run dev
```

Open the local URL printed in the terminal, usually `http://localhost:5173`.

### Production build

```bash
npm run build
```

### Run tests

```bash
npm run test
```

Run these commands from `frontend/`, unless the root `package.json` explicitly provides equivalent scripts.

## 5. Supabase Backend Setup

### Database tables

| Table | Purpose |
|---|---|
| `public.profiles` | User profile information linked to Supabase Auth |
| `public.vehicles` | Vehicle registry and operational parameters |
| `public.vehicle_locations` | Historical GPS telemetry and movement points |
| `public.trips` | Trip details, metrics, and route coordinates |
| `public.alerts` | Operational alerts and their statuses |

### Relationships

- `profiles.id` references `auth.users.id`.
- `vehicle_locations.vehicle_id` references `vehicles.id`.
- `trips.vehicle_id` references `vehicles.id`.
- `alerts.vehicle_id` references `vehicles.id`.

Foreign-key behavior and security policies are defined in the SQL migrations.

### Apply the database migrations

1. Open your Supabase project.
2. Navigate to **SQL Editor**.
3. Run the core schema migration:

   `backend/supabase/migrations/20261023_init_fleet_schema.sql`

4. Run the user profiles and authentication migration, if included in the submitted project:

   `backend/supabase/migrations/20261023_user_profiles_and_auth_trigger.sql`

5. Run the sample data script:

   `backend/supabase/seed.sql`

Apply the migrations in the documented order. Review the SQL files before executing them in another Supabase project.

### Sample data

The seed script is designed to provide sample fleet data, including:

- 8 commercial vehicles
- 24 historical GPS telemetry points
- 4 trips
- 5 operational alerts

The data represents a simulated fleet operating around the Bengaluru logistics corridor. It is sample data, not live vehicle telemetry.

### Authentication and database security

- Supabase Auth handles user authentication.
- Protected routes restrict dashboard access to authenticated users.
- Row Level Security (RLS) policies control database access.
- Environment secrets must remain outside the submitted source code.

Review the actual SQL migrations and policies when configuring a new Supabase project.

## 6. Technical Decisions

### Architecture

The application uses a React frontend with Supabase for authentication and PostgreSQL data storage. A separate Express server was not introduced because the required application operations can be handled directly through Supabase.

### Data model

Vehicle records are separated from location history, trips, and alerts. This structure supports vehicle-to-trip relationships and historical movement visualization.

### Map library

Leaflet and React-Leaflet were selected with OpenStreetMap to provide an interactive map without requiring a proprietary mapping API key.

### Trade-offs

- Client-side search and sorting keep interactions simple for a small evaluation fleet.
- Seeded GPS telemetry makes the project easy to evaluate without physical devices.
- Route coordinates stored with trip records support route visualization without requiring a separate GIS server.

## 7. AI Usage

### AI tools used

- Google Antigravity IDE and its AI coding assistant.
- ChatGPT for planning, troubleshooting, reviewing requirements, and refining implementation instructions.

### Where AI helped

- Planning the application architecture and PostgreSQL schema.
- Creating sample fleet and GPS telemetry data.
- Implementing map interactions and dashboard components.
- Developing and reviewing tests.
- Troubleshooting database UUID errors and location-history integration.
- Reviewing the assignment scope and removing unnecessary features.

### Human review and modifications

AI-generated output was reviewed and modified during development. Examples include:

- Correcting invalid UUID values after a PostgreSQL type error.
- Updating the map implementation to use historical records from `vehicle_locations`.
- Removing unnecessary role-based complexity and focusing on the assignment requirements.
- Reviewing database setup and application behavior during testing.

### AI conversation records

Include one of the following in the submission ZIP:

- Exported AI chat logs under `docs/ai-chat-logs/`, or
- A text or Markdown file containing shareable links to the relevant conversations.

**AI chat log file:** [Confirm the actual file or folder included in the ZIP]

**Shareable conversation links:** [Add real links if available]

Do not leave placeholder text in the final submission.

## 8. Optional Walkthrough

**Video URL:** [Add a walkthrough link if you recorded one]

This section can be omitted if no walkthrough was recorded.

## 9. Optional Stretch Work

The application includes operational alert triage and historical telemetry breadcrumbs.

- Alerts are categorized by severity.
- Operators can acknowledge or resolve alerts where supported.
- Vehicle movement history is visualized using stored GPS coordinates.
- Trip routes can be displayed on the map.

These features extend the core fleet-monitoring workflow.

## 10. Testing and Quality Checks

Run the following commands from `frontend/`:

```bash
npm run test
npm run build
```

The project report indicated 11 automated tests and a successful production build. Re-run these commands against the final submitted version and update this section if the results differ.

Before submission, verify:

- Sign-in and logout.
- Protected routes.
- Dashboard, vehicles, trips, map, and alerts.
- Supabase data loading and persistence.
- Database setup instructions.
- Production build and tests.

## 11. Submission

The submission ZIP should contain:

- Frontend source code and required configuration files.
- Backend SQL migrations and seed data.
- A single root `README.md`.
- AI chat exports or a file containing shareable conversation links.
- Any other required project documentation.

Exclude `node_modules`, build output, cache folders, `.git`, `.env.local`, and secret credentials.

The ZIP must be under **100 MB**.

Submit the ZIP through the assignment form:

https://forms.gle/byk2ZDWnM1gEfyXA8

Do not upload the assignment to GitHub.

---

**Final reminder:** Replace all placeholders with actual details, verify the deployed application URL, and confirm that the AI conversation records are physically included in the ZIP before submitting.