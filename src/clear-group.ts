import { EventAggregator } from "aurelia-event-aggregator";

export class selectableHelper {
    
    constructor(private events:EventAggregator) {
        
    }

    clearGroup(groupName:string) {
        this.events.publish(`selectable.clear-group.${groupName}`);
    }

}
