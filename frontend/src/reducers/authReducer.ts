import { AUTH_STATUS, IAuthState, IAuthStatus, IAuthUser } from '@/types/auth.types';

export const initialState: IAuthState = {
  user: null,
  status: AUTH_STATUS.UNAUTHENTICATED,
  userPermissions: [],
  isInitialized: false,
  isLoading: false,
  error: null,
};

type AuthAction =
  | { type: 'INITIALIZE' }
  | { type: 'LOGIN_REQUEST' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: IAuthUser } }
  | { type: 'LOGIN_FAILURE'; payload: { error: string } }
  | { type: 'LOGOUT_REQUEST' }
  | { type: 'LOGOUT_SUCCESS' }
  | { type: 'LOGOUT_FAILURE'; payload: { error: string } }
  | { type: 'UPDATE_USER'; payload: { user: IAuthUser } }
  | { type: 'SET_STATUS'; payload: { status: IAuthStatus } }
  | { type: 'CLEAR_ERROR' };

const authReducer = (state: IAuthState, action: AuthAction): IAuthState => {
  switch (action.type) {
    case 'INITIALIZE':
      return {
        ...state,
        isInitialized: true,
      };

    case 'LOGIN_REQUEST':
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        userPermissions: action.payload.user.permissions,
        status: AUTH_STATUS.AUTHENTICATED,
        isLoading: false,
        error: null,
      };

    case 'LOGIN_FAILURE':
      return {
        ...state,
        status: AUTH_STATUS.UNAUTHENTICATED,
        isLoading: false,
        error: action.payload.error,
      };

    case 'LOGOUT_REQUEST':
      return {
        ...state,
        isLoading: true,
      };

    case 'LOGOUT_SUCCESS':
      return {
        ...initialState,
        isInitialized: true,
      };

    case 'LOGOUT_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload.error,
      };

    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload.user,
        userPermissions: action.payload.user.permissions,
      };

    case 'SET_STATUS':
      return {
        ...state,
        status: action.payload.status,
      };

    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

export default authReducer;
