// ==UserScript==
// @name         Shopping List Tab Generator
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Generate individual ingredient tabs for online shopping!
// @author       You
// @match        https://my.whisk.com/shopping-list/*
// @match        https://www.ishopnewworld.co.nz/Search?q=*
// @grant    GM.getValue
// @grant    GM.setValue
// ==/UserScript==

var site = document.location.host;
if (site === "www.ishopnewworld.co.nz") {
    var nwList = GM.getValue('list');
    console.log(nwList);
} else {
    (function() {
        window.addEventListener("load", () => {
            // get list
            let list = Array.from(document.querySelectorAll('[data-testid="shopping-list-item-name"]')).map(e => e.innerHTML).join('\n');
            console.log(list);

            // listener functions
            function copyToClipboard(str) {
                console.log('ctc');
                console.log(list);
                const el = document.createElement('textarea');
                el.innerHTML = list;
                el.setAttribute('readonly', '');
                el.style.position = 'absolute';
                el.style.left = '-9999px';
                document.body.appendChild(el);
                el.select();
                document.execCommand('copy');
                document.body.removeChild(el);
            };

            function openInTabs() {
                var listArray = list.split('\n');
                var prefix = "https://www.ishopnewworld.co.nz/Search?q=";
                var urlArray = listArray.map(e => prefix + e.replace(/\s/g, "%20"));

                // if (nwRadio.checked) {
                //     console.log("new world baby");
                //     prefix = "https://www.ishopnewworld.co.nz/Search?q=";
                // } else if (cdRadio.checked) {
                //     console.log("countdown biatch!");
                //     prefix = "https://shop.countdown.co.nz/shop/searchproducts?search=";
                // }

                urlArray.forEach((url) => {
                    window.open(url, "_blank");
                });
            }

            function login(supermarket) {
                window.open('https://www.ishopnewworld.co.nz/', '_blank');
            }

            // helper functions
            function addButton(text, onclick, cssObj) {
                cssObj = cssObj || {
                    // display: 'inline-block',

                    "z-index": 3,
                    fontWeight: "600",
                    fontSize: "14px",
                    backgroundColor: "#00cccc",
                    color: "white",
                    border: "none",
                    padding: "10px 20px",
                    margin: "5px",
                };
                let button = document.createElement("button"),
                    btnStyle = button.style;
                buttonDiv.appendChild(button);
                button.innerHTML = text;
                // Settin function for button when it is clicked.
                button.onclick = onclick;
                Object.keys(cssObj).forEach(key => (btnStyle[key] = cssObj[key]));
                return button;
            }

            function insertAtTop (newNode) {
                let parentNode = document.querySelector('#app > div.sc-1m5eneg.bxumRo');
                let refNode = document.querySelector('#app > div.sc-1m5eneg.bxumRo > div.sc-1qjhcgc.ikMhkq.sc-1te27dw.eXwaQM');
                parentNode.insertBefore(newNode, refNode);
            }
            // setup buttons
            let buttonDiv = document.createElement('div');
            buttonDiv.style.display = 'flex';
            buttonDiv.style["justify-content"] = 'center';
            buttonDiv.style["margin-bottom"] = '-25px';
            insertAtTop(buttonDiv);
            addButton("Login", login);
            addButton("Copy to Clipboard", copyToClipboard);
            addButton("Open in Tabs", openInTabs);

            GM.setValue("list", list);
        });
    })();
}



