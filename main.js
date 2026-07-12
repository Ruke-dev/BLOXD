const textArea = document.getElementById("text-area");
const btn = document.getElementById("btn");
const outputDiv = document.getElementById("output");
const preview = document.getElementById("preview");


function validateTextInp(textInpStr) {
    const textRegexp = /^(head|subh|para):\s*((?:[a-z][\w-]*\s*)*)(?::\s*)?(.+)$/i;
    return textRegexp.exec(textInpStr);
}


// function - to sanitize text-area content

function sanitizeTextAreaValue() {
    const textAreaValue = textArea.value;

    if(typeof textAreaValue !== "string") return alert("Syntax does not match!");

    if(!textAreaValue) return alert("No syntax found!");

    return textAreaValue;
}


// The below function will parse the actual html tag from string

/**
 * 
 * @param {string} inputStr - this is a input string that will have the value of the textarea
 */
function parseInpStrToObj(inputStr) {

    // head: content, subh: content, para: content
    let separatedArr = '';

    if(inputStr.includes(",")){
        separatedArr = inputStr.split(",");
    }else if (inputStr.includes("\n")) {
        separatedArr = inputStr.split("\n");
    }

    const outputArr = [];

    separatedArr.forEach((e) => {

        const cleanStr = validateTextInp(e.trim());

        if(cleanStr){
            
            outputArr.push({
                tag: cleanStr[1] ? cleanStr[1].trim() : "",
                classes: cleanStr[2] ? cleanStr[2].trim().split(/\s+/).filter(Boolean) : [],
                content: cleanStr[3] ? cleanStr[3].trim(): ""
            })
        }else{
            outputArr.push({
                tag: "error",
                content: `⚠️ Invalid syntax on line ${cleanStr}`
            });
        }
    })
    return outputArr;
}

function generateHtmlFromOutputObj(outputObj) {
    let htmlTag = '';
    let htmlTagPredefinedClass = '';

    switch (outputObj.tag) {
        case "head":
            htmlTag = "h1";
            htmlTagPredefinedClass = outputObj.classes.length ? outputObj.classes.join(" ") : "text-3xl antialiased";
            break;
        
        case "subh":
            htmlTag = "h2";
            htmlTagPredefinedClass = outputObj.classes.length ? outputObj.classes.join(" ") : "text-xl antialiased";
            break;

        case "para":
            htmlTag = "p";
            htmlTagPredefinedClass = outputObj.classes.length ? outputObj.classes.join(" ") : "text-lg antialiased";
            break;

        default:
            htmlTag = "div";
            htmlTagPredefinedClass = "text-lg antialiased text-red-800";
            break;
    }

    return { htmlTag, htmlTagPredefinedClass, content: outputObj.content };
}

btn.addEventListener("click", () => {

    preview.textContent = "My Blog Preview";

    outputDiv.innerHTML = "";

    const output = document.createElement("div");

    const textAreaValue = sanitizeTextAreaValue();

    const outputObj = parseInpStrToObj(textAreaValue);

    outputObj.forEach((obj) => {
        const generatedTagAndClass = generateHtmlFromOutputObj(obj);

        const createdTag = document.createElement(generatedTagAndClass.htmlTag);

        createdTag.textContent = generatedTagAndClass.content;

        createdTag.className = generatedTagAndClass.htmlTagPredefinedClass;

        output.appendChild(createdTag);
    })

    output.classList.add("relative", "w-full", "p-4", "bg-black/30", "bg-[linear-gradient(160deg,#000000_0%,#051515_45%,#0a1a2a_75%,#000000_100%)]", "shadow-[0_1rem_1.5rem_-0.9rem_#000000e1]", "border-2", "border-transparent", "bg-clip-border", "[border-image:linear-gradient(to_bottom,rgba(255,255,255,0.2),rgba(255,255,255,0.05))_1]");

    const copy = document.createElement("i"); 

    copy.classList.add("fa-regular", "fa-copy", "text-white", "text-2xl", "cursor-pointer", "absolute", "right-4", "top-4", "hover:text-green-400");

    output.appendChild(copy);

    copy.addEventListener("click", () => {
        navigator.clipboard.writeText(output.innerText).then(() => {
            
            copy.className = "fa-solid fa-check text-green-400 text-2xl cursor-pointer absolute right-4 top-4";

            setTimeout(() => {
                copy.className = "fa-regular fa-copy text-white text-2xl cursor-pointer absolute right-4 top-4 hover:text-green-400";
            }, 1500);
        });
    });

    outputDiv.appendChild(output);
})
