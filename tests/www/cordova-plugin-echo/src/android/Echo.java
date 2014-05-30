/*
Licensed to the Apache Software Foundation (ASF) under one
or more contributor license agreements.  See the NOTICE file
distributed with this work for additional information
regarding copyright ownership.  The ASF licenses this file
to you under the Apache License, Version 2.0 (the
"License"); you may not use this file except in compliance
with the License.  You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an
"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, either express or implied.  See the License for the
specific language governing permissions and limitations
under the License.
*/

package org.apache.cordova.test;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;

import android.annotation.SuppressLint;
import android.util.Base64;

/**
* This class exposes methods in Cordova that can be called from JavaScript.
*/
public class Echo extends CordovaPlugin {


     private volatile boolean bulkEchoing;

     /**
     * Executes the request and returns PluginResult.
     *
     * @param action            The action to execute.
     * @param args              JSONArry of arguments for the plugin.
     * @param callbackContext   The callback context from which we were invoked.
     * @return                  A PluginResult object with a status and message.
     */
    @SuppressLint("NewApi")
	public boolean execute(String action, final JSONArray args, final CallbackContext callbackContext) throws JSONException {
        try {
            if (action.equals("echo")) {
                callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK, args.getString(0)));
                return true;
            } else if(action.equals("echoAsync")) {
                cordova.getActivity().runOnUiThread(new Runnable() {
                    public void run() {
                    	callbackContext.sendPluginResult( new PluginResult(PluginResult.Status.OK, args.optString(0)));
                    }
                });
                return true;
            } else if(action.equals("echoArrayBuffer")) {
            	String data = args.optString(0);
                byte[] rawData= Base64.decode(data, Base64.DEFAULT);
            	callbackContext.sendPluginResult( new PluginResult(PluginResult.Status.OK, rawData));
                return true;
            } else if(action.equals("echoArrayBufferAsync")) {
                cordova.getThreadPool().execute(new Runnable() {
                    public void run() {
                        String data = args.optString(0);
                        byte[] rawData= Base64.decode(data, Base64.DEFAULT);
                        callbackContext.sendPluginResult( new PluginResult(PluginResult.Status.OK, rawData));
                    }
                });
                return true;
            } else if(action.equals("echoMultiPart")) {
            	callbackContext.sendPluginResult( new PluginResult(PluginResult.Status.OK, args.getJSONObject(0)));
                return true;
            } else if(action.equals("stopEchoBulk")) {
                bulkEchoing = false;
            } else if(action.equals("echoBulk")) {
                if (bulkEchoing) {
                    return true;
                }
                final String payload = args.getString(0);
                final int delayMs = args.getInt(1);
                bulkEchoing = true;
                cordova.getThreadPool().execute(new Runnable() {
                    public void run() {
                        while (bulkEchoing) {
                            try {
                                Thread.sleep(delayMs);
                            } catch (InterruptedException e) {}
                            PluginResult pr = new PluginResult(PluginResult.Status.OK, payload);
                            pr.setKeepCallback(true);
                            callbackContext.sendPluginResult(pr);
                        }
                        PluginResult pr = new PluginResult(PluginResult.Status.OK, payload);
                        callbackContext.sendPluginResult(pr);
                    }
                });
                return true;
            }
            callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.ERROR));
            return false;
        } catch (JSONException e) {
            callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.JSON_EXCEPTION));
            return false;
        }
    }
}
