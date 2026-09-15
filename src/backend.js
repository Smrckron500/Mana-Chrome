// Inject functions into the page context
function injectScript(fn) {
    const script = document.createElement('script');
    script.textContent = '(' + fn.toString() + ')();';
    (document.head || document.documentElement).appendChild(script);
    script.remove();
}

// Define the exported functions
injectScript(function() {
    window.EnterKioskMode = function() {
        chrome.runtime.sendMessage("kisok-enter");
    };
    
    window.WhoopsieDaises = function() {
        chrome.runtime.sendMessage("fsnp");
    };
    
    window.ExitKioskMode = function() {
        chrome.runtime.sendMessage("kisok-exit");
    };
});