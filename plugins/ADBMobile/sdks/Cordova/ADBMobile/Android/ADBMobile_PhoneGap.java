package com.adobe;

import android.location.Location;
import android.util.Log;
import android.widget.Switch;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CallbackContext;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import com.adobe.mobile.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Iterator;

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

public class ADBMobile_PhoneGap extends CordovaPlugin {

    // =====================
    // public Method - all calls filter through this
    // =====================
    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        Config.setContext(cordova.getActivity());
        if (action.equals("getVersion")) {
            this.getVersion(callbackContext);
            return true;
        } else if (action.equals("getPrivacyStatus")) {
            this.getPrivacyStatus(callbackContext);
            return true;
        } else if (action.equals("setPrivacyStatus")) {
            this.setPrivacyStatus(args, callbackContext);
            return true;
        } else if (action.equals("getLifetimeValue")) {
            this.getLifetimeValue(callbackContext);
            return true;
        } else if (action.equals("getUserIdentifier")) {
            this.getUserIdentifier(callbackContext);
            return true;
        } else if (action.equals("setUserIdentifier")) {
            this.setUserIdentifier(args, callbackContext);
            return true;
        } else if (action.equals("getDebugLogging")) {
            this.getDebugLogging(callbackContext);
            return true;
        } else if (action.equals("setDebugLogging")) {
            this.setDebugLogging(args, callbackContext);
            return true;
        } else if (action.equals("trackState")) {
            this.trackState(args, callbackContext);
            return true;
        } else if (action.equals("trackAction")) {
            this.trackAction(args, callbackContext);
            return true;
        } else if (action.equals("trackLocation")) {
            this.trackLocation(args, callbackContext);
            return true;
        } else if (action.equals("trackLifetimeValueIncrease")) {
            this.trackLifetimeValueIncrease(args, callbackContext);
            return true;
        } else if (action.equals("trackTimedActionStart")) {
            this.trackTimedActionStart(args, callbackContext);
            return true;
        } else if (action.equals("trackTimedActionUpdate")) {
            this.trackTimedActionUpdate(args, callbackContext);
            return true;
        } else if (action.equals("trackTimedActionEnd")) {
            this.trackTimedActionEnd(args, callbackContext);
            return true;
        } else if (action.equals("trackingTimedActionExists")) {
            this.trackingTimedActionExists(args, callbackContext);
            return true;
        } else if (action.equals("trackingIdentifier")) {
            this.trackingIdentifier(callbackContext);
            return true;
        } else if (action.equals("trackingClearQueue")) {
            this.trackingClearQueue(callbackContext);
            return true;
        } else if (action.equals("trackingGetQueueSize")) {
            this.trackingGetQueueSize(callbackContext);
            return true;
        } else if (action.equals("targetLoadRequest")) {
            this.targetLoadRequest(args, callbackContext);
            return true;
        } else if (action.equals("targetLoadOrderConfirmRequest")) {
                this.targetLoadOrderConfirmRequest(args, callbackContext);
                return true;
        }

        return false;
    }

    // =====================
    // Analytics/Config Methods
    // =====================
    private void getVersion(final CallbackContext callbackContext) {
        cordova.getThreadPool().execute((new Runnable() {
            @Override
            public void run() {
                String version = Config.getVersion();
                callbackContext.success(version);
            }
        }));
    }

    private void getPrivacyStatus(final CallbackContext callbackContext) {
        cordova.getThreadPool().execute((new Runnable() {
            @Override
            public void run() {
                switch (Config.getPrivacyStatus()) {
                    case MOBILE_PRIVACY_STATUS_OPT_IN:
                        callbackContext.success("Opted In");
                        break;
                    case MOBILE_PRIVACY_STATUS_OPT_OUT:
                        callbackContext.success("Opted Out");
                        break;
                    case MOBILE_PRIVACY_STATUS_UNKNOWN:
                        callbackContext.success("Opt Unknown");
                        break;
                    default:
                        callbackContext.error("Privacy Status was an unknown value");
                }
            }
        }));
    }

    private void setPrivacyStatus(JSONArray args, final CallbackContext callbackContext) throws JSONException {
        final int status = args.getInt(0);

        cordova.getThreadPool().execute((new Runnable() {
            @Override
            public void run() {
                switch (status) {
                    case 1:
                        Config.setPrivacyStatus(MobilePrivacyStatus.MOBILE_PRIVACY_STATUS_OPT_IN);
                        callbackContext.success("Status set to opted in");
                        break;
                    case 2:
                        Config.setPrivacyStatus(MobilePrivacyStatus.MOBILE_PRIVACY_STATUS_OPT_OUT);
                        callbackContext.success("Status set to opted out");
                        break;
                    case 3:
                        Config.setPrivacyStatus(MobilePrivacyStatus.MOBILE_PRIVACY_STATUS_UNKNOWN);
                        callbackContext.success("Status set to unknown");
                        break;
                    default:
                        callbackContext.error("Privacy Status was an unknown value");
                }
            }
        }));
    }

    private void getLifetimeValue(final CallbackContext callbackContext) {
        cordova.getThreadPool().execute((new Runnable() {
            @Override
            public void run() {
                BigDecimal ltValue = Config.getLifetimeValue();
                callbackContext.success(ltValue.toString());
            }
        }));
    }

    private void getUserIdentifier(final CallbackContext callbackContext) {

        cordova.getThreadPool().execute((new Runnable() {
            @Override
            public void run() {
                String UserIdentifier = Config.getUserIdentifier();
                callbackContext.success(UserIdentifier);
            }
        }));
    }

    private void setUserIdentifier(JSONArray args, final CallbackContext callbackContext) throws JSONException{
        final String userIdentifier = args.getString(0);

        cordova.getThreadPool().execute((new Runnable() {
            @Override
            public void run() {
                Config.setUserIdentifier(userIdentifier);
                callbackContext.success("Set User Identifier");
            }
        }));
    }

    private void getDebugLogging(final CallbackContext callbackContext) {
        cordova.getThreadPool().execute((new Runnable() {
            @Override
            public void run() {
                boolean debugLogging = Config.getDebugLogging();
                callbackContext.success(debugLogging ? "true" : "false");
            }
        }));
    }

    private void setDebugLogging(JSONArray args, final CallbackContext callbackContext) throws JSONException{
        final boolean status = args.getBoolean(0);

        cordova.getThreadPool().execute((new Runnable() {
            @Override
            public void run() {
                Config.setDebugLogging(status);
                callbackContext.success("Set DebugLogging");
            }
        }));
    }

    private void trackState(final JSONArray args, final CallbackContext callbackContext) {
        cordova.getThreadPool().execute((new Runnable() {
            @Override
            public void run() {
                String state = null;
                HashMap<String, Object> cData = null;

                try {
                    if (args.get(0) != JSONObject.NULL && args.get(0).getClass() == String.class) {
                        state = args.getString(0);
                    } else if (args.get(0) != JSONObject.NULL) {
                        JSONObject cDataJSON = args.getJSONObject(0);
                        if (cDataJSON != null && cDataJSON.length() > 0) {
                            cData = GetHashMapFromJSON(cDataJSON);
                        }
                    }
                    if (args.get(1) != JSONObject.NULL) {
                        JSONObject cDataJSON = args.getJSONObject(1);
                        if (cDataJSON != null && cDataJSON.length() > 0) {
                            cData = GetHashMapFromJSON(cDataJSON);
                        }
                    }
                }
                catch (JSONException e) {
                    e.printStackTrace();
                    callbackContext.error(e.getMessage());
                }

                Analytics.trackState(state, cData);
                callbackContext.success();
            }
        }));
    }

    private void trackAction(final JSONArray args, final CallbackContext callbackContext) {
        cordova.getThreadPool().execute((new Runnable() {
            @Override
            public void run() {
                String action = null;
                HashMap<String, Object> cData = null;

                try {
                    // set appState if passed in
                    if (args.get(0) != JSONObject.NULL && args.get(0).getClass() == String.class) {
                        action = args.getString(0);
                    } else if (args.get(0) != JSONObject.NULL) {
                        // else set cData if it is passed in alone
                        JSONObject cDataJSON = args.getJSONObject(0);
                        if (cDataJSON != null && cDataJSON.length() > 0) {
                            cData = GetHashMapFromJSON(cDataJSON);
                        }
                    }
                    // set cData if it is passed in along with action
                    if (args.get(1) != JSONObject.NULL) {
                        JSONObject cDataJSON = args.getJSONObject(1);
                        if (cDataJSON != null && cDataJSON.length() > 0) {
                            cData = GetHashMapFromJSON(cDataJSON);
                        }
                    }
                }
                catch (JSONException e) {
                    e.printStackTrace();
                    callbackContext.error(e.getMessage());
                }

                Analytics.trackAction(action, cData);
                callbackContext.success();
            }
        }));
    }

    private void trackLocation(final JSONArray args, final CallbackContext callbackContext) {
        cordova.getThreadPool().execute((new Runnable() {
            @Override
            public void run() {
                Location location = new Location("New Location");
                HashMap<String, Object> cData = null;

                try {
                    location.setLatitude(Double.parseDouble(args.getString(0)));
                    location.setLongitude(Double.parseDouble(args.getString(1)));

                    // set cData if it is passed in along with action
                    if (args.get(2) != JSONObject.NULL)
                    {
                        JSONObject cDataJSON = args.getJSONObject(2);
                        if (cDataJSON != null && cDataJSON.length() > 0)
                            cData = GetHashMapFromJSON(cDataJSON);
                    }
                }
                catch (JSONException e) {
                    e.printStackTrace();
                    callbackContext.error(e.getMessage());
                }
                catch (NumberFormatException e) {
                    e.printStackTrace();
                    callbackContext.error(e.getMessage());
                }

                Analytics.trackLocation(location, cData);
                callbackContext.success();
            }
        }));
    }

    private void trackLifetimeValueIncrease(final JSONArray args, final CallbackContext callbackContext) {
        cordova.getThreadPool().execute((new Runnable() {
            @Override
            public void run() {
                BigDecimal amount = null;
                HashMap<String, Object> cData = null;

                try {
                    amount = new BigDecimal(args.getString(0));

                    // set cData
                    if (args.get(1) != JSONObject.NULL) {
                        JSONObject cDataJSON = args.getJSONObject(1);
                        if (cDataJSON != null && cDataJSON.length() > 0) {
                            cData = GetHashMapFromJSON(cDataJSON);
                        }
                    }
                }
                catch (JSONException e) {
                    e.printStackTrace();
                    callbackContext.error(e.getMessage());
                } catch (NumberFormatException e) {
                    e.printStackTrace();
                    callbackContext.error(e.getMessage());
                }
                Analytics.trackLifetimeValueIncrease(amount, cData);
                callbackContext.success();
            }
        }));
    }

    private void trackTimedActionStart(final JSONArray args, final CallbackContext callbackContext) {
        cordova.getThreadPool().execute((new Runnable() {
            String action = null;
            HashMap<String, Object> cData = null;

            @Override
            public void run() {
                try {
                    // set appState if passed in
                    if (args.get(0) != JSONObject.NULL && args.get(0).getClass() == String.class) {
                        action = args.getString(0);
                    } else if (args.get(0) != JSONObject.NULL) {
                        // else set cData if it is passed in alone
                        JSONObject cDataJSON = args.getJSONObject(0);
                        if (cDataJSON != null && cDataJSON.length() > 0) {
                            cData = GetHashMapFromJSON(cDataJSON);
                        }
                    }
                    // set cData if it is passed in along with action
                    if (args.get(1) != JSONObject.NULL) {
                        JSONObject cDataJSON = args.getJSONObject(1);
                        if (cDataJSON != null && cDataJSON.length() > 0) {
                            cData = GetHashMapFromJSON(cDataJSON);
                        }
                    }
                }
                catch (JSONException e) {
                    e.printStackTrace();
                    callbackContext.error(e.getMessage());
                }
                Analytics.trackTimedActionStart(action, cData);
                callbackContext.success();
            }
        }));
    }

    private void trackTimedActionUpdate(final JSONArray args, final CallbackContext callbackContext) {
        cordova.getThreadPool().execute((new Runnable() {
            String action = null;
            HashMap<String, Object> cData = null;

            @Override
            public void run() {
                try {
                    // set appState if passed in
                    if (args.get(0) != JSONObject.NULL && args.get(0).getClass() == String.class) {
                        action = args.getString(0);
                    } else if (args.get(0) != JSONObject.NULL) {
                        // else set cData if it is passed in alone
                        JSONObject cDataJSON = args.getJSONObject(0);
                        if (cDataJSON != null && cDataJSON.length() > 0)
                            cData = GetHashMapFromJSON(cDataJSON);
                    }
                    // set cData if it is passed in along with action
                    if (args.get(1) != JSONObject.NULL)
                    {
                        JSONObject cDataJSON = args.getJSONObject(1);
                        if (cDataJSON != null && cDataJSON.length() > 0)
                            cData = GetHashMapFromJSON(cDataJSON);
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                    callbackContext.error(e.getMessage());
                }

                Analytics.trackTimedActionUpdate(action, cData);
                callbackContext.success();
            }
        }));
    }

    private void trackingTimedActionExists(final JSONArray args, final CallbackContext callbackContext) throws JSONException {
        final String action = args.getString(0);

        cordova.getThreadPool().execute((new Runnable() {
            @Override
            public void run() {
                boolean exists = Analytics.trackingTimedActionExists(action);
                callbackContext.success(exists ? "true" : "false");
            }
        }));
    }

    private void trackTimedActionEnd(final JSONArray args, final CallbackContext callbackContext) throws JSONException {
        final String action = args.getString(0);

        cordova.getThreadPool().execute((new Runnable() {
            @Override
            public void run() {
                Analytics.trackTimedActionEnd(action, null);
                callbackContext.success();
            }
        }));
    }

    private void trackingIdentifier(final CallbackContext callbackContext) {
        cordova.getThreadPool().execute((new Runnable() {
            @Override
            public void run() {
                String trackingIdentifier = Analytics.getTrackingIdentifier();
                callbackContext.success(trackingIdentifier);
            }
        }));
    }

    private void trackingClearQueue(final CallbackContext callbackContext) {
        cordova.getThreadPool().execute((new Runnable() {
            @Override
            public void run() {
                Analytics.clearQueue();
                callbackContext.success();
            }
        }));
    }

    private void trackingGetQueueSize(final CallbackContext callbackContext) {
        cordova.getThreadPool().execute((new Runnable() {
            @Override
            public void run() {
                long size = Analytics.getQueueSize();
                callbackContext.success(String.valueOf(size));
            }
        }));
    }

    // =====================
    // Target
    // =====================
    private void targetLoadRequest(final JSONArray args, final CallbackContext callbackContext) {
        cordova.getThreadPool().execute((new Runnable() {
            @Override
            public void run() {
                try {
                    String name = args.getString(0);
                    String defaultContent = args.getString(1);
                    HashMap<String, Object> params = null;

                    // set params
                    if (args.get(2) != JSONObject.NULL)
                    {
                        JSONObject cDataJSON = args.getJSONObject(2);
                        if (cDataJSON != null && cDataJSON.length() > 0) {
                            params = GetHashMapFromJSON(cDataJSON);
                        }
                    }

                    TargetLocationRequest request = Target.createRequest(name, defaultContent, params);

                    Target.loadRequest(request, new Target.TargetCallback<String>() {
                        @Override
                        public void call(String s) {
                            callbackContext.success(s);
                        }
                    });

                } catch (JSONException e) {
                    e.printStackTrace();
                    callbackContext.error(e.getMessage());
                }
            }
        }));

    }

    private void targetLoadOrderConfirmRequest(final JSONArray args, final CallbackContext callbackContext) {
        cordova.getThreadPool().execute((new Runnable() {
            @Override
            public void run() {
                HashMap<String, Object> params = null;
                String name = null;
                String orderID = null;
                String orderTotal = null;
                String productPurchaseID = null;

                try {
                    name = args.getString(0);
                    orderID = args.getString(1);
                    orderTotal = args.getString(2);
                    productPurchaseID = args.getString(3);

                    // set params
                    if (args.get(4) != JSONObject.NULL)
                    {
                        JSONObject cDataJSON = args.getJSONObject(4);
                        if (cDataJSON != null && cDataJSON.length() > 0) {
                            params = GetHashMapFromJSON(cDataJSON);
                        }
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                    callbackContext.error(e.getMessage());
                }

                TargetLocationRequest request = Target.createOrderConfirmRequest(name, orderID, orderTotal, productPurchaseID , params);
                Target.loadRequest(request, new Target.TargetCallback<String>() {
                    @Override
                    public void call(String s) {
                        callbackContext.success(s);
                    }
                });
            }
        }));
    }

    // =====================
    // Helpers
    // =====================
    private HashMap<String, Object> GetHashMapFromJSON(JSONObject data) {
        HashMap<String, Object> map = new HashMap<String, Object>();
        @SuppressWarnings("rawtypes")
        Iterator it = data.keys();
        while (it.hasNext()) {
            String n = (String)it.next();
            try {
                map.put(n, data.getString(n));
            }
            catch (JSONException e) {
                e.printStackTrace();
            }
        }

        HashMap<String, Object> table = new HashMap<String, Object>();
        table.putAll(map);
        return table;
    }
}