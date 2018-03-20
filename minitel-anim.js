/* Minitel animation for MediaWiki + CSS dynamic management
 * by LRQ3000
 *  v1.9.3
 * Released under co-license Creative Commons Attribution-ShareAlike 3.0 Unported License (CC BY-SA) and the GNU Free Documentation License (GFDL), and in addition also licensed under the General Public License v2 at choice.
 * Usage: the simplest way is to include this script, at the very bottom of your page, so that all other HTML elements are already defined before (else the hideOrShowAllBut() function won't work properly). No external library is required (such as JQuery), and then call the helper functions, like this.
 *
<script src="minitel-anim.js"></script>
<script>minitelHeader(); minitelFooter();</script>
 *
 * Note: There is no need to include the CSS separately, it will be dynamically loaded by this script (which allows to disable the style by clicking a link). The style can however be used standalone, without the JS, by only including the CSS in the HTML head.
 *
 * The second way is more complicated but will prevent the split-second blinking of the standard WP style before the new one loads.
 * To achieve this, you need to do 2 includes and 2 code snippets:
 * In the header:
 *
<script src="minitel-anim.js"></script>
<script>
// IMPORTANT NOTE: the WP stylesheet needs to be done inside the javascript, else there will be a split-second blink (not a usability issue, it's just for a more pleasing visual experience)
document.write('<link rel="stylesheet" href="path-to-wp-style"/>') // use the standard WP style as a basis, this is optional, if this line is removed the minitel style will display just fine too (albeit a bit different)
minitelHeader();
</script>
<noscript>
<link rel="stylesheet" href="path-to-wp-style"/>
</noscript>
 *
 * Note: you need to replace path-to-wp-style with the dynamically generated path to the WP standard style.
 * And in the footer at the most bottom part of your <body> just before </body>:
 *
<script>minitelFooter();</script>
 *
 * Then you're done!
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
        window.onclick = f;
        window.onkeypress = f;
        document.getElementsByTagName("body")[0].onclick = function(){ f(); }; // for IE < 10 compatibility
        document.getElementsByTagName("body")[0].onkeypress = function(){ f(); }; // for IE < 10 compatibility
    } else {
        window.onclick = null;
        window.onkeypress = null;
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
    bannerdiv.setAttribute("style", "font-size: 2em; width: 100em; overflow: visible; position: absolute;"); // make it bigger
    // Allow to skip the animation on mouse click or key press
    bindUserInterruption(stopAnim, true);
    // Hide all other elements except the banner
    hideOrShowAllBut("#"+bannerdiv_id, true);
    // Start playing the Minitel like connection sound
    minitel_play_sound();
    // Start the Minitel like animation drawing the banner, after the Minitel sound
    setTimeout(function(){  // to wait for sound to finish
        minitel_title_anim(message.replace(/<[^>]+>/gi, "")); // trim all html code before doing the animation, the animation will anyway display the full message at the end with the markup
    }, 1400);
}
function includeMinitelCSS() {
    // Loads additional Minitel CSS style file to the webpage (so this does not replace any other CSS style file, it gets added over the others)
    var fileref = document.createElement("link");
    fileref.rel = "stylesheet";
    fileref.type = "text/css";
    fileref.href = "minitel.css";
    document.getElementsByTagName("head")[0].appendChild(fileref)
}
function minitelAddFish() {
    // Add a div where the April's Fools fish image will be placed (via CSS) */
    document.body.innerHTML += '<div id="aprilfish"><a href="https://fr.wikipedia.org/wiki/Poisson_d%27avril"><img id="aprilfishimg" src="https://upload.wikimedia.org/wikipedia/commons/2/23/Fish_shell_logo_ascii_minitel.png" /></a></div>';
}

/* Images pixelation (does not work on background images */
function loadScript(url, callback)
{
    // Load an additional javascript library on-the-fly and callback a function that can then access this library
    /* https://stackoverflow.com/questions/950087/how-do-i-include-a-javascript-file-in-another-javascript-file */
    // Adding the script tag to the head
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;

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
                img.pixelate({ value: 0.3, reveal: true }); // modify the value here to make it less or more pixelated (1 for no pixelation, 0 for full pixelation)
            }
        }
    }
}
function loadAndPixelateImages(){
    // Callback to pixelate all images at the end of the animation
    // Useful to avoid pixelating while images are still hidden (else they will be misdetected as being originally hidden, whereas it's because of the banner animation)
    try {
        loadScript("pixelate.js", pixelateImages); // Bonus: pixelate all images
    } catch(err) {};
}

// HELPER FUNCTIONS
function minitelHeader() {
    // Helper function: Auto include CSS file as appropriate and add link to disable/enable the style
    // To be placed in the header (technically it could be placed at the footer and be merged with minitelFooter() but then there would be a split second where we can see the original WP style)
    var minitel_disableflag = getCookie("miniteldisable"); // check the miniteldisable style flag in the cookie
    if (minitel_disableflag != 1) {
        // Minitel style flag not disabled (or not defined), we include the CSS and launch the animation
        includeMinitelCSS();
    }
}
function minitelFooter() {
    // Helper function: Launch the main routine on if not disabled by cookie! Also manages the links to enable/disable the style and animation
    // To be placed in the footer, at the most bottom place in your <body>, just before the </body> if possible (because we need all HTML elements to be already loaded, in order to manipulate them)
    var minitel_disableflag = getCookie("miniteldisable"); // check the miniteldisable style flag in the cookie
    mobilelink = document.getElementById('mw-mf-display-toggle'); // get the link to toggle between mobile and desktop (this id only exists on the mobile version)
    if (minitel_disableflag != 1) {
        // Do the animation, but only if not on mobile
        if (mobilelink == null) { // simply check for the existence of the link to switch the mobile version to desktop. This link does not exist on the desktop version.
            // Desktop version, we can show the animation (which will add a disable link)
            minitelAddFish(); // add a div to place the April's Fools fish image (via CSS) - DO THIS BEFORE calling the animation (so that the animation can hide it and restore it afterward)
            minitelAnimMain(); // do the banner animation! Note: this will also add a link to disable the style + Bonus: pixelate all images (included in stopAnim())
        } else {
            // Mobile version, no animation but we add a disable link (to disable the CSS style)
            minitelAddFish(); // add also the fish
            // Add a disable link
            futurelink = "<li><a href=\"?\" id=\"backtofuturelink\" style=\"color:#ff0080\" onclick=\"setCookie('miniteldisable', 1, 1);\">Retourner vers le futur!</a></li>";
            footerdiv = document.getElementsByClassName('footer-places')[0];
            footerdiv.innerHTML = footerdiv.innerHTML + futurelink;
            // Bonus: pixelate all images
            loadAndPixelateImages();
        }
    } else {
        // Else the user disabled the Minitel style, just don't do anything except adding a link to reactivate the Minitel style
        if (mobilelink == null) {
            // Desktop version
            pastlink = "<a href=\"?\" id=\"backtofuturelink\" style=\"font-size: 0.8em\" onclick=\"setCookie('miniteldisable', 0, 1);\">Je suis nostalgique, retourner dans le passé!</a>";
            bannerdiv = document.getElementById('accueil_2017_bloc-titre');
            bannerdiv.innerHTML = bannerdiv.innerHTML + pastlink;
        } else {
            // Desktop version
            pastlink = "<li><a href=\"?\" id=\"backtofuturelink\" onclick=\"setCookie('miniteldisable', 0, 1);\">Je suis nostalgique, retourner dans le passé!</a></li>";
            footerdiv = document.getElementsByClassName('footer-places')[0];
            footerdiv.innerHTML = footerdiv.innerHTML + pastlink;
        }
    }
}
