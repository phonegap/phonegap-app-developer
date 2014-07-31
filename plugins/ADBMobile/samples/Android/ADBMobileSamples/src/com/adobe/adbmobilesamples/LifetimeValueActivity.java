/**
 * (c) 2013 Adobe Systems Incorporated. All Rights Reserved.
 */

package com.adobe.adbmobilesamples;

import android.app.Activity;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.widget.LinearLayout;
import android.widget.TextView;
import com.adobe.mobile.Analytics;
import com.adobe.mobile.Config;

import java.math.BigDecimal;
import java.util.HashMap;

public class LifetimeValueActivity extends Activity {

	private TextView _lblText;
	private LinearLayout _layout;

	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		this.requestWindowFeature(Window.FEATURE_NO_TITLE);
		setContentView(R.layout.lifetime_value_example);

		_lblText = (TextView)findViewById(R.id.lblLifetimeValueText);
		_layout = (LinearLayout)findViewById(R.id.layoutLifetimeValue);
        updateLTVLabel();
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
		Analytics.trackState("Lifetime Value Example", null);
	}

    public void linkClicked(View view) {
        HashMap<String, Object> cData = new HashMap<String, Object>();
        cData.put("Success Event", "Link Clicked");
        /*
	     * Adobe Tracking - Analytics
	     *
	     * call to trackLifetimeValueIncrease:data: to increase user's lifetime value
	     * we are attributing clicking a link to a value of 3.5
	     */
        Analytics.trackLifetimeValueIncrease(BigDecimal.valueOf(3.5), cData);
        updateLTVLabel();
    }

    public void purchaseMade(View view) {
        HashMap<String, Object> cData = new HashMap<String, Object>();
        cData.put("Success Event", "Purchase");

        /*
	     * Adobe Tracking - Analytics
	     *
	     * call to trackLifetimeValueIncrease:data: to increase user's lifetime value
	     * we are attributing a purchase to a value of 10.0
	     */
        Analytics.trackLifetimeValueIncrease(BigDecimal.valueOf(10.0), cData);
        updateLTVLabel();
    }

    public void mediaUploaded(View view) {
        HashMap<String, Object> cData = new HashMap<String, Object>();
        cData.put("Success Event", "Media Uploaded");

        /*
	     * Adobe Tracking - Analytics
	     *
	     * call to trackLifetimeValueIncrease:data: to increase user's lifetime value
	     * we are attributing uploading media to a value of 5.0
	     */
        Analytics.trackLifetimeValueIncrease(BigDecimal.valueOf(5.0), cData);
        updateLTVLabel();
    }

    public void mediaViewed(View view) {
        HashMap<String, Object> cData = new HashMap<String, Object>();
        cData.put("Success Event", "Media Viewed");
        /*
	     * Adobe Tracking - Analytics
	     *
	     * call to trackLifetimeValueIncrease:data: to increase user's lifetime value
	     * we are attributing viewing media to a value of 7.0
	     */
        Analytics.trackLifetimeValueIncrease(BigDecimal.valueOf(7.0), cData);
        updateLTVLabel();
    }

    public void socialEngagement(View view) {
        HashMap<String, Object> cData = new HashMap<String, Object>();
        cData.put("Success Event", "Social Engagement");
        /*
	     * Adobe Tracking - Analytics
	     *
	     * call to trackLifetimeValueIncrease:data: to increase user's lifetime value
	     * we are attributing a social engagement to a value of 9.0
	     */
        Analytics.trackLifetimeValueIncrease(BigDecimal.valueOf(9.0), cData);
        updateLTVLabel();
    }

    private void updateLTVLabel() {
        TextView ltvLabel = (TextView)findViewById(R.id.lblInApp1);
        /*
	     * Adobe Tracking - Analytics
	     *
	     * call to lifetimeValue returns users current lifetime value
	     */
        ltvLabel.setText(String.format("%.02f", Config.getLifetimeValue()));
    }
}