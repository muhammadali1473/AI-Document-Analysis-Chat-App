# Beginner's Deployment Guide for RAG AI App

Since you are a beginner, we will use the easiest and most free tools available:
1. **GitHub**: To store your code.
2. **Render**: To host your Backend (Server) for free.
3. **Expo EAS**: To build your Mobile App (Frontend) into an installable file.

---

## Phase 1: Upload Code to GitHub
Most hosting services require your code to be on GitHub.

1. **Create a GitHub Account** at [github.com](https://github.com/signup).
2. **Create a New Repository**:
   - Click the **+** icon in the top right -> **New repository**.
   - Name it `rag-project`.
   - Make it **Public** or **Private** (Private is safer for keys, but we'll handle keys separately).
   - Click **Create repository**.
3. **Connect Your Local Code**:
   I can run the commands to initialize git for you locally, but you will need to provide the "HTTPS URL" of your new repository (it looks like `https://github.com/username/rag-project.git`).

---

## Phase 2: Deploy Backend (Render)
We will host your Node.js server so it runs 24/7 in the cloud, not just on your laptop.

1. **Sign up for [Render.com](https://render.com/)** using your GitHub account.
2. Click **New +** -> **Web Service**.
3. Select your `rag-project` repository from the list.
4. **Configure Settings**:
   - **Name**: `rag-backend-api` (or similar)
   - **Region**: Choose one close to you (e.g., Singapore or Frankfurt).
   - **Runtime**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && node index.js`
5. **Environment Variables** (Crucial!):
   Scroll down to "Environment Variables" and add:
   - Key: `GROQ_API_KEY` | Value: `your_actual_api_key`
   - Key: `PORT` | Value: `10000` (Render usually expects this or sets it automatically)
6. Click **Create Web Service**.
7. **Wait**: It will take a few minutes. Once done, it will give you a URL like `https://rag-backend-api.onrender.com`. **Copy this URL.**

---

## Phase 3: Connect Frontend to Cloud Backend
Now that your server is online, your app needs to talk to *that* URL instead of your local `192.168...` IP.

1. Open `frontend/src/api/client.js`.
2. Change the `PROD_URL` to your new Render URL:
   ```javascript
   const PROD_URL = "https://rag-backend-api.onrender.com/api"; 
   ```
   *(Make sure to keep the `/api` at the end if your routes need it).*

---

## Phase 4: Build the App (APK)
Now we turn your code into an app you can install properly.

1. **Install EAS CLI**:
   Run this in your terminal: `npm install -g eas-cli`
2. **Login**:
   Run `eas login` and enter your Expo credentials.
3. **Configure**:
   Run `eas build:configure`. Choose `Android`.
4. **Build APK**:
   Run `eas build -p android --profile preview`.
5. **Wait**:
   This happens in the cloud. It might take 10-20 minutes.
   When finished, it will give you a link to download the `.apk` file.
6. **Install**: Transfer that file to your phone and install it!

---

### Important Notes
- **Security**: Never commit your `.env` files to GitHub. Render handles your secrets securely in their dashboard.
- **Updates**: If you change backend code, push to GitHub, and Render auto-deploys. If you change Frontend code, you usually need to rebuild the app (Stage 4) or use EAS Update.
