// ==UserScript==
// @name         Shopping List Tab Generator
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Generate individual ingredient tabs for online shopping!
// @author       You
// @match        https://my.whisk.com/*
// @match        https://www.ishopnewworld.co.nz/Search?q=*
// @match        https://shop.countdown.co.nz/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_openInTab
// @run-at       document-idel
// @connect      ishopnewworld.co.nz
// @grant        GM_xmlhttpRequest

//ng-star-inserted

// ==/UserScript==

var site = document.location.host;
if (site === "www.ishopnewworld.co.nz") {
    const targetNode = document.querySelector('body');

    const callback = function(mutationsList, observer) {
        for(const mutation of mutationsList) {
            if (document.querySelector("div.m-header__middle input") && document.querySelector("div.m-header__middle input").value !== "") {
                observer.disconnect();
                console.log('mutation stage');
                var spList = JSON.parse(GM_getValue('list'));
                let searchInput = document.querySelector("div.m-header__middle input");
                let qString = spList.quantity[spList.name.findIndex(e => e === searchInput.value)];
                qString !== null ? searchInput.value += " Quantity: " + qString : console.log('no quantity');
                break;
            }
        }
    }

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, { childList: true, subtree: true } );

} else if (site === "shop.countdown.co.nz") {

    // Select the node that will be observed for mutations
    const targetNode = document.querySelector('body');

    // Callback function to execute when mutations are observed
    const callback = function(mutationsList, observer) {
        // Use traditional 'for loops' for IE 11
        for(const mutation of mutationsList) {
            if (document.querySelector("#search") && document.querySelector("#search").value !== "") {
                observer.disconnect();
                var spList = JSON.parse(GM_getValue('list'));
                let searchInput = document.querySelector("#search");
                let qString = spList.quantity[spList.name.findIndex(e => e === searchInput.value)];
                qString !== null ? searchInput.value += " Quantity: " + qString : console.log('no quantity');
                break;
            }
        }
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, { childList: true, subtree: true } );

} else {

    // Select the node that will be observed for mutations
    const targetNode = document.querySelector('body');

    const callback = function(mutationsList, observer) {
        for(const mutation of mutationsList) {
            if (document.querySelector('div.sc-1m5eneg.bxumRo') && document.querySelector('div.sc-1qjhcgc.ikMhkq.sc-1te27dw.eXwaQM')) {
                observer.disconnect();
                // listener functions
                function copyToClipboard(str) {
                    let list = setList();
                    let listString = '';
                    for (let i = 0; i < list.name.length; i++) {
                        listString += list.name[i] + ' ' + (list.quantity[i] || '') + '\n';
                    }
                    const el = document.createElement('textarea');
                    el.innerHTML = listString;
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
                    var listArray = list.name;
                    var prefix = superDeets().prefix;
                    var urlArray = listArray.map(e => prefix + e.replace(/\s/g, "%20"));
        
                    urlArray.forEach((url) => {
                        GM_openInTab(url, {active: true})
                        //window.open(url, "_blank");
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
                    let parentNode = document.querySelector('#app > div.sc-1m5eneg.bxumRo');
                    let refNode = document.querySelector('#app > div.sc-1m5eneg.bxumRo > div.sc-1qjhcgc.ikMhkq.sc-1te27dw.eXwaQM');
                    parentNode.insertBefore(newNode, refNode);
                }
        
                function setList() {
                    let listObj = {
                        name: [],
                        quantity: []
                    };
                    let validItems = Array.from(document.querySelectorAll('[data-testid="shopping-list-item"]')).filter(e => e.querySelector('input').checked === false);
                    validItems.forEach(e => {
                        let name = e.querySelector('[data-testid="shopping-list-item-name"]').innerHTML;
                        let quantity = null;
                        let element = null;
                        if (element = e.querySelector('[data-testid="shopping-list-item-quantity-unit"]')) {
                            quantity = element.innerHTML;
                        }
                        listObj.quantity.push(quantity);
                        listObj.name.push(name);
                    });
                    // let list = Array.from(document.querySelectorAll('[data-testid="shopping-list-item-name"]')).map(e => e.innerHTML).join('\n');
                    GM_setValue("list", JSON.stringify(listObj));
                    console.log(listObj);
                    return listObj;
                }
        
                function superDeets() {
                    var cdRadio = document.getElementById("cd");
                    var nwRadio = document.getElementById("nw");
                    let sp = {}
                    if (nwRadio.checked) {
                        console.log("new world baby");
                        sp.prefix = "https://www.ishopnewworld.co.nz/Search?q=";
                        sp.login = "https://www.ishopnewworld.co.nz/my-account/my-lists";
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
                <img class="logo nwlogo" src="https://i.imgur.com/9Gy77Qs.jpg" alt="New World" height ='30px'>
                <input type="radio" name="super" id="nw" value="New World" checked>
                <img class="logo cdlogo" src="https://i.imgur.com/sGVNVne.jpg" alt="Countdown" height ='30px'>
                <input type="radio" name="super" id="cd" value="Countdown">
                </form>`;
                GM_addStyle('input[type="radio"] { margin-top: -25px; vertical-align: middle; appearance: radio; }');
                GM_addStyle('.buttonDiv { display: flex; justify-content: center; align-items: center; margin-bottom: -25px; }');
                //GM_addStyle('.nwlogo, .cdlogo { border: 2px solid red; box-sizing: content-box;}');
                //GM_addStyle(' { border: 5px solid red; box-sizing: content-box;}');
                buttonDiv.style.display = 'flex';
                buttonDiv.style["justify-content"] = 'center';
                buttonDiv.style["align-items"] = 'center';
                buttonDiv.style["margin-bottom"] = '-25px';
                insertAtTop(buttonDiv);
                addButton("Login", login);
                addButton("Copy to Clipboard", copyToClipboard);
                addButton("Open in Tabs", openInTabs);
                break;
            }
        }
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, { childList: true, subtree: true } );

}



