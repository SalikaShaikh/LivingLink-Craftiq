# LivingLink Frontend (React)

Role-based, responsive frontend for the LivingLink residential society app.

## Quick Start
```bash
cd frontend
npm install
npm start
```
Then open http://localhost:3000

## Pages
- Landing `/`
- Sign In `/signin`
- Sign Up `/signup`
- Resident `/resident`
- Secretary `/secretary`
- Treasurer `/treasurer`
- Maintenance `/maintenance`
- Security `/security`

## Connect to Backend (Read-Only)
1. Create a file named `.env.local` in the `frontend` folder (same level as package.json).
2. Paste and save:
```
REACT_APP_USE_LIVE=true
REACT_APP_API_BASE=http://localhost:5000
```
3. Stop and restart `npm start`.  
4. Visit the dashboards:
   - Resident → loads `/api/notices`
   - Secretary → click **Load Complaints** to fetch `/api/complaints` (paste JWT if your endpoint requires it)
   - Security → loads `/api/visitors`

To switch to a deployed backend, change `REACT_APP_API_BASE` to your URL.

## Notes
- Styling keeps your original color scheme, with improved spacing and components.
- Authentication & forms will be wired in the final project phase.
