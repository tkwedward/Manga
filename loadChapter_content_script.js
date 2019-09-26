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

    c2 = document.createElement("canvas")
    ctx2 = c2.getContext("2d")
    c2.width = width
    c2.height= height
    document.body.append(c2)


    var selectedValue = document.body.querySelector("#pageSelect").value
    console.log(selectedValue, optionLength)
    let datablob;
    let datablob2;

    var interval = setInterval(function(){
        console.log(datablob==datablob2)
        let originImage = document.querySelector("#mangaFile")
        let width = originImage.clientWidth
        let height = originImage.clientHeight
        c.width = width
        c.height= height
        c2.width = width
        c2.height= height
        let newImg = new Image();
        newImg.crossOrigin = '';
        newImg.onload = async function () {
            ctx.drawImage(this, 0, 0, width, height);
            datablob = await c.toDataURL("image/jpeg", 0.5)
            imageList.push(datablob)
            console.log(selectedValue, optionLength)

            ctx2.drawImage(this, 0, 0, width, height);
            datablob2 = await c.toDataURL("image/jpeg", 0.5)
        };
        newImg.src = originImage.src

        if (datablob==datablob2 && datablob!="data:,"){
            nextButton.click()
            selectedValue = document.body.querySelector("#pageSelect").value
        }

        if (optionLength == selectedValue){
            clearInterval(interval)
            console.log("send message")
            console.log(imageList)
            document.body.innerHTML = ""
            imageList.forEach(p=>{
                let img = document.createElement("img")
                img.src = p
                document.body.append(img)
            })
            chrome.runtime.sendMessage({
                "todo":"closeChapterTabRequest", "imageList": {[chapterName]:imageList}, "mangaId": mangaId
            }, function(){
                console.log("send message succuess");
            })
        }
    }, 1000)







}// if mangaBoxExist
