import { bindable, autoinject } from "aurelia-framework";
import { EventAggregator } from "aurelia-event-aggregator";

@autoinject
export class SelectableCustomAttribute {


    @bindable
    groupName:string;

    @bindable
    oneAtTime:string;

    @bindable
    onSelect:Function;

    @bindable
    onDiselect: Function;

    condition: boolean | Function;
    isSelected: boolean;

    constructor(private element:Element, private events:EventAggregator){}

    listenEvents(){
        
        let isSelecting = false;

        // prevenimos que se despliegue el menu contextual
        // on click derecho seleccionamos
        this.element.addEventListener('contextmenu', e=>{
            this.run();
            e.preventDefault();
            return false;
        });
    
        // preparamos los eventos

        let	isTouchDevice = 'ontouchstart' in window;
        let startEvent, finishEvent;
    
        
        if(isTouchDevice){
            startEvent = 'touchstart';
            finishEvent = 'touchend';
            
            // si movio el dedo, no esta intentando seleccionar
            document.addEventListener('touchmove', e=>{
              isSelecting = false;
            })
    
        }
    
        else{
            startEvent = 'mousedown';
            finishEvent = 'mouseup';
        }
    
          this.element.addEventListener(startEvent, e=>{
            
            console.log('seleccionando');
            
            isSelecting = true;
    
          });

          this.element.addEventListener(finishEvent, e=>{
              console.log('finlizando');
              if (isSelecting) {
                  this.run();
              }
          })

    
    }

    async run(){

        let result = await this.evalCondition();
        if (result){
            this.select();
        }

        else{
           this.diselect(); 
        }


    }

    select(){
        this.onSelect();
        this.isSelected = true;
        this.element.classList.add('selectable-selected');
        if (this.oneAtTime) {
            let eventName = `selectable.${this.groupName}.select`;
            this.events.publish(eventName);
            this.events.subscribeOnce(eventName, ()=>{
                this.diselect();
            })
        }
    }

    diselect(){
        this.onDiselect();
        this.isSelected = false;
        this.element.classList.remove('selectable-selected');
    }

    

    async evalCondition(){
        // si es falso no hacer nada
        if (this.condition === true) {
            return true;
        }

        // si es una funcion, ejecuta y evalua el resultado
        else if (typeof this.condition === 'function') {
             let result = this.condition();

             // si es promesa
             if (result instanceof Promise) {
                // true or false 
                result = await result;

             }

             if (result === true) {
                    return true;
             }

             return false;


        }
    }

}