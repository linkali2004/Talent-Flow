# 💼 Talent Flow — React.js Application

This is a **Hiring Web Platform** built with **React.js**.  
It uses **MirageJS** to simulate backend APIs, **IndexedDB** (via Dexie) for local data storage, and a modern UI powered by **TailwindCSS** and **Lucide React Icons**.

---

## 🚀 Setup

Follow the steps below to run the project locally:

### 1. Clone the repository
```bash
git clone <repository-url>
cd <project-folder>
```

### 2. Install dependencies
```bash
npm install
# or
yarn install
```

### 3. Run the development server
```bash
npm start
# or
yarn start
```

### 4. Open the app
Once the server is running, open your browser and navigate to:

👉 [http://localhost:5173](http://localhost:5173)

---
## Admin Login Credentials
-- Username: Shrey Dwivedi
-- Password: begpd9885m

## 🧱 Architecture

The **Talent Flow React.js app** follows a clean and modular structure designed for scalability and clarity.

### 🧩 Core Stack

- **Frontend Framework:**  
  Built with **React.js** using functional components and hooks for modularity and stateful behavior.

- **Routing:**  
  Implemented using **React Router DOM (v6)** for smooth client-side navigation.  
  Routes are defined in a centralized `App.jsx` file and include:
  - `/jobs`
  - `/candidates`
  - `/assessments`
  - `/responses`
  - `/notes`
  - `/login`
  - `/signup`
  

- **Styling:**  
  Uses **TailwindCSS** for responsive, utility-first styling.  
  Tailwind makes it easy to apply consistent design patterns directly within JSX.

- **Mock Backend (MirageJS):**  
  - **MirageJS** provides a full mock API server that intercepts fetch calls.  
  - It seeds **user**, **job**, and **notes** data from local JSON files.  
  - CRUD operations are simulated with in-memory persistence.  
  - Mirage runs once during app initialization (in `index.js` or `App.jsx`).

- **Local Storage (Dexie + IndexedDB):**  
  - Data is stored locally using **IndexedDB** for offline support.  
  - **Dexie.js** acts as a convenient wrapper to simplify IndexedDB queries and transactions.

- **State Management:**  
  Uses the **Context API** for global state sharing across pages.  
  Components subscribe to global data (like selected job, logged-in user, or assessment state) without prop drilling.

- **Icons & Notifications:**  
  - **Lucide React Icons** for lightweight, elegant icons.  
  - **React Toastify** for user-friendly toast notifications (success, error, info).

---

## 🪲 Issues
### 1. Attempted Test
The logic to show that a certain test and its score is still missing.
This can be implemented by:
- Implementing backend routes for score calculating 
- Implementing frontend code for displaying appropiate text
- Splitting complex states into smaller subcomponents

---

### 2. Assessment Builder Performance
When adding many questions to an assessment, **frequent state updates** can slow down the UI.  
This can be improved by:
- Using **React.memo()**
- Implementing **useCallback** for stable handlers
- Splitting complex states into smaller subcomponents

---

### 3. Context Sync Delays
Occasionally, components using shared context re-render later than expected, leading to small UI inconsistencies.  
This can be fixed by:
- Structuring state updates with **batching**
- Avoiding unnecessary deep context nesting

---

## ⚙️ Technical Decisions

- **React.js:**  
  Chosen for its component-driven architecture, ecosystem maturity, and compatibility with React Router for single-page applications (SPAs).

- **Dexie.js:**  
  Simplifies working with IndexedDB, allowing easy CRUD operations without dealing with complex IndexedDB APIs.

- **TailwindCSS:**  
  Enables fast and consistent UI development directly within JSX without managing external CSS files.

- **Context API:**  
  Chosen over Redux for simplicity — ideal for lightweight apps where full state normalization isn’t needed.

- **Client-Side Filtering & Searching:**  
  For jobs and candidates, all searching and filtering happen on the client after the initial load — improving performance and responsiveness without requiring backend queries.

- **Assessment Timer:**  
  A built-in timer runs during assessments.  
  When the timer ends, the user’s response auto-submits to ensure fairness.

---
---

## 💡 Notes

- The app uses **Vite** (or CRA) as the React development environment for faster build and refresh.  
- **Hot Reloading** automatically updates the browser view when you change the code.  
- MirageJS and Dexie work together to mimic a full-stack workflow entirely in the browser.
