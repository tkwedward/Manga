// chrome.runtime.sendMessage({"todo":""})
var mangaBoxExist = document.querySelector("#mangaFile")

if (mangaBoxExist){

    var chapterName = document.querySelector("h2").innerHTML
    let pageSelect = document.body.querySelectorAll("option")
    let optionLength = pageSelect.length
    let mangaIdArray = document.URL.split("/")
    let mangaId = mangaIdArray[mangaIdArray.length-2]
    var data;

    // next page button
    var nextButton = document.querySelector("#next")


    // image related thing


    var imageList = []

    let originImage = document.querySelector("#mangaFile")
    let width = originImage.clientWidth
    let height = originImage.clientHeight
    let chapterTitle = document.querySelector("h2").innerHTML

    c = document.createElement("canvas")
    ctx = c.getContext("2d")
    c.width = width
    c.height= height
    document.body.append(c)


    let newImg = new Image();
    let result_data
    newImg.crossOrigin = '';
    newImg.onload = async function () {
        ctx.drawImage(this, 0, 0, width, height);
        datablob = await c.toDataURL("image/jpeg", 0.5)
        console.log(datablob)
        imageList.push(datablob)
            // imageList.push(ctx.getImageData(0,0, width, height))
    };
    newImg.src = originImage.src

    // click next page action
    function* nextPageGenerator(start=0, end=optionLength, step=1){
        /*This generator is used to create a list of images on each page*/
        for (i=start; i< end; i++){
            let originImage = document.querySelector("#mangaFile")
            let width = originImage.clientWidth
            let height = originImage.clientHeight
            let newImg = new Image();
            newImg.crossOrigin = '';
            newImg.onload = async function () {
                ctx.drawImage(this, 0, 0, width, height);
                datablob = await c.toDataURL("image/jpeg", 0.5)
                imageList.push(datablob)
                next.click()
            };
            newImg.src = originImage.src


            yield i
        }
    }// nextPageGenerator
    //
    let nextPageGen = nextPageGenerator()
    var interval = setInterval(function(){
        let selectedValue = document.body.querySelector("#pageSelect").value
        let value = nextPageGen.next().value
        console.log(selectedValue, optionLength)


        // at the end of the page
        // optionLength=10 // a parameter to stop the looping of page quickly
        console.log(selectedValue, optionLength)
        if (selectedValue>=optionLength){
            clearInterval(interval)
            console.log("interval is cleared")
            chrome.runtime.sendMessage({
                "todo":"closeChapterTabRequest", "imageList": {[chapterName]:imageList}, "mangaId": mangaId
            }, function(){
                console.log("send message succuess");
            })
        }
    }, 2000)
}// if mangaBoxExist
