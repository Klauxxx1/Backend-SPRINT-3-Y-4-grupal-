const admin = require("firebase-admin");

// Configuración desde variables de entorno
const firebaseConfig = {
  type: process.env.FIREBASE_TYPE || "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
    : undefined,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri:
    process.env.FIREBASE_AUTH_URI ||
    "https://accounts.google.com/o/oauth2/auth",
  token_uri:
    process.env.FIREBASE_TOKEN_URI || "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url:
    process.env.FIREBASE_AUTH_CERT_URL ||
    "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
};

// Inicializar Firebase
admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig),
});

module.exports = admin;
