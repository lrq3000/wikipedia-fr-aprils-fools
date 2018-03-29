/* Minitel animation for MediaWiki + CSS dynamic management
 * by LRQ3000
 * v2.2.4
 * Released under MIT license.
 * Usage: either simply include this script at the header:
 *
<script src="minitel-anim.js"></script>
 *
 * Or if via the javascript overloading API in MediaWiki, you can simply create a common.js page (either in userspace at User:YourName/common.js or globally for all users at MediaWiki:Common.js) and add the following line at the bottom:
 mw.loader.load( '/w/index.php?title=User:YourName/minitel-anim.js&action=raw&ctype=text/javascript' );
 * Then create three pages minitel-anim.js, minitel.css and pixelate.js and paste respectively the code of these files in these pages. Note that you will have to update the paths in minitel-anim.js to load the correct articles paths that you have just created.
 * Note: There is no need to include the CSS separately, it will be dynamically loaded by this script (which allows to disable the style by clicking a link). The style can however be used standalone, without the JS, by only including the CSS in the HTML head.
 * Note2: to do a hard refresh to reload the javascript and CSS in case of modifications, press CTRL+F5.
 *
 * These instructions work for both the desktop and mobile homepages.
 */

function minitel_title_anim(msg) {
    // Inspired by Anonymous's code snippet: https://openclassrooms.com/forum/sujet/affichage-a-la-minitel
    c = msg.substring(I, I=I+1);
    // Replace special characters with equivalent html code
    if (c == "\n") {
        c = "<br />"; // line return
    } else if (c == " ") {
        c = "&nbsp;"; // physical space (important for correct rendering of figlet style banner)
    } else if (c == "<") {
        // support for html tags, we collect all the tags characters and input at once
        next_c = "";
        while (next_c != ">") {
            next_c = msg.substring(I, I=I+1);
            c = c + next_c;
        }
        c = c + msg.substring(I, I=I+1); // also add the next character to have something to display on screen
    }

    // Continue, unless user interrupted
    if (!animstop_flag) {
        // display the new character
        bannerdiv.innerHTML = bannerdiv.innerHTML + c;
        // If there are more characters to draw, continue the animation
        if ( I < message.length ) {
            setTimeout(function() {minitel_title_anim(msg);}, J=J-Jstep);
        // Else this was the last character, draw the full message (with markup code) and show all other elements on page
        } else {
            setTimeout(function(){  // wait a bit before revealing everything for a better effect
                stopAnim(); // show the full message with potentially some html markup
            }, 500);
        }
    }
}
function minitel_play_sound(){
    // Play a minitel-like sound
    try {
        var s = new Audio('https://upload.wikimedia.org/wikipedia/commons/a/a1/Fake_Minitel_sound.ogg');
        //var s = new Audio('https://upload.wikimedia.org/wikipedia/commons/4/4f/Dial_up_connection.ogg');
        s.loop = false;
        s.play();
    } catch(err) {}; // pass if Internet Explorer < 11 (incompatible with Audio)
}
function disableBlinkingOnUserInteraction() {
    // Stop animations on user interaction
    // In accordance with: https://www.w3.org/TR/2008/REC-WCAG20-20081211/#time-limits-pause
    // Stop the banner cursor blinking on user key press and mouse click
    var a = document.getElementsByTagName('blink');
    var b = document.createElement('span');
    b.innerText = a[0].innerText;
    a[0].parentNode.replaceChild(b, a[0]);
    bindUserInterruption(disableBlinkingOnUserInteraction, false);
    // Also stop the fish image from moving
    var c = document.getElementById('aprilfish');
    c.style.animationIterationCount = '0';
}
function stopAnim() {
    // Stop the animation and restore the page (on user interruption or because animation has finished)
    // This is called in any case at the end of the animation
    animstop_flag = true;
    J = 0;
    bannerdiv.innerHTML = message.replace(/\n/gi, "<br />") + message_post.replace(/\n/gi, "<br />"); // show the full message with correct HTML markup
    bannerdiv.setAttribute("style", prevstyle); // restore style (ie, font-size)
    hideOrShowAllBut("#"+bannerdiv_id, false); //revealAll(); // reveal everything, all other HTML elements
    bindUserInterruption(stopAnim, false); // unbind user interruption on mouse/keyboard (else it's not a big issue, the banner gets refreshed at each mouse or key press, it's not even visible with naked eye)
    loadAndPixelateImages(); // bonus: pixelate all images if possible (there is a try catch inside)
    document.getElementById('backtofuturelinkfixed').style.display = 'none'; // hide the fixed link to disable the style, there will be other links on the page anyway
    bindUserInterruption(disableBlinkingOnUserInteraction, true); // allow to disable the blinking of the cursor if user press any key or click the mouse
}
function revealAll() {
    // Show all other HTML elements along with #minitelanim
    // UNUSED: now hideOrShowAll does everything without needing JQuery
    /*
    $('#accueil_2017_bloc-titre').show().parentsUntil('body').addBack().siblings().show();
    $('script').hide().parentsUntil('body'); // hide script back, else they will be displayed as text on the page
    */
}
function hideOrShowAllBut(eltid, mode) {
    // Hide (or show) all other HTML elements except #eltid
    // Use mode == true to hide, or mode == false to show
    // Original code snippet by the awesome RobG: https://stackoverflow.com/a/44877057/1121352
    var el = document.querySelector(eltid);
    var node, nodes = [];

    do {
        var parent = el.parentNode;

        // Collect element children
        for (var i=0, iLen=parent.childNodes.length; i<iLen; i++) {
            node = parent.childNodes[i];

            // Collect only sibling nodes that are elements and not the current element
            if (node.nodeType == 1 && node != el) {
                nodes.push(node);
            }
        }

        // Go up to parent
        el = parent;

    // Stop when processed the body's child nodes
    } while (el.tagName.toLowerCase() != 'body');

    // Hide the collected nodes
    //nodes.forEach(function(node){ // incompatible with old IE, or could use JQuery
    for (var i = 0; i < nodes.length; i++) { // compatible with old IE
        node = nodes[i];
        if (mode) {
            try {
                node.classList.add("hide"); // add a hide class defined in CSS to set display: none; visibility: hidden. This does the job but will leave some divs only invisible, not removed (so there will still be a scrollbar)
            } catch(err) {} // just pass if IE < 10 (incompatible with classList)
            node.style.display = 'none'; // this totally hides, just like the html elements do not exist
        } else {
            try {
                node.classList.remove("hide"); // remove the hide class
            } catch(err) {} // just pass if IE < 10 (incompatible with classList)
            node.style.display = 'inherit';  // use inherit to get the original values from CSS such as block/flex/inline-block etc
        }
    };

    // Equivalent one-liner in JQuery 3.3.1
    //$('#accueil_2017_bloc-titre').show().parentsUntil('body').addBack().siblings().hide();
}
function bindUserInterruption(f, mode) {
    // Bind the mouse click and keyboard key press to call the specified function (or unbinds if mode == false)
    if (mode == true) {
        window.addEventListener("onclick", f, true);
        //window.onclick = f;
        window.addEventListener("onkeypress", f, true);
        //window.onkeypress = f;
        document.getElementsByTagName("body")[0].onclick = function(){ f(); }; // for IE < 10 compatibility
        document.getElementsByTagName("body")[0].onkeypress = function(){ f(); }; // for IE < 10 compatibility
    } else {
        window.removeEventListener("onclick", f, true);
        //window.onclick = null;
        window.removeEventListener("onkeypress", f, true);
        //window.onkeypress = null;
        document.getElementsByTagName("body")[0].onclick = function(){ null }; // for IE < 10 compatibility
        document.getElementsByTagName("body")[0].onkeypress = function(){ null }; // for IE < 10 compatibility
    }
}

// Functions to activate the link to disable this style
function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
function eraseCookie(name) {   
    document.cookie = name+'=; Max-Age=-99999999;';  
}

// Compatibility functions
if (document.getElementsByClassName == null) {
    document.getElementsByClassName = function(cl) {
      var retnode = [];
      var elem = this.getElementsByTagName('*');
      for (var i = 0; i < elem.length; i++) {
        if((' ' + elem[i].className + ' ').indexOf(' ' + cl + ' ') > -1) retnode.push(elem[i]);
      }
      return retnode;
    };
}

// MAIN Minitel animation routine
function minitelAnimMain() {
    // Declare some global variables
    I = 0; // Current character being drawn in the banner animation - Internal parameter, do not touch
    J = 30.0; // Slowness of drawing the banner = starting delay of drawing between two characters (of the banner) - this amount will be gradually reduced
    Jstep = 0.1; // Step to decrease gradually the time it takes to draw the banner
    animstop_flag = false; // declare that the animation was stopped by user - Internal parameter, do not touch
    bannerdiv_id = 'accueil_2017_bloc-titre'; // id of the html div that will welcome the animated banner (the content will be entirely replaced)
    // Banner in figlet style, generated with https://www.npmjs.com/package/figlet
    // To change the banner, please first sanitize it in this order: double (escape) the antislashes and then replace line returns by \n
    // This necessitate an appropriate CSS for the bannerdiv for good display (even though we enclose inside <pre> for consistent rendering in old browsers): white-space: pre; font-family: courier;
    message = "<pre> __      __ _  _    _         __     _  _\n \\ \\    / /(_)| |__(_) _ __  /_/  __| |(_) __ _\n  \\ \\/\\/ / | || / /| || '_ \\/ -_)/ _` || |/ _` |\n   \\_/\\_/  |_||_\\_\\|_|| .__/\\___|\\__,_||_|\\__,_|\n                      |_|</pre>\nL'encyclopédie libre que chacun peut améliorer<blink>_</blink>";
    message_post = "\n<a href=\"?\" id=\"backtofuturelink\" style=\"color:#ff0080\" onclick=\"setCookie('miniteldisable', 1, 1);\">Retourner vers le futur!</a>"; // something you want to add after the banner but not shown during the animation (but this will be shown after on the page)
    //document.getElementById('backtofuturelink').onclick = setCookie('miniteldisable', 1, 30);
    // Get the banner div html element
    bannerdiv = document.getElementById(bannerdiv_id);
    bannerdiv.innerHTML = ""; // reset anything inside the bannerdiv, we will fill with our Minitel-like banner
    // Style it a bit for better effect (make it bigger)
    prevstyle = bannerdiv.getAttribute("style"); // backup previous style
    bannerdiv.setAttribute("style", "font-size: 2em; width: auto; overflow: visible; position: absolute;"); // make it bigger
    // Allow to skip the animation on mouse click or key press
    bindUserInterruption(stopAnim, true);
    // Hide all other elements except the banner
    hideOrShowAllBut("#"+bannerdiv_id, true);
    // Start playing the Minitel like connection sound
    minitel_play_sound();
    // Add a link fixed on the screen to disable the style at any moment
    appendJSLink(document.body, "backtofuturelinkfixed", "Retourner vers le futur ! (désactive le poisson d'avril et l'animation)", 1, false, 'position:fixed;bottom:0;left:0;color:#ff0080;font-weight:bold;');
    // Start the Minitel like animation drawing the banner, after the Minitel sound
    setTimeout(function(){  // to wait for sound to finish
        minitel_title_anim(message.replace(/<[^>]+>/gi, "")); // trim all html code before doing the animation, the animation will anyway display the full message at the end with the markup
    }, 1400);
}
function includeMinitelCSS() {
    // Loads additional Minitel CSS style file to the webpage (so this does not replace any other CSS style file, it gets added over the others)
    try {
    	mw.loader.load( '/w/index.php?title=User:Lrq3000/minitel.css&action=raw&ctype=text/css', 'text/css' );
    } catch(err) {
    	var fileref = document.createElement("link");
	    fileref.rel = "stylesheet";
	    fileref.type = "text/css";
	    fileref.href = "minitel.css";
	    document.getElementsByTagName("head")[0].appendChild(fileref)
    }
}
function minitelAddFish() {
    // Add a div where the April's Fools fish image will be placed (via CSS) */
    var div = document.createElement('div');
    div.id = "aprilfish";
    var a = document.createElement('a');
    a.href = "https://fr.wikipedia.org/wiki/Poisson_d%27avril";
    var img = document.createElement('img');
    img.id = "aprilfishimg";
    img.src = "data:image/png;base64,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";
    a.appendChild(img);
    div.appendChild(a);
    document.body.appendChild(div);
}

/* Images pixelation (does not work on background images */
function loadScript(url, callback)
{
    // Load an additional javascript library on-the-fly and callback a function that can then access this library
    /* https://stackoverflow.com/questions/950087/how-do-i-include-a-javascript-file-in-another-javascript-file */

    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    if (window.location.host.match( /wikipedia.org/ )) { // special path for wikipedia, load from user space
        script.src = '/w/index.php?title=User:Lrq3000/'+url+'&action=raw&ctype=text/javascript';
    } else { // else use the direct path
        script.src = url;
    }

    // Then bind the event to the callback function.
    // There are several events for cross browser compatibility.
    script.onreadystatechange = callback;
    script.onload = callback;

    // Fire the loading
    head.appendChild(script);
}
function pixelateImages() {
    // Pixelate all img
    var imgs = document.getElementsByTagName('img'); // get all img objects
    for (var i = 0; i < imgs.length; i++) { // iterate on each image
        img = imgs[i];
        //console.log(img.id);
        if (!(img.id == "aprilfishimg")) { // exception for april fish!
            prevstyle = window.getComputedStyle(img);
            if ((!prevstyle.display | prevstyle.display != 'none') & (!prevstyle.visibility | prevstyle.visibility != 'hidden')) { // pixelate and show only if the image is not already hidden
                img.pixelate({ value: 0.25, reveal: true }); // modify the value here to make it less or more pixelated (1 for no pixelation, 0 for full pixelation)
            }
        }
    }
}
function loadAndPixelateImages(){
    // Callback to pixelate all images at the end of the animation
    // Useful to avoid pixelating while images are still hidden (else they will be misdetected as being originally hidden, whereas it's because of the banner animation)
    //try {
        loadScript("pixelate.js", pixelateImages); // Bonus: pixelate all images
    //} catch(err) {};
}
function eegg() {
    loadScript('konami.js',
        function () {var ee = new Konami(function() { 
            var newWnd = window.open('https://lrq3000.github.io/javascript-racer/v5.game.html', '_blank', 'noopener');
            newWnd.opener = null; // security fix: https://www.jitbit.com/alexblog/256-targetblank---the-most-underestimated-vulnerability-ever/
        });
        }
    );
}
function getCurrentDate() {
    // Get (client-side) current date
    // from: https://stackoverflow.com/a/12409344/1121352
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!

    var yyyy = today.getFullYear();
    if(dd<10){
        dd='0'+dd;
    } 
    if(mm<10){
        mm='0'+mm;
    } 
    var today = dd+'/'+mm+'/'+yyyy;
    return today;
}

// Auxiliary function to generate html links using DOM operators via JS
function appendJSLink(parent, id, text, miniteldisable, list=false, style=null) {
    // Create the links to disable/reenable the style, without using innerHTML
    // if list is true, then will put the link inside a <li>
    var a = document.createElement('a');
    a.appendChild(document.createTextNode(text));
    a.title = text;
    a.href = "?";
    a.onclick = function() {setCookie('miniteldisable', miniteldisable, 1)};
    a.id = id;
    if (!style) {
        a.style = "color:#ff0080";
    } else {
        a.style = style;
    }
    if (list) {
        var li = document.createElement('li');
        li.appendChild(a);
        parent.appendChild(li);
    } else {
        parent.appendChild(a);
    }
}
function changeColorWMF() {
    // Change the text color of the "Powered by Wikimedia Foundation etc" text, for which the style is hardcoded in the HTML page (so cannot use CSS, only JS can do something here)
    // limit the search inside mw-parser-output div
    var mwparser = document.getElementsByClassName('mw-parser-output');
    // search for all divs containing "Powered by Wikimedia Foundation etc" text
    var aTags = mwparser[0].getElementsByTagName("div");
    var searchText = "Wikipédia est hébergé par la ";
    var found;
    for (var i = 0; i < aTags.length; i++) {
      if (aTags[i].textContent.includes(searchText)) {
        found = aTags[i];
        break;
      }
    }
    // Now change the hardcoded font color for each div inside the one found
    aTags2 = found.getElementsByTagName("div");
    for (var i = 0; i < aTags2.length; i++) {
        aTags2[i].style.color = 'lime';
    }
    // Change the horizontal separator color while we're at it
    found.style.borderColor = 'lime';
    // Finally hide again the printfooter
    var printfooter = document.getElementsByClassName("printfooter")[0]
    printfooter.style = '';
    printfooter.style.display = 'none !important';
    printfooter.hidden = true;
    printfooter.style.position = 'absolute';
    printfooter.style.visibility = 'hidden';
}

// HELPER FUNCTIONS
function minitelHeader() {
    // Helper function: Auto include CSS file as appropriate and add link to disable/enable the style
    // To be placed in the header (technically it could be placed at the footer and be merged with minitelFooter() but then there would be a split second where we can see the original WP style)
    console.log('Poisson d\'avril : chargement du header');
    var minitel_disableflag = getCookie("miniteldisable"); // check the miniteldisable style flag in the cookie
    if (minitel_disableflag != 1) {
        // Minitel style flag not disabled (or not defined), we include the CSS and launch the animation
        includeMinitelCSS();
    }
}
function minitelFooter() {
    // Helper function: Launch the main routine on if not disabled by cookie! Also manages the links to enable/disable the style and animation
    // To be placed in the footer, at the most bottom place in your <body>, just before the </body> if possible (because we need all HTML elements to be already loaded, in order to manipulate them)
    console.log('Poisson d\'avril : chargement du footer');
    var minitel_disableflag = getCookie("miniteldisable"); // check the miniteldisable style flag in the cookie
    mobilelink = document.getElementById('mw-mf-display-toggle'); // get the link to toggle between mobile and desktop (this id only exists on the mobile version)
    if (minitel_disableflag != 1) {
        // Do the animation, but only if not on mobile
        if (mobilelink == null) { // simply check for the existence of the link to switch the mobile version to desktop. This link does not exist on the desktop version.
            // Desktop version, we can show the animation (which will add a disable link)
            minitelAddFish(); // add a div to place the April's Fools fish image (via CSS) - DO THIS BEFORE calling the animation (so that the animation can hide it and restore it afterward)
            minitelAnimMain(); // do the banner animation! Note: this will also add a link to disable the style + Bonus: pixelate all images (included in stopAnim(), to apply on images when they are unhidden)
            // Add another link in the footer
            footerdiv = document.getElementById('footer-places');
            appendJSLink(footerdiv, "backtofuturelink", "Retourner vers le futur ! (désactive le poisson d'avril)", 1, true);
            changeColorWMF();
            eegg();
        } else {
            // Mobile version, no animation but we add a disable link (to disable the CSS style)
            minitelAddFish(); // add also the fish
            //minitel_play_sound(); // the function is used directly to play the sound even if the banner is not displayed
            // Add a disable link
            footerdiv = document.getElementsByClassName('footer-places')[0];
            appendJSLink(footerdiv, "backtofuturelink", "Retourner vers le futur ! (désactive le poisson d'avril)", 1, true);
            // Bonus: pixelate all images
            loadAndPixelateImages();
            eegg();
        }
    } else {
        // Else the user disabled the Minitel style, just don't do anything except adding a link to reactivate the Minitel style
        if (mobilelink == null) {
            // Desktop version
            bannerdiv = document.getElementById('accueil_2017_bloc-titre');
            appendJSLink(bannerdiv, "backtofuturelink", "Je suis nostalgique, retourner dans le passé ! (active le poisson d'avril)", 0, false, "font-size: 0.8em;");
            footerdiv = document.getElementById('footer-places');
            appendJSLink(footerdiv, "backtofuturelink", "Retourner dans le passé ! (active le poisson d'avril)", 0, true, ' ');
        } else {
            // Mobile version
            footerdiv = document.getElementsByClassName('footer-places')[0];
            appendJSLink(footerdiv, "backtofuturelink", "Je suis nostalgique, retourner dans le passé ! (active le poisson d'avril)", 0, true, ' ');
        }
    }
}

// LOAD ON JS INCLUDE

// Load only if we are the 1st april 2018, and no other date (will allow automatic enabling/disabling past the date)
var match = window.location.host.match( /localhost/ ) || window.location.host.match( /^.*\.github.io/ ); // special case if we are testing, just show the style anytime
if (getCurrentDate() == '01/04/2018' || match) {
    // Load only if main page, else skip and show normal pages
    var match2 = window.location.pathname.match( /\/wiki\/Wikip%C3%A9dia:Accueil_principal/ ) || window.location.href.match( /title=Wikip%C3%A9dia:Accueil_principal/ ) || match;
    var match3 = window.location.pathname.match( /Sp%C3%A9cial/ ) || (window.location.href.match( /action/ ) && (window.location.href.match( /mobileaction/ ) == null)); // check if we are not doing an action on the homepage, then we disable (except if the action is to switch from mobile to desktop version, then we still show)
    if (match2 && (!match3 || match3 == null)) {
        // the WP stylesheet needs to be done inside the javascript, else there will be a split-second blink (not a usability issue, it's just for a more pleasing visual experience)
        minitelHeader();
        // Add a callback to start the animation at the end of page load (so all elements, including images, are already loaded and can be modified/hidden)
        console.log('Poisson d\'avril : page d\'accueil détectée');
        //window.addEventListener("load", function(){ // better but does not work on WP
        if (document.readyState=="complete") {
            minitelFooter();
        } else {
            window.onload = function() {
                minitelFooter();
            };
        }
        console.log('Poisson d\'avril : chargement complet');
        // Add an empty unload callback to prevent the browser from caching JS (this allows to redo the animation just like first load when hitting the back button)
        window.addEventListener("unload", function(){});
    }
}
