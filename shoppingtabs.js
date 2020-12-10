// ==UserScript==
// @name         Shopping List Tab Generator
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Generate individual ingredient tabs for online shopping!
// @author       You
// @match        https://my.whisk.com/shopping-list/*
// @match        https://www.ishopnewworld.co.nz/Search?q=*
// @grant    GM_getValue
// @grant    GM_setValue
// @grant    GM_addStyle
// ==/UserScript==

var site = document.location.host;
if (site === "www.ishopnewworld.co.nz" || site === "https://shop.countdown.co.nz/") {
    var spList = GM_getValue('list');
    console.log(spList);
} else {
    (function() {
        window.addEventListener("load", () => {
            
            // Fake GM
            // let GM = 
            //         {
            //             setValue: function(par1, par2) {
            //                 console.log(`GM variable ${par1} is now set to ${par2}`);
            //             }
            //         };
            

            // listener functions
            function copyToClipboard(str) {
                let list = setList();
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
                let list = setList();
                var listArray = list.split('\n');
                var prefix = superDeets().prefix;
                var urlArray = listArray.map(e => prefix + e.replace(/\s/g, "%20"));

                urlArray.forEach((url) => {
                    window.open(url, "_blank");
                });
            }

            function login(supermarket) {
                window.open(superDeets().login, '_blank');
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
                let parentNode = document.querySelector('.one');
                let refNode = document.querySelector('.two');
                // let parentNode = document.querySelector('#app > div.sc-1m5eneg.bxumRo');
                // let refNode = document.querySelector('#app > div.sc-1m5eneg.bxumRo > div.sc-1qjhcgc.ikMhkq.sc-1te27dw.eXwaQM');
                parentNode.insertBefore(newNode, refNode);
            }

            function setList() {
                let list = Array.from(document.querySelectorAll('[data-testid="shopping-list-item-name"]')).map(e => e.innerHTML).join('\n');
                GM_setValue("list", list);
                console.log(list);
                return list;
            }

            function superDeets() {
                var cdRadio = document.getElementById("cd");
                var nwRadio = document.getElementById("nw");
                let sp = {}
                if (nwRadio.checked) {
                    console.log("new world baby");
                    sp.prefix = "https://www.ishopnewworld.co.nz/Search?q=";
                    sp.login = "https://www.ishopnewworld.co.nz/";
                } else if (cdRadio.checked) {
                    console.log("countdown biatch!");
                    sp.prefix = "https://shop.countdown.co.nz/shop/searchproducts?search=";
                    sp.login = "https://shop.countdown.co.nz/shop/securelogin";
                }
                return sp;
            }

            // setup buttons
            let buttonDiv = document.createElement('div');
            buttonDiv.classList.add('buttonDiv');
            buttonDiv.innerHTML = `<form id="radio-div">
            <img class="logo" src="https://i.imgur.com/9Gy77Qs.jpg" alt="New World" height ='30px'>
            <input type="radio" name="super" id="nw" value="New World" checked>
            <img class="logo" src="https://i.imgur.com/sGVNVne.jpg" alt="Countdown" height ='30px'>
            <input type="radio" name="super" id="cd" value="Countdown">
            </form>`;
            GM_addStyle('input[type="radio"] { margin-top: -1px; vertical-align: middle; }');
            GM_addStyle('.buttonDiv { display: flex; justify-content: center; align-items: center; margin-bottom: -25px; }');
            buttonDiv.style.display = 'flex';
            buttonDiv.style["justify-content"] = 'center';
            buttonDiv.style["align-items"] = 'center';
            buttonDiv.style["margin-bottom"] = '-25px';
            insertAtTop(buttonDiv);
            addButton("Login", login);
            addButton("Copy to Clipboard", copyToClipboard);
            addButton("Open in Tabs", openInTabs);

        });
    })();
}