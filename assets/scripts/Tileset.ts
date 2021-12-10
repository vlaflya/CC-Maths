
import { _decorator, Component, Node, Button, EventHandler, math, Label, random, randomRangeInt } from 'cc';
import { Math1 } from './Math1';
import { Helper } from './Helper';
const { ccclass, property } = _decorator;

@ccclass('Tileset')
export class Tileset extends Component {
    private tileCount: number = 1
    private countAdd = 1
    private Math: Math1
    init(Math1: Math1, reversed){
        this.Math = Math1
        if(reversed){
            this.tileCount = this.node.children.length
            this.countAdd = -1
        }
        let array: Array<number> = []
        for(let i = 0; i < this.node.children.length; i++){
            array.push(i)
            array = Helper.shuffleArray(array)
        }
        this.node.children.forEach(child => {
            let button = child.getComponent(Button)
            let label = button.node.children[0].getComponent(Label)
            let sp:number = array.pop()
            let st = (sp + 1).toString()
            label.string = st
            Helper.setClickEvent(this.node, button, "Tileset", "callback", sp+1)
        });
    }
    
    callback(event, customEventData){
        console.log(Number(customEventData));
        if(Number(customEventData) == this.tileCount){
            let button: Node = event.target
            this.tileCount += this.countAdd
            button.destroy()
            if(this.tileCount == 0){
                this.Math.setWin()
            }
        }
    }
    
}


