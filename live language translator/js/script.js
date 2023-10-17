const fromText = document.querySelector(".from-text"),
    toText = document.querySelector(".to-text"),
    exchangeIcon = document.querySelector(".exchange"),
    selectTag = document.querySelectorAll("select"),
    translateBtn = document.querySelector("button"),
    icons = document.querySelectorAll(".row i");

selectTag.forEach((tag, id) => {
    for (const country_code in countries) {
        //selecting English as default as FROM language and Telugu as TO language
        let selected;
        if (id == 0 && country_code == "en-GB") {
            selected = "selected";
        } else if (id == 1 && country_code == "te-IN") {
            selected = "selected";
        }
        let option = `<option value="${country_code}"${selected}>${countries[country_code]}</option>`;
        tag.insertAdjacentHTML("beforeend", option);//adding option tag inside select tag
    }
});

exchangeIcon.addEventListener("click", () => {
    //exchanging textarea and language values
    let tempText = fromText.value,
        tempLang = selectTag[0].value;
    fromText.value = toText.value;
    selectTag[0].value = selectTag[1].value;
    toText.value = tempText;
    selectTag[1].value = tempLang;
});

translateBtn.addEventListener("click", () => {
    let text = fromText.value,
        translateFrom = selectTag[0].value,
        translateTo = selectTag[1].value;
    if (!text) return;
    toText.setAttribute("placeholder", "Translating...");
    let apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;
    fetch(apiUrl).then(res => res.json()).then(data => {
        toText.value = data.responseData.translatedText;
        toText.setAttribute("placeholder", "Translation...");

    });
});

icons.forEach(icon => {
    icon.addEventListener("click", ({ target }) => {
        if (target.classList.contains(`fa-copy`)) {
            //if clicked icon has from id,copy the fromTextarea value else copy the to textarea value
            if (target.id == "from") {
                navigator.clipboard.writeText(fromText.value);
            } else {
                navigator.clipboard.writeText(toText.value);
            }
        } else {
            //if clicked icon has from id,speak the fromTextarea value else speak the to textarea value
            let utterance;
            if (target.id == "from") {
                utterance = new SpeechSynthesisUtterance(fromText.value);
                utterance.lang = selectTag[0].value;//select utterance language fromselectTag value
            } else {
                utterance = new SpeechSynthesisUtterance(toText.value);
                utterance.lang = selectTag[1].value;//select utterance language toselectTag value
            }
            speechSynthesis.speak(utterance);//speak the passed utterance
        }
    });
})