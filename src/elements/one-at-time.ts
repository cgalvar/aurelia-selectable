import { inject } from "aurelia-framework";
import { EventAggregator } from "aurelia-event-aggregator";

@inject(EventAggregator)
export class OneAtTime{
	subscription: any;
	events: any;
	currentId: any;


	/**
	 * Creates an instance of OneAtTime.
	 * @param {EventAggregator} EventAggregator 
	 * @memberof OneAtTime
	 */
	constructor(EventAggregator){
		this.events = EventAggregator;
		this.currentId = undefined;
	}

	init(){
		this.subscription = this.events.subscribe('selectable.selected', (id)=>{
			if(this.currentId !== undefined && this.currentId !== id){
				this.diselect(this.currentId);
			}

			this.currentId = id;

		})
	}

	diselect(id){
		this.events.publish('selectable.diselect' + id, true);
	}

	stop(){
		this.subscription.dispose();
	}

}