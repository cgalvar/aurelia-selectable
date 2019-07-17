import { EventAggregator } from "aurelia-event-aggregator";
import { autoinject } from "aurelia-framework";

@autoinject
export class SelectableHelper {
    
    constructor(private events:EventAggregator) {
        
    }

    clearGroup(groupName:string) {
        let eventName = `selectable.clear-group.${groupName}`;
        this.events.publish(eventName);
    }

}
