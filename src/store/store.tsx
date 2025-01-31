import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';
import establishmentDetailSlice from '../store/establishment/establishmentSliceDetails';
import notificationSlice from '../store/notification/notificationSlice';
import reviewSlice from '../store/reviews/ReviewsSlice';
import commonSlice from './common/commonSlice';
import establishmentSlice from './establishment/establishmentSlice';
import userSlice from './user/UserSlice';

const reducers = combineReducers({
  commonSlice,
  userSlice,
  establishmentSlice,
  establishmentDetailSlice,
  reviewSlice,
  notificationSlice,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whiteList: [
    'userSlice',
  ],
};

const rootReducer = (state: any, action: any) => {
  if (action.type === 'LOGOUT') {
    state = undefined;
  }
  return reducers(state, action);
};

const persistedReducers = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducers,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    }),
});

export const persister = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
