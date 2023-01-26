import {
  SET_LOGIN_USER_DETAIL,
  SET_USER_FOR_CHAT,
  SET_GROUP_FOR_CHAT,
  SET_LOGIN_USER_DATA,
  SET_LOGIN_USER_NAME,
  SET_LOGIN_USER_PROFILE,
} from "./actions";

const initialState = {
  //
  userDetail: "",
  username: "",
  userProfile: "",
  loggedInUser: null,
  selectedChatGroup: {
    chatroomId: "",
    name: "",
  },
  selectedChatUser: {
    chatroomId: "",
    name: "",
  },
};

function userReducer(state = initialState, action) {
  switch (action.type) {
    case SET_LOGIN_USER_DETAIL:
      return { ...state, userDetail: action.payload };
    case SET_USER_FOR_CHAT:
      return { ...state, selectedChatUser: action.payload };
    case SET_GROUP_FOR_CHAT:
      return { ...state, selectedChatGroup: action.payload };
    case SET_LOGIN_USER_DATA:
      return { ...state, loggedInUser: action.payload };
    case SET_LOGIN_USER_NAME:
      return { ...state, username: action.payload };
    case SET_LOGIN_USER_PROFILE:
      return { ...state, userProfile: action.payload };
    default:
      return state;
  }
}

export default userReducer;
