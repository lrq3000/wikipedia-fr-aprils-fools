# wikipedia-fr-aprils-fools
WP+:fish:=:star2::bridge_at_night::star2:

This is a style for MediaWiki overloading the Vector style for desktop and Minerva style for mobile and mimicking a retro web style in a mix between Minitel/Videotex and old web's ASCII art. The style was tailored to work on the homepage and the Bistro, although the CSS style can be applied on any page. It was used for an event on French Wikipédia on April's Fools Day 2018.

[Test the style here.](https://lrq3000.github.io/wikipedia-fr-aprils-fools/)

![Desktop screenshot](https://github.com/lrq3000/wikipedia-fr-aprils-fools/raw/master/img/WP-FR-Minitel-maquette-v7.png)
![Mobile screenshot](https://github.com/lrq3000/wikipedia-fr-aprils-fools/raw/master/img/WP-FR-Minitel-maquette-mobile-v7.png)

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

## TODO
The following would have been great additions to do but could not be done on time:
* Downsampling images color bits to web colors only (https://fr.wikipedia.org/wiki/Couleur_du_Web#Noms_des_couleurs_HTML), an idea of Pic-Sou which was unfortunately not made in time.
* Avoid any use of global variables (particularly for the animation function).
* Integrate in WP API as a JS widget, so that users can disable in their preferences menu and with better and more modular caching and management for admins.
