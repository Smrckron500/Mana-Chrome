let tabId = 0;
let sessionExists = false;
let originalWindowState = 'none';
let originalWindowId = 0;
let thatWindow = { id: 0 };
let iii = 0;

console.log('Test 6,7');
console.log('rizz ohio')

// Helper to promisify Chrome APIs
function promisify(fn) {
    return function(...args) {
        return new Promise((resolve, reject) => {
            fn(...args, (result) => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    resolve(result);
                }
            });
        });
    };
}

async function genericHandler(tab) {
    try {
        const url = new URL(tab.url);
        if((
            url.pathname.endsWith('/startquiz')
            || url.pathname.endsWith('/viewform')
        ) && url.hash === '#gfu') {
            tabId = tab.id;
            sessionExists = true;
            await promisify(chrome.tabs.update.bind(chrome.tabs))(tab.id, { active: true });
            originalWindowId = tab.windowId;
            
            const currentWindow = await promisify(chrome.windows.getCurrent.bind(chrome.windows))();
            originalWindowState = currentWindow.state;
            
            thatWindow = await promisify(chrome.windows.create.bind(chrome.windows))({
                tabId: tab.id,
                state: 'fullscreen'
            });
            
            iii = setInterval(async () => {
                if(!sessionExists) return;
                const lf = await promisify(chrome.windows.getLastFocused.bind(chrome.windows))();
                if(lf.id != thatWindow.id)
                    onupd();
            }, 100);
        }
    } catch (error) {
        console.warn(error);
    }
}

chrome.tabs.onCreated.addListener(tab => {
    if(sessionExists) {
        return chrome.tabs.remove(tab.id);
    }
    genericHandler(tab);
});

async function onupd(tab) {
    if (!tab) {
        tab = await promisify(chrome.tabs.get.bind(chrome.tabs))(tabId);
    }
    let id = tab.id;
    if(tab.id === tabId) {
        const url = new URL(tab.url);
        if(!((
            url.pathname.endsWith('/startquiz')
            || url.pathname.endsWith('/viewform')
        )&&url.hash==='#gfu')) {
            sessionExists = false;
            await promisify(chrome.tabs.move.bind(chrome.tabs))(id, {
                windowId: originalWindowId,
                index: -1
            });
            await promisify(chrome.tabs.update.bind(chrome.tabs))(id, { active: true });
            clearInterval(iii);
        } else {
            await promisify(chrome.tabs.update.bind(chrome.tabs))(id, { active: true });
            await promisify(chrome.windows.update.bind(chrome.windows))(thatWindow.id, {
                state: 'fullscreen',
                focused: true
            });
        }
    } else {
        await promisify(chrome.tabs.update.bind(chrome.tabs))(id, { active: true });
        await promisify(chrome.windows.update.bind(chrome.windows))(thatWindow.id, {
            state: 'fullscreen',
            focused: true
        });
    }
}

chrome.tabs.onActivated.addListener((activeInfo) => {
    if(!sessionExists) return;
    if(activeInfo.tabId !== tabId) onupd();
});

chrome.windows.onFocusChanged.addListener(async (id) => {
    if(!sessionExists) return;
    if(id !== thatWindow.id) {
        await promisify(chrome.windows.update.bind(chrome.windows))(thatWindow.id, {
            state: 'fullscreen',
            focused: true
        });
    }
});

chrome.tabs.onUpdated.addListener(async (id, changeInfo, tab) => {
    if(sessionExists) {
        onupd(tab);
    } else {
        genericHandler(tab);
    }
});

chrome.tabs.onRemoved.addListener(id => {
    if(id === tabId && sessionExists) {
        sessionExists = false;
        tabId = null; 
        clearInterval(iii);
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if(message === 'fsnp' && sender.tab && thatWindow && sessionExists) {
        chrome.windows.update(thatWindow.id, {
            state: "fullscreen",
            focused: true,
            drawAttention: true
        });
    }
    // Keep message channel open for async
    return true;
});

chrome.webRequest.onBeforeSendHeaders.addListener(
    (details) => {
        const headers = details.requestHeaders || [];
        for (let i = 0; i < headers.length; i++) {
            if(headers[i].name.toLowerCase() === 'user-agent') {
                headers[i].value = 'Mozilla/5.0 (X11; CrOS x86_64 16181.61.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36';
            }
        }
        return { requestHeaders: headers };
    },
    {
        urls: ['*://docs.google.com/forms/*']
    },
    ['requestHeaders', 'blocking', 'extraHeaders']
);