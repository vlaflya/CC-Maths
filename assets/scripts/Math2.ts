
import { _decorator, Component, Node, Button, Prefab, SpriteFrame, instantiate, Sprite, randomRangeInt, Label } from 'cc';
import { Helper } from './Helper';
import { IconsHolder } from './IconsHolder';
import { Math } from './Math';
const { ccclass, property } = _decorator;

@ccclass('Math2')
export class Math2 extends Math {
    @property({type: [Button]}) buttons: Array<Button> = []
    @property({type: [Prefab]}) configurations: Array<Prefab> = []
    @property({type: [SpriteFrame]}) objects: Array<SpriteFrame> = []
    private currentCount: number = 0

    start(){
    }

    public init(json: string){
        let inf: information = JSON.parse(json)
        let count = inf.count
        let name = inf.name
        this.currentCount = count
        IconsHolder.Instance.setIconConfiguration(this.node, count, name)
        this.buttons = Helper.shuffleArray(this.buttons)
        let c: Array<number> = [1,2,3,4,5,6,7,8,9,10]
        let index = c.indexOf(count)
        c.splice(index, 1)
        for(let i = 0; i < this.buttons.length; i++){
            let r: number
            if(i == 0){
                r = count
            }
            else{
                c = Helper.shuffleArray(c)
                r = c.pop()   
            }
            this.buttons[i].node.children[0].getComponent(Label).string = r.toString()
            Helper.setClickEvent(this.node, this.buttons[i],"Math2","callback",r) 
        }
    }
    callback(event, customEventData){
        if(Number(customEventData) == this.currentCount)
            this.setWin()
    }
    setWin(){
        console.log("Math2 Win")
    }
}
class information{
    public count: number
    public name: string
}

