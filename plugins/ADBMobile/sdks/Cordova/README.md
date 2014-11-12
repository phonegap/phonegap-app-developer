#Adobe Mobile Services cordova plugin

##Getting Started:

###Create and add plugin
1. Create a cordova plugin
	ex. cordova create sampleApp com.sample.test HelloWorld
2. Navigate to the root of the recently created project
	ex. cd sampleApp/
3. Add Platforms
	ex. cordova platform add android
4. Add MobileServices plugin
	ex. cordova plugin add https://github.com/Adobe-Marketing-Cloud/mobile-services.git

###Android 
1. Open the project
2. Replace or update ADBMobileConfig.json
	- Replace ADBMobileConfig.json located in the assets directory with your ADBMobileConfig.json downloaded from Adobe Mobile Services  
	or  
	- Update ADBMobileConfig.json located in the assets directory with your settings
3. Navigate to the default activity Cordova made (located in your src directory)
4. In onCreate supply the Adobe library with an application context (com.adobe.mobile.Config.setContext(this.getApplicationContext());)
5. In onResume tell the Adobe library when the application resumes. 

	```java
	@Override
	protected void onResume() {
		super.onResume();
		com.adobe.mobile.Config.collectLifecycleData();
	}
	```
	
6. In onPause tell the Adobe library when the application pauses.

	```java
	@Override
	protected void onPause() {
		super.onPause();
		com.adobe.mobile.Config.pauseCollectingLifecycleData();
	}
	```

7. Setup is complete. The Adobe library is now accessable within the index.html file via "window.ADB"
	```html
	<button style="height:200px; width:600px" onclick = "window.ADB.trackState('login page', {'user':'john','remember':'true'});">sampleHit</button>
	```

###iOS
1. Open the project
2. Replace or update ADBMobileConfig.json
	- Replace ADBMobileConfig.json located in the Resources directory with your ADBMobileConfig.json downloaded from Adobe Mobile Services  
	or  
	- Update ADBMobileConfig.json located in the Resources directory with your settings.
3. Setup is complete. The Adobe library is now accessable within the index.html file via "window.ADB"
	
	```html
	<button style="height:200px; width:600px" onclick = "window.ADB.trackState('login page', {'user':'john','remember':'true'});">sampleHit</button>
	```
