
import { _decorator, Component, Node, Label, Button} from 'cc';
import { IconsHolder } from './IconsHolder';
import { Helper } from './Helper';
import { GameStateMachine } from './GameStateMachine';
const { ccclass, property } = _decorator;

@ccclass('Math3')
export class Math3 extends Component {
    @property({type: Node}) container1: Node
    @property({type: Node}) container2: Node
    @property({type: Label}) label1: Label
    @property({type: Label}) label2: Label
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

    private currentIcons1: Node = null
    private currentIcons2: Node = null
    start () {
        this.init("3*fish1+2*fish2-3-7,5*pig1+1*pig2-8-5")
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
        console.log(count1 + " " + iconName1 + " " + count2 + " " + iconName2);
        this.currentSum = count1 + count2
        this.label1.string = count1.toString()
        this.label2.string = count2.toString()
        if(this.currentIcons1 != null)
            this.currentIcons1.destroy()
        if(this.currentIcons2 != null)
            this.currentIcons2.destroy()
        this.currentIcons1 = IconsHolder.Instance.setIconConfiguration(this.container1, count1, iconName1)
        this.currentIcons2 = IconsHolder.Instance.setIconConfiguration(this.container2, count2, iconName2)
        Helper.shuffleArray(this.buttons)
        let c: Array<number> = [this.currentSum, wrong1, wrong2]
        for(let i = 0; i < this.buttons.length; i++){
            this.buttons[i].interactable = true
            let r: number = c[i]
            console.log("R " + r);
            this.buttons[i].node.children[0].getComponent(Label).string = r.toString()
            Helper.setClickEvent(this.node, this.buttons[i],"Math3","callback",r) 
        }
    }
    callback(event, customEventData){
        if(Number(customEventData) == this.currentSum)
            this.checkWin()
        else{
            console.log(event);
            let button: Node = event.target
            button.getComponent(Button).interactable = false
        }
    }
    checkWin(){
        this.currentStage++
        if(this.currentStage == this.stageCount){
            GameStateMachine.Instance.winState(this.stageCount)
            return
        }
        this.create(this.counts1[this.currentStage], this.icons1[this.currentStage], this.counts2[this.currentStage], this.icons2[this.currentStage], this.wrong1[this.currentStage], this.wrong2[this.currentStage])
    }
}