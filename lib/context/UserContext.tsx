import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, onSnapshot } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase' // Make sure these are your correct imports

interface UserContextType {
  user: any; // Adjust the type as needed
  userData: any; // Adjust the type as needed
  loading: boolean;
}

const UserContext = createContext<UserContextType>({
  user: null,
  userData: null,
  loading: true,
})

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null)
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        // User is logged out
        setUser(null)
        setUserData(null)
        setLoading(false)
        return
      }

      // User is logged in
      setUser(currentUser)
      const userDoc = doc(db, 'users', currentUser.uid)

      const unsubscribeUser = onSnapshot(
        userDoc,
        (snapshot) => {
          if (snapshot.exists()) {
            setUserData(snapshot.data() || {})
          } else {
            // If the user doc doesn't exist or was deleted
            setUserData(null)
          }
          setLoading(false)
        },
        (error) => {
          console.error('Error listening to user doc:', error)
          setUserData({})
          setLoading(false)
        }
      )

      // Cleanup user snapshot listener when user logs out or component unmounts
      return () => unsubscribeUser()
    })

    // Cleanup the auth state listener on unmount
    return () => unsubscribeAuth()
  }, [])

  return (
    <UserContext.Provider value={{ user, userData, loading }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)
