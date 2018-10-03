

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

    this.resizeCWidth();
    this.resizeCHeight();
    this.bindEvents();
    this.drawFunc();
  }
  bindEvents(){
    var self = this;
    this.input.addEventListener('keyup', function(e){
      if( e.key != 'ArrowRight'
       && e.key != 'ArrowLeft'
       && e.key != 'ArrowUp'
       && e.key != 'ArrowRight'
       && e.key != ' '
      ){
        self.drawFunc();
      }
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
    var ratio = this.c.height / size;
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
  resizeCWidth(){
    this.c.width = window.innerWidth;
    this.ctx = this.c.getContext('2d');
  }
  resizeCHeight(){
    this.c.height = window.innerHeight - this.input.offsetHeight;
    this.ctx = this.c.getContext('2d');
  }
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
  displayDict(){
    var dictEl = document.createElement('ul');
    dictEl.classList.add('func-dict');
    for (var i = 0; i < this.dict.length; i++) {
      var term = this.dict[i];
      var el = document.createElement('li');
      el.innerHTML = '<strong>'+ term.value+'</strong>';
      if(  term.desc ) el.innerHTML += '<p>'+ term.desc+'</p>';
      dictEl.appendChild(el);
    }
    this.input.parentNode.appendChild(dictEl);
  }

}

const DEFAULT_DICT = [
  {value: 'abs(', addBefore: 'Math.', desc: "Retourne la valeur absolue d'un nombre."},
  {value: 'acos(', addBefore: 'Math.', desc: "Retourne l'arc cosinus d'un nombre."},
  {value: 'acosh(', addBefore: 'Math.', desc: "Retourne l'arc cosinus hyperbolique d'un nombre."},
  {value: 'asin(', addBefore: 'Math.', desc: "Retourne l'arc sinus d'un nombre."},
  {value: 'asinh(', addBefore: 'Math.', desc: "Retourne l'arc sinus hyperbolique d'un nombre."},
  {value: 'atan(', addBefore: 'Math.', desc: "Retourne l'arc tangente d'un nombre."},
  {value: 'atanh(', addBefore: 'Math.', desc: "Retourne l'arc tangente hyperbolique d'un nombre"},
  {value: 'atan2(, ', addBefore: 'Math.', desc: "Retourne l'arc tangente du quotient de ses arguments."},
  {value: 'cbrt(', addBefore: 'Math.', desc: "Renvoie la racine cubique d'un nombre."},
  {value: 'ceil(', addBefore: 'Math.', desc: "Retourne le plus petit entier supérieur ou égal à la valeur passée en paramètre."},
  {value: 'clz32(', addBefore: 'Math.', desc: "Renvoie le nombre de zéros qui préfixent un entier sur 32 bits."},
  {value: 'cos(', addBefore: 'Math.', desc: "Retourne le cosinus d'un nombre."},
  {value: 'cosh(', addBefore: 'Math.', desc: "Renvoie le cosinus hyperbolique d'un nombre."},
  {value: 'exp(', addBefore: 'Math.', desc: "Renvoie l'exponentielle d'un nombre (soit Enombre) avec E la constante d\'Euler (2,718...)."},
  {value: 'expm1(', addBefore: 'Math.', desc: "Renvoie le résultat de 1 moins l'exponentielle d'un nombre."},
  {value: 'floor(', addBefore: 'Math.', desc: "Retourne le plus grand entier inférieur ou égal à la valeur passée en paramètre."},
  {value: 'fround(', addBefore: 'Math.', desc: "Renvoie le nombre flottant exprimé sur 32 bits le plus proche de l'argument."},
  {value: 'imul(x, ', addBefore: 'Math.', desc: "Retourne le résultat de la multiplication d'entiers sur 32 bits."},
  {value: 'log(', addBefore: 'Math.', desc: "Retourne le logarithme naturel (loge) d'un nombre."},
  {value: 'log1p(', addBefore: 'Math.', desc: "Retourne le logarithme naturel de 1 + un nombre."},
  {value: 'log10(', addBefore: 'Math.', desc: "Retourne le logarithme en base 10 d'un nombre."},
  {value: 'log2(', addBefore: 'Math.', desc: "Retourne le logarithme en base 2 d'un nombre."},
  {value: 'pow(', addBefore: 'Math.', desc: "Retourne le calcul de x à la puissance y (x correspond à la base et y à l'exposant)."},
  {value: 'random', addBefore: 'Math.', desc: "Retourne un nombre pseudo-aléatoire compris entre 0 (inclus) et 1 (exclu)."},
  {value: 'round(', addBefore: 'Math.', desc: "Retourne l'arrondi d'un nombre."},
  {value: 'sign(', addBefore: 'Math.', desc: "Retourne le signe d'un nombre, indiquant s'il est positif, négatif ou égal à zéro."},
  {value: 'sin(', addBefore: 'Math.', desc: "Retourne le sinus d'un nombre."},
  {value: 'sinh(', addBefore: 'Math.', desc: "Retourne le sinus hyperbolique d'un nombre."},
  {value: 'sqrt(', addBefore: 'Math.', desc: "Retourne la racine carrée d'un nombre."},
  {value: 'tan(', addBefore: 'Math.', desc: "Retourne la tangente d'un nombre."},
  {value: 'tanh(', addBefore: 'Math.', desc: "Retourne la tangente hyperbolique d'un nombre"},
  {value: 'toSource(', addBefore: 'Math.', desc: "Renvoie la chaîne de caractères \"Math\"."},
  {value: 'trunc(', addBefore: 'Math.', desc: "Retourne la partie entière d'un nombre (la partie décimale est retirée)."},


  { value: 'pi',  replace: 'PI' , desc: "Le nombre Pi"},
  { value: 'PI',  addBefore: 'Math.' , desc: "Le nombre Pi"},
];
const DEFAULT_COLORS = {
  clear: '#272727',
  draw: '#ffffff',
}
