/**
 * (c) 2013 Adobe Systems Incorporated. All Rights Reserved.
 */

package com.adobe.adbmobilesamples;

import android.app.Activity;
import android.graphics.Color;
import android.location.Location;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.widget.LinearLayout;
import android.widget.TextView;
import com.adobe.mobile.Analytics;
import com.adobe.mobile.Config;
import com.adobe.mobile.Target;
import com.adobe.mobile.TargetLocationRequest;

public class TargetingLocationActivity extends Activity {

	private Location _seattle, _sanJose, _nyc, _dallas, _miami;
	private TextView _lblText;
	private LinearLayout _layout;

	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		this.requestWindowFeature(Window.FEATURE_NO_TITLE);
		setContentView(R.layout.targeting_location);

		_lblText = (TextView)findViewById(R.id.lblTargetText);
		_layout = (LinearLayout)findViewById(R.id.layoutTarget);

		_seattle = new Location("seattle");
		_sanJose = new Location("sanJose");
		_nyc = new Location("nyc");
		_dallas = new Location("dallas");
		_miami = new Location("miami");

		setLatLon(_seattle, 47.60621, -122.33207);
		setLatLon(_sanJose, 37.33939, -121.89496);
		setLatLon(_nyc, 40.71435, -74.00597);
		setLatLon(_dallas, 32.78014, -96.80045);
		setLatLon(_miami, 25.78897, -80.22644);
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
		Analytics.trackState("Location Targeting Example", null);
	}

	private void setLatLon(Location location, double lat, double lon) {
		location.setLatitude(lat);
		location.setLongitude(lon);
	}

	public void targetSeattle(View view) {
		sendLocationTrack(_seattle);
	}

	public void targetSanJose(View view) {
		sendLocationTrack(_sanJose);
	}

	public void targetNewYork(View view) {
		sendLocationTrack(_nyc);
	}

	public void targetDallas(View view) {
		sendLocationTrack(_dallas);
	}

	public void targetMiami(View view) {
		sendLocationTrack(_miami);
	}

	private void sendLocationTrack(Location location) {
		/* Adobe Tracking - Analytics
		 *
		 * standard tracking location call with our pre-determined CLLocation objects
		 * once we have a location via trackLocation(...), the poi data will automatically be used
		 * for subsequent calls to target
		 */
		Analytics.trackLocation(location, null);
		runLocationTargeting();
	}

	private void runLocationTargeting() {
		/* Adobe Tracking - Target
		 *
		 * reset cookies to ensure target gives us a different experience depending on user's location choice
		 * note: we are resetting cookies for this demo so the target server will allow us to reset experiences
		 */
		Target.clearCookies();

		/* Adobe Tracking - Target
		 *
		 * create a request for the geo targeting location
		 * default is black background and white text
		 */
		TargetLocationRequest locationRequest = Target.createRequest("geoColors", "ffffff/000000", null);

		/* Adobe Tracking - Target
		 *
		 * send our location request and in the callback, change the colors we get back from target
		 */
		Target.loadRequest(locationRequest, new Target.TargetCallback<String>() {
			@Override
			public void call(String content) {
				// change colors
				final String[] colors = content.split("/");

				if (colors.length != 2) {
					return;
				}

				TargetingLocationActivity.this.runOnUiThread(new Runnable() {
					@Override
					public void run() {
						_lblText.setTextColor(Color.parseColor("#FF"+colors[0]));
						_layout.setBackgroundColor(Color.parseColor("#DD"+colors[1]));
					}
				});
			}
		});
	}

}