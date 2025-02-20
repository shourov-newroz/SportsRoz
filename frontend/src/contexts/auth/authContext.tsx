import { createContext } from 'react';
import { IAuthContextType } from './authContextProvider';

const AuthContext = createContext<IAuthContextType | null>(null);

export default AuthContext;
