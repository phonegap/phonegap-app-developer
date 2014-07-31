/**
 * (c) 2013 Adobe Systems Incorporated. All Rights Reserved.
 */

package com.adobe.adbmobilesamples;

import android.app.Activity;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.widget.EditText;
import com.adobe.mobile.Analytics;
import com.adobe.mobile.Config;
import java.util.HashMap;

public class SimpleTrackingActivity extends Activity {
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		this.requestWindowFeature(Window.FEATURE_NO_TITLE);
		setContentView(R.layout.simple_tracking);
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
		Analytics.trackState("Simple Tracking Example", null);
	}

	public void trackState(View view) {
		HashMap<String, Object> contextData = new HashMap<String, Object>();
		contextData.put("page.name", "Example State");
		EditText name = (EditText)findViewById(R.id.txtName);
		if (name.getText().length() > 0) {
			contextData.put("user.name", name.getText());
		}

		/*
		 * Adobe Tracking - Analytics
		 *
		 * call to trackState:data: for view states report
		 * trackState:data: increments the page view
		 */
		Analytics.trackState("Example State", contextData);
	}

	public void trackAction(View view) {
		HashMap<String, Object> contextData = new HashMap<String, Object>();
		contextData.put("page.name", "Example State");
		EditText name = (EditText)findViewById(R.id.txtName);
		if (name.getText().length() > 0) {
			contextData.put("user.name", name.getText());
		}

		/*
		 * Adobe Tracking - Analytics
		 *
		 * call to trackAction:data: indicating the trackAction button was pushed
		 * trackAction:data: does not increment page view
		 */
		Analytics.trackAction("trackAction:data: button pushed", contextData);
	}
}