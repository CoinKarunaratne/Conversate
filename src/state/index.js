import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {
    uid: null,
    displayName: null,
    photoURL: null,
  },
  room: {
    users: [],
    messages: [],
  },
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
    },
    setLogout: (state, action) => {
      state.user = null;
      state.room = null;
    },
    setConversation: (state, action) => {
      state.room = action.payload.room;
    },
  },
});

export const { setLogout, setUser, setConversation } = authSlice.actions;
export default authSlice.reducer;
