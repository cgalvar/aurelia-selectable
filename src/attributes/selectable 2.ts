import {bindable, autoinject} from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';


/**
 * 
 * 
 * @export
 * @class SelectableCustomAttribute
 */
@autoinject
export class SelectableCustomAttribute {

	@bindable oneAtTime;

	@bindable
	condition;

	@bindable
	record;

	@bindable
	eventName;

 	wait = true;
	element: Element;
	events: EventAggregator;
	__isSelected: boolean;
	__isSelecting: boolean;
 
/**
 * Creates an instance of SelectableCustomAttribute.
 * @param {any} element 
 * @param {EventAggregator} EventAggregator 
 * @memberof SelectableCustomAttribute
 */
constructor(element:Element, EventAggregator:EventAggregator) {
	
    this.element = element;
    this.events = EventAggregator;
    this.__isSelected = false;

  }


  bind(){
	
	this.canBeSelectable();
	
  }

  conditionChanged(){
	  this.canBeSelectable();
  }

  canBeSelectable(){
	  if (this.condition === true) {
		  this.listenEvents();
		  this.onClear();
		  this.listenWait();
	  }

	  else if (this.condition === false) {
		  return;
	  }

	  else if (typeof this.condition == 'function') {
		  let result = this.condition(this.record)

		  if (result instanceof Promise) {
			  result.then(confirmation => {
				  if (confirmation) {
					  this.listenEvents();
					  this.onClear();
					  this.listenWait();
				  }
			  })
				  .catch(error => {
					  console.error(error)
				  });
		  }

		  else {
			  if (result) {
				  this.listenEvents();
				  this.onClear();
				  this.listenWait();
			  }
		  }

	  }

	  else {
		  this.listenEvents();
		  this.onClear();
		  this.listenWait();
	  }
  }

  listenEvents(){
	
	this.element.addEventListener('contextmenu', e=>{
		this.select();
		e.preventDefault();
		return false;
	});

	let	isTouchDevice = 'ontouchstart' in window;
	let startEvent, finishEvent;


	if(isTouchDevice){
		startEvent = 'touchstart';
		finishEvent = 'touchend';

		document.addEventListener('touchmove', e=>{
		  this.__isSelecting = false;
  		})

	}

	else{
		startEvent = 'mousedown';
		finishEvent = 'mouseup';
	}

  	this.element.addEventListener(startEvent, e=>{
		
		console.log('seleccionando');
		
		this.__isSelecting = true;

		  if(this.wait){
			this.waitAndselect();
		  }

		  else
		  	this.select();

  	});
  	this.element.addEventListener(finishEvent, e=>{
		  console.log('finlizando');
		  this.__isSelecting = false;

			let eventName = `selectable.${this.eventName ? (this.eventName + '.'):''}mouseup`;

		  this.events.publish(eventName);
  	})

  	let invalids = this.element.querySelectorAll('.selectable-invalid');
  	
  	if (invalids) {
  		for (var i = 0; i < invalids.length; i++) {
  			let invalid = invalids[i];

  			invalid.addEventListener(startEvent, e=>{
  				e.stopPropagation()
  			})

  		}
  	}

  }

  onClear(){
	
	let eventName = `selectable.${this.eventName ? (this.eventName + '.') : ''}clear`;

  	this.events.subscribe(eventName, response=>{
		debugger;  
		this.diselect();
	})
	  
  }

  diselect(){
	  
	this.__isSelected = false;
	//@ts-ignore
	this.element.isSelected = false;
	this.wait = true;
	this.element.classList.remove('selected');
  }



  waitAndselect(){

  	setTimeout(e=>{
		if (this.__isSelecting) {

			this.select();
			

		}

	}, 500);

  }

  select(){
	if (this.__isSelected) {
		this.diselect();
		let eventName = `selectable.${this.eventName ? (this.eventName + '.') : ''}onDiselect`;
		this.events.publish(eventName, this.record)
	}

	else{
		if(this.oneAtTime){
			debugger;
			let name;
			if(this.eventName){
				name = 'selectable.' + this.eventName + '.clear'; 
			}
			else{
				name = 'selectable.clear'; 
			}
			this.events.publish(name, this.record)
		}

		this.element.classList.add('selected');
		this.__isSelected = true;
		//@ts-ignore
		this.element.isSelected = true;

		let eventName = 'selectable.';

		if(this.eventName){
			eventName += this.eventName;
		}
		else{
			eventName += 'onSelect';
		}

		this.events.publish(eventName, this.record)
		
	}
  }

}

