let isNode = (typeof window === 'undefined');

class ObnizUtil {

  constructor(obniz) {
    this.obniz = obniz;
  }

  createCanvasContext(width, height) {
    if (this.obniz.isNode) {
      try {
        const { createCanvas } = require('canvas');
        return createCanvas(this.width, this.height);
        throw new Error();
      } catch(e) {
        throw new Error('obniz.js require node-canvas to draw rich contents. see more detail on docs');
      }
    } else {
      var canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      canvas.style["-webkit-font-smoothing"] = "none";
      var body = document.getElementsByTagName("body")[0];
      body.appendChild(canvas);
      
      var ctx = canvas.getContext("2d");
      return ctx;
    } 
  }
  
  static _keyFilter(params,keys){
    var filterdParams = {};
    if(typeof params !== "object" ){
      return filterdParams;
    }
    filterdParams =  Object.keys(params)
    .filter(key => keys.includes(key))
    .reduce((obj, key) => {
      obj[key] = params[key];
      return obj;
    }, {});
    
    return filterdParams;
  }
  
  /**
   *
   * @return {String} key name of not found. 
   */
  static _requiredKeys(params, keys){
    if(typeof params !== "object" ){
      return keys[0];
    }
    
    for( var index in keys){
        if(!(keys[index] in params )){
            return keys[index];
        }
    }
    return null;
  }
  
  static dataArray2string(data) {
    var string = null;
    try {
          const StringDecoder = require('string_decoder').StringDecoder;
          if(StringDecoder){
             string = new StringDecoder('utf8').write(Buffer.from(data));
          }
       }catch(e) {
        //this.obniz.error(e);
      }
      return string;
  };

  static string2dataArray(str){
      const buf = Buffer(str);
      return [... buf];

  }
}

module.exports = ObnizUtil;