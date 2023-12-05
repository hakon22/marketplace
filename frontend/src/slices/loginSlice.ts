import axios from 'axios';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../types/User';
import type { InitialStateType } from '../types/InitialState';
import routes from '../routes';

export const fetchLogin = createAsyncThunk(
  'login/fetchLogin',
  async (data: { phone: string, password: string, save: boolean }) => {
    const response = await axios.post(routes.login, data);
    return response.data;
  },
);

export const fetchActivation = createAsyncThunk(
  'login/fetchActivation',
  async (id: string | undefined) => {
    const response = await axios.get(`${routes.activation}${id}`);
    return response.data;
  },
);

export const fetchTokenStorage = createAsyncThunk(
  'login/fetchTokenStorage',
  async (refreshTokenStorage: string) => {
    const response = await axios.get(routes.updateTokens, {
      headers: { Authorization: `Bearer ${refreshTokenStorage}` },
    });
    return response.data;
  },
);

export const updateTokens = createAsyncThunk(
  'login/updateTokens',
  async (refresh: string | undefined) => {
    const refreshTokenStorage = window.localStorage.getItem('refresh_token');
    if (refreshTokenStorage) {
      const { data } = await axios.get(routes.updateTokens, {
        headers: { Authorization: `Bearer ${refreshTokenStorage}` },
      });
      if (data.user.refreshToken) {
        window.localStorage.setItem('refresh_token', data.user.refreshToken);
        return data;
      }
    } else {
      const { data } = await axios.get(routes.updateTokens, {
        headers: { Authorization: `Bearer ${refresh}` },
      });
      if (data.user.refreshToken) {
        return data;
      }
    }
    return null;
  },
);

export const initialState: InitialStateType = {
  loadingStatus: 'idle',
  error: null,
};

export const fetchFulfilled = fetchLogin.fulfilled;

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    removeToken: (state) => {
      const entries = Object.keys(state);
      entries.forEach((key) => {
        if (key !== 'loadingStatus') {
          state[key] = null;
        }
      });
    },
    changeEmailActivation: (state, { payload }) => {
      state.email = payload;
    },
    changeUserData: (state, { payload }: PayloadAction<{ [key: string]: string }>) => {
      const entries = Object.entries(payload);
      entries.forEach(([key, value]) => { state[key] = value; });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLogin.pending, (state) => {
        state.loadingStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchLogin.fulfilled, (state, { payload }
        : PayloadAction<{ code: number, user: User }>) => {
        if (payload.code === 1) {
          const entries = Object.entries(payload.user);
          entries.forEach(([key, value]) => { state[key] = value; });
        }
        state.loadingStatus = 'finish';
        state.error = null;
      })
      .addCase(fetchLogin.rejected, (state, action) => {
        state.loadingStatus = 'failed';
        state.error = action.error.message ?? null;
      })
      .addCase(fetchTokenStorage.pending, (state) => {
        state.loadingStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchTokenStorage.fulfilled, (state, { payload }
        : PayloadAction<{ code: number, user: User }>) => {
        if (payload.code === 1) {
          if (window.localStorage.getItem('refresh_token')) {
            window.localStorage.setItem('refresh_token', payload.user.refreshToken);
          }
          const entries = Object.entries(payload.user);
          entries.forEach(([key, value]) => { state[key] = value; });
        }
        state.loadingStatus = 'finish';
        state.error = null;
      })
      .addCase(fetchTokenStorage.rejected, (state, action) => {
        state.loadingStatus = 'failed';
        state.error = action.error.message ?? null;
      })
      .addCase(updateTokens.pending, (state) => {
        state.loadingStatus = 'loading';
        state.error = null;
      })
      .addCase(updateTokens.fulfilled, (state, { payload }
        : PayloadAction<{ code: number, user: User }>) => {
        if (payload.code === 1) {
          const entries = Object.entries(payload.user);
          entries.forEach(([key, value]) => { state[key] = value; });
        }
        state.loadingStatus = 'finish';
        state.error = null;
      })
      .addCase(updateTokens.rejected, (state, action) => {
        state.loadingStatus = 'failed';
        state.error = action.error.message ?? null;
      })
      .addCase(fetchActivation.pending, (state) => {
        state.loadingStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchActivation.fulfilled, (state, { payload }) => {
        state.loadingStatus = 'finish';
        state.error = null;
        if (payload) {
          state.email = payload;
        }
      })
      .addCase(fetchActivation.rejected, (state, action) => {
        state.loadingStatus = 'failed';
        state.error = action.error.message ?? null;
      });
  },
});

export const { removeToken, changeEmailActivation, changeUserData } = loginSlice.actions;

export default loginSlice.reducer;
