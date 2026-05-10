import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 1 | 2 | 3 | 4; // 1: Customer, 2: Owner, 3: Admin, 4: Staff
  avatar?: string;
  phone?: string;
  password?: string; // For authentication
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  register: (data: Omit<User, 'id'>) => boolean;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  deleteAccount: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock initial users
const initialUsers: User[] = [
  {
    id: '1',
    email: 'customer@test.com',
    name: '田中太郎',
    role: 1,
    phone: '0901234567',
    password: 'password123',
  },
  {
    id: '2',
    email: 'owner@test.com',
    name: 'Nguyễn Văn An',
    role: 2,
    phone: '0987654321',
    password: 'password123',
  },
  {
    id: '3',
    email: 'admin@test.com',
    name: 'Admin System',
    role: 3,
    phone: '0900000000',
    password: 'password123',
  },
  {
    id: '4',
    email: 'staff@test.com',
    name: 'Trần Văn Bình',
    role: 4,
    phone: '0901234567',
    password: 'password123',
  },
  {
    id: '5',
    email: 'binh@cafe1.com',
    name: 'Trần Văn Bình',
    role: 4,
    phone: '0901234567',
    password: 'password123',
    avatar: 'https://i.pravatar.cc/150?img=12',
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Force reinitialize users with password field (for development)
    // TODO: Remove this force reset in production
    localStorage.setItem('users', JSON.stringify(initialUsers));
    
    // Force reinitialize staff data with correct cafe IDs
    localStorage.removeItem('staff');

    // Check for logged in user
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      setUser(JSON.parse(currentUser));
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    const usersJson = localStorage.getItem('users');
    if (!usersJson) return false;

    const users: User[] = JSON.parse(usersJson);
    const foundUser = users.find(u => u.email === email && u.password === password);

    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const register = (data: Omit<User, 'id'>): boolean => {
    const usersJson = localStorage.getItem('users');
    const users: User[] = usersJson ? JSON.parse(usersJson) : [];

    // Check if email already exists
    if (users.some(u => u.email === data.email)) {
      return false;
    }

    const newUser: User = {
      ...data,
      id: Date.now().toString(),
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Auto login after register
    setUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const updateUser = (data: Partial<User>) => {
    if (!user) return;

    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));

    // Update in users list
    const usersJson = localStorage.getItem('users');
    if (usersJson) {
      const users: User[] = JSON.parse(usersJson);
      const index = users.findIndex(u => u.id === user.id);
      if (index !== -1) {
        users[index] = updatedUser;
        localStorage.setItem('users', JSON.stringify(users));
      }
    }
  };

  const deleteAccount = () => {
    if (!user) return;

    // Remove from users list
    const usersJson = localStorage.getItem('users');
    if (usersJson) {
      const users: User[] = JSON.parse(usersJson);
      const filteredUsers = users.filter(u => u.id !== user.id);
      localStorage.setItem('users', JSON.stringify(filteredUsers));
    }

    // Remove related data (bookings, reviews, notifications)
    const bookingsJson = localStorage.getItem('bookings');
    if (bookingsJson) {
      const bookings = JSON.parse(bookingsJson);
      const filteredBookings = bookings.filter((b: any) => b.userId !== user.id);
      localStorage.setItem('bookings', JSON.stringify(filteredBookings));
    }

    const reviewsJson = localStorage.getItem('reviews');
    if (reviewsJson) {
      const reviews = JSON.parse(reviewsJson);
      const filteredReviews = reviews.filter((r: any) => r.userId !== user.id);
      localStorage.setItem('reviews', JSON.stringify(filteredReviews));
    }

    const notificationsJson = localStorage.getItem('notifications');
    if (notificationsJson) {
      const notifications = JSON.parse(notificationsJson);
      const filteredNotifications = notifications.filter((n: any) => n.userId !== user.id);
      localStorage.setItem('notifications', JSON.stringify(filteredNotifications));
    }

    logout();
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}