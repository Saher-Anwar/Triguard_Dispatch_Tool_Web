# Triguard Web Dispatch Tool

A modern, role-based field service dispatch and scheduling web application built for Triguard. It gives dispatchers and agents a single interface to manage appointments end-to-end — from booking through assignment, status tracking, and completion — while enforcing granular permissions across every action.

---

<!-- Demo placeholder -->
<!-- ![Demo](demo.gif) -->
> **Demo:** Add a screen recording or animated GIF here once the app is deployed.

---

## Tech Stack

| Category | Technology |
|---|---|
| Framework | React 19 |
| Language | TypeScript 5.9 |
| Build tool | Vite 7 with SWC plugin |
| Styling | Tailwind CSS v4 |
| UI components | Radix UI primitives, shadcn/ui patterns |
| Icons | Lucide React |
| Routing | React Router v7 |
| Server state | TanStack Query v5 |
| Client state | Zustand v5 |
| Forms | React Hook Form |
| Address search | Mapbox Search JS React (AddressAutofill) |
| Date handling | date-fns, React Day Picker |
| Auth | AWS Cognito (OAuth 2.0 Authorization Code), jwt-decode |
| Notifications | Sonner, react-hot-toast |
| Linting | ESLint 9, typescript-eslint |

---

## Features

### Permission System

Navigation items, action buttons, and table controls are all gated by a code-based permission system. Permissions are attached to the authenticated user and evaluated client-side via the `usePermissions` hook.

| Code | Description |
|---|---|
| `APPOINTMENTS.VIEW.ALL` | View all appointments |
| `APPOINTMENTS.VIEW.SELF` | View only your own appointments |
| `APPOINTMENTS.CREATE` | Create new appointments |
| `APPOINTMENTS.DELETE` | Delete appointments |
| `APPOINTMENTS.UPDATE.ASSIGN_AGENT` | Assign or reassign agents |
| `APPOINTMENTS.UPDATE.SELF_ASSIGN` | Assign yourself to an appointment |
| `APPOINTMENTS.UPDATE.STATUS` | Update appointment status |
| `USERS.VIEW` | View the user management page |
| `USERS.CREATE` | Create users |
| `USERS.DELETE` | Delete users |
| `USERS.UPDATE.PERMISSIONS` | Modify a user's individual permissions |
| `ROLES.CREATE` | Create roles |
| `ROLES.DELETE` | Delete roles |
| `ROLES.UPDATE` | Add permissions to roles |
| `DISPOSITIONS.CREATE` | Create disposition codes |
| `DISPOSITIONS.DELETE` | Delete disposition codes |

In mock mode, the injected user holds all permissions. To test a restricted access level, edit the `permissions` array in `src/mock/mockUser.ts`.

### Appointment Management
- Searchable, filterable data table of all appointments with real-time status badges
- Create new appointments with full customer intake — date/time, appointment type (physical or virtual), customer contact details, Mapbox address autofill with geocoding, roof age, main concern, spouse information, credit score, and call center notes
- Assign or reassign field agents to appointments, with candidates ranked by proximity
- Inline status updates (Unassigned, Scheduled, In Progress, Complete, Cancelled, Rescheduled) directly from the table
- Complete an appointment by selecting a disposition code and adding a completion note
- View appointment details including disposition summary and live tracking stats when an appointment is in progress
- Filter between all appointments and your own assigned appointments

### User Management
- Tabular view of all system users with role and status information
- Granular per-user permission editor — grant or revoke individual permissions without changing the user's role
- Delete users with confirmation dialog; unassigns them from any open appointments automatically

### Settings (Roles and Dispositions)
- Create and delete roles; assign any combination of system permissions to a role
- Create and delete disposition codes used to classify completed appointments
- Collapsible sections for a clean, scannable layout

### Reports
- Summary stat cards (total appointments, completed, in progress, top performer) with period selector (week, month, quarter, year)
- Chart placeholder ready for a charting library integration

### Authentication and Access Control
- AWS Cognito OAuth 2.0 Authorization Code flow with PKCE-style redirect
- First-time login redirects to a self-registration page to complete the user profile
- JWT validation with automatic redirect on token expiry
- Granular permission codes control what each user sees and can do — navigation items, action buttons, and table columns all respect permissions
- Dark/light theme toggle with preference persisted to localStorage

### Mock Mode
- Run the entire application without a backend — no Cognito credentials required
- All data is served from static JSON fixtures in `public/mock/`
- Every write operation (create, update, delete) mutates the in-memory store so changes persist for the duration of the session
- A visible amber banner reminds you that mock mode is active and that data resets on refresh

### Responsive Design
- Desktop sidebar navigation with collapsible toggle
- Mobile bottom tab bar that renders only the tabs the current user has access to
- All dialogs and data tables adapt to small screens

---

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm 9 or later

For Mocked environment, no external setup is required.

For production or development against a real backend you need:

- A Mapbox account with a public access token (required for address autofill)
- A running Triguard backend API
- An AWS Cognito User Pool configured with a public client and the appropriate callback URLs

### Environment Setup

The project ships with three environment files:

| File | Purpose |
|---|---|
| `.env` | Local development against a real backend |
| `.env.mock` | Mock mode — no backend or Cognito required |
| `.env.production` | Production build |

Copy `.env.mock` to get started immediately without a backend:

### Environment Variables

All variables are prefixed with `VITE_` and are inlined at build time by Vite.

| Variable | Required | Description |
|---|---|---|
| `VITE_MOCK` | No | Set to `true` to enable mock mode. When true, all API calls use local JSON fixtures and Cognito auth is bypassed. Automatically set by `npm run mock` via `.env.mock`. |
| `VITE_API_ENDPOINT` | Yes (non-mock) | Base URL of the Triguard backend API (e.g. `https://app.salesdispatcher.com/api`). |
| `VITE_COGNITO_DOMAIN` | Yes (non-mock) | Full URL of the Cognito hosted UI domain (e.g. `https://<pool>.auth.<region>.amazoncognito.com`). |
| `VITE_CLIENT_ID` | Yes (non-mock) | Cognito app client ID (public client, no client secret). |
| `VITE_COGNITO_CALLBACK_URL` | Yes (non-mock) | OAuth callback URL registered in Cognito (e.g. `https://app.salesdispatcher.com/callback`). Must match exactly. |
| `VITE_MAPBOX_TOKEN` | Yes | Mapbox public access token used for address autofill in the appointment creation and user registration forms. |

> **Note:** Never commit `.env`, `.env.local`, or `.env.production` to source control if they contain real credentials.

---

### Running in Mock Mode

```bash
npm run mock
```

Starts Vite with `--mode mock`, which loads `.env.mock` and sets `VITE_MOCK=true`. In this mode:

- Cognito authentication is bypassed entirely — a pre-built admin user is injected automatically
- All API calls are intercepted and served from the JSON files under `public/mock/`
- Write operations (create appointment, delete user, etc.) update an in-memory store, so changes are visible immediately but reset on page refresh
- A banner at the top of the screen confirms mock mode is active

This is the fastest way to explore or develop features without any infrastructure.

### Running in Development Mode

```bash
npm run dev
```

Starts Vite on `http://localhost:5173`. Requires a live backend and valid Cognito credentials set in your `.env` / `.env.local`.


### Building for Production

```bash
npm run build
```

Runs the TypeScript compiler and then Vite's production build. Output lands in `dist/`. The project includes an `nginx.conf` for serving the SPA.

```bash
npm run preview   # preview the production build locally
```

---