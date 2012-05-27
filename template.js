/*
# Name:    Subak the HTML Template Engine
# Version: 0.2
# Author:  Takahashi Hiroyuki
# License: GPL Version 2
*/


if ('undefined' == typeof(Subak)) {
  Subak = {}
}
;

Subak.Template = (function() {

  function Template(doc, opt) {
    var _ref, _ref1;
    this.doc = doc;
    if (opt == null) {
      opt = {};
    }
    if (!(this.doc != null) || !(this.doc.childNodes != null)) {
      throw new TypeError('document must not be null');
    }
    this.resetable = (_ref = (opt['resetable'] != null) && opt['resetable']) != null ? _ref : {
      "true": false
    };
    if (this.resetable) {
      this.replica = this.doc.cloneNode(true);
    }
    this.parentNode = this.doc.parentNode;
    this.prefix = (_ref1 = opt['prefix']) != null ? _ref1 : 'data-tpl-';
    this.block = "" + this.prefix + "block";
    this.veil = "" + this.prefix + "veil";
    this.append = "" + this.prefix + "append";
    this.insertBefore = "" + this.prefix + "insert_before";
    this.remove = "" + this.prefix + "remove";
    this.removeIf = "" + this.remove + "-if";
    this.removeEmpty = "" + this.remove + "-empty";
    this.removeEqual = "" + this.remove + "-equal";
    this.removeContain = "" + this.remove + "-contain";
    this.removeStartWith = "" + this.remove + "-start_with";
    this.removeEndWith = "" + this.remove + "-end_with";
    this.removeNotEmpty = "" + this.remove + "-not-empty";
    this.removeNotEqual = "" + this.remove + "-not-equal";
    this.removeNotContain = "" + this.remove + "-not-contain";
    this.removeNotStartWith = "" + this.remove + "-not-start_with";
    this.removeNotEndWith = "" + this.remove + "-not-end_with";
    this.removeRegex = "" + this.remove + "-regex";
    this.removeNotRegex = "" + this.remove + "-not-regex";
    this.init_track();
  }

  Template.prototype.init_track = function() {
    this.varNodes = [];
    this.blockNodes = [];
    this.veilNodes = [];
    this.removeNodes = [];
    this.removeIfNodes = [];
    this.insertBeforeNodes = [];
    this.appendNodes = [];
    return this.valueNodes = [];
  };

  Template.prototype.track_node = function(node, type) {
    var exists, nodes, _i, _len, _node;
    switch (type) {
      case 'var':
        nodes = this.varNodes;
        break;
      case 'block':
        nodes = this.blockNodes;
        break;
      case 'veil':
        nodes = this.veilNodes;
        break;
      case 'remove':
        nodes = this.removeNodes;
        break;
      case 'remove-if':
        nodes = this.removeIfNodes;
        break;
      case 'insert_before':
        nodes = this.insertBeforeNodes;
        break;
      case 'append':
        nodes = this.appendNodes;
        break;
      default:
        throw new TypeError('unknown type');
    }
    exists = false;
    for (_i = 0, _len = nodes.length; _i < _len; _i++) {
      _node = nodes[_i];
      if (_node === node) {
        exists = true;
        break;
      }
    }
    if (!exists) {
      return nodes.push(node);
    }
  };

  Template.prototype.reset = function() {
    var doc;
    if (!this.resetable) {
      throw new Error('this template not allow to reset');
    }
    doc = this.replica.cloneNode(true);
    if (this.doc.parentNode != null) {
      this.doc.parentNode.insertBefore(doc, this.doc);
      this.doc.parentNode.removeChild(this.doc);
    } else if ((this.insertBefore != null) && (this.insertBefore.parentNode != null)) {
      this.insertBefore.parentNode.insertBefore(doc, this.insertBefore);
    } else if ((this.parentNode != null) && (this.parentNode.parentNode != null)) {
      this.parentNode.appendChild(doc);
    } else {
      alert('error');
      throw new Error('this template can not reset');
    }
    return this.doc = doc;
  };

  Template.prototype.load = function(data, namespace) {
    if (namespace == null) {
      namespace = null;
    }
    if (!(data != null)) {
      throw new TypeError('data must not be null');
    }
    this.ns = namespace;
    if ("[object String]" === Object.prototype.toString.call(this.ns)) {
      if (0 === this.ns.length) {
        throw new TypeError('namespace must not be empty');
      }
    }
    this.varsStack = [];
    return this.template(this.doc, data);
  };

  Template.prototype.close = function() {
    var a, b, div, html, node, parent, res, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _len5, _len6, _len7, _m, _n, _o, _p, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7;
    _ref = this.valueNodes;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      node = _ref[_i];
      node.nodeValue = node.nodeValue.replace(/\$\{[^}]*\}/g, '');
    }
    _ref1 = this.appendNodes;
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      node = _ref1[_j];
      if ((html = node.getAttribute(this.append)) && html !== '') {
        div = node.ownerDocument.createElement('div');
        div.innerHTML = html;
        while (div.childNodes[0] != null) {
          node.appendChild(div.childNodes[0]);
        }
        div = null;
        node.removeAttribute(this.append);
      }
    }
    _ref2 = this.insertBeforeNodes;
    for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
      node = _ref2[_k];
      if ((html = node.getAttribute(this.insertBefore))) {
        div = node.ownerDocument.createElement('div');
        div.innerHTML = html;
        while (div.childNodes[0] != null) {
          node.parentNode.insertBefore(child, node);
        }
        div = null;
        node.removeAttribute(this.insertBefore);
      }
    }
    _ref3 = this.blockNodes;
    for (_l = 0, _len3 = _ref3.length; _l < _len3; _l++) {
      node = _ref3[_l];
      if (node.getAttributeNode(this.block) != null) {
        node.parentNode.removeChild(node);
      }
    }
    _ref4 = this.varNodes;
    for (_m = 0, _len4 = _ref4.length; _m < _len4; _m++) {
      node = _ref4[_m];
      parent = node;
      while (parent.parentNode != null) {
        parent.removeAttribute(this.veil);
        if (parent === this.doc) {
          break;
        }
        parent = parent.parentNode;
      }
    }
    _ref5 = this.veilNodes;
    for (_n = 0, _len5 = _ref5.length; _n < _len5; _n++) {
      node = _ref5[_n];
      if (node.getAttributeNode(this.veil) != null) {
        node.parentNode.removeChild(node);
      }
    }
    _ref6 = this.removeIfNodes;
    for (_o = 0, _len6 = _ref6.length; _o < _len6; _o++) {
      node = _ref6[_o];
      a = node.getAttribute(this.removeIf) || '';
      node.removeAttribute(this.removeIf);
      res = node.getAttributeNode(this.removeEmpty) != null ? (b = node.getAttribute(this.removeEmpty) || '', node.removeAttribute(this.removeEmpty), a.length === 0) : node.getAttributeNode(this.removeNotEmpty) != null ? (b = node.getAttribute(this.removeNotEmpty) || '', node.removeAttribute(this.removeNotEmpty), a.length > 0) : node.getAttributeNode(this.removeEqual) != null ? (b = node.getAttribute(this.removeEqual) || '', node.removeAttribute(this.removeEqual), a === b) : node.getAttributeNode(this.removeNotEqual) != null ? (b = node.getAttribute(this.removeNotEqual) || '', node.removeAttribute(this.removeNotEqual), a !== b) : node.getAttributeNode(this.removeContain) != null ? (b = node.getAttribute(this.removeContain) || '', node.removeAttribute(this.removeContain), a.indexOf(b) >= 0) : node.getAttributeNode(this.removeNotContain) != null ? (b = node.getAttribute(this.removeNotContain) || '', node.removeAttribute(this.removeNotContain), a.indexOf(b) <= -1) : node.getAttributeNode(this.removeStartWith) != null ? (b = node.getAttribute(this.removeStartWith) || '', node.removeAttribute(this.removeStartWith), a.indexOf(b) === 0) : node.getAttributeNode(this.removeNotStartWith) != null ? (b = node.getAttribute(this.removeNotStartWith) || '', node.removeAttribute(this.removeNotStartWith), a.indexOf(b) !== 0) : node.getAttributeNode(this.removeEndWith) != null ? (b = node.getAttribute(this.removeEndWith) || '', node.removeAttribute(this.removeEndWith), res = a.lastIndexOf(b), res >= 0 && a.length - b.length === a.lastIndexOf(b)) : node.getAttributeNode(this.removeNotEndWith) != null ? (b = node.getAttribute(this.removeNotEndWith) || '', node.removeAttribute(this.removeNotEndWith), res = a.lastIndexOf(b), res < 0 || (a.length - b.length) !== a.lastIndexOf(b)) : void 0;
      if (res && (node.parentNode != null)) {
        node.parentNode.removeChild(node);
      }
    }
    _ref7 = this.removeNodes;
    for (_p = 0, _len7 = _ref7.length; _p < _len7; _p++) {
      node = _ref7[_p];
      node.parentNode.removeChild(node);
    }
    this.init_track();
    return this.nextSibling = this.doc.nextSibling;
  };

  Template.prototype.template = function(doc, data, previous_vars) {
    var attr, blockname, blocks, child, data_blocks, data_vars, datas, i, job, jobAdded, key, kipple, match, matches, newVars, node, nodes, parentVars, re, stack, tpl, value, varname, varnames, vars, _i, _j, _k, _l, _len, _len1, _len10, _len2, _len3, _len4, _len5, _len6, _len7, _len8, _len9, _m, _n, _o, _p, _q, _r, _ref, _ref1, _ref2, _ref3, _ref4, _s, _t;
    vars = {};
    blocks = {};
    stack = [];
    stack.push({
      node: doc,
      i: 0
    });
    while (stack[0] != null) {
      jobAdded = false;
      job = stack.pop();
      while (job.node.childNodes[job.i] != null) {
        child = job.node.childNodes[job.i];
        switch (child.nodeType) {
          case 3:
            if (matches = child.nodeValue.match(/\$\{[^}]+\}/g)) {
              for (_i = 0, _len = matches.length; _i < _len; _i++) {
                match = matches[_i];
                if (!(vars[match] != null)) {
                  vars[match] = [];
                }
                vars[match].push(child);
                this.valueNodes.push(child);
              }
            }
            break;
          case 1:
            if (child.getAttributeNode(this.veil) != null) {
              this.track_node(child, 'veil');
            }
            if (child.getAttributeNode(this.remove) != null) {
              this.track_node(child, 'remove');
            }
            if (child.getAttributeNode(this.removeIf) != null) {
              this.track_node(child, 'remove-if');
            }
            if (child.getAttributeNode(this.insertBefore) != null) {
              this.track_node(child, 'insert_before');
            }
            if (child.getAttributeNode(this.append) != null) {
              this.track_node(child, 'append');
            }
            blockname = child.getAttribute('data-tpl-block');
            if ((blockname != null) && '' !== blockname.length) {
              if (!(blocks[blockname] != null)) {
                blocks[blockname] = [];
              }
              blocks[blockname].push(child);
              this.track_node(child, 'block');
            } else {
              _ref = child.attributes;
              for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
                attr = _ref[_j];
                if (matches = ("" + attr.nodeValue).match(/\$\{[^}]+\}/g)) {
                  for (_k = 0, _len2 = matches.length; _k < _len2; _k++) {
                    match = matches[_k];
                    if (!(vars[match] != null)) {
                      vars[match] = [];
                    }
                    vars[match].push(attr);
                    this.valueNodes.push(attr);
                  }
                }
              }
              jobAdded = (_ref1 = 1 <= child.childNodes.length) != null ? _ref1 : {
                "true": false
              };
              if (jobAdded) {
                job.i++;
                stack.push(job);
                stack.push({
                  node: child,
                  i: 0
                });
                break;
              }
            }
        }
        if (jobAdded) {
          break;
        }
        job.i++;
      }
    }
    _ref2 = doc.attributes;
    for (_l = 0, _len3 = _ref2.length; _l < _len3; _l++) {
      attr = _ref2[_l];
      if (matches = ("" + attr.nodeValue).match(/\$\{[^}]+\}/g)) {
        for (_m = 0, _len4 = matches.length; _m < _len4; _m++) {
          match = matches[_m];
          if (!(vars[match] != null)) {
            vars[match] = [];
          }
          vars[match].push(attr);
          this.valueNodes.push(attr);
        }
      }
    }
    if (doc.getAttributeNode(this.veil) != null) {
      this.track_node(doc, 'veil');
    }
    if (doc.getAttributeNode(this.remove) != null) {
      this.track_node(doc, 'remove');
    }
    if (doc.getAttributeNode(this.removeIf) != null) {
      this.track_node(doc, 'remove-if');
    }
    if (doc.getAttributeNode(this.insertBefore) != null) {
      this.track_node(doc, 'insert_before');
    }
    if (doc.getAttributeNode(this.append) != null) {
      this.track_node(doc, 'append');
    }
    data_vars = {};
    data_blocks = {};
    for (key in data) {
      value = data[key];
      switch (Object.prototype.toString.call(value)) {
        case '[object Array]':
          data_blocks[key] = value;
          break;
        case '[object Number]':
        case '[object String]':
        case '[object Boolean]':
        case '[object Null]':
        case '[object Undefined]':
          data_vars[key] = value;
          break;
        default:
          data_blocks[key] = [value];
      }
    }
    newVars = {};
    i = 1;
    _ref3 = this.varsStack.reverse();
    for (_n = 0, _len5 = _ref3.length; _n < _len5; _n++) {
      parentVars = _ref3[_n];
      for (key in parentVars) {
        value = parentVars[key];
        for (kipple = _o = 0; 0 <= i ? _o <= i : _o >= i; kipple = 0 <= i ? ++_o : --_o) {
          key = "@" + key;
        }
        newVars[key] = value;
      }
      i += 1;
    }
    this.varsStack.reverse();
    _ref4 = this.varsStack;
    for (_p = 0, _len6 = _ref4.length; _p < _len6; _p++) {
      parentVars = _ref4[_p];
      for (key in parentVars) {
        value = parentVars[key];
        newVars[key] = value;
      }
    }
    for (key in data_vars) {
      value = data_vars[key];
      newVars[key] = value;
      newVars["@" + key] = value;
    }
    if (previous_vars != null) {
      for (key in previous_vars) {
        value = previous_vars[key];
        newVars["#" + key] = value;
      }
    }
    for (varname in newVars) {
      data = newVars[varname];
      varnames = [varname];
      if (this.ns != null) {
        varnames.push("" + this.ns + ":" + varname);
      }
      for (_q = 0, _len7 = varnames.length; _q < _len7; _q++) {
        varname = varnames[_q];
        if (nodes = vars["${" + varname + "}"]) {
          varname = '\\$\\{' + varname + '\\}';
          for (_r = 0, _len8 = nodes.length; _r < _len8; _r++) {
            node = nodes[_r];
            re = new RegExp(varname, 'g');
            node.nodeValue = node.nodeValue.replace(re, data);
            if (node.nodeType === 2) {
              this.track_node(node.ownerElement, 'var');
            }
            if (node.nodeType === 3) {
              this.track_node(node.parentNode, 'var');
            }
          }
        }
      }
    }
    for (blockname in data_blocks) {
      datas = data_blocks[blockname];
      if (nodes = blocks[blockname]) {
        for (_s = 0, _len9 = nodes.length; _s < _len9; _s++) {
          node = nodes[_s];
          previous_vars = null;
          for (i = _t = 0, _len10 = datas.length; _t < _len10; i = ++_t) {
            data = datas[i];
            tpl = node.cloneNode(true);
            data_vars['_i'] = i;
            this.varsStack.push(data_vars);
            previous_vars = this.template(tpl, data, previous_vars);
            this.varsStack.pop();
            tpl.removeAttribute('data-tpl-block');
            node.parentNode.insertBefore(tpl, node);
          }
        }
      }
    }
    return data_vars;
  };

  return Template;

})();
