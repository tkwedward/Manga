// match pattern for the URLs to redirect
var pattern = [
    "https://cdn.runative-syndicate.com/*",
    "https://www.google-analytics.com/*",
    "https://native.propellerclick.com/*",
    "https://ads.aralego.com/*",
    "https://psa.aralego.com/*",
    "https://prebid-asia.creativecdn.com/*",
    "https://ad2.apx.appier.net/*",
    "https://rec.scupio.com/*",
    "https://bidder.criteo.com/*",



];

// cancel function returns an object
// which contains a property `cancel` set to `true`
function cancel(requestDetails) {
  console.log("Canceling: " + requestDetails.url);
  return {cancel: true};
}

// add the listener,
// passing the filter argument and "blocking"
chrome.webRequest.onBeforeRequest.addListener(
  cancel,
  {urls: pattern},
  ["blocking"]
);

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
        console.log("***************************************************** loopPicturesInitialize ************************************")
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
        console.log("THe msg.list is : ");
        console.log(msg.list);

        chrome.storage.local.get(mangaId, function(item){
            var item = Object.entries(item).length==0 ? {"name": mangaTitle, "chapters": []} : item[mangaId]

            console.log("The item got from database is")
            console.log(item)
            chrome.storage.local.set({[mangaId]: item}, function(){
                console.log("*****************************After the first process")
                console.log({[mangaId]: item});
            })
        })

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
            console.log("the item from database is:")
            console.log(item);
            console.log("the entries length is not 0")

            console.log("The oldImageList is");
            var oldImageList = item[msg.mangaId]["chapters"]
            console.log(oldImageList);

            console.log("Here is the new item")
            console.log(msg.imageList)

            console.log("i want to add this new item into the oldImageList")

            oldImageList.push(msg.imageList)
            let newImageList = oldImageList
            //
            console.log("After updating, the oldImageList becomes")
            console.log(oldImageList)
            //
            //
            console.log("Here is the newImageList")
            console.log(newImageList)

            console.log("Here is the newItem is:")
            item[msg.mangaId]["chapters"] = newImageList
            let newItem = item
            console.log(newItem)
            //
            //
            console.log("I want to save the new Item")

            //
            //
            chrome.storage.local.set(newItem, function(){
                // chrome.tabs.remove(sender.tab.id)
                downloading-=1
            })// set
        })//get
    }// if close Chapter Tab Request,
})// addEventListener
