# wikipedia-fr-aprils-fools
A retro Minitel/ASCII style for MediaWiki. WP+:fish:=:star2::bridge_at_night::star2:

This is a style for MediaWiki overloading the Vector style for desktop and Minerva style for mobile and mimicking a retro web style in a mix between Minitel/Videotex and old web's ASCII art. The style was tailored to work on the homepage and the Bistro, although the CSS style can be applied on any page. It was used for an event on French Wikipédia on April's Fools Day 2018.

[Test the style here.](https://lrq3000.github.io/wikipedia-fr-aprils-fools/)

![Desktop screenshot](https://github.com/lrq3000/wikipedia-fr-aprils-fools/raw/master/screenshots/WP-FR-Minitel-Final.png)
![Mobile screenshot](https://github.com/lrq3000/wikipedia-fr-aprils-fools/raw/master/screenshots/WP-FR-Minitel-mobile-Final.png)
![Logo](https://github.com/lrq3000/wikipedia-fr-aprils-fools/raw/master/res/Wikipedia-logo-v2-fr-minitel-2.svg.png)

## INSTALL
To install this theme in MediaWiki, this can be done either globally or only for your user account. To do that, simply create one article in your user pages for each script name, and copy/paste the code there (eg, `/w/User:my_username/minitel.css` - for French Wikipédia, replace `User:my_username` by `Utilisateur:my_username`). Then, just add one include in your `/w/User:my_username/common.js` like this:

`mw.loader.load( '/w/index.php?title=User:my_username/minitel-anim.js&action=raw&ctype=text/javascript' );`

This will load the whole style with the animation and everything, but this will be activated only on 1st April 2018 and on the homepage (this can easily be modified in the code, in `minitel-anim.js`).

Also, note that the javascript is only useful if you want the homepage banner animation and the images pixellating, if not, you can simply include the `minitel.css`, this will do most of the styling, then simply include this in your `Utilisateur:my_username/common.css` (not `common.js`!):

`mw.loader.load( '/w/index.php?title=User:my_username/minitel.css&action=raw&ctype=text/css', 'text/css');`

For more infos, see [this page](https://en.wikipedia.org/wiki/Wikipedia:Skin#Customisation_(advanced_users)) and [this page](https://www.mediawiki.org/wiki/ResourceLoader/Core_modules#mw.loader.load).

Finally, note that this style was built as an overload over Vector (for desktop) and Minerva (for mobile) standard styles, so you need these styles loaded first before loading this retro style.

## CREDITS
Big thank you, in no particular order, to:
* ShakespeareFan00 for the original idea of a Minitel style on homepage!
* Framawiki for supporting, communicating and helping the organization of this project!
* Lofhi for CSS style fix, code style fix, color-blind tests and the april fish CSS animation!
* VateGV for his support and feedbacks, the idea of a JS link to disable the style, the idea of a videogame arcade style for the Bistro, the idea of the Konami code to access the easter egg and for making the Wikipédia Arcades logo!
* Gratusfr for the security fix!
* Jules for the idea of adding an april fish image linking to the April's Fools Day Wikipédia article.
* Warp3 for his support, the idea of downsampling/pixellating images and proposing fish shell as the april fish image
* Fish shell for making the ASCII april fish image
* Arkanosis and Orlodrim for reviewing the code and providing essential suggestions on security and ergonomy!
* Erik Bovin and Fanfwah for their help with the anecdotes!
* Sammyday for suggesting the relevant Wikipédia article and to use Color Contrast Analyzer to check for color blind accessibility!
* the community of Wikipédia FR!
* anyone else who contributed that I might have forgotten (please open an issue!)

## LESSONS LEARNT
These are things that were learnt during the development of an April's Fools joke for such a big community project:
* be (super) obvious, in particular the links to disable (must be super visible and easy)
* make it easy to disable for the user (both the whole style and any animation/moving object), via for example a javascript link setting a cookie
* make it accessible for color blind
* test test and retest on all browsers, including super old ones and mobiles
* make it easy to implement for admins, and easy to remove in case of issues
* make it auto-activated in the specific timeframe you want, because of cache
* use good standards, and in particular check for XSS vulnerabilities

## TODO
The following would have been great additions to do but could not be done on time:
* Downsampling images color bits to web colors only (https://fr.wikipedia.org/wiki/Couleur_du_Web#Noms_des_couleurs_HTML), an idea of Pic-Sou which was unfortunately not made in time.
* Avoid any use of global variables (particularly for the animation function).
* Integrate in WP API as a JS widget, so that users can disable in their preferences menu and with better and more modular caching and management for admins.
