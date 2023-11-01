import axios from 'axios';
import {
  createSlice, createEntityAdapter, createAsyncThunk, PayloadAction,
} from '@reduxjs/toolkit';
import type { RootState } from './index';
import type { Item } from '../types/Item';
import type { InitialStateType } from '../types/InitialState';
import routes from '../routes';

export const fetchItems = createAsyncThunk(
  'market/fetchItems',
  async (token: string) => {
    const response = await axios.get(routes.getAllItems, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
);

export const marketAdapter = createEntityAdapter<Item>();

export const initialState: InitialStateType = {
  loadingStatus: 'idle',
  error: null,
};

export const fetchFulfilled = fetchItems.fulfilled;

const marketSlice = createSlice({
  name: 'market',
  initialState: marketAdapter.getInitialState(initialState),
  reducers: {
    marketAdd: marketAdapter.addOne,
    marketUpdate: marketAdapter.updateOne,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchItems.pending, (state) => {
        state.loadingStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchItems.fulfilled, (state, { payload }:
        PayloadAction<{ code: number, items: Item[] }>) => {
        if (payload.code === 1) {
          marketAdapter.addMany(state, payload.items);
        }
        state.loadingStatus = 'finish';
        state.error = null;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.loadingStatus = 'failed';
        state.error = action.error.message ?? null;
      });
  },
});

export const { marketAdd, marketUpdate } = marketSlice.actions;

export const selectors = marketAdapter.getSelectors<RootState>((state) => state.market);

export default marketSlice.reducer;
