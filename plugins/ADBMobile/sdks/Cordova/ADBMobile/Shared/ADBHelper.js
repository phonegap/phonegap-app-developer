/*************************************************************************
 *
 * ADOBE CONFIDENTIAL
 * ___________________
 *
 *  Copyright 2013 Adobe Systems Incorporated
 *  All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Adobe Systems Incorporated and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Adobe Systems Incorporated and its
 * suppliers and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe Systems Incorporated.
 *
 **************************************************************************/

var ADB = (function () {
	var ADB = (typeof exports !== 'undefined') && exports || {};
	
	ADB.doNothing = function () {};
		
	var PLUGIN_NAME = "ADBMobile_PhoneGap";
	var fTRACK_APP_STATE_WITH_CDATA = "myMethod";
	
	ADB.optedIn = 1;
	ADB.optedOut = 2;
	ADB.optUnknown = 3;

	ADB.trackAppState = function (stateName) {
	   return cordova.exec(ADB.doNothing, ADB.doNothing, "ADBMobile_PhoneGap", "myMethod", [stateName]);
	};
	
	ADB.getVersion = function(success, fail) {
		return cordova.exec(success, fail, "ADBMobile_PhoneGap", "getVersion", [null]);
	}
	
	ADB.getPrivacyStatus = function(success, fail) {
		return cordova.exec(success, fail, "ADBMobile_PhoneGap", "getPrivacyStatus", [null]);
	}
	
	ADB.setPrivacyStatus = function (privacyStatus) {
		return cordova.exec(ADB.doNothing, ADB.doNothing, "ADBMobile_PhoneGap", "setPrivacyStatus", [privacyStatus]);
	};
	
	ADB.getLifetimeValue = function(success, fail) {
		return cordova.exec(success, fail, "ADBMobile_PhoneGap", "getLifetimeValue", [null]);
	}

	ADB.getUserIdentifier = function(success, fail) {
		return cordova.exec(success, fail, "ADBMobile_PhoneGap", "getUserIdentifier", [null]);
	}
	
	ADB.setUserIdentifier = function (userIdentifier) {
		return cordova.exec(ADB.doNothing, ADB.doNothing, "ADBMobile_PhoneGap", "setUserIdentifier", [userIdentifier]);
	};

	ADB.getDebugLogging = function(success, fail) {
		return cordova.exec(success, fail, "ADBMobile_PhoneGap", "getDebugLogging", [null]);
	}

	ADB.setDebugLogging = function(debugLogging) {
		return cordova.exec(ADB.doNothing, ADB.doNothing, "ADBMobile_PhoneGap", "setDebugLogging", [debugLogging]);
	}

	ADB.keepLifecycleSessionAlive = function(success, fail) {
		return cordova.exec(success, fail, "ADBMobile_PhoneGap", "keepLifecycleSessionAlive", [null]);
	}

	ADB.collectLifecycleData = function(success, fail) {
		return cordova.exec(success, fail, "ADBMobile_PhoneGap", "collectLifecycleData", [null]);
	}
	
	ADB.trackState = function(stateName, cData) {
		return cordova.exec(ADB.doNothing, ADB.doNothing, "ADBMobile_PhoneGap", "trackState", [stateName, cData]);
	}

	ADB.trackAction = function(action, cData) {
		return cordova.exec(ADB.doNothing, ADB.doNothing, "ADBMobile_PhoneGap", "trackAction", [action, cData]);
	}
	
	ADB.trackActionFromBackground = function(action, cData) {
		return cordova.exec(ADB.doNothing, ADB.doNothing, "ADBMobile_PhoneGap", "trackActionFromBackground", [action, cData]);
	}

	ADB.trackLocation = function(lat, long, cData) {
		return cordova.exec(ADB.doNothing, ADB.doNothing, "ADBMobile_PhoneGap", "trackLocation", [lat, long, cData]);
	}
	
	ADB.trackLifetimeValueIncrease = function(amount, cData) {
		return cordova.exec(ADB.doNothing, ADB.doNothing, "ADBMobile_PhoneGap", "trackLifetimeValueIncrease", [amount, cData]);
	}

	ADB.trackTimedActionStart = function(action, cData) {
		return cordova.exec(ADB.doNothing, ADB.doNothing, "ADBMobile_PhoneGap", "trackTimedActionStart", [action, cData]);
	}

	ADB.trackTimedActionUpdate = function(action, cData) {
		return cordova.exec(ADB.doNothing, ADB.doNothing, "ADBMobile_PhoneGap", "trackTimedActionUpdate", [action, cData]);
	}

	ADB.trackTimedActionEnd = function(action) {
		return cordova.exec(ADB.doNothing, ADB.doNothing, "ADBMobile_PhoneGap", "trackTimedActionEnd", [action]);
	}

	ADB.trackingTimedActionExists = function(success, fail, action) {
		return cordova.exec(success, fail, "ADBMobile_PhoneGap", "trackingTimedActionExists", [action]);
	}

	ADB.trackingIdentifier = function(success, fail) {
		return cordova.exec(success, fail, "ADBMobile_PhoneGap", "trackingIdentifier", []);
	}

	ADB.trackingClearQueue = function(success, fail) {
		return cordova.exec(success, fail, "ADBMobile_PhoneGap", "trackingClearQueue", []);
	}

	ADB.trackingGetQueueSize = function(success, fail) {
		return cordova.exec(success, fail, "ADBMobile_PhoneGap", "trackingGetQueueSize", []);
	}
		   
	ADB.targetLoadRequest = function(success, fail, name, defaultContent, parameters) {
	   return cordova.exec(success, fail, "ADBMobile_PhoneGap", "targetLoadRequest", [name, defaultContent, parameters]);
	}

   ADB.targetLoadOrderConfirmRequest = function(success, fail, name, orderId, orderTotal, productPurchaseId, parameters) {
	   return cordova.exec(success, fail, "ADBMobile_PhoneGap", "targetLoadOrderConfirmRequest", [name, orderId, orderTotal, productPurchaseId, parameters]);
   }

	return ADB;
}());