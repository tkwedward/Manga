
/*
1. check regularly if there any data in the downloadList waiting for download
2. If the number of file in the list is less than 2, then add in more chapter to downloaded

*/
var downloadList = []
var downloading = 0
var downloadCheck = setInterval(regularCheck, 10000)
function regularCheck(){
    if (downloading < 2){
        if (downloadList.length!=0){
            for (let i=0; i<3; i++){
                console.log(downloadList)
                console.log(downloading)
                let p = downloadList.shift()
                if (p){
                    downloading +=1
                    chrome.tabs.create({"url": p},function(newTab) {
                        console.log(newTab.id);
                        chrome.tabs.executeScript(newTab.id, {"file":"loadChapter_content_script.js"})
                    });// create tab
                }// if p exist
            }// take out 5 object and download
        } else {
            console.log("no object in the list");
        } // check if the list is empty
    }

}// reuglarCheck



chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse){
    if (msg.todo == "showPageAction"){
        chrome.tabs.query({"active": true, "currentWindow": true}, function(tabs){
            chrome.pageAction.show(tabs[0].id)
        })
    }

    /*
    from: chapter List Page
    to: background.js
    aims: to open the chapter and start loop the picture

    mgs.mangaDetail.title: The title of  the manga
    msg.mangaDetail.url: The  url of the  manga
    msg.list: a list contains all the urls of the chapter selected to be downloaded

    1. get the mangaId from  the URL
    2. get allMangaIdList, which is a list contains all the IDs  of the mangas. If there is nothing it, then initialize it as an empty array, and then put the mangaId into the array.catch((err) => {})
    3. loop each url and start download it
    */

    if (msg.todo == "loopPicturesInitialize"){
        console.log(msg.mangaDetail.title, msg.mangaDetail.url)
        let mangaTitle = msg.mangaDetail.title
        let mangaURL = msg.mangaDetail.url
        let mangaId = mangaURL.split("comic/")[1].split("/")[0]
        let mangaObject;


        // chrome.storage.local.remove("allMangaIdList")
        chrome.storage.local.get("allMangaIdList", function(item){
            // console.log(Object.entries(item).length);
            console.log(item);
            if (Object.entries(item).length==0){
                list = []
                list.push(mangaId)
                chrome.storage.local.set({"allMangaIdList":list})
            } else {
                list = item["allMangaIdList"]
                list.push(mangaId)
                chrome.storage.local.set({"allMangaIdList":list})
            }
        })// intialize allMangaIdList
        console.log(msg.list);

        msg.list.forEach(url=>{
            downloadList.push(url)
        })
    }// if startLoopPicutre


/*****************************
closeChapterTabRequest
******************************/

    if (msg.todo == "closeChapterTabRequest"){
        console.log(msg);
        /*
        msg.chapterName: The chapter name of a manga
        msg.mangaId: The id of the manga in the website
        msg.imageList: The list that contains all the scraped images from the website

        first tried to get the manga from the database by using the ID, if there is no chapter in it, just initialize an empty list, and then put the data into it.  If there are chapters in it, then add the new  list into it

        After finish  saving the images, close the tab
        */
        // chrome.storage.local.remove(msg.mangaId)
        chrome.storage.local.get(msg.mangaId, function(item){
            console.log(item);
            if (Object.entries(item).length==0){
                console.log("the entries length is 0")
                list = {}
                list[msg.chapterName] = msg.imageList
                console.log({[msg.mangaId]:list});
                chrome.storage.local.set({[msg.mangaId]:list})
            } else {
                console.log("the entries length is not 0")
                list = item[msg.mangaId]
                console.log(list)
                list[msg.chapterName] = msg.imageList
                console.log(list)
                chrome.storage.local.set({[msg.mangaId]:list}, function(){

                    chrome.tabs.remove(sender.tab.id)
                    download-=1
                })
            }
        })


    }// if close Chapter Tab Request
})// addEventListener
