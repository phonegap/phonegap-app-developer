/**
 * (c) 2013 Adobe Systems Incorporated. All Rights Reserved.
 */

package com.adobe.adbmobilesamples;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.location.Criteria;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.Window;
import android.widget.Toast;
import com.adobe.mobile.*;

import java.util.List;

public class MenuActivity extends Activity implements LocationListener {

	private LocationManager locationManager;
	private String locationProvider = null;

	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		this.requestWindowFeature(Window.FEATURE_NO_TITLE);
		setContentView(R.layout.main);

		/*
		 * Adobe Tracking - Analytics
		 *
		 * set the context for the SDK
		 * this is necessary for access to sharedPreferences and file i/o
		 */
		Config.setContext(this.getApplicationContext());

		/*
		 * Adobe Tracking - Config
		 *
		 * turn on debug logging for the ADBMobile SDK
		 */
		Config.setDebugLogging(true);
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

		if (locationProvider != null && locationProvider.length() > 0) {
			locationManager.removeUpdates(this);
		}
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
		Analytics.trackState("Main Menu", null);

        // update current location
        getUserLocation();
	}

	public void gallery(View view) {
		Intent galleryIntent = new Intent(this, GalleryActivity.class);
		startActivity(galleryIntent);
	}

	public void simpleTracking(View view) {
		Intent simpleTrackingIntent = new Intent(this, SimpleTrackingActivity.class);
		startActivity(simpleTrackingIntent);
	}

	public void timedActions(View view) {
		Intent timedActionsIntent = new Intent(this, TimedActionsActivity.class);
		startActivity(timedActionsIntent);
	}

	public void privacy(View view) {
		Intent privacyIntent = new Intent(this, PrivacyActivity.class);
		startActivity(privacyIntent);
	}

	public void mediaExample(View view) {
		Intent mediaIntent = new Intent(this, MediaActivity.class);
		startActivity(mediaIntent);
	}

	public void targetingLocations(View view) {
		Intent targetingIntent = new Intent(this, TargetingLocationActivity.class);
		startActivity(targetingIntent);
	}

    public void lifetimeValue(View view) {
        Intent lifetimeValueIntent = new Intent(this, LifetimeValueActivity.class);
        startActivity(lifetimeValueIntent);
    }

	private void getUserLocation() {
		locationManager = (LocationManager)getApplicationContext().getSystemService(Context.LOCATION_SERVICE);
		Criteria criteria = new Criteria();
		criteria.setAccuracy(Criteria.ACCURACY_FINE);
		List<String> providers = locationManager.getProviders(criteria, true);

        if (providers == null || providers.size() == 0) {
			Toast.makeText(this, "Could not open GPS service", Toast.LENGTH_LONG).show();
		}
		else {
            Criteria stuff = new Criteria();
			locationProvider = locationManager.getBestProvider(stuff, false);
			locationManager.requestLocationUpdates(locationProvider, 0, 0, this);
            locationManager.requestLocationUpdates(LocationManager.NETWORK_PROVIDER, 0, 0, this);
		}

    }

	@Override
	public void onLocationChanged(Location location) {
		/*
		 * Adobe Tracking - Analytics
		 *
		 * trackLocation(...) call to get the location of the current user
		 * because the config file has points of interest in it, the SDK will automatically determine
		 * whether the user falls within a point of interest
		 */
		Analytics.trackLocation(location, null);

        // remove the updates because we only want to track the location once
		locationManager.removeUpdates(this);
	}

	@Override
	public void onStatusChanged(String s, int i, Bundle bundle) {}

	@Override
	public void onProviderEnabled(String s) {
		Toast.makeText(this, "Location Provider Enabled", Toast.LENGTH_LONG).show();
	}

	@Override
	public void onProviderDisabled(String s) {
		Toast.makeText(this, "Location Provider Disabled", Toast.LENGTH_LONG).show();
	}



}
