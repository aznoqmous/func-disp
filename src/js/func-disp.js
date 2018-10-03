const DEFAULT_DICT = [
  { value: 'sin(', addBefore : 'Math.' },
  { value: 'cos(', addBefore : 'Math.' },
  { value: 'tan(', addBefore : 'Math.' },
];

function replaceAll(target, search, replacement){
  return target.split(search).join(replacement);
}

class FuncDisp{
  constructor(canvasId, inputId){
    this.c = document.getElementById(canvasId);
    this.input = document.getElementById(inputId);
    this.init();
    this.dict = DEFAULT_DICT;

  }

  get func(){
    var inputFuncValue = this.getConvertedInputFunc(this.input.value, 1);
    var func =  eval( inputFuncValue );
    if( func ) return this.getConvertedInputFunc(this.input.value);
    else return 'no input func';
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
    return eval( this.func.replace('x', x) );
  }

  init(){
    this.bindEvents();
  }

  bindEvents(){
    var self = this;
    this.input.addEventListener('keyup', function(e){
      if( e.key == 'Enter' ){
        self.drawFunc();
      }
    });

  }

  drawFunc(){
    console.log(this.func);
    if( this.func == null ) return false;
    var res = this.getFunc(1);
    console.log(res);
  }



}
