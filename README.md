# StyleSwitcher

A JavaScript library for creating alternate stylesheets dynamically, and 
switching between them and their originals.

The library was born out of the need to develop CSS on a remotely hosted 
site without setting up a development site. The script goes through all of the 
stylesheets on the page and adds alternate stylesheets for each style that 
matches specific URL replacement patterns.

One limitation is that browsers usually don't permit the alternate styles to be
loaded as local files (using the file:// schema), so you still need the files 
to be served by a web server.

## Usage

There are trhree bookmarklets available in bookmarklets.html that load, setup 
and trigger StyleSwitcher. (Unfortunately, GitHub doesn't let me include them 
in this README.) 

The basic API for using this library programmatically looks like this:

    styleSwitcher.processStyleSheets({
      "http://www.example.com/css/": "http://localhost/example.com/css/"
    });
    myLink.onClick = function() {
      styleSwitcher.switchStyle();
    };
