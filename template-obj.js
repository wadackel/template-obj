/*!
 * template-obj
 * 
 * @version 0.0.1
 * @license MIT
 * @author tsuyoshiwada
 * @url https://github.com/tsuyoshiwada/template-obj
 */
(function(){
  "use strict";

  var root = this,
      objectPrototype = Object.prototype;


  function hasProp(obj, key){
    return objectPrototype.hasOwnProperty.call(obj, key);
  }


  function isArray(val){
    return objectPrototype.toString.call(val) === "[object Array]";
  }


  function isObject(obj){
    var type = typeof obj;
    return type === "function" || type === "object" && !!obj && !isArray(obj);
  }


  function clone(obj){
    var _isArray = isArray(obj),
        _isObject = isObject(obj);
    if( !_isArray && !_isObject ) return undefined;
    var result = _isArray ? [] : {}, key, val;
    for( key in obj ){
      if( !hasProp(obj, key) ) continue;
      val = obj[key];
      if( isArray(val) || isObject(val) ) val = clone(val);
      result[key] = val;
    }
    return result;
  }


  function each(obj, iterate, context){
    if( obj === null ) return obj;
    context = context || obj;
    if( isObject(obj) ){
      for( var key in obj ){
        if( !hasProp(obj, key) ) continue;
        if( iterate.call(context, obj[key], key) === false ) break;
      }
    }else if( isArray(obj) ){
      var i, length = obj.length;
      for( i = 0; i < length; i++ ){
        if( iterate.call(context, obj[i], i) === false ) break;
      }
    }
    return obj;
  }


  function getObjValue(obj, key){
    if( hasProp(obj, key) ) return obj[key];

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
    var val;
    return str.replace(/\$\{(.*?)\}/g, function(all, key){
      val = getObjValue(values, key);
      return val != null ? val : all;
    });
  }


  function templateObj(obj, rootObj){
    var results = clone(obj);
    
    rootObj = isObject(rootObj) ? rootObj : results;

    each(results, function(val, key){
      if( isObject(val) ){
        results[key] = templateObj(val, rootObj);
      }else{
        results[key] = template(val, rootObj);
      }
    });

    return results;
  }


  // export modules
  if( typeof module === "object" && typeof module.exports === "object" ){
    module.exports = templateObj;

  /*global define */
  }else if( typeof define === "function" && define.amd ){
    define("template-obj", templateObj);

  }else{
    root.templateObj = templateObj;
  }

}.call(this));