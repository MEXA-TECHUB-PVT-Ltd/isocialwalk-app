// const BASE_URL = "https://teamsuit.co/isocialwalk/api";
// const BASE_URL = "https://beforevault.com/isocial/app/api";
const BASE_URL = "https://isocialwalk.cloud/app/api";
export const api = {
  // users
  signup: BASE_URL + "/users/signup.php",
  signin: BASE_URL + "/users/signin.php",
  otpverification: BASE_URL + "/users/otpverification.php",
  verify_otp: BASE_URL + "/users/verify-otp.php",
  updatepassword: BASE_URL + "/users/updatepassword.php",
  updateprofile: BASE_URL + "/users/updateprofile.php",
  updatedevicetoken: BASE_URL + "/users/updatedevicetoken.php",
  // forgetpassword: BASE_URL + "/users/forgetpassword.php",
  forgetpassword: BASE_URL + "/users/verify.php",
  changePassword: BASE_URL + "/users/verify-otp(forgetpass).php",
  profileimage: BASE_URL + "/users/profileimage.php",
  get_specific_user: BASE_URL + "/users/getusers.php",
  forget_change_password: BASE_URL + "/users/verify-otp(forgetchangepass).php",
  //Groups
  create_group: BASE_URL + "/groups/create.php",
  group_profileimage: BASE_URL + "/groups/profileimage.php",
  changeprivacy: BASE_URL + "/groups/changeprivacy.php",
  allgroups: BASE_URL + "/groups/allgroups.php",
  showmembers: BASE_URL + "/groups/showmembers.php",
  addmembers: BASE_URL + "/groups/addmembers.php",
  removemember: BASE_URL + "/groups/removemember.php",
  search_group_by_specific_admin:
    BASE_URL + "/groups/allgroupsbyspeciifiadmin.php",
  edit_group_details: BASE_URL + "/groups/editdetails.php",
  join_group: BASE_URL + "/groups/join.php",
  groupsuggestions: BASE_URL + "/groups/groupsuggestions.php",
  deletegroups: BASE_URL + "/groups/deletegroups.php",
  search_group: BASE_URL + "/groups/search.php",
  get_specific_group_members:
    BASE_URL + "/groups/getmembersinspecificgroup.php",
  get_group_detail: BASE_URL + "/groups/getsinglegroupinfo.php",
  get_user_joined_groups: BASE_URL + "/groups/specificusersofgroup.php",
  get_common_groups: BASE_URL + "/groups/groupsincommon.php",
  get_requested_groups: BASE_URL + "/groups/getrequestedstats.php",
  update_group_request: BASE_URL + "/notifications/updategrouprequest.php",
  get_group_status: BASE_URL + "/groups/getstatus.php",

  //notifications
  getAllGroup_notifications: BASE_URL + "/notifications/getallgroup.php",
  get_notifications: BASE_URL + "/notifications/get.php",
  get_all_notifications1: BASE_URL + "/notifications/getallnotifications.php",
  get_all_notifications: BASE_URL + "/notifications/getall.php",
  get_notification_detail: BASE_URL + "/notifications/get.php",
  mark_notification_as_read:
    BASE_URL + "/notifications/updatespecificnotification.php",
  mark_all_notifications_as_read:
    BASE_URL + "/notifications/updatenotification.php",

  // //Goals
  // add_goals: BASE_URL + '/goals/insert.php',
  // update_goals: BASE_URL + '/goals/update.php',
  // get_user_goals: BASE_URL + '/goals/getusersgoals.php',

  //friends
  getfriendsuggestions: BASE_URL + "/friends/getfriendsuggestions.php",
  getallfriends: BASE_URL + "/friends/getallfriends.php",
  addfriends: BASE_URL + "/friends/addfriends.php",
  approveRequest: BASE_URL + "/friends/updaterequestapprove.php",
  unApproveRequest: BASE_URL + "/friends/updaterequestunapproved.php",
  search_friend: BASE_URL + "/friends/search.php",
  unFriend: BASE_URL + "/friends/unfriend.php",
  get_friend_status: BASE_URL + "/friends/getstatus.php",
  get_requested_friends: BASE_URL + "/friends/getrequestedstatus.php",

  //challenges
  create_challenge: BASE_URL + "/challenges/create.php",
  getSuggestedChallenges: BASE_URL + "/challenges/challengessuggestions.php",
  join_individual_challenge: BASE_URL + "/challenges/joinindiviual.php",
  leave_challenges: BASE_URL + "/challenges/leavechallenges.php",
  search_challenges: BASE_URL + "/challenges/search.php",
  upload_challenge_image: BASE_URL + "/challenges/image.php",
  add_participants_to_Challenge: BASE_URL + "/challenges/addparticipants.php",
  // add_group_to_Challenge:
  //   BASE_URL + "/challenges/addgroupparticipantsnotify.php",
  add_group_to_Challenge: BASE_URL + "/challenges/challengesgroups.php",
  get_admin_challenges: BASE_URL + "/challenges/searchbyspecificadmin.php",
  show_challenge_participants: BASE_URL + "/challenges/showparticipants.php",
  approve_individual_challenge:
    BASE_URL + "/notifications/updatenotificationschallengeindiviual.php",
  get_challenge_details: BASE_URL + "/challenges/getspecificchallenge.php",
  remove_participant_from_challenge:
    BASE_URL + "/challenges/removeparticipant.php",
  get_specific_user_joined_challenges:
    BASE_URL + "/challenges/specificuserchallenges.php",
  get_groups_of_specific_challenge:
    BASE_URL + "/challenges/groupofchallenge.php",
  delete_challenge: BASE_URL + "/challenges/deletechallenege.php",
  get_group_active_challenges:
    BASE_URL + "/challenges/specificgroupactivechallengeslist.php",
  remove_group_from_challenge:
    BASE_URL + "/challenges/removegroupchallenge.php",
  // get_requested_challenges: BASE_URL + "/challenges/getstatusrequest.php",
  get_requested_challenges: BASE_URL + "/challenges/getrequestedstatus.php",
  get_challenge_status: BASE_URL + "/challenges/singlechallengesttaus.php",

  //goals
  add_goals: BASE_URL + "/goals/insert.php",
  update_goals: BASE_URL + "/goals/update.php",
  get_user_goals: BASE_URL + "/goals/getusersgoals.php",
  get_user_daily_goal: BASE_URL + "/goals/getuserdailgoal.php",
  update_daily_weekly_goals: BASE_URL + "/goals/updationweekly.php",

  //Devices
  connect_device: BASE_URL + "/devices/insert.php",
  update_device: BASE_URL + "/devices/update.php",
  delete_device: BASE_URL + "/devices/delete.php",
  get_device_connected: BASE_URL + "/devices/deviceconnected.php",

  //ranking
  get_user_ranking: BASE_URL + "/ranking/usersranking.php",
  get_user_weekly_ranking: BASE_URL + "/ranking/weekranking.php",
  get_individual_challenge_ranking: BASE_URL + "/ranking/challengeranking.php",

  //history
  get_history_of_specific_date: BASE_URL + "/history/historyofspecificdate.php",
  get_history_of_specific_year: BASE_URL + "/history/historyofspecificyear.php",
  get_history_btw_two_dates:
    BASE_URL + "/history/historybetweentwospecificdates.php",
  get_history_of_week: BASE_URL + "/history/historyofweek.php",

  //privacy policy
  get_privacy_policy: BASE_URL + "/privacy/get.php",

  //groupchallengenotification

  send_request_to_group_admin_to_join_challenge:
    BASE_URL +
    "/groupchallengenotification/requestoadminforgroupchallengejoining.php",
  group_admin_send_request_to_challenge_owner:
    BASE_URL + "/groupchallengenotification/groupadminreqtochallengeowner.php",
  approve_or_reject_groupChallenge_request:
    BASE_URL + "/groupchallengenotification/response.php",

  //report
  report_challenge: BASE_URL + "/report/reportchallenge.php",
  report_group: BASE_URL + "/report/reportgroups.php",
  report_user: BASE_URL + "/report/reportusers.php",
};
