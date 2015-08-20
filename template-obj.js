/*!
 * template-obj
 * 
 * @version 0.0.2
 * @license MIT
 * @author tsuyoshiwada
 * @url https://github.com/tsuyoshiwada/template-obj
 */
(function(root){
  "use strict";

  var OBJECT = "object", STRING = "string", ARRAY = "array", FUNCTION = "function";
  var objectPrototype = Object.prototype;


  function hasProp(obj, key){
    return objectPrototype.hasOwnProperty.call(obj, key);
  }


  function is(type, obj){
    var clas = objectPrototype.toString.call(obj);

    if( type === ARRAY ){
      return clas === "[object Array]";

    }else if( type === OBJECT ){
      clas = typeof obj;
      return clas === FUNCTION || clas === OBJECT && !!obj && !is(ARRAY, obj);

    }else{
      clas = clas.slice(8, -1).toLowerCase();
      return obj !== undefined && obj != null && clas === type;
    }
  }


  function clone(obj){
    var _isArray = is(ARRAY, obj),
        _isObject = is(OBJECT, obj);
    if( !_isArray && !_isObject ) return undefined;
    var result = _isArray ? [] : {}, key, val;
    for( key in obj ){
      if( !hasProp(obj, key) ) continue;
      val = obj[key];
      if( is(ARRAY, val) || is(OBJECT, val) ) val = clone(val);
      result[key] = val;
    }
    return result;
  }


  function each(obj, iterate, context){
    if( obj === null ) return obj;
    context = context || obj;
    if( is(OBJECT, obj) ){
      for( var key in obj ){
        if( !hasProp(obj, key) ) continue;
        if( iterate.call(context, obj[key], key) === false ) break;
      }
    }else if( is(ARRAY, obj) ){
      var i, length = obj.length;
      for( i = 0; i < length; i++ ){
        if( iterate.call(context, obj[i], i) === false ) break;
      }
    }
    return obj;
  }


  function getValue(obj, key){
    if( hasProp(obj, key) ) return obj[key];

    // key[index] => key.index
    key = key.split("[").join(".").split("]").join("");

    var keys = key.split("."),
        results = clone(obj);

    each(keys, function(val){
      if( hasProp(results, val) ){
        results = results[val];
      }else{
        results = null;
        return false;
      }
    });

    return results;
  }


  function template(str, values){
    if( !is(STRING, str) ) return str;
    return str.replace(/\$\{(.*?)\}/g, function(all, key){
      var val = getValue(values, key);
      return val != null ? val : all;
    });
  }


  function templateObj(obj, rootObj){
    var results = clone(obj);
    
    rootObj = is(OBJECT, rootObj) ? rootObj : results;

    each(results, function(val, key){
      if( is(OBJECT, val) ){
        results[key] = templateObj(val, rootObj);
      }else{
        results[key] = template(val, rootObj);
      }
    });

    return results;
  }


  // export modules
  if( typeof module === OBJECT && typeof module.exports === OBJECT ){
    module.exports = templateObj;

  /*global define */
  }else if( typeof define === FUNCTION && define.amd ){
    define("template-obj", templateObj);

  }else{
    root.templateObj = templateObj;
  }

}(this));