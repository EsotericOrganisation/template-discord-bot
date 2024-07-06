import { Event } from "./Event.js";

export interface ProcessEvent extends Event {
    readonly name: NodeJS.Signals;
}