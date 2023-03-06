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
  currentAvatar: {
    displayName: null,
    photoUrl: null,
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
    setNumber: (state, action) => {
      state.conversations = action.payload.conversations;
    },
    setCurrentAvatar: (state, action) => {
      state.currentAvatar = action.payload;
    },
  },
});

export const {
  setLogout,
  setUser,
  setConversation,
  setNumber,
  setCurrentAvatar,
} = authSlice.actions;
export default authSlice.reducer;
