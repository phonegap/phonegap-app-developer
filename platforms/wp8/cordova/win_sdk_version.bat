@ECHO OFF
SET script_path="%~dp0lib\win_sdk_version.js"
IF EXIST %script_path% (
    cscript %script_path% %* //nologo
) ELSE (
    ECHO.
    ECHO ERROR: Could not find 'win_sdk_version.js' in 'bin' folder, aborting...>&2
    EXIT /B 1
)