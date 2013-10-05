// himins_user.js
// Manages users based on client connections

var game = require('./himins_game'),
    app = require('./himins_app');

var REMOTE_ADDRESS = 0,
    REMOTE_PORT = 1,
    USER_ID = 2,
    USER_LINGO = 3,
    USER_START_TIME = 4,
    USER_INTERVAL_ID = 5,
    USER_TIME_CHECK_COUNT = 6,
    USER_MODE_ID = 7,
    USER_LOC_X = 8,
    USER_LOC_Y = 9,
    USER_MAP_NAME = 10;
    
module.exports.USER_ID = USER_ID;
module.exports.USER_LINGO = USER_LINGO;
module.exports.USER_START_TIME = USER_START_TIME;
module.exports.USER_TIME_CHECK_COUNT = USER_TIME_CHECK_COUNT;
    
var NORMAL_USER_MODE = 0,
    RENAME_USER_MODE = 1;
    
module.exports.NORMAL_USER_MODE = NORMAL_USER_MODE;
module.exports.RENAME_USER_MODE = RENAME_USER_MODE;
    
var userList = [],
    userIndex = 0;

// # createUser()
// initializes all the fields associated with a user record and adds the user to the userList
var createUser = function(remoteAddress, remotePort, remoteLingo) {
  
  console.log("createUser(" + remoteAddress + ", " + remotePort + ", " + remoteLingo + ")");
  
  // userIndex used just for giving each user a unique start name
  userIndex++;
  
  // init user fields
  var userID = "Mortal" + userIndex,
      userStartTime = new Date().getTime(),
      userIntervalID = 0,
      userTimeCheckCount = 0,
      userMode = NORMAL_USER_MODE,
      userLocX = -1,
      userLocY = -1,
      userMapName = "";

  // create user record and add to the list
  var newUser = [ remoteAddress, 
                  remotePort, 
                  userID, 
                  remoteLingo, 
                  userStartTime, 
                  userIntervalID, 
                  userTimeCheckCount, 
                  userMode,
                  userLocX,
                  userLocY,
                  userMapName
                ];
  userList.push(newUser);

  console.log("new user created: " + newUser);

  // return unique user id
  return userID;
};
module.exports.createUser = createUser;

// # calcTimeRemainig(userID)
// how much time does a user have left to play?
var calcTimeRemaining = function(userID) {
  
  var startTime = getUserStartTime(userID),
      currentTime = new Date().getTime(),
      playedTime = currentTime - startTime,
      result = game.MAX_PLAY_TIME_MS - playedTime;
  
  result = Math.ceil((result/60)/1000);
  return result;
};
module.exports.calcTimeRemaining = calcTimeRemaining;

// # isUserID(userID)
// return true if the input is an existing user's name
var isUserID = function (userID) {
  var result = false;
  for (var i = 0; i < userList.length; i++) {
    var userRecord = userList[i];
    if (userRecord[USER_ID] === userID) {
      result = true;
      break;
    }
  }
  return result;
};
module.exports.isUserID = isUserID;

// # setUserID(oldID, newID)
// change the ID (name) of a user
var setUserID = function (oldID, newID) {
  for (var i = 0; i < userList.length; i++) {
    var userRecord = userList[i];
    if (userRecord[USER_ID] === oldID) {
      userRecord[USER_ID] = newID;
      app.setClientName(oldID, newID);
      break;
    }
  }  
};
module.exports.setUserID = setUserID;

// # getUserByID(userID)
// return the user based on their user name
var getUserByID = function (userID) {
  
  //console.log("getUserByID(" + userID + ")");
  //console.log("arguments.callee.caller.name: " + arguments.callee.caller.name.toString());

  var result = "",
      err = true;
  
  for (var i = 0; i < userList.length; i++) {
    var userRecord = userList[i];
    if (userRecord[USER_ID] === userID) {
      result = userRecord;
      err = false;
      break;
    }
  }
  if (err) {
    console.log("failed to find userID " + userID + " in userList " + userList);
  }
  return result;
};
module.exports.getUserByID = getUserByID;

// # getUserLingo(userID)
var getUserLingo = function (userID) {
  var userRecord = getUserByID(userID),
      result = userRecord[USER_LINGO];
  return result; 
};
module.exports.getUserLingo = getUserLingo;

// # getUserStartTime(userID)
var getUserStartTime = function (userID) {
  var userRecord = getUserByID(userID),
      result = userRecord[USER_START_TIME];
  return result; 
};
module.exports.getUserStartTime = getUserStartTime;

// # getIntervalID(userID)
var getIntervalID = function (userID) {
  var userRecord = getUserByID(userID),
      result = userRecord[USER_INTERVAL_ID];
  return result;
};
module.exports.getIntervalID = getIntervalID;

// # setIntervalID(userID)
var setIntervalID = function (userID, intervalID) {
  var userRecord = getUserByID(userID);
  userRecord[USER_INTERVAL_ID] = intervalID;
};
module.exports.setIntervalID = setIntervalID;

// # stopUpdates(userID)
var stopUpdates = function (userID) {
  clearInterval(getIntervalID(userID));
};
module.exports.stopUpdates = stopUpdates;

// # getTimeCheckCount(userID)
var getTimeCheckCount = function (userID) {
  var userRecord = getUserByID(userID),
      result = userRecord[USER_TIME_CHECK_COUNT];
  return result;
};
module.exports.getTimeCheckCount = getTimeCheckCount;

// # incrementTimeCheckCount(userID)
var incrementTimeCheckCount = function (userID) {
  var userRecord = getUserByID(userID);
  userRecord[USER_TIME_CHECK_COUNT] += 1;
};
module.exports.incrementTimeCheckCount = incrementTimeCheckCount;

// # getUserMode(userID)
var getUserMode = function (userID) {
  var userRecord = getUserByID(userID),
      result = userRecord[USER_MODE_ID];
  return result;
};
module.exports.getUserMode = getUserMode;

// # setUserMode(userID)
var setUserMode = function (userID, newMode) {
  var userRecord = getUserByID(userID);
  userRecord[USER_MODE_ID] = newMode;
};
module.exports.setUserMode = setUserMode;

