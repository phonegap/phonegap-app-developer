/**
 * (c) 2013 Adobe Systems Incorporated. All Rights Reserved.
 */

package com.adobe.adbmobilesamples;

import android.app.Activity;
import android.content.Intent;
import android.media.MediaPlayer;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.widget.LinearLayout;
import android.widget.MediaController;
import android.widget.ToggleButton;
import android.widget.VideoView;
import com.adobe.mobile.Analytics;
import com.adobe.mobile.Config;
import com.adobe.mobile.Media;
import com.adobe.mobile.MediaSettings;

public class MediaActivity extends Activity {

	private ToggleButton _toggleTrackMilestones, _toggleSegmentMilestones, _toggleTrackOffsetMilestones,
			_toggleSegmentOffsetMilestones, _toggleTrackEvery30;

	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		this.requestWindowFeature(Window.FEATURE_NO_TITLE);
		setContentView(R.layout.media_example);

		_toggleTrackMilestones = (ToggleButton)findViewById(R.id.toggleTrackMilestones);
		_toggleSegmentMilestones = (ToggleButton)findViewById(R.id.toggleSegmentMilestones);
		_toggleTrackOffsetMilestones = (ToggleButton)findViewById(R.id.toggleOffsetMilestones);
		_toggleSegmentOffsetMilestones = (ToggleButton)findViewById(R.id.toggleSegmentOffset);
		_toggleTrackEvery30 = (ToggleButton)findViewById(R.id.toggleTrack30);

		_toggleTrackMilestones.setChecked(true);
		_toggleSegmentMilestones.setChecked(true);
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
		Analytics.trackState("Media Example", null);
	}

	public void toggleMilestones(View view) {
		if (_toggleTrackMilestones.isChecked()) {
			_toggleTrackOffsetMilestones.setChecked(false);
			_toggleSegmentOffsetMilestones.setChecked(false);
			_toggleTrackEvery30.setChecked(false);
		}
		else {
			_toggleSegmentMilestones.setChecked(false);
		}
	}

	public void toggleSegmentMilestones(View view) {
		if (_toggleSegmentMilestones.isChecked()) {
			_toggleTrackMilestones.setChecked(true);
			_toggleTrackOffsetMilestones.setChecked(false);
			_toggleSegmentOffsetMilestones.setChecked(false);
			_toggleTrackEvery30.setChecked(false);
		}
	}

	public void toggleOffsetMilestones(View view) {
		if (_toggleTrackOffsetMilestones.isChecked()) {
			_toggleTrackMilestones.setChecked(false);
			_toggleSegmentMilestones.setChecked(false);
			_toggleTrackEvery30.setChecked(false);
		}
		else {
			_toggleSegmentOffsetMilestones.setChecked(false);
		}
	}

	public void toggleSegmentOffsetMilestones(View view) {
		if (_toggleSegmentOffsetMilestones.isChecked()) {
			_toggleTrackOffsetMilestones.setChecked(true);
			_toggleTrackMilestones.setChecked(false);
			_toggleSegmentMilestones.setChecked(false);
			_toggleTrackEvery30.setChecked(false);
		}
	}

	public void toggleTrackEvery30(View view) {
		if (_toggleTrackEvery30.isChecked()) {
			_toggleTrackMilestones.setChecked(false);
			_toggleSegmentMilestones.setChecked(false);
			_toggleTrackOffsetMilestones.setChecked(false);
			_toggleSegmentOffsetMilestones.setChecked(false);
		}
	}

	public void playMedia(View view) {
		Intent videoPlayerIntent = new Intent(this, VideoPlayerActivity.class);

		if (_toggleTrackMilestones.isChecked()) {
			videoPlayerIntent.putExtra("milestones", "25,50,75");

			if (_toggleSegmentMilestones.isChecked()) {
				videoPlayerIntent.putExtra("segmentByMilestones", true);
			}
		}
		else if (_toggleTrackOffsetMilestones.isChecked()) {
			videoPlayerIntent.putExtra("offsetMilestones", "60,120");

			if (_toggleSegmentOffsetMilestones.isChecked()) {
				videoPlayerIntent.putExtra("segmentByOffsetMilestones", true);
			}
		}
		else if (_toggleTrackEvery30.isChecked()) {
			videoPlayerIntent.putExtra("trackSeconds", 30);
		}

		startActivity(videoPlayerIntent);
	}
}