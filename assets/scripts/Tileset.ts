
import { _decorator, Component, Node, Button, EventHandler, math, Label, random, randomRangeInt, tween, Quat, Vec3 } from 'cc';
import { Math1 } from './Math1';
import { Helper } from './Helper';
import { Frame } from './Frame';
const { ccclass, property } = _decorator;

@ccclass('Tileset')
export class Tileset extends Component {
    private tileCount: number = 1
    private reverced: boolean = false
    private math1: Math1
    private countTo: number = 0
    init(Math1: Math1, reversed: boolean){
        this.math1 = Math1
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
        Helper.resetClickEvent(button.getComponent(Button), "checkCallback")
        if(Number(customEventData) == this.tileCount){
            Frame.Instance.zebraNod()
            if(this.reverced)
                this.tileCount--
            else
                this.tileCount++
            this.math1.setTile(Number(customEventData))
            
            let number = this.math1.getNumber(this.tileCount-2)
            let label = button.children[0]
            let pos = new Vec3(label.worldPosition)
            label.parent = number
            label.worldPosition = pos

            tween(label)
            .to(0.5, {position: new Vec3(0,0,0)})
            .to(0.1, {scale: new Vec3(0,0,0)})
            .start()

            tween(button)
            .to(0.5, {scale: new Vec3(0,0,0)})
            .start()

            console.log(this.tileCount);
            if(this.tileCount == 0 && this.reverced){
                this.math1.setWin()
            }
            if(this.tileCount == this.countTo && !this.reverced){
                this.math1.setWin()
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


