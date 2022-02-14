
import { _decorator, Component, Node, Label, Button, tween } from 'cc';
import { IconsHolder } from './IconsHolder';
import { Helper } from './Helper';
import { GameStateMachine } from './GameStateMachine';
import { SkeletonButton } from './SkeletonButton';
import { Frame } from './Frame';
const { ccclass, property } = _decorator;

@ccclass('Math3')
export class Math3 extends Component {
    @property({type: Node}) container1: Node
    @property({type: Node}) container2: Node
    @property({type: Label}) label1: Label
    @property({type: Label}) label2: Label
    @property({type: [Node]}) disableNodes: Array<Node> = []
    @property({type: [Button]}) buttons: Array<Button> = []

    private currentSum: number
    private currentStage = 0;
    private stageCount = 0
    private counts1: Array<number> = []
    private icons1: Array<string> = []
    private counts2: Array<number> = []
    private icons2: Array<string> = []
    private wrong1: Array<number> = []
    private wrong2: Array<number> = []

    start () {
        // this.init("3*fish1+2*fish2-3-7,5*pig1+1*pig2-8-5")
        Frame.Instance.setFrameDouble()
    }
    init(config: string){
        console.log(config);
        let c = 0
        let st = ""
        for(; c < config.length; c++){
            for(; c < config.length;c++){
                if(config[c] == "*"){
                    this.counts1.push(Number(st))
                    console.log(st);
                    st = ""
                    c++
                    break
                }
                st+=config[c]
            }
            for(; c < config.length;c++){
                if(config[c] == "+"){
                    this.icons1.push(st)
                    console.log(st);
                    st = ""
                    c++
                    break
                }
                st+=config[c]
            }
            for(; c < config.length;c++){
                if(config[c] == "*"){
                    this.counts2.push(Number(st))
                    console.log(st);
                    st = ""
                    c++
                    break
                }
                st+=config[c]
            }
            for(; c < config.length;c++){
                if(config[c] == "-"){
                    this.icons2.push(st)
                    console.log(st);
                    st = ""
                    c++
                    break
                }
                st+=config[c]
            }
            
            for(; c< config.length; c++){
                if(config[c] == "-"){
                    this.wrong1.push(Number(st))
                    console.log("Wrong1 " + st);
                    st = ""
                    c++
                    break
                }
                st+=config[c]
            }
            for(; c< config.length; c++){
                if(config[c] == ","){
                    this.wrong2.push(Number(st))
                    console.log("Wrong2 " + st);
                    st = ""
                    
                    break
                }
                st+=config[c]
                if(c == config.length - 1){
                    this.wrong2.push(Number(st))
                    console.log("Wrong2 " + st);
                }
            }
            this.stageCount++
        }
        this.create(this.counts1[this.currentStage], this.icons1[this.currentStage], this.counts2[this.currentStage], this.icons2[this.currentStage], this.wrong1[this.currentStage], this.wrong2[this.currentStage])
    }
    create(count1: number, iconName1: string, count2: number, iconName2: string, wrong1:number, wrong2:number){
        this.buttons.forEach(element => {
            element.getComponent(SkeletonButton).reset()
            Helper.resetClickEvent(element, "checkCallback")
        });
        tween(this.node)
        .delay(1)
        .call(() => {
            this.disableNodes.forEach(element => {
                element.active = true;
            });
        })
        .start()
        this.currentSum = count1 + count2
        this.label1.string = count1.toString()
        this.label2.string = count2.toString()
        IconsHolder.Instance.deleteIcons("Math3_1")
        IconsHolder.Instance.deleteIcons("Math3_2")
        tween(this.container1)
        .delay(0.6)
        .call(() => {
            IconsHolder.Instance.setIconConfiguration(this.container1, count1, iconName1, "Math3_1")
            IconsHolder.Instance.setIconConfiguration(this.container2, count2, iconName2, "Math3_2")
        })
        .start()
        Helper.shuffleArray(this.buttons)
        let c: Array<number> = [this.currentSum, wrong1, wrong2]
        this.buttons[0].getComponent(SkeletonButton).isCurrent = true
        for(let i = 0; i < this.buttons.length; i++){
            this.buttons[i].interactable = true
            let r: number = c[i]
            console.log("R " + r);
            this.buttons[i].node.children[1].getComponent(Label).string = r.toString()
            Helper.addClickEvent(this.node, this.buttons[i],"Math3","checkCallback",r) 
        }
    }
    checkCallback(event, customEventData){
        if(Number(customEventData) == this.currentSum)
            this.checkWin()
        else{
            Frame.Instance.zebraWrong()
            console.log(customEventData);
            let button: Node = event.target
            Helper.resetClickEvent(button.getComponent(Button), "checkCallback")
        }
    }
    checkWin(){
        GameStateMachine.Instance.colorLamp()
        IconsHolder.Instance.deleteIcons("Math3_1")
        IconsHolder.Instance.deleteIcons("Math3_2")

        this.disableNodes.forEach(element => {
            element.active = false;
        });
        this.currentStage++
        if(this.currentStage == this.stageCount){
            Frame.Instance.zebraWin()
            tween(this.node)
            .delay(2.5)
            .call(() => {
                GameStateMachine.Instance.winState(this.stageCount)
            })
            .start()
        }
        else{
            Frame.Instance.zebraNod()
            tween(this.node)
            .delay(2.5)
            .call(() => {
                this.create(this.counts1[this.currentStage], this.icons1[this.currentStage], this.counts2[this.currentStage], this.icons2[this.currentStage], this.wrong1[this.currentStage], this.wrong2[this.currentStage])
            })
            .start()
        }
    }
}