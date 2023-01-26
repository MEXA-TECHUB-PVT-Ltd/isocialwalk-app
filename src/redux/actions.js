export const SET_LOGIN_USER_DETAIL = "SET_LOGIN_USER_DETAIL";
export const SET_LOGIN_USER_DATA = "SET_LOGIN_USER_DATA";
export const SET_USER_FOR_CHAT = "SET_USER_FOR_CHAT";
export const SET_GROUP_FOR_CHAT = "SET_GROUP_FOR_CHAT";
export const SET_LOGIN_USER_NAME = "SET_LOGIN_USER_NAME";
export const SET_LOGIN_USER_PROFILE = "SET_LOGIN_USER_PROFILE";

export const setLoginUserDetail = (data) => (dispatch) => {
  dispatch({
    type: SET_LOGIN_USER_DETAIL,
    payload: data,
  });
};
export const setUserForChat = (data) => (dispatch) => {
  dispatch({
    type: SET_USER_FOR_CHAT,
    payload: data,
  });
};
export const setGroupForChat = (data) => (dispatch) => {
  dispatch({
    type: SET_GROUP_FOR_CHAT,
    payload: data,
  });
};
export const setLoggedInUserData = (data) => (dispatch) => {
  dispatch({
    type: SET_LOGIN_USER_DATA,
    payload: data,
  });
};
export const setLoginUserName = (data) => (dispatch) => {
  dispatch({
    type: SET_LOGIN_USER_NAME,
    payload: data,
  });
};
export const setLoginUserProfile = (data) => (dispatch) => {
  dispatch({
    type: SET_LOGIN_USER_PROFILE,
    payload: data,
  });
};
