const DEFAULT_DICT = {
  'sin(' : { addBefore : 'Math.' },
  'cos(' : { addBefore : 'Math.' },


}

class FuncDisp{
  constructor(canvasId, inputId){
    this.c = document.getElementById(canvasId);
    this.input = document.getElementById(inputId);
    this.init();
    this.dict = {};

  }

  get func(){
    var inputFuncValue = this.getConvertedInputFunc(this.input.value).replace('x', '1');
    var func =  eval( inputFuncValue );
    if(func) return this.getConvertedInputFunc(this.input.value);
    else return 'no input func';
  }
  getFunc(x){
    return ;
  }
  getConvertedInputFunc(func, x){


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

  }



}
