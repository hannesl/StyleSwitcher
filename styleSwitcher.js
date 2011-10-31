/**
 * StyleSwitcher: A JavaScript library for creating alternate stylesheets 
 * dynamically, and switching between them and their originals.
 */

var styleSwitcher = styleSwitcher || {
  // The styles that are available for switching.
  styleSheets: window.document.styleSheets,

  // Hash table of style replacement patterns. Each pattern is defined as a 
  // search key and a replacement string, like this:
  // {
  //    "http://www.example.com/styles/": "http://localhost/project/styles/",
  //    ...
  // }
  replacePatterns: {},

  // Arrays of original and alternate style link objects.
  originalStyles: [],
  alternateStyles: [],

  // The switcher state: original or alternate.
  state: "original",

  // Go through the available stylesheets and create alternate styles if 
  // appropriate. A hash table of replacement patterns can be passed.
  processStyleSheets: function(patterns) {
    patterns = patterns ? patterns : this.replacePatterns;

    for (var s in this.styleSheets) {
      var styleSheet = this.styleSheets[s];
      // Check if this is a linked stylesheet.
      if (styleSheet.href) {
        var altURL = this.replaceURL(styleSheet.href, patterns);
        if (altURL && altURL != styleSheet.href) {
          // Tag this style as the original.
          styleSheet.title = "original";
          this.originalStyles.push(styleSheet);

          // Create the alternate style.
          var lStyle = this.createLink(true, altURL);
          this.alternateStyles.push(lStyle);
          
        }
      }

      // Look for @import rules.
      // Avoid Security errors from cross-domain violations.
      try {
        rules = styleSheet != null ? styleSheet.cssRules : void 0;
      }
      catch (e) {
        // Ignore the exception.
      }

      for (var r in rules) {
        var rule = rules[r];

        // Check if this is an import rule.
        if (rule && rule.type == CSSRule.IMPORT_RULE && rule.href) {
          var url = rule.href;
          var altURL = this.replaceURL(url, patterns);

          if (altURL && altURL != url) {
            // Remove the import rule and create a new stylesheet link element.
            styleSheet.deleteRule(r);
            var oStyle = this.createLink(false, url);
            this.originalStyles.push(oStyle);

            // Create the alternate style.
            var lStyle = this.createLink(true, altURL);
            this.alternateStyles.push(lStyle);
          }

        }
      }
    }

  },

  // Create a new stylesheet link element.
  createLink: function(alternate, url) {
    var link = document.createElement("link");
    link.setAttribute("rel", alternate ? "alternate stylesheet" : "stylesheet");
    link.setAttribute("type", "text/css");
    link.setAttribute("title", alternate ? "alternate" : "original");
    link.setAttribute("href", url);

    document.getElementsByTagName("head")[0].appendChild(link);
    
    return link;
  },

  // Replace the URL based on the passed patterns.
  replaceURL: function(url, patterns) {
    patterns = patterns ? patterns : this.replacePatterns;
    var altURL = url;
    for (var search in patterns) {
      altURL = url.replace(search, patterns[search]);
      if (altURL != url) {
        break;
      }
    }
    return altURL;
  },

  // Switch between original and alternate stylesheets.
  switchStyle: function() {
    // Switch the state.
    this.state = this.state == "original" ? "alternate" : "original";

    var disableOriginal = this.state == "alternate";
    for (var o in this.originalStyles) {
      var oStyle = this.originalStyles[o];
      oStyle.disabled = disableOriginal;
    }
    for (var a in this.alternateStyles) {
      var aStyle = this.alternateStyles[a];
      aStyle.disabled = !disableOriginal;
    }

  }
}
