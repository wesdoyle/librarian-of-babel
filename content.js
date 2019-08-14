$("<style>")
    .prop("type", "text/css")
    .html("\
    .lib-highlight {\
                background-color: #00ECAD;\
            }")
    .appendTo("head");


$.extend({
    highlight: function (node, re, nodeName, className) {
        if (node.nodeType === 3) {
            var match = node.data.match(re);
            if (match) {
                var highlight = document.createElement(nodeName || 'span');
                highlight.className = className || 'lib-highlight';
                var wordNode = node.splitText(match.index + 1);
                wordNode.splitText(match[0].replace(/\s+/g, '').length);
                var wordClone = wordNode.cloneNode(true);
                highlight.appendChild(wordClone);
                wordNode.parentNode.replaceChild(highlight, wordNode);
                return 1; //skip added node in parent
            }
        } else if ((node.nodeType === 1 && node.childNodes) && // only element nodes that have children
            !/(script|style)/i.test(node.tagName) && // ignore script and style nodes
            !(node.tagName === nodeName.toUpperCase() && node.className === className)) { // skip if already highlighted
            for (var i = 0; i < node.childNodes.length; i++) {
                i += $.highlight(node.childNodes[i], re, nodeName, className);
            }
        }
        return 0;
    }
});


$.fn.unhighlight = function (options) {
    var settings = { className: 'lib-highlight', element: 'span' };
    $.extend(settings, options);

    return this.find(settings.element + "." + settings.className).each(function () {
        var parent = this.parentNode;
        parent.replaceChild(this.firstChild, this);
        parent.normalize();
    }).end();
};


$.fn.highlight = function (words, options) {
    var settings = { className: 'lib-highlight', element: 'span', caseSensitive: false, wordsOnly: false };
    $.extend(settings, options);

    if (words.constructor === String) {
        words = [words];
    }

    words = $.grep(words, function(word, i){
        return word != '';
    });

    words = $.map(words, function(word, i) {
        return word.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    });

    if (words.length == 0) { return this; };

    var flag = settings.caseSensitive ? "" : "i";
    var pattern = "(" + words.join("|") + ")";

    if (settings.wordsOnly) {
        pattern = "\\b" + pattern + "\\b";
    }

    var re = new RegExp(pattern, flag);

    return this.each(function () {
        $.highlight(this, re, settings.element, settings.className);
    });
};

$(document).ready(function(){
    $('#textblock').highlight(words);
});
