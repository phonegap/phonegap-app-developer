/**
 * (c) 2013 Adobe Systems Incorporated. All Rights Reserved.
 */

package com.adobe.adbmobilesamples;

import android.app.Activity;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import com.adobe.mobile.Analytics;
import com.adobe.mobile.Config;
import com.adobe.mobile.MobilePrivacyStatus;

public class PrivacyActivity extends Activity {
	private MobilePrivacyStatus currentStatus;

	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		this.requestWindowFeature(Window.FEATURE_NO_TITLE);
		setContentView(R.layout.privacy_example);
	}

	@Override
	protected void onPause() {
		super.onPause();
		/*
		 * Adobe Tracking - Config
		 *
		 * call pauseCollectingLifecycleData() in case leaving this activity also means leaving the app
		 * must be in the onPause() of every activity in your app
		 */
		Config.pauseCollectingLifecycleData();
	}

	@Override
	protected void onResume() {
		super.onResume();
		/*
		 * Adobe Tracking - Config
		 *
		 * call collectLifecycleData() to begin collecting lifecycle data
		 * must be in the onResume() of every activity in your app
		 */
		Config.collectLifecycleData();

		/*
		 * Adobe Tracking - Analytics
		 *
		 * call to trackState(...) for view states report
		 * trackState(...) increments the page view
		 */
		currentStatus = Config.getPrivacyStatus();
		Analytics.trackState("Privacy Example", null);
	}

	public void setOptIn(View view) {
		/*
		 * Adobe Tracking - Analytics
		 *
		 * setting privacy status to ADBMobilePrivacyStatusOptIn will send hits immediately
		 */
		Config.setPrivacyStatus(MobilePrivacyStatus.MOBILE_PRIVACY_STATUS_OPT_IN);
		currentStatus = Config.getPrivacyStatus();
	}

	public void setOptOut(View view) {
		/*
		 * Adobe Tracking - Analytics
		 *
		 * setting privacy status to ADBMobilePrivacyStatusOptOut will discard hits immediately
		 */
		Config.setPrivacyStatus(MobilePrivacyStatus.MOBILE_PRIVACY_STATUS_OPT_OUT);
		currentStatus = Config.getPrivacyStatus();
	}

	public void setOptUnknown(View view) {
		/*
		 * Adobe Tracking - Analytics
		 *
		 * setting privacy status to ADBMobilePrivacyStatusOptUnknown will have different behaviors
		 * if your app is not set to track offline, hits will be discarded immediately
		 * if your app is set to track offline, hits will be retained until the privacy status changes
		 * retained hits will all be sent if next privacy status is set to OptIn
		 * retained hits will all be discarded if next privacy status is set to OptOut
		 */
		Config.setPrivacyStatus(MobilePrivacyStatus.MOBILE_PRIVACY_STATUS_UNKNOWN);
		currentStatus = Config.getPrivacyStatus();
	}

	public void trackActionPrivacy(View view) {
		/*
		 * Adobe Tracking - Analytics
		 *
		 * call to trackAction:data: for privacy status check
		 * trackAction:data: does not increment page views
		 */
		Analytics.trackAction("privacyStatusCheck", null);
	}
}