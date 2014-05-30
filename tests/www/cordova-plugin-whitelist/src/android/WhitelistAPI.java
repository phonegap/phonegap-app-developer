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

import org.apache.cordova.Whitelist;
import org.apache.cordova.Config;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;

public class WhitelistAPI extends CordovaPlugin {
    /**
     * Executes the request and returns PluginResult.
     *
     * @param action            The action to execute.
     * @param args              JSONArry of arguments for the plugin.
     * @param callbackContext   The callback id used when calling back into JavaScript.
     * @return                  True if the action was valid, false if not.
     */
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if (action.equals("URLMatchesPatterns")) {
            String url = args.getString(0);
            JSONArray patterns = args.getJSONArray(1);
            Whitelist whitelist = new Whitelist();
            for (int i=0; i < patterns.length(); i++) {
                String pattern = patterns.getString(i);
                whitelist.addWhiteListEntry(pattern, false);
            }
            boolean isAllowed = whitelist.isUrlWhiteListed(url);
            callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK, isAllowed));
            return true;
        } else if (action.equals("URLIsAllowed")) {
            String url = args.getString(0);
            boolean isAllowed = Config.isUrlWhiteListed(url);
            callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK, isAllowed));
            return true;
        }
        return false;
    }
}
