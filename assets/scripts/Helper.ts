
import { _decorator, Component, Node, Button, EventHandler } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Helper')
export class Helper{
    public static shuffleArray(array): Array<any> {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array
    }
    public static setClickEvent(target: Node, button: Button, component: string, callback: string, eventData: number){
        let clickEvent = new EventHandler()
        clickEvent.target = target
        clickEvent.component = component
        clickEvent.handler = callback
        clickEvent.customEventData = eventData.toString()
        button.clickEvents[0] = clickEvent
    }
}
