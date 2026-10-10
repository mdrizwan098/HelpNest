// Quick-fix steps and problem-category detection.
const FIXES={

 wifi:[["Restart your router","Unplug the router's power cable and wait 30 seconds.","Plug it back in and wait 2 minutes for the lights to turn steady.","Try opening a website again."],["Reconnect to Wi-Fi","Click the Wi-Fi icon near the clock.","Turn Wi-Fi off, then on again.","Choose your network and enter the password."]],

 printer:[["Check the basics","Make sure the printer is on and has paper.","Look for a blinking red or orange light, or paper stuck inside.","Turn the printer off and on again."],["Clear the print queue","Open the printer list on your computer.","Cancel any stuck documents.","Print one page to test."]],

 email:[["Close and reopen your email","Close the email program completely.","Open it again and wait a minute.","Check that your internet is working."],["Try email in a web browser","Open your email website in a browser.","Sign in with your usual password.","If it works there, the app just needs a refresh."]],

 slow:[["Restart your computer","Save your work first.","Choose Restart (not Shut down) from the Start or Apple menu.","Wait for it to start fully before opening anything."],["Close what you aren't using","Close extra browser tabs and programs.","Check that nothing is downloading.","Try the task again."]],

 login:[["Check the keyboard","Make sure Caps Lock is off.","Type the password slowly and check each letter.","Try again."],["Reset your password","Click “Forgot password” on the sign-in page.","Follow the link sent to your email.","Choose a new password you can remember."]],

 other:[["Restart what's acting up","Save your work.","Close the program, or turn the device off and on.","Try again."]]};

const GUESS=[["wifi|wi-fi|internet|network|online","wifi"],["print|paper|toner","printer"],["mail|outlook|gmail|inbox","email"],["slow|freez|stuck|lag|hang","slow"],["password|login|log in|sign in|locked","login"]];
