import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {
    uid: null,
    displayName: null,
    photoURL: null,
  },
  room: {
    id: null,
    users: [],
  },
  conversations: null,
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
    setNumber: (state, action) => {
      state.conversations = action.payload.conversations;
    },
  },
});

export const { setLogout, setUser, setConversation, setNumber } =
  authSlice.actions;
export default authSlice.reducer;
