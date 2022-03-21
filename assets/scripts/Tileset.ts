
import { _decorator, Component, Node, Button, EventHandler, math, Label, random, randomRangeInt, tween, Quat, Vec3, instantiate, UITransform, UIOpacity, Tween } from 'cc';
import { Math1 } from './Math1';
import { Helper } from './Helper';
import { Frame } from './Frame';
import { Lamp } from './Lamp';
import { SoundManager } from './SoundManager';
import { Bridge } from './Bridge';
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
        this.blinkFirstPanel(this.tileCount)
    }
    
    callback(event, customEventData){
        if(this.givingHint)
            return
        let button: Node = event.target
        Tween.stopAllByTarget(button)
        Helper.resetClickEvent(button.getComponent(Button), "checkCallback")
        if(Number(customEventData) == this.tileCount){
            this.math1.playRight()
            Frame.Instance.zebraNod()
            if(this.reverced)
                this.tileCount--
            else
                this.tileCount++
            this.math1.setTile(Number(customEventData))
            
            let number = this.math1.getNumber()
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
        this.math1.playWrong()
        Frame.Instance.zebraWrong()
        SoundManager.Instance.playMathWrong()
        tween(button)
        .to(0.05, {eulerAngles: new Vec3(0,0,10)})
        .to(0.05, {eulerAngles: new Vec3(0,0,-10)})
        .to(0.1, {eulerAngles: new Vec3(0,0,0)})
        .start()
    }

    private givingHint = false
    public giveHint(){
        if(this.currentPanel != null){
            Tween.stopAllByTarget(this.currentPanel)
        }
        this.givingHint = true
        this.lightPanel(this.tileCount)
    }

    private lightPanel(count){
        let panel: Node
        
        for(let i = 0; i < this.node.children.length; i++){
            if(this.node.children[i].children.length == 0 || this.node.children[i] == null){
                continue
            }
            if(!this.node.children[i].children[0].getComponent(Label)){
                continue
            }
            if(this.node.children[i].children[0].getComponent(Label).string == count.toString()){
                panel = this.node.children[i]
            }
        }
        if(panel == null)
            return
        let colorBlock = instantiate(this.math1.colorBlock)
        // colorBlock.worldPosition = panel.worldPosition
        let colorTransform = colorBlock.getComponent(UITransform)
        let panelTransform = panel.getComponent(UITransform)
        colorBlock.parent = panel
        colorBlock.position = new Vec3(0,0,0)
        colorTransform.contentSize.set(panelTransform.width, panelTransform.height)
        tween(colorBlock.getComponent(UIOpacity))
        .to(0.4, {opacity: 200})
        .to(0.4, {opacity: 0})
        .start()

        tween(panel)
        .by(0.4, {scale: new Vec3(0.1, 0.1, 0.1)})
        .call(() =>{
            SoundManager.Instance.playIconCount(count, false, true)
        })
        .by(0.4, {scale: new Vec3(-0.1, -0.1, -0.1)})
        .delay(0.1)
        .call(() => {
            colorBlock.destroy()
            if(this.reverced)
                count--
            else
                count++
            if(this.reverced){
                console.log(count);
                if(count == 0){
                    this.givingHint = false
                    Lamp.Instance.callBack()
                }
                else
                    this.lightPanel(count)
                return
            }
            if(!this.reverced){
                if(count == this.countTo){
                    this.givingHint = false
                    Lamp.Instance.callBack()
                }
                else
                    this.lightPanel(count)
                return
            }
        })
        .start()
    }
    private blinkFirstPanel(count){
        if(!this.reverced)
            count = 1
        let panel: Node
        for(let i = 0; i < this.node.children.length; i++){
            if(this.node.children[i].children.length == 0)
                continue
            if(this.node.children[i].children[0].getComponent(Label).string == count.toString()){
                panel = this.node.children[i]
            }
        }
        let colorBlock = instantiate(this.math1.colorBlock)
        let colorTransform = colorBlock.getComponent(UITransform)
        let panelTransform = panel.getComponent(UITransform)
        colorBlock.parent = panel
        colorBlock.position = new Vec3(0,0,0)
        colorTransform.contentSize.set(panelTransform.width, panelTransform.height)
        this.currentPanel = panel
        this.blinkPanel(panel, colorBlock)
    }

    private currentPanel: Node = null
    private blinkPanel(panel: Node, colorBlock: Node){
        tween(colorBlock.getComponent(UIOpacity))
        .to(0.4, {opacity: 150})
        .to(0.4, {opacity: 0})
        .start()

        tween(panel)
        .by(0.4, {scale: new Vec3(0.05, 0.05, 0.05)})
        .by(0.4, {scale: new Vec3(-0.05, -0.05, -0.05)})
        .delay(0.5)
        .call(() => {
            this.blinkPanel(panel, colorBlock)
        })
        .start()
    }
}


