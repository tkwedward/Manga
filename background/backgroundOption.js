
chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse){
    if (msg.todo=="showAllManga"){
        console.log("I will show all manga")
    }

})
