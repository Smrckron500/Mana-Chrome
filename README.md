# Codename "Mana"
This extension allows you to fill out Managed Quizzes on Google Forms. Tested on Firefox 146.0.1 on Arch Linux; will NOT work in Chrome or Border.

## Demo Video
TBD

## How to install
> [!NOTE]
> You can only uninstall through AMO if you install it through AMO or the Releases tab.


### 2. Install manually
Go to the "Releases" tab and download it from there. If it warns you about untrusted addons, just ignore it, it should install anyways.

### 3. Install from source
> [!WARNING]
> You'll have to do this each time you restart Firefox.

1. Download the source code as a ZIP file.
2. Extract the contents of the ZIP file.
   a. On Windows, explorer has this feature built-in.
   b. On Linux, you can use an app like Ark.
3. Open `about://debugging` in Firefox and go to the "This Firefox" tab.
4. Click "Load Temporary Add-on."
5. Open the folder where you extracted the ZIP and select the `manifest.json` file.
6. You can now open any Locked Quiz on Google Forms.

## Credits
This extension uses a modified version of xNasuni's [Google Forms unlocker userscript](https://github.com/xNasuni/google-forms-unlocker), which is also licensed under the [GNU General Public License v3.0](https://github.com/xNasuni/google-forms-unlocker?tab=GPL-3.0-1-ov-file).
