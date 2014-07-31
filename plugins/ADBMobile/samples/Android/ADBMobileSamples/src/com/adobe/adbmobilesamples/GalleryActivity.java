/**
 * (c) 2013 Adobe Systems Incorporated. All Rights Reserved.
 */

package com.adobe.adbmobilesamples;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Bundle;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewTreeObserver;
import android.view.Window;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.TextView;
import com.adobe.mobile.Analytics;
import com.adobe.mobile.Config;
import com.adobe.mobile.ADBScene7.*;
import com.adobe.mobile.Target;
import com.adobe.mobile.TargetLocationRequest;

import java.util.HashMap;
import java.util.UUID;

public class GalleryActivity extends Activity {

	// string constants
	private static final String S7_COMPANY              = "mcmobile";
	private static final String URL_DEFAULT             = "http://yodawg.mobi/store";
	private static final String URL_BOGO                = "http://yodawg.mobi/store/bogo";
	private static final String URL_50_OFF              = "http://yodawg.mobi/store/50off";
	private static final String LOCATION_ORDER_CONFIRM  = "orderConfirm";

	private ProgressBar _progressBar;
	private ImageView _imageView;
	private ImageView _bannerImage;
	private TextView _lblImageName;
	private TextView _lblProgress;
	private int _currentGalleryCounter = 0;
	private GalleryItem _currentGalleryItem;
	private final GalleryItem[] _galleryItems = GalleryItem.GetGalleryItems();
	private String _webUrl = URL_DEFAULT;

	// get the correct height and width only once
	private ViewTreeObserver.OnPreDrawListener _listener = new ViewTreeObserver.OnPreDrawListener() {
		@Override
		public boolean onPreDraw() {
			Scene7Image.SetCompany(S7_COMPANY);
			Scene7Image.SetDimensions(_imageView.getMeasuredHeight(), _imageView.getMeasuredWidth());

			_imageView.getViewTreeObserver().removeOnPreDrawListener(_listener);
			updateImage();

			return true;
		}
	};

	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		this.requestWindowFeature(Window.FEATURE_NO_TITLE);
		setContentView(R.layout.gallery);

		_progressBar = (ProgressBar)findViewById(R.id.progressBar);

		// get a reference for the potential promo banner
		_bannerImage = (ImageView)findViewById(R.id.imgBanner);
		_bannerImage.setVisibility(View.INVISIBLE);
		checkForPromotion();

		_imageView = (ImageView)findViewById(R.id.s7ImageView);
		_lblImageName = (TextView)findViewById(R.id.lblImageName);
		_lblProgress = (TextView)findViewById(R.id.lblProgress);

		// add pre draw listener to get correct dimensions of the imageview
		_imageView.getViewTreeObserver().addOnPreDrawListener(_listener);

		// add a touch listener for swipes
		SwipeDetector swipeDetector = new SwipeDetector();
		_imageView.setOnTouchListener(swipeDetector);
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
		Analytics.trackState("Gallery", null);
	}

	public void buyButtonPressed(View view) {

		HashMap<String, Object> orderData = new HashMap<String, Object>();
		orderData.put("revenue", 39.95);
		orderData.put("imageName", _currentGalleryItem.title);

		/* Adobe Tracking - Analytics
		 *
		 * track the revenue produced by this purchase
		 * we are just putting a fake amount (39.95) to produce data
		 */
		Analytics.trackAction("Purchase Image", orderData);

		UUID orderNumber = UUID.randomUUID();
		/* Adobe Tracking - Target
		 *
		 * create an order confirm request for target
		 */
		TargetLocationRequest orderRequest =
				Target.createOrderConfirmRequest(LOCATION_ORDER_CONFIRM, orderNumber.toString(), "39.95", _currentGalleryItem.title, null);

		/* Adobe Tracking - Target
		 *
		 * send the order confirm request
		 * for an order confirm, we don't care about the callback, so we pass null
		 */
		Target.loadRequest(orderRequest, null);

		launchWebStore();
	}

	private void launchWebStore() {
		/* Adobe Tracking - Analytics
		 *
		 * attach the trackingIdentifier from analytics sdk to url in our web store
		 */
		Uri storeUri = Uri.parse(String.format("%s?visitorId=%s&imgName=%s", _webUrl, Analytics.getTrackingIdentifier(), _currentGalleryItem.assetName));

		Intent browser = new Intent(Intent.ACTION_VIEW, storeUri);
		startActivity(browser);
	}

	public void showNextImage() {
		// check against -1 to account for 0 based array
		if (_currentGalleryCounter == _galleryItems.length - 1) {
			return;
		}

		_currentGalleryCounter++;
		updateImage();
	}

	public void showPreviousImage() {
		if (_currentGalleryCounter == 0) {
			return;
		}
		_currentGalleryCounter--;
		updateImage();
	}

	private void updateImage() {
		startGetImage();

		_currentGalleryItem = _galleryItems[_currentGalleryCounter];

		Scene7Image.GetAsset(_currentGalleryItem.assetName, new S7CachedResource.S7Callback<Bitmap>() {
			@Override
			public void call(final Bitmap bitmap) {
				GalleryActivity.this.runOnUiThread(new Runnable() {
					@Override
					public void run() {
						// update image title
						_lblImageName.setText(_currentGalleryItem.title);

						// update the image itself
						_imageView.setImageBitmap(bitmap);

						// update our counter
						_lblProgress.setText(String.format("%d of %d", _currentGalleryCounter + 1, _galleryItems.length));

						// fix control visibility
						endGetImage();
					}
				});
			}
		});
	}

	private void startGetImage() {
		_progressBar.setVisibility(View.VISIBLE);
		_bannerImage.setVisibility(View.INVISIBLE);
		_imageView.setVisibility(View.INVISIBLE);
	}

	private void endGetImage() {
		_progressBar.setVisibility(View.INVISIBLE);
		_bannerImage.setVisibility(View.VISIBLE);
		_imageView.setVisibility(View.VISIBLE);
	}

	private void checkForPromotion() {
		/* Adobe Tracking - Target
		 *
		 * create a request for our bannerOffer location
		 * default content is null so we don't apply an image if our request times out
		 */
		TargetLocationRequest bannerLocation = Target.createRequest("bannerOffer", null, null);

		/* Adobe Tracking - Target
		 *
		 * send the request to see if the user gets a special offer
		 * on the back end, we are returning the name of an image as "offer"
		 * we check to see which offer we got and draw the appropriate image
		 */
		Target.loadRequest(bannerLocation, new Target.TargetCallback<String>() {
			@Override
			public void call(final String offer) {
				GalleryActivity.this.runOnUiThread(new Runnable() {
					@Override
					public void run() {
						if (offer != null && offer.length() > 0) {
							if (offer.contains("bogo")) {
								_bannerImage.setImageDrawable(getResources().getDrawable(R.drawable.bogo));
								_bannerImage.setVisibility(View.VISIBLE);
								_webUrl = URL_BOGO;
							}
							else if (offer.contains("50")) {
								_bannerImage.setImageDrawable(getResources().getDrawable(R.drawable.fiftyoff));
								_bannerImage.setVisibility(View.VISIBLE);
								_webUrl = URL_50_OFF;
							}
							else {
								_bannerImage.setVisibility(View.INVISIBLE);
								_webUrl = URL_DEFAULT;
							}
						}
					}
				});
			}
		});
	}

	// handles swipe gestures to page between images
	public class SwipeDetector implements View.OnTouchListener {

		private static final int MIN_DISTANCE = 100;
		private float downX, upX;

		public void onRightToLeftSwipe() {
			showNextImage();
		}

		public void onLeftToRightSwipe() {
			showPreviousImage();
		}

		public boolean onTouch(View v, MotionEvent event) {
			switch (event.getAction()) {
				case MotionEvent.ACTION_DOWN: {
					downX = event.getX();
					return true;
				}
				case MotionEvent.ACTION_UP: {
					upX = event.getX();

					float deltaX = downX - upX;

					if (Math.abs(deltaX) > MIN_DISTANCE) {
						// left or right
						if (deltaX < 0) {
							this.onLeftToRightSwipe();
							return true;
						}
						else if (deltaX > 0) {
							this.onRightToLeftSwipe();
							return true;
						}
					}
					else {
						return false;
					}

					return true;
				}
				default:
					return false;
			}

		}
	}
}

