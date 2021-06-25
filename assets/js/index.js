const dropZone = document.querySelector(".drop-zone");
const fileInput = document.querySelector("#fileInput");
const browseBtn = document.querySelector(".browseBtn");
const bgProgress = document.querySelector(".bg-progress");
const percentProgress = document.querySelector("#percent");
const progressBar = document.querySelector(".progress-bar");
const progressContainer = document.querySelector(".progress-container");
const fileURLInput = document.querySelector("#fileURL");
const sharingContainer = document.querySelector(".sharing-container");
const showClipboard = document.querySelector(".clip-board");
const emailForm = document.querySelector("#emailForm");
const copyBtn = document.querySelector("#copyBtn");
const host = "https://justshare-vs.herokuapp.com/";
const uploadUrl = `${host}api/files/`;
const emailUrl = `${host}api/files/send`;
const maxAllowedSize = 100 * 1024 * 1024;
dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    if (!dropZone.classList.contains("dragged")) {
        dropZone.classList.add("dragged");
    }
});

dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("dragged");
});

dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.classList.remove("dragged");
    const files = e.dataTransfer.files;
    console.log(files);
    if (files.length === 1) {
        fileInput.files = files;
        uploadFile();
    }
});

fileInput.addEventListener("change", () => {
    uploadFile();
});

browseBtn.addEventListener("click", () => {
    fileInput.click();
});

copyBtn.addEventListener("click", () => {
    fileURLInput.select()
    document.execCommand("copy");
    showClipboard("Link copied");
});

const resetFileInput = () => {
    fileInput.value = "";
}

const uploadFile = () => {
    console.log(fileInput.files.length);
    if (fileInput.files.length > 1) {
        resetFileInput();
        showClipboard("Only upload 1 file")
        return ;
    }
    const file = fileInput.files;
    if (file.size > maxAllowedSize) {
        showClipboard("Cann't upload file larger than 1mb");
        resetFileInput();
    }
    const formData = new FormData();
    formData.append("myfile", file[0]);
    console.log(file);
    progressContainer.style.display = "block";
    const xhr = new XMLHttpRequest();

    xhr.upload.onprogress = updateProgress;

    xhr.upload.onerror = function() {
        resetFileInput();
        showClipboard(`Error in upload: ${xhr.status}.`);
    };

    xhr.onreadystatechange = function() {
            console.log(xhr.responseText);
            if(xhr.readyState == XMLHttpRequest.DONE){
                onUploadSuccess(xhr.responseText);
            }    
    };


    xhr.open("POST", uploadUrl);
    xhr.send(formData);
};    


 const updateProgress = (e) => {
        let percent = Math.round((100 * e.loaded) / e.total) ;
        console.log(percent);
        bgProgress.style.transform = `scaleX(${percent / 100})`;
        progressBar.style.transform = `scaleX(${percent / 100})`;
 };   




const onUploadSuccess = (res) => {
    resetFileInput();
    status.innerText = "Uploaded";
    emailForm[2].removeAttribute("disabled");
    emailForm[2].innerText="send";
    progressContainer.style.display = "none";
    const {file: url} = JSON.parse(res);
    console.log(url);
    sharingContainer.style.display = "block";
    fileURLInput.value = url;
};


emailForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const url = fileURLInput.value;
    const formData = {
        uuid: url.split("/").splice(-1, 1)[0],
        emailTo: emailForm.elements["to-email"].value,
        emailForm: emailForm.elements["from-email"].value
    };
    emailForm[2].setAttribute("disabled", "true");
    console.table(formData);
    fetch(emailUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    }).then(res => res.json()).then(({ success }) => {
        if (success) {
            sharingContainer.style.display = "none";
            showClipboard("Email Send")
        }
    });
});




