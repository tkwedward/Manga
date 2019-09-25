chrome.runtime.sendMessage({
    "todo":"showPageAction"
})


// console.log(document.querySelectorAll(".chapter-list"))
var mangatitle = document.querySelector("h1").innerText
var mangaURL = document.URL
var chapterListExist = document.querySelector(".chapter-list")
if (chapterListExist ){
    function extraDataFromChapterList(p){
        // to extract Data from the Chapter List
        let link = p.href;
        let title = p.getAttribute("title");
        return {"link":link, "title":title}
    }


    function clickButtonAndHighlight(){
        event.target.classList.toggle("highlight")
    }

    function createAnchorAndAppend(data, container){
        let link = data.href;
        let title = data.getAttribute("title");
        let button = document.createElement("button");
        button.classList.add("chapter-button")
        button.innerText = title;
        button.setAttribute("data-src", link);
        button.addEventListener("click", clickButtonAndHighlight, false)
        container.append(button)
    }


    var chapterList = document.querySelectorAll(".chapter-list")
    var normalChapter = chapterList[0].querySelectorAll("a")




    /************************* Overlay *************************/
    var overlay = document.createElement("div")
    overlay.classList.add("overlay")

    // 单话
    var normalChapterDiv = document.createElement("div")
    normalChapterDiv.classList.add("normal", "chapterButton")
    normalChapter.forEach(p=>{
        createAnchorAndAppend(p, normalChapterDiv)
    })
    overlay.append(normalChapterDiv)

    // 番外篇
    if (chapterList[1]){
        var specialChapter = chapterList[1].querySelectorAll("a")
        var specialChapterDiv = document.createElement("div")
        specialChapterDiv.classList.add("special", "chapterButton")
        specialChapter.forEach(p=>{
            createAnchorAndAppend(p, specialChapterDiv)
            createAnchorAndAppend(p, specialChapterDiv)
        })
        overlay.append(specialChapterDiv)
    }

    /************************* 下載、全選 button *************************/
    function selectAllButton(){
        let allChapters = document.querySelectorAll(".chapter-button")
        allChapters.forEach(p=>{
            p.classList.add("highlight")
        })
    }// selectAllButton


    function downloadAllSelected(){
        /* pass the download list to the background*/
        let allSelected = document.querySelectorAll(".highlight")
        let downloadList = Array.from(allSelected)
                                .map(p=>p.getAttribute("data-src"))

        chrome.runtime.sendMessage({
            "list": downloadList,
            "todo": "loopPicturesInitialize",
            "mangaDetail":{"title": mangatitle, "url": mangaURL}
        })
    }

    var buttonChoice = [
        {"name": "全選", "action": "selectAll", "function": selectAllButton},
        {"name": "下載", "action": "download", "function": downloadAllSelected},
    ]
    var controlDiv = document.createElement("div")
    controlDiv.classList.add("control")

    buttonChoice.forEach(p=>{
        let button = document.createElement("button")
        button.classList.add("control-button")
        button.innerText = p.name
        button.setAttribute("data-action", p.action)
        button.addEventListener("click", p.function, false)
        controlDiv.appendChild(button)
    })
    overlay.append(controlDiv)


    // closeButton
    var closeButton = document.createElement("div")
    closeButton.innerText = "close"
    closeButton.addEventListener("click", function(){
        overlay.style.display = "none"
    })
    overlay.append(closeButton)


    document.body.appendChild(overlay)


}// if chapterListExist
