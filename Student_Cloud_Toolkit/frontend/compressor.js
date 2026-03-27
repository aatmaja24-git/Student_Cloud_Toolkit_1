async function uploadFile(){

const fileInput=document.getElementById("fileInput")
const status=document.getElementById("status")
const downloadDiv=document.getElementById("downloadLink")

const file=fileInput.files[0]

if(!file){
alert("Select a file")
return
}

status.innerText="Uploading and compressing..."

const formData=new FormData()
formData.append("file",file)

try{

const response=await fetch("https://4ecpi9z5mj.execute-api.us-east-1.amazonaws.com/compress",{
method:"POST",
body:formData
})

if(!response.ok){
throw new Error("Compression failed")
}

const blob=await response.blob()

const url=window.URL.createObjectURL(blob)

const link=document.createElement("a")

link.href=url
link.download="compressed_"+file.name
link.innerText="⬇ Download Compressed File"

downloadDiv.innerHTML=""
downloadDiv.appendChild(link)

status.innerText="Compression completed!"

}
catch(error){

status.innerText="Error: "+error.message

}

}