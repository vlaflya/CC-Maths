
import { _decorator, Component, Node, Button, EventHandler, math, Label, random, randomRangeInt, tween, Quat, Vec3 } from 'cc';
import { Math1 } from './Math1';
import { Helper } from './Helper';
import { Frame } from './Frame';
const { ccclass, property } = _decorator;

@ccclass('Tileset')
export class Tileset extends Component {
    private tileCount: number = 1
    private reverced: boolean = false
    private Math: Math1
    private countTo: number = 0
    init(Math1: Math1, reversed: boolean){
        this.Math = Math1
        if(reversed){
            this.tileCount = this.node.children.length
            this.reverced = true
        }
        this.countTo = this.node.children.length + 1
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
            Helper.addClickEvent(this.node, button, "Tileset", "callback", sp+1)
        });
    }
    
    callback(event, customEventData){
        let button: Node = event.target
        if(Number(customEventData) == this.tileCount){
            Frame.Instance.zebraNod()
            if(this.reverced)
                this.tileCount--
            else
                this.tileCount++
            this.Math.setTile(Number(customEventData))
            button.destroy()
            console.log(this.tileCount);
            if(this.tileCount == 0 && this.reverced){
                this.Math.setWin()
            }
            if(this.tileCount == this.countTo && !this.reverced){
                this.Math.setWin()
            }
            return
        }
        Frame.Instance.zebraWrong()
        tween(button)
        .to(0.05, {eulerAngles: new Vec3(0,0,10)})
        .to(0.05, {eulerAngles: new Vec3(0,0,-10)})
        .to(0.1, {eulerAngles: new Vec3(0,0,0)})
        .start()
    }
}


