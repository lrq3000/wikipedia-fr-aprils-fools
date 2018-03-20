// Minitel animation for MediaWiki + CSS dynamic management
// by LRQ3000
// v1.4.0
// Released under co-license Creative Commons Attribution-ShareAlike 3.0 Unported License (CC BY-SA) and the GNU Free Documentation License (GFDL).
// Usage: simply include this script, at the very bottom of your page, so that all other HTML elements are already defined before (else the hideOrShowAllBut() function won't work properly). No external library is required (such as JQuery). No need to include the CSS separately, it will be dynamically loaded by this script (which allows to disable the style by clicking a link). The style can however be used standalone, without the JS, by only including the CSS in the HTML head.

function minitel_title_anim(msg) {
    // Inspired by Anonymous's code snippet: https://openclassrooms.com/forum/sujet/affichage-a-la-minitel
    c = msg.substring(I, I=I+1);
    // Replace special characters with equivalent html code
    if (c == "\n") {
        c = "<br />"; // line return
    } else if (c == " ") {
        c = "&nbsp;"; // physical space (important for correct rendering of figlet style banner)
    }
    // display the new character
    bannerdiv.innerHTML = bannerdiv.innerHTML + c;
    // Continue, unless user interrupted
    if (!animstop_flag) {
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
    var s = new Audio('https://upload.wikimedia.org/wikipedia/commons/a/a1/Fake_Minitel_sound.ogg');
    //var s = new Audio('https://upload.wikimedia.org/wikipedia/commons/4/4f/Dial_up_connection.ogg');
    s.loop = false;
    s.play();
}
function stopAnim() {
    // Stop the animation and restore the page (on user interruption or because animation has finished)
    animstop_flag = true;
    J = 0;
    bannerdiv.innerHTML = message.replace(/(?<=>)[ ]/gi, "&nbsp;").replace(/\n/gi, "<br />") + message_post.replace(/\n/gi, "<br />"); // show the full message with correct HTML markup
    bannerdiv.setAttribute("style", prevstyle); // restore style (ie, font-size)
    hideOrShowAllBut("#"+bannerdiv_id, false); //revealAll(); // reveal everything, all other HTML elements
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
    nodes.forEach(function(node){
        if (mode) {
            node.classList.add("hide"); // add a hide class defined in CSS to set display: none; visibility: hidden. This does the job but will leave some divs only invisible, not removed (so there will still be a scrollbar)
            node.style.display = 'none'; // this totally hides, just like the html elements do not exist
        } else {
            node.classList.remove("hide"); // remove the hide class
            node.style.display = 'inherit';  // use inherit to get the original values from CSS such as block/flex/inline-block etc
        }
    });

    // Equivalent one-liner in JQuery 3.3.1
    //$('#accueil_2017_bloc-titre').show().parentsUntil('body').addBack().siblings().hide();
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

// MAIN Minitel animation routine
function minitelAnimMain() {
    // Declare some global variables
    I = 0; // Current character being drawn in the banner animation - Internal parameter, do not touch
    J = 30.0; // Slowness of drawing the banner = starting delay of drawing between two characters (of the banner) - this amount will be gradually reduced
    Jstep = 0.1; // Step to decrease gradually the time it takes to draw the banner
    animstop_flag = false; // declare that the animation was stopped by user - Internal parameter, do not touch
    // Banner in figlet style, generated with https://www.npmjs.com/package/figlet
    // To change the banner, please first sanitize it in this order: double (escape) the antislashes and then replace line returns by \n
    // This necessitate an appropriate CSS for the bannerdiv for good display: white-space: pre; font-family: courier;
    message = " __      __ _  _    _         __     _  _\n \\ \\    / /(_)| |__(_) _ __  /_/  __| |(_) __ _\n  \\ \\/\\/ / | || / /| || '_ \\/ -_)/ _` || |/ _` |\n   \\_/\\_/  |_||_\\_\\|_|| .__/\\___|\\__,_||_|\\__,_|\n                      |_|\nL'encyclopédie libre que chacun peut améliorer<blink>_</blink>";
    message_post = "\n<a href=\"?\" id=\"backtofuturelink\" style=\"color:magenta\" onclick=\"setCookie('miniteldisable', 1, 1);\">Cliquez ici pour retourner vers le futur!</a>"; // something you want to add after the banner but not shown during the animation (but this will be shown after on the page)
    //document.getElementById('backtofuturelink').onclick = setCookie('miniteldisable', 1, 30);
    // Get the banner div html element
    bannerdiv_id = 'accueil_2017_bloc-titre';
    bannerdiv = document.getElementById(bannerdiv_id);
    bannerdiv.innerHTML = ""; // reset anything inside the bannerdiv, we will fill with our Minitel-like banner
    // Style it a bit for better effect (make it bigger)
    prevstyle = bannerdiv.getAttribute("style"); // backup previous style
    bannerdiv.setAttribute("style", "font-size: 2em; width: 100em; overflow: visible; position: absolute;"); // make it bigger
    // Allow to skip the animation on mouse click or key press
    window.onclick = stopAnim;
    window.onkeypress = stopAnim;
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

// Launch the main routine on script include!
var minitel_disableflag = getCookie("miniteldisable"); // check the miniteldisable style flag in the cookie
if (minitel_disableflag != 1) {
    // Minitel style flag not disabled (or not defined), we include the CSS and launch the animation
    includeMinitelCSS();

    // Do the animation, but only if not on mobile
    mobilelink = document.getElementById('mw-mf-display-toggle');  // simply check for the existence of the link to switch the mobile version to desktop. This link does not exist on the desktop version.
    if (mobilelink == null) {
        minitelAnimMain();
    }
} else {
    // Else the user disabled the Minitel style, just don't do anything except adding a link to reactivate the Minitel style
    pastlink = "<a href=\"?\" id=\"backtofuturelink\" style=\"font-size: 0.8em\" onclick=\"setCookie('miniteldisable', 0, 1);\">Je me sens nostalgique! Ramenez-moi dans le passé!</a>";
    bannerdiv = document.getElementById('accueil_2017_bloc-titre');
    bannerdiv.innerHTML = bannerdiv.innerHTML + pastlink;
}
