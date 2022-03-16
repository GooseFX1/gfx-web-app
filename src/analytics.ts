import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'

// https://firebase.google.com/docs/web/setup#available-libraries
// Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
console.log(process.env)

const analytics = () => {
  // creates control statement to asset environment variables are present
  const activeAnalytics: boolean =
    process.env.REACT_APP_ANALYTICS_API_KEY === undefined ||
    process.env.REACT_APP_AUTH_DOMAIN === undefined ||
    process.env.REACT_APP_PROJECT_ID === undefined ||
    process.env.REACT_APP_STORAGE_BUCKET === undefined ||
    process.env.REACT_APP_MESSAGING_SENDER_ID === undefined ||
    process.env.REACT_APP_APP_ID === undefined ||
    process.env.REACT_APP_MEASUREMENT_ID === undefined
      ? false
      : true

  // creates firebase config if the env values are set; returns null if any are undefined
  if (activeAnalytics) {
    const firebaseConfig = {
      apiKey: process.env.REACT_APP_ANALYTICS_API_KEY,
      authDomain: process.env.REACT_APP_AUTH_DOMAIN,
      projectId: process.env.REACT_APP_PROJECT_ID,
      storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
      messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
      appId: process.env.REACT_APP_APP_ID,
      measurementId: process.env.REACT_APP_MEASUREMENT_ID
    }

    // Initialize Firebase
    const app = initializeApp(firebaseConfig)
    return getAnalytics(app)
  } else {
    return null
  }
}

export default analytics
