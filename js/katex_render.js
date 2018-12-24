document.addEventListener('DOMContentLoaded', function() {
  function extractTex(str) {
    var res = str.replace(/\n/g,"");
    res = res.match(/CDATA\[(.*)\%\]\]/);
    res = res && res[1] || str;
    res = res.trim();
    return res;
  }

  renderMathInElement(document.body, {'delimiters' : [
    // {left: "$$", right: "$$", display: true},
    {left: "\\[", right: "\\]", display: true},
    // {left: "$", right: "$", display: false},
    {left: "\\(", right: "\\)", display: false}
  ]});

  $("script[type='math/tex']").replaceWith(
    function(){
      var tex = extractTex($(this).text());
      return katex.renderToString(tex, { throwOnError: false });
  });

  $("script[type='math/tex; mode=display']").replaceWith(
    function(){
      var tex = extractTex($(this).text());
      return katex.renderToString("\\displaystyle " + tex, { displayMode: true, throwOnError: false });
  });
});
