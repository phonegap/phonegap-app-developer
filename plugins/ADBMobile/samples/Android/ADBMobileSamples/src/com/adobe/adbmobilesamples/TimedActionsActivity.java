/**
 * (c) 2013 Adobe Systems Incorporated. All Rights Reserved.
 */

package com.adobe.adbmobilesamples;

import android.app.Activity;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.widget.TextView;
import com.adobe.mobile.Analytics;
import com.adobe.mobile.Config;

import java.util.Map;

public class TimedActionsActivity extends Activity {
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		this.requestWindowFeature(Window.FEATURE_NO_TITLE);
		setContentView(R.layout.timed_actions);
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
		Analytics.trackState("Timed Action Example", null);
	}

	public void startAction1(View view) {
		/*
		 * Adobe Tracking - Analytics
		 *
		 * start a timed action with name "action1" and no additional context data
		 * note: if you call trackTimedActionStart(...) for an action already running, it will overwrite the existing one
		 */
		Analytics.trackTimedActionStart("action1", null);
	}

	public void stopAction1(View view) {
		/*
		 * Adobe Tracking - Analytics
		 *
		 * stop a timed action with name "action1"
		 * in the logic callback, you can manipulate your context data as the Map<String, Object> data object
		 * you must return true if you want the SDK to send a hit for this timed action, or false to suppress the hit
		 */
		Analytics.trackTimedActionEnd("action1", new Analytics.TimedActionBlock<Boolean>() {
			@Override
			public Boolean call(final long inAppDuration, final long totalDuration, Map<String, Object> data) {
				TimedActionsActivity.this.runOnUiThread(new Runnable() {
					@Override
					public void run() {
						TextView inApp1 = (TextView)findViewById(R.id.lblInApp1);
						TextView total1 = (TextView)findViewById(R.id.lblTotal1);
						inApp1.setText(String.format("%d second(s)", inAppDuration));
						total1.setText(String.format("%d second(s)", totalDuration));
					}
				});

				return true;
			}
		});
	}

	public void startAction2(View view) {
		/*
		 * Adobe Tracking - Analytics
		 *
		 * start a timed action with name "action2" and no additional context data
		 * note: if you call trackTimedActionStart(...) for an action already running, it will overwrite the existing one
		 */
		Analytics.trackTimedActionStart("action2", null);
	}

	public void stopAction2(View view) {
		/*
		 * Adobe Tracking - Analytics
		 *
		 * stop a timed action with name "action2"
		 * in the logic callback, you can manipulate your context data as the Map<String, Object> data object
		 * you must return true if you want the SDK to send a hit for this timed action, or false to suppress the hit
		 */
		Analytics.trackTimedActionEnd("action2", new Analytics.TimedActionBlock<Boolean>() {
			@Override
			public Boolean call(final long inAppDuration, final long totalDuration, Map<String, Object> data) {
				TimedActionsActivity.this.runOnUiThread(new Runnable() {
					@Override
					public void run() {
						TextView inApp2 = (TextView)findViewById(R.id.lblInApp2);
						TextView total2 = (TextView)findViewById(R.id.lblTotal2);
						inApp2.setText(String.format("%d second(s)", inAppDuration));
						total2.setText(String.format("%d second(s)", totalDuration));
					}
				});
				return true;
			}
		});
	}
}