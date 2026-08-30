            # AI Document Analysis App    
      
A React Native (Expo) application with a Node.js backend for analyzing documents using Groq API and RAG.
             
## Prerequisites                           
                               
                                                                         
- Node.js installed                 
- Expo Go app on your   phone (or an emulato  r)                                                                           
- Groq API Key                                                                                      
                                                                                 
## Project Structure                                                  
                                    
- `frontend/`: Expo mobile app                                                
- `backend/`: Node.js Express server                
                             
## Setup Actions      
,,    
### 1. Backend Setup                 
          1383848545846u5654068096859685496845968406940684608640684906509865406809568408640864066458460464056406840964090459
1. Navigate to the backend folder:
   ```bash
   cd backend    
   ```   
2. Install dependencies (if not already done):
   ```bash
   npm install --legacy-peer-deps
   ```
3. Configure Environment Variables:
   - Open `.env` in the `backend` folder.
   - Add your **GROQ_API_KEY**.
   - (Optional) Add OpenAI/Pinecone keys if you want full vector search functionality.
4. Start the server:
   ```bash
   node index.js
   ```
   Server runs on `http://localhost:3000`.

### 2. Frontend Setup

1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Update API URL:
   - Open `src/api/client.js`.   
   - Update `PROD_URL` or `DEV_URL` to your computer's local IP address if testing on a physical device (e.g., `http://192.168.1.5:3000/api`).
   - If using Android Emulator, `http://10.0.2.2:3000/api` works by default.
4. Run the app:
   ```bash
   npx expo start
   ```
   - Scan the QR code with Expo Go.

## Features

- **Upload**: Supports PDF, DOCX, TXT.
- **Library**: View uploaded docs.
- **Analysis**: Auto-generate questions, summaries, and topics using Groq/Llama-3.
- **Chat**: RAG-based chat (currently using full-text context injection for instant setup without Vector DB complexity).

## Troubleshooting

- **Upload Fails**: Ensure the `backend/uploads` folder exists (the server creates it on start).
- **Network Error**: Ensure your phone and computer are on the same Wi-Fi and that you updated `client.js` with your IP.
