const DEFAULT_DICT = [
  { value: 'sin(', addBefore: 'Math.' },
  { value: 'cos(', addBefore: 'Math.' },
  { value: 'tan(', addBefore: 'Math.' },

  { value: 'pi',  replace: 'PI' },
  { value: 'PI',  addBefore: 'Math.' },
];
const DEFAULT_COLORS = {
  clear: '#272727',
  draw: '#ffffff',
}

function replaceAll(target, search, replacement){
  return target.split(search).join(replacement);
}

class FuncDisp{
  constructor(canvasId, inputId){
    this.dict = DEFAULT_DICT;
    this.colors = DEFAULT_COLORS;

    this.c = document.getElementById(canvasId);
    this.input = document.getElementById(inputId);

    this.allowedTags = 'x0123456789+-*/() ';

    this.allowDict();

    this.init();

  }


  get func(){
    if(! this.isInputAllowed( this.input.value ) ) return null;
    var inputFuncValue = this.getConvertedInputFunc(this.input.value, 1);
    if(!eval( inputFuncValue )) return null;
    var func =  eval( inputFuncValue );
    if( func ) return this.getConvertedInputFunc(this.input.value);
    else return null;
  }

  isInputAllowed(func){
    var str = func;
      for (var i = 0; i <= this.allowedTags.length; i++) {
        var allowed = this.allowedTags[i];
        str = replaceAll(str, allowed, '');
        console.log(str);
      }

      if( ! str.length ) return true;
      return false;
  }

  getConvertedInputFunc(func, x){
    var x = x || false;
    if( !func ) return false;
    func += '';
    for (var i = 0; i < this.dict.length; i++) {
      var term = this.dict[i];

      if( term.addBefore ) {
        func = replaceAll( func, term.value, term.addBefore + term.value );
      }
    }

    if( x ) func = replaceAll(func, 'x', x);

    return func;
  }

  getFunc(x){
    return eval( this.currFunc.replace('x', x) );
  }


  init(attr){
    var attr = attr || {};
    if(attr.canvasId) this.c = document.getElementById(attr.canvasId);
    if(attr.inputId) this.input = document.getElementById(attr.inputId);

    this.ctx = this.c.getContext('2d');

    this.attr = attr || this.attr || {};

    this.minX = this.attr.minX || this.minX || -10;
    this.maxX = this.attr.maxX || this.maxX ||  10;
    this.minY = this.attr.minY || this.minY || -10;
    this.maxY = this.attr.maxY || this.maxY ||  10;

    this.bindEvents();
    this.drawFunc();
  }
  bindEvents(){
    var self = this;
    this.input.addEventListener('keyup', function(e){
      // if( e.key == 'Enter' ){
        self.drawFunc();
      // }
    });

  }

  getX(cx){
    var size = this.maxX - this.minX;
    var ratio = size / this.c.width;
    var ratioX = cx * ratio + this.minX;
    return ratioX;
  }
  getCy(y){
    var size = this.maxY - this.minY;
    var ratio = this.c.width / size;
    var ratioY = ( y + this.minY ) * ratio;
    return ratioY;
  }
  drawFunc(){
    this.currFunc = this.func;
    if( this.currFunc === null ) return false;
    this.clearCtx();
    for (var cx = 0; cx < this.c.width; cx++) {

      var x = this.getX(cx);

      var y = this.getFunc(x);

      var cy = this.getCy(y);
      this.drawPixel(cx, -cy);

    }

  }

  //CTX
  clearCtx(){
    this.ctx.fillStyle = this.colors.clear || '#272727';
    this.ctx.globalAlpha = 0.5;
    this.ctx.fillRect( 0, 0, this.c.width, this.c.height );
    this.ctx.globalAlpha = 1;
  }
  drawPixel(x, y){
    this.ctx.fillStyle = this.colors.draw;
    this.ctx.fillRect(x, y, 1, 1);
  }
  //  drawTrace(){}

  allowDict(){
    var alloweds = this.allowedTags.split('');
    this.allowedTags = [];
    for (var i = 0; i < this.dict.length; i++) {
      var term = this.dict[i];
      this.allowedTags.push(term.value);
    }
    this.allowedTags = this.allowedTags.concat(alloweds);
  }


}
