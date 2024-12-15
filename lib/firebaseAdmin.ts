import { initializeApp, getApps, applicationDefault } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

// Initialize the Firebase Admin app if not already initialized.
// Note: This uses Application Default Credentials. Ensure your environment is set up with credentials.
if (!getApps().length) {
  initializeApp({
    credential: applicationDefault()
  })
}

const adminAuth = getAuth()

export { adminAuth }
