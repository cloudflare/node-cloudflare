/**
 * Build basic docs for the CloudFlare Client API
 */
var casper = require("casper").create({
    // verbose:  true,
    // logLevel: 'debug'
});

var docs = [];

var methodNames = {
  'stats': 'domainStats',
  'zone_load_multi': 'listDomains',
  'rec_load_all':    'listDomainRecords',
  'ip_lkup':         'checkIp'
};

var paramMap = {
  'z': 'domain'
};

var useObjectForRemainingParams = true;

casper.start("http://www.cloudflare.com/docs/client-api.html", function () {
  docs = this.evaluate(function () {
    var docs = [];

    function extract_response(elem) {
      if (!(elem || elem.innerText)) {
        return "";
      }

      // Sample JSON needs some cleanup before parsed
      var code = elem.textContent.replace(/([\{,\[])-(["\{\[])/g, '$1$2');

      try {
        return JSON.parse(code);
      } catch (e) {
        return code;
      }
    }


    function strip_quotes(str) {
      return str.replace(/(^"|"$)/g, "");
    }

    function list_to_array(elem) {
      var list = [];

      if (is_tag(elem)) {
        each(elem.children, function (item) {
          list.push(item_to_object(item));
        });
      }

      return list;
    }

    function to_array(arg) {
      return Array.prototype.slice.call(arg, 0);
    }

    function each(list, fn) {
      return to_array(list).forEach(fn);
    }

    function is_tag(el, tag) {
      var isTag = el && el.tagName;

      if (arguments.length === 2) {
        return isTag && el.tagName === tag.toUpperCase();
      }

      return isTag;
    }

    function remove_self(el) {
      return has_parent(el) && el.parentNode.removeChild(el);
    }

    function has_parent(el) {
      return el && el.parentNode;
    }

    function pluck(el) {
      remove_self(el);

      return el;
    }

    function is_whitespace(el) {
      return el && el.textContent.match(/^\s*$/);
    }

    function trim_whitespace(str) {
      return str.replace(/(^\s*|\s*$)/g, "");
    }

    function trim_starting_breaks(elem) {
      var firstEl = elem.firstChild;
      if (!firstEl) {
        return;
      }

      if (is_tag(firstEl, "BR") || is_whitespace(firstEl)) {
        remove_self(firstEl);

        trim_starting_breaks(elem);
      }
    }

    function wrap_text(str, wrap) {
      return wrap + str + wrap;
    }

    function html_to_markdown(elem) {
      each(elem.getElementsByTagName('*'), function (el) {
        switch (el.tagName) {
          case "STRONG":
          case "B":
            el.innerHTML = wrap_text(el.innerHTML, "**");
            break;

          case "EM":
          case "I":
            el.innerHTML = wrap_text(el.innerHTML, "*");
            break;

          case "PRE":
            el.parentNode.replaceChild(
              document.createTextNode(wrap_text(el.textContent, '```')),
              el
            );
            break;
        }
      });

      return trim_whitespace(elem.textContent);
    }

    function item_to_object(elem) {
      var obj = {};

      trim_starting_breaks(elem);

      if (is_tag(elem.firstChild, "STRONG")) {
        var name = pluck(elem.firstChild);

        obj.name = strip_quotes(name.textContent);
      }

      trim_starting_breaks(elem);

      each(elem.children, function (child) {
        if (is_tag(child, "UL")) {
          var list = list_to_array(child);

          // trim any initial whitespace
          trim_starting_breaks(child);

          if (list.length > 0) {
            obj.items = list;
          }

          remove_self(child);
        }
      });

      obj.text = html_to_markdown(elem);

      return obj;
    }


    function parse_input(elem) {
      if (!is_tag(elem)) {
        return;
      }

      return item_to_object(elem);
    }




    function parse_output(elem) {
      return extract_response(elem.querySelector("div[id='json']"));
    }

    each(document.querySelectorAll('button.btn[data-target]'), function (elem) {
      elem.click();
    });

    each(document.querySelectorAll('li + p'), function (p) {
      if (is_tag(p.previousElementSibling, "LI")) {
        p.previousElementSibling.appendChild(p);
      }
    });

    // Remove all the <script> tags.  CloudFlare uses <script> tags to keep email addresses
    // from being included directly in markup.
    each(document.querySelectorAll('script'), remove_self);

    each(document.querySelectorAll('a[name^="s"]'), function (elem) {
      // Filter out any "header" sections - only things like 1.1 or 3.2 are wanted
      if (!elem.name.match(/\./)) {
        return;
      }

      var title = elem.innerText.replace(/(^\s*|\s*$)/g, ""),
          section_num,
          action;

      // Extract data from the header text.  Headers follow the format:
      //   [section id] - "[action]" - [title]
      //
      // Note: Some of the headers end up using "--" for instead of just "-"
      var parts = title.split(/\s*--?\s*/g);

      section_num = parts[0];
      action = parts[1];
      title = parts[2];

      // Only process sections > 2.  The first 2 sections are general info.
      if (section_num.match(/^[12]/)) {
        return;
      }

      action = strip_quotes(action);

      var section = {
        num: section_num,
        action: action,
        title: title
      };

      // After the main header there is a <p> tag that may contain additional
      // information describing the request
      var p = elem.nextElementSibling;

      if (is_tag(p, "P")) {
        if (!is_whitespace(p)) {
          section.description = p.innerText;
        }

        // The last element to process is the <table> for this section.  It will
        // appear after the previous <p> tag in the DOM.
        // code = document.getElementById action
        var table = p.nextElementSibling;

        // if code and code.tagName is "DIV"
        if (is_tag(table, "TABLE")) {
          section.input = parse_input(table.querySelector('tr:first-child > td:last-child'));

          // Locate the example response data
          section.output = parse_output(table.querySelector('tr:last-child > td:last-child'));
        }
      }

      docs.push(section);
    });

    return docs;
  });
});

function pluck(list, key) {
  return Array.prototype.map.call(list, function (item) {
    return item[key];
  });
}

function getMaxLength(list, key) {
  var len = 1, useKey = false;
  if (arguments.length === 2) {
    useKey = true;
  }
  Array.prototype.forEach.call(list, function (item) {
    if (useKey) {
      item = item[key];
    }
    len = Math.max(len, item.length);
  });

  return len;
}

function padString(str, len, chr) {
  if (arguments.length < 3) {
    chr = " ";
  }
  while (str.length < len) {
    str += chr;
  }
  return str;
}

casper.buildParamList = function (action) {
  var params = {},
      maxParamLength = 1;

  if (!(action.input && action.input.hasOwnProperty('items'))) {
    return ['@param  {Function} fn'];
  }

  var namedParams      = [],
      additionalParams = [];

  action.input.items.forEach(function (item) {
    if (!item.name) {
      return;
    }

    var name = item.name;

    if (paramMap.hasOwnProperty(name)) {
      name = paramMap[name];

      namedParams.push(name);
    } else if (useObjectForRemainingParams) {
      additionalParams.push(name);
    } else {
      namedParams.push(name);
    }

    params[name] = item;
  });

  maxParamLength = getMaxLength([].concat(namedParams, additionalParams));
  if (additionalParams.length > 0) {
    // also need to add the "options" param to the "namedParams"
    namedParams.push("options");

    maxParamLength += 8; // for "options."
  }

  action.namedParams = namedParams;

  var result = [];

  function addParam(type, name, text) {
    result.push('@param  ' + padString('{' + type + '}', 10) + ' ' + padString(name, maxParamLength) + '  ' + text);
  }

  namedParams.forEach(function (name) {
    if ("options" === name) {
      addParam('Object', 'options', '');
      additionalParams.forEach(function (n) {
        addParam('String', 'options.' + n, params[n].text);
      });
    } else {
      addParam('String', name, params[name].text);
    }
  });

  addParam('Function', 'fn', '');

  return result;
};

casper.getMethodName = function (action) {
  if (methodNames.hasOwnProperty(action)) {
    return methodNames[action];
  }

  return action.replace(/_([a-z])/g, function (m, k) {
    return k.toUpperCase();
  });
}

casper.buildDocblock = function (action) {
  var doc = '/**\n',
      maxParamLength = 1;

  doc += action.title + '\n\n';
  if (action.hasOwnProperty('description')) {
    doc += action.description + '\n\n';
  }

  doc += '@method ' + casper.getMethodName(action.action) + '\n';
  doc += '@link   http://www.cloudflare.com/docs/client-api.html#s' + action.num + '\n';

  doc += this.buildParamList(action).map(function (line) {
    return line.replace('\n', '\n    ');
  }).join('\n') + '\n';

  doc += '**/';

  return doc;
};

casper.buildDocs = function () {
  this.echo(docs.map(this.buildDocblock.bind(this)).join("\n\n"));
};

casper.dumpCode = function () {
  var code = docs.map(function (action) {
    var docblock = this.buildDocblock(action),
        namedParams = [],
        additionalParams = [];

    if (action.input && action.input.items) {
      action.input.items.forEach(function (item) {
        if (!item.name) {
          return;
        }

        var name = item.name;

        if (paramMap.hasOwnProperty(name)) {
          name = paramMap[name];

          namedParams.push(name);
        } else {
          additionalParams.push(name);
        }
      });
    }

    if (additionalParams.length) {
      namedParams.push('options');
    }

    namedParams.push('fn');

    var viewData = {
      methodName: casper.getMethodName(action.action),
      actionName: action.action,
      argList:    namedParams.join(', '),
      options:    '{}',
      extra:      ''
    };

    if (namedParams.indexOf('options')) {
      viewData.options = 'options';
      if (namedParams.indexOf('domain') > -1) {
        viewData.options = 'mix({}, options, { z: domain })';
      }
    } else if (namedParams.indexOf('domain') > -1) {
      viewData.options = '{ z: domain }';
    }

    var method = [
      'cf.<methodName> = function <methodName>(<argList>) {',
      '  <extra>this._request("<actionName>", <options>, function (err, res) {',
      '    // remaining processing goes here',
      '  });',
      '};',
      'cf.<actionName> = cf.<methodName>;'
    ].join('\n');

    method = method.replace(/<([a-z]+)>/ig, function (m, k) {
      return viewData[k];
    });

    return docblock + '\n' + method;
  }.bind(this));

  this.echo(code.join("\n\n"));
};

casper.dumpMockResponses = function () {
  var responses = docs.map(function (item) {
    if (item.action.match(/\W/)) {
      return '';
    }

    var response = 'cat > test/responses/' + item.action + '.json <<-EOF\n';

    response += JSON.stringify(item.output, null, 2) + '\n';

    response += 'EOF\n';

    return response;
  });

  this.echo(responses.join("\n\n"));
};

casper.run(function () {
  if (casper.cli.has("dump-responses")) {
    this.dumpMockResponses();
  } else if (casper.cli.has("dump-docs")) {
    this.buildDocs();
  } else if (casper.cli.has("dump-code")) {
    this.dumpCode();
  } else {
    require("utils").dump(docs);
  }
  this.exit();
});
