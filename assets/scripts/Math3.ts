
import { _decorator, Component, Node, Label, Button} from 'cc';
import { IconsHolder } from './IconsHolder';
import { Helper } from './Helper';
import { Math } from './Math';
const { ccclass, property } = _decorator;

@ccclass('Math3')
export class Math3 extends Math {
    @property({type: Node}) container1: Node
    @property({type: Node}) container2: Node
    @property({type: Label}) label1: Label
    @property({type: Label}) label2: Label
    @property({type: [Button]}) buttons: Array<Button> = []
    private currentSum: number
    start () {
    }
    init(json: string){
        let inf: information = JSON.parse(json)
        let count1: number = inf.count1
        let count2: number = inf.count2
        let iconName1: string = inf.iconName1
        let iconName2: string = inf.iconName2
        this.currentSum = count1 + count2
        this.label1.string = count1.toString()
        this.label2.string = count2.toString()
        IconsHolder.Instance.setIconConfiguration(this.container1, count1, iconName1)
        IconsHolder.Instance.setIconConfiguration(this.container2, count2, iconName2)
        let c: Array<number> = [1,2,3,4,5,6,7,8,9,10]
        let index = c.indexOf(this.currentSum)
        c.splice(index, 1)
        for(let i = 0; i < this.buttons.length; i++){
            let r: number
            if(i == 0){
                r = this.currentSum
            }
            else{
                c = Helper.shuffleArray(c)
                r = c.pop()   
            }
            this.buttons[i].node.children[0].getComponent(Label).string = r.toString()
            Helper.setClickEvent(this.node, this.buttons[i],"Math3","callback",r) 
        }
    }
    callback(event, customEventData){
        if(Number(customEventData) == this.currentSum)
            this.setWin()
    }
    setWin(){
        console.log("Math3 Win")
    }
}
class information{
    count1: number
    count2: number
    iconName1: string
    iconName2: string
}