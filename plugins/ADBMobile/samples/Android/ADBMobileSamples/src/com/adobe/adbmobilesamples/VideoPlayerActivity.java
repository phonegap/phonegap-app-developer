/**
 * (c) 2013 Adobe Systems Incorporated. All Rights Reserved.
 */

package com.adobe.adbmobilesamples;

import android.app.Activity;
import android.media.MediaPlayer;
import android.os.Bundle;
import android.view.Window;
import android.widget.MediaController;
import android.widget.VideoView;
import com.adobe.mobile.*;

public class VideoPlayerActivity extends Activity {

	private static final String MOVIE_URL = "http://s7d2.scene7.com/is/content/mcmobile/new-building-AVS.m3u8";
	private static final String MEDIA_NAME = "MyAdobe";
	private static final String PLAYER_NAME = "VideoView";
	private static final String PLAYER_ID = "VideoView1";
	private static final double MEDIA_LENGTH = 146;

	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		this.requestWindowFeature(Window.FEATURE_NO_TITLE);
		setContentView(R.layout.video_player);

		/*
		 * Adobe Tracking - Media
		 *
		 * create our media settings object so we can configure our tracking preferences
		 */
		MediaSettings settings = Media.settingsWith(MEDIA_NAME, MEDIA_LENGTH, PLAYER_NAME, PLAYER_ID);

		Bundle extras = getIntent().getExtras();
		if (extras != null) {
			/*
			 * Adobe Tracking - Media
			 *
			 * updating our settings based on values passed in from the MediaActivity toggle buttons
			 */
			settings.milestones = extras.getString("milestones");
			settings.segmentByMilestones = extras.getBoolean("segmentByMilestones");
			settings.offsetMilestones = extras.getString("offsetMilestones");
			settings.segmentByOffsetMilestones = extras.getBoolean("segmentByOffsetMilestones");
			settings.trackSeconds = extras.getInt("trackSeconds");
		}

		/*
		 * Adobe Tracking - Media
		 *
		 * opens the media item, preparing it for tracking
		 */
		Media.open(settings, null);

		final VideoView videoView = (VideoView)findViewById(R.id.videoView);

		MediaController mediaController = new MediaController(this);
		mediaController.setAnchorView(videoView);

		videoView.setVideoPath(MOVIE_URL);
		videoView.setMediaController(mediaController);

		videoView.setOnPreparedListener(new MediaPlayer.OnPreparedListener() {
			@Override
			public void onPrepared(MediaPlayer mediaPlayer) {
				/*
				 * Adobe Tracking - Media
				 *
				 * sets the media item into a playing state
				 * if this is the initial play, it begins the tracking and monitor for the media item
				 */
				Media.play(MEDIA_NAME, 0);

				mediaPlayer.start();
			}
		});

		videoView.setOnCompletionListener(new MediaPlayer.OnCompletionListener() {
			@Override
			public void onCompletion(MediaPlayer mediaPlayer) {
				/*
				 * Adobe Tracking - Media
				 *
				 * stops the media item
				 * we need to stop here because we are no longer in a playing state
				 */
				Media.stop(MEDIA_NAME, mediaPlayer.getCurrentPosition());

				/*
				 * Adobe Tracking - Media
				 *
				 * closes the media item
				 * media item should receive no more calls unless its a new open and play
				 */
				Media.close(MEDIA_NAME);

				mediaPlayer.stop();
			}
		});
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

        /*
		 * Adobe Tracking - Media
		 *
		 * closes the media item
		 * media item should receive no more calls unless its a new open and play
		 */
        Media.close(MEDIA_NAME);
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
	}
}