import { bindable, autoinject } from "aurelia-framework";
import { EventAggregator, Subscription } from "aurelia-event-aggregator";

@autoinject
export class SelectableCustomAttribute {


    @bindable
    groupName:string;

    @bindable
    onSelect:Function;

    @bindable
    onDiselect: Function;

    canBeSelected: boolean | Function;
    isSelected: boolean;

    // time to long press in seconds
    @bindable longPressTime: number = 0.5;
    eventSubscription: Subscription;

    constructor(private element:Element, private events:EventAggregator){
        this.listenEvents();
    }

    listenEvents(){
        let isSelecting = false;
        // prevenimos que se despliegue el menu contextual
        // on click derecho seleccionamos
        this.element.addEventListener('contextmenu', e=>{
            console.log('evento contextmenu');
            isSelecting = false;
            this.run();
            e.preventDefault();
            return false;
        });
    
        // Long Click

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
        
        let timeOutId;

          this.element.addEventListener(startEvent, e=>{
            isSelecting = true;
            timeOutId = setTimeout(() => {
                if (isSelecting) {
                    this.run();
                    isSelecting = false;
                }
            }, this.longPressTime * 1000);
    
          });

          this.element.addEventListener(finishEvent, e=>{
              
              if (isSelecting) {
                  console.log('clear isSelecting');
                  isSelecting = false;
                  clearTimeout(timeOutId);
                  
              }


          })
    
    }

    longClick(){
        
       
    }

    async run(){
        debugger;
        if(this.isSelected){
            this.diselect();
        }

        else{
            let result = await this.evalCondition();
            
            if (result){
                this.select();
            }

        }



    }

    select(){
        this.onSelect();
        this.isSelected = true;
        this.selectedStyle();
        if (this.groupName) {
            let eventName = `selectable.${this.groupName}.select`;
            this.events.publish(eventName);
            this.eventSubscription = this.events.subscribeOnce(eventName, ()=>{
                debugger;
                this.diselect();
            })
        }
    }

    diselect(){
        this.onDiselect();
        this.isSelected = false;
        this.diselectedStyle();
        this.eventSubscription.dispose();
    }

    selectedStyle(){

        //@ts-ignore
        this.element.style.outline = '1px solid gray';

    }

    diselectedStyle(){

        //@ts-ignore
        this.element.style.outline = 'none';

    }

    async evalCondition(){
        // si es falso no hacer nada
        if (this.canBeSelected === true || this.canBeSelected === undefined) {
            return true;
        }

        // si es una funcion, ejecuta y evalua el resultado
        else if (typeof this.canBeSelected === 'function') {
             let result = this.canBeSelected();

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