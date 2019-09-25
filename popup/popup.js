
var color = document.querySelector("#color").value
var submit = document.querySelector("#submit")
submit.addEventListener("click", function(){
    document.body.style.background ="yellow"
    chrome.tabs.query({active: true, currentWindow: true}, function(tab){
        chrome.tabs.sendMessage(tab[0].id, {todo:"changeBgColor", color: color})
    })
})


var showDownload = document.querySelector("#showDownload")
showDownload.addEventListener("click", function(){
    chrome.tabs.query({"active": true, "currentWindow": true}, function(tabs){
        chrome.tabs.executeScript(tabs[0].id, {"code": "document.querySelector('.overlay').style.display='block'"})
    })
})

chrome.storage.local.get("33381", function(item){
    if (!item){
        chrome.runtime.sendMessage({"todo": "showManga", "item": "30434 does not exist"})
    } else {
        chrome.runtime.sendMessage({"todo": "showManga", "item": item})
    }//
})
