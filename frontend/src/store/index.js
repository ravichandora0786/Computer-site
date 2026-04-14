import { configureStore, combineReducers } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import { commonReducer } from './commonSlice'

// Sagas and reducers will be added here
const sagaMiddleware = createSagaMiddleware()

const rootReducer = combineReducers({
  common: commonReducer,
})

const persistConfig = {
  key: 'root',
  storage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(sagaMiddleware),
})

export const persistor = persistStore(store)
// sagaMiddleware.run(rootSaga)
