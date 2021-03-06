
import { _decorator, Component, Node, Button, EventHandler, sp } from 'cc';
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

    public static resetClickEvent(button: Button, name: string){
        for(let i = 0; i < button.clickEvents.length; i++){
            let eventName = button.clickEvents[i].handler
            if(eventName == name){
                button.clickEvents.splice(i);
            }
        }
    }

    public static addClickEvent(target: Node, button: Button, component: string, callback: string, eventData: any){
        let clickEvent = new EventHandler()
        clickEvent.target = target
        clickEvent.component = component
        clickEvent.handler = callback
        clickEvent.customEventData = eventData.toString()
        button.clickEvents.push(clickEvent)
    }
}

export function setMixedSkin(skeleton: sp.Skeleton, name: string, skinNames: string[]) {
    
    var defaultSkin = skeleton._skeleton.data.skins[0];
    let skinProto = Object.getPrototypeOf(defaultSkin);
    let mixedSkin = Object.create(skinProto);
    mixedSkin.name = name;
    mixedSkin.attachments = new Array();
    mixedSkin.bones = Array();
    mixedSkin.constraints = new Array();
    for(let skinName of skinNames) {
        let skin = skeleton._skeleton.data.findSkin(skinName);
        mixedSkin.addSkin(skin);
    }

    skeleton._skeleton.setSkin();
    skeleton._skeleton.setSkin(mixedSkin);
}
