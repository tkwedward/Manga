document.body.style.background = "yellow"

let showAllMangaButton = document.querySelector("#showAllManga")

// to get allManga List
chrome.storage.local.get("allMangaIdList", function(allMangaIdList){

    // console.log(allMangaIdList)
    // let k = new Set(allMangaIdList['allMangaIdList'])
    // allMangaIdList['allMangaIdList'] =  Array.from(k)
    // console.log(allMangaIdList["allMangaIdList"])
    // chrome.storage.local.set({"allMangaIdList": allMangaIdList['allMangaIdList'] })
})

/*
    Button function

/*
    All Manga Interface
*/


/*
    Chapters Interface
    1. chapterButtonWrapper
    2. chapterButton Generator
*/
let mangaId = "4172"
// chrome.storage.local.remove(mangaId)

chrome.storage.local.get(mangaId, function(item){
    document.body.style.background = "AliceBlue "
    console.log(item);
    let mangaPictureList = Object.values(item[mangaId])
    console.log(mangaPictureList);
    /*
         chapterButtonWrapper and chapter button
    */
    // chapterButtonWrapper
    let chapterButtonWrapper = document.createElement("div")
    chapterButtonWrapper.classList.add("chapterButtonWrapper")

    // chapterButton Generator
    let overlay = document.querySelector("#overlay")
    mangaPictureList.forEach(p=>{
        // chapterButton funciton
        function openChapter(){
            overlay.classList.toggle("hidden")
            let targetData = event.target.__data__
            console.log(event.target, targetData);
            targetData.forEach(link=>{
                let img = document.createElement("img")
                img.src = link
                overlay.appendChild(img)
            })
        }

        // add chapter Button
        let chapterButton = document.createElement("a")
        chapterButton.classList.add("chapterButton")
        chapterButton.__data__ = Object.values(p)[0]
        chapterButton.innerHTML = Object.keys(p)[0]
        chapterButton.addEventListener("click", openChapter, false)

        chapterButtonWrapper.appendChild(chapterButton)
        document.body.appendChild(chapterButtonWrapper)

    })// forEach mangaPictureList

    /*
        close Button
    */
    function closeOverlay(){
        overlay.classList.toggle("hidden")
    }
    let closeButton = document.querySelector(".closeButton")
    closeButton.addEventListener("click", closeOverlay, false)
})



/*
    Chapters Interface
*/
// chapterPictureList.forEach(link=>{
//
//
// })
