<<<<<<< HEAD
# Frontend (Netlify-ready)
1. Set an environment variable on Netlify: `VITE_API_URL=https://your-render-backend.onrender.com`.
2. Build: `npm run build` (Netlify will run this automatically).
3. Publish directory: `dist`.
=======
# Backend (Render-ready)
1. Copy `.env.example` to `.env` and set `MONGO_URI`.
2. Run locally: `npm install && npm start`
3. Deploy on Render as a Web Service. Root directory = `backend` if using monorepo.
4. Add Environment Variables on Render: `PORT=5000`, `MONGO_URI=...`.
>>>>>>> 234b2312ef0cbefd0fb3833614d9f16b8be213c1
