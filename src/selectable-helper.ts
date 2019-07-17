import { EventAggregator } from "aurelia-event-aggregator";
import { autoinject } from "aurelia-framework";

@autoinject
export class SelectableHelper {
    
    constructor(private events:EventAggregator) {
        
    }

    clearGroup(groupName:string) {
        this.events.publish(`selectable.clear-group.${groupName}`);
    }

}
