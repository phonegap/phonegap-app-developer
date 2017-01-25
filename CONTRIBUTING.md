# How to Contribute

## Get the Source

    $ git clone https://github.com/phonegap/phonegap-app-developer.git
    $ cd phonegap-app-developer/

## Join the Discussion

We use the [GitHub Issue Tracker][issue-url] for all of our discussions.
You can [filter the discussions][filter-url] with the **discussion** label.

## Submit an Issue

We use the [GitHub Issue Tracker][issue-url] for all of our issues.

## Commits

We expect atomic commits that reference the GitHub issue.

For example:

- `[#33] Fix viewport layout.`
- `[#144] Add PointerEvent support for WP8.`

When no issue is exists, then prefix each commit with the root directory or topic:

- `[doc] Update date in LICENSE.`
- `[www] Fix button style.`
- `[ios] Update icon name in plist.`

## Tags

When a tag affects all platforms, use an ordinary semver tag:

- 0.0.1
- 0.1.0
- 0.1.1
- 0.2.0
- 1.0.0

Platform releases should individually tagged as:

- 1.0.0-android-rc.1
- 1.0.0-android-release
- 1.0.0-ios-release

## Branches

Ideally, commits will land in `dev` before being merged with `master`. This makes the release process easier to manage and ensures `master` is the "version" that's in the store right now.

## Releases

### Update CHANGELOG

Replace `1.0.0` with the previous version:

    $ git log HEAD...1.0.0 --format="%s"

Copy and paste the output to `CHANGELOG.md`

## iOS Submission

- itunesconnect.apple.com
- Add a new PhoneGap Developer version
  - Choose to not auto-release the app
- Download Application Loader
- Open Application Loader
- Select Deliver Your App
- Select PhoneGap with the correct version number
- Select Choose
- Select Send

## Windows Phone Submission

- Update test.app.phonegap.com to use the latest connect-phonegap
- Deploy the site

- Open Microsoft Remote Desktop
- Go to dev.windowsphone.com
- Select Dashboard
- Select Windows Phone Store
- Select Apps
- Select PhoneGap Developer
- Select Update App
- Select Upload and Describe Your Package
- Go to GitHub and download the latest tagged release and extract it
- Select Replace on Windows Phone site
- Update the package version number
- Update the change log (involves replacing the current content)
- Save
- Press Review and Submit
- Verify that it's a manual publish
- Press Submit
- Clean up the downloaded GitHub zip file

[issue-url]: https://github.com/phonegap/phonegap-app-developer/issues
[filter-url]: https://github.com/phonegap/phonegap-app-developer/issues?labels=discussion&page=1&state=open
