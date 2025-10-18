import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface User {
  name: string;
  email: string;
  createdAt: string;
  isAdmin?: boolean;
}

// FIX: Define an internal type that includes the password to avoid type errors
// and keep the public `User` interface clean.
type UserWithPassword = User & { password?: string };

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password?: string) => Promise<void>; // Password is now used
  signup: (name: string, email: string, password?: string) => Promise<void>;
  logout: () => void;
  getAllUsers: () => User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_STORAGE_KEY = 'allUsers';

// FIX: Update return type to UserWithPassword[]
const getInitialUsers = (): UserWithPassword[] => {
    try {
        const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
        if (storedUsers) {
            return JSON.parse(storedUsers);
        }
    } catch (error) {
        console.error("Failed to parse users from localStorage", error);
    }
    // Default/initial set of users if nothing is in storage
    return [
        // FIX: The objects now match the UserWithPassword type
        { name: 'Admin', email: 'admin@bloovi.media', createdAt: new Date().toISOString(), isAdmin: true, password: 'admin123' },
        { name: 'John Doe', email: 'john@example.com', createdAt: new Date('2023-01-15').toISOString(), password: 'password123' },
    ];
};


export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  // FIX: Use UserWithPassword[] for the internal users state
  const [users, setUsers] = useState<UserWithPassword[]>(getInitialUsers);

  // Persist users list to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }, [users]);
  
  // Check for a logged-in user on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (email: string, password?: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // FIX: Remove `as any` cast by using the correct type
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
          // FIX: Remove `as any` cast
          const { password: _, ...userToSave } = user; // Don't store password in currentUser state/storage
          localStorage.setItem('currentUser', JSON.stringify(userToSave));
          setCurrentUser(userToSave);
          resolve();
        } else {
          reject(new Error('invalidCreds'));
        }
      }, 500);
    });
  };

  const signup = (name: string, email: string, password?: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (users.some(u => u.email === email)) {
          reject(new Error('userExists'));
        } else {
          // FIX: Use UserWithPassword type instead of `any`
          const newUser: UserWithPassword = {
            name,
            email,
            password, // In a real app, this would be hashed
            createdAt: new Date().toISOString(),
            isAdmin: false,
          };
          setUsers(prevUsers => [...prevUsers, newUser]);
          const { password: _, ...userToSave } = newUser;
          localStorage.setItem('currentUser', JSON.stringify(userToSave));
          setCurrentUser(userToSave);
          resolve();
        }
      }, 500);
    });
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
  };
  
  const getAllUsers = (): User[] => {
      // Return users without their passwords
      return users.map(u => {
          // FIX: Remove `as any` cast
          const { password, ...userWithoutPassword } = u;
          return userWithoutPassword;
      });
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, signup, logout, getAllUsers }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
