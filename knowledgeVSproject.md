1. Simple Architecture
   Browser (React + Vite)
   |
   | fetch() JSON + Authorization: Bearer <token>
   v
   Express server (port 8000)
   |
   | authMiddleware -> verifies JWT
   | router -> validates request -> Mongoose model
   v
   MongoDB (local) -> User collection, Contact collection
   What each layer does:

- React frontend displays pages, holds temporary UI state in useState, and (only after Phase 7) sends requests to Express.
- Express backend receives requests, checks the token, runs a Mongoose operation, and returns { success, message, result }.
- Mongoose converts JavaScript objects into MongoDB documents and back.
- MongoDB stores two collections: one User (the single admin) and many Contact documents.
- JWT is created at login, stored in the browser, and attached to every contact request. authMiddleware verifies it before the contact router runs.
- bcrypt is used only in two places: the setup script hashes the admin password once, and the login route compares the entered password with that hash.
  One request, end to end (after Phase 8+):

1. User opens /contacts.
2. React runs a fetch("http://localhost:8000/contacts") with the token.
3. Express middleware verifies the token.
4. Contact router calls Contact.find().
5. MongoDB returns documents.
6. Express returns { success: true, message, result }.
7. React stores result in useState.
8. .map() renders the contact cards.
   Architecture decisions that keep it beginner-friendly:

- One admin only → no registration page, no roles, no user-contact relationship.
- Route logic stays inside routers → no controllers/services.
- No populate() → contacts are independent documents.
- Single-user app → no userId field needed initially.

2. Final Folder Structure
   Items marked (Phase N) are added in that phase, not at project creation.
   MERN/
   ├── knowledge.md
   ├── .gitignore
   │
   ├── backend/
   │ ├── index.js
   │ ├── package.json
   │ ├── .env (Phase 9)
   │ ├── uploads/ (Phase 13, contact photos)
   │ │
   │ └── src/
   │ ├── connectToDb.js
   │ │
   │ ├── schema/
   │ │ ├── userSchema.js
   │ │ └── contactSchema.js
   │ │
   │ ├── routes/
   │ │ ├── authRoute.js
   │ │ └── contactRoute.js
   │ │
   │ ├── middleware/
   │ │ └── authMiddleware.js (Phase 9)
   │ │
   │ └── scripts/
   │ └── createAdmin.js
   │
   └── frontend/
   ├── package.json
   ├── index.html
   ├── vite.config.js
   │
   └── src/
   ├── main.jsx
   ├── App.jsx
   ├── config.js (Phase 8, one base URL constant)
   │
   ├── components/
   │ ├── Sidebar.jsx
   │ ├── Header.jsx
   │ ├── ContactCard.jsx
   │ ├── ContactList.jsx
   │ ├── ConfirmDelete.jsx
   │ └── ProtectedRoute.jsx (Phase 10)
   │
   ├── pages/
   │ ├── Login.jsx
   │ ├── Dashboard.jsx
   │ ├── Contacts.jsx
   │ ├── Favorites.jsx
   │ ├── AddContact.jsx
   │ ├── ContactDetails.jsx
   │ └── EditContact.jsx
   │
   ├── css/
   │ ├── global.css
   │ ├── sidebar.css
   │ ├── dashboard.css
   │ ├── contacts.css
   │ └── forms.css
   │
   └── assets/
   Notes:

- config.js is a tiny file with export let baseURL = "http://localhost:8000"; it uses only import/export and avoids editing seven files at deployment.
- ProtectedRoute.jsx is a small wrapper, not a new architecture pattern. Without it, protection would be duplicated in every page.
- No controllers, services, Redux, Context, or custom hooks.

3. Already-Known Concepts That Will Be Used
   Area Concepts used
   JavaScript let/const, objects, arrays, map(), arrow functions, params/return, template literals, import/export
   Express app setup, express.json(), Router(), app.use() mounting, req.body, req.params, req.query
   Express async/await, try/catch, GET/POST/PATCH/DELETE, JSON responses, status codes
   Mongoose connect, Schema, Model, String/Number fields, required/optional
   Mongoose create, find, findById, findByIdAndUpdate({new:true}), findByIdAndDelete
   React Vite setup, JSX, components, props, useState, events, controlled forms, conditional rendering, map() with keys
   Routing BrowserRouter, Routes, Route, NavLink, useNavigate, useParams
   Styling plain CSS files, class names, inline style objects
   Security primitives bcrypt.hash, bcrypt.compare, jwt.sign, jwt.verify
   Important distinction for viva: you know the four security functions, but you have never built a login endpoint or middleware. Those integrations are new and must be taught.
4. New Concepts To Learn Before Use
   4.1 Small additions (10–20 minutes each)
   Concept Why needed
   Boolean schema type and default: false isFavorite field
   Date schema type lastVisitedAt field
   Static routes before /:id /contacts/favorites, /contacts/recent, /contacts/bulk-delete must not be treated as an id
   User.findOne({ email }) Login lookup by email
   Array.filter() and String.includes() / toLowerCase() Name search
   Mongoose .sort({ lastVisitedAt: -1 }).limit(10) Recently viewed order
   for loop with await Bulk delete using known findByIdAndDelete
   Checkbox input + array state Selecting multiple contacts
   CSS flexbox/grid basics Sidebar + card layout
   CSS media queries Responsive design
   4.2 Learning gates (must be taught with a separate mini-example)

# Concept

1 useEffect()
2 fetch() with GET/POST/PATCH/DELETE, JSON headers, body stringify
3 CORS (cors package)
4 Reading req.headers.authorization, Bearer token parsing, req.user
5 .env + dotenv
6 localStorage set/get/remove
7 Protected route with <Navigate>
8 Multer + multipart/form-data + FormData + express.static
9 Excel library (xlsx)
10 Deployment: Atlas, Render, Vercel, production env/CORS
4.3 Decisions and risks to settle before coding

1.  Temporary open APIs: Phases 3–4 build Contact CRUD without auth so Postman testing is simple. Phase 9 adds the middleware and we retest. Final app must be protected; this is intentional, not a skipped requirement.
2.  Bulk delete: Use a for loop with your known findByIdAndDelete, not deleteMany({ $in: [...] }), because $in would be a new MongoDB operator to defend in viva.
3.  Search: Follow the requirement and send GET /contacts?search=...; backend uses req.query (known), then Array.filter()/includes() (tiny new) instead of regex.
4.  Recent contacts: Use Mongoose .sort().limit() rather than manual Date comparison in JS.
5.  Excel vs CSV: Use the xlsx package because the requirement says Excel. CSV would avoid the dependency but would not meet the stated requirement.
6.  Photos are the riskiest feature for viva because Multer is a completely new library. If time is short, we must explicitly agree to drop it, not silently skip it.
7.  JWT secret: Teach dotenv in Phase 9, even though deployment is Phase 16, so the secret is never hardcoded.
8.  One useState per form field: This matches your existing form style. Selection checkboxes will use one array state, which is a small new pattern.
9.  No window.confirm: Use the ConfirmDelete component with useState and conditional rendering, which stays inside your known React skills.
10. Token header repetition: Each fetch adds the Authorization header explicitly. This is repetitive but easy to explain. config.js only holds the base URL.
    4.4 Explicitly excluded
    Redux, Context API, useReducer, useRef, custom hooks, TypeScript, Tailwind, Bootstrap, Material UI, controllers, services, populate(), aggregation, regex search, pagination, socket.io, and any package not listed above.
11. Phase-by-Phase Roadmap
    Phase Build
12. Planning Create backend/ and frontend/, init npm, install dependencies, set "type": "module", .gitignore
13. Server + DB index.js, connectToDb.js, a simple GET test route
14. Contact schema + CRUD contactSchema.js, contactRoute.js, mount router; open (no auth yet)
15. Postman testing Test create, read all, read one, update, delete; error cases
16. React setup + routes Vite app, BrowserRouter, Routes/Route, placeholder pages, sidebar/header shells
17. Static UI Components, pages, forms, CSS, fake arrays, confirm component, checkboxes
18. Learn integration Standalone mini-examples: useEffect, fetch GET/POST, CORS
19. Integrate contacts Replace static data with fetch calls for list, details, add, edit, delete
20. Auth backend userSchema, createAdmin.js, authRoute.js, authMiddleware.js, protect contact routes, .env
21. Frontend auth Login page fetch, localStorage, ProtectedRoute, logout, token in every contact request
22. Favorites/search/recent Toggle favorite, favorites page, query search, update lastVisitedAt, recent endpoint
23. Bulk delete Checkboxes, selected count, confirmation, bulk-delete endpoint, refresh list
24. Photos Multer setup, uploads/, static serving, FormData upload, default avatar fallback
25. Excel export Install xlsx, export selected contacts, exclude photo, empty-selection message
26. Responsive + testing Media queries, empty states, full manual checklist
27. Deployment Atlas, Render backend, Vercel frontend, production CORS, API URL, JWT secret
    Critical path: Phase 7 (integration) and Phase 9 (auth). Do not start Phase 8 before Phase 7 is understood, and do not start Phase 10 before Phase 9 works in Postman.
    Final Guardrails

- Every phase ends with a test + explanation gate. If you cannot explain it, we do not move on.
- Each new concept gets a small independent example before it enters the project.
- When we start, I will use your required 10-part format: what, why, concept status, files, installs, code, explanation, run, test, checklist.
- The final app will be defended as: Express + Mongoose CRUD, React routing/state/forms, JWT-protected APIs, and six explicitly taught additions. No hidden magic.

PS D:\Acer Nitro\Addy\Training Sem I\Contact_App> opencode -s ses_e2cfd6eb6ffeRIZWSsngN5lIJn
▄
█▀▀█ █▀▀█ █▀▀█ █▀▀▄ █▀▀▀ █▀▀█ █▀▀█ █▀▀█
█ █ █ █ █▀▀▀ █ █ █ █ █ █ █ █▀▀▀
▀▀▀▀ █▀▀▀ ▀▀▀▀ ▀▀▀▀ ▀▀▀▀ ▀▀▀▀ ▀▀▀▀ ▀▀▀▀

Session MERN stack knowledge base for next project
Continue opencode -s ses_e2cfd6eb6ffeRIZWSsngN5lIJn
