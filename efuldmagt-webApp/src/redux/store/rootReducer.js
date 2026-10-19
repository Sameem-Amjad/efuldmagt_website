import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "../features/user/userSlice";
import companyReducer from "../features/company/companySlice";
import fuldmagtsReducer from "../features/fuldmagts/fuldmagtsSlice";
import notificationReducer from "../features/notifications/notificationSlice";
import mitIdReducer from "../features/mitId/mitidSlice"
import ProfileMitidProfileReducer from "../features/mitidProfile/profileMitidSlice"
const rootReducer = combineReducers({
  user: userReducer,
  company: companyReducer,
  fuldmagts: fuldmagtsReducer,
  notifications: notificationReducer,
  mitid:mitIdReducer,
  profileMitId:ProfileMitidProfileReducer

});

export default rootReducer;
