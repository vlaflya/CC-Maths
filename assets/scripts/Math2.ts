
import { _decorator, Component, Node, Button, Prefab, SpriteFrame, instantiate, Sprite, randomRangeInt, Label } from 'cc';
import { Helper } from './Helper';
import { IconsHolder } from './IconsHolder';
const { ccclass, property } = _decorator;

@ccclass('Math2')
export class Math2 extends Component {
    @property({type: [Button]}) buttons: Array<Button> = []
    @property({type: [Prefab]}) configurations: Array<Prefab> = []
    @property({type: [SpriteFrame]}) objects: Array<SpriteFrame> = []
    private currentIcons: Node = null
    private currentOption: number = 0

    private currentCycle = 0
    private cycles: Array<string> = []
    init(config: string){
        let index = config.indexOf(",")
        if(index == -1){
            this.createGame(this.cycles[0])
        }
        else{
            this.cycles.pop()
            let st1 =  config.slice(0,index)
            this.cycles.push(st1)
            st1 = config.slice(index+1)
            this.cycles.push(st1)
            this.init(st1)
        }
    }

    public createGame(config: string){
        let name: string = ""
        let ar: Array<number> = []
        let c = 0;
        for(; c < config.length; c++){
            if(config[c] == "-"){
                c++
                break
            }
            name+= config[c]
        }
        let st = ""
        for(;c < config.length; c++){
            if(config[c] == "-"){
                ar.push(Number(st))
                st = ""
                continue
            }
            st += config[c]
        }
        ar.push(Number(st))
        
        this.currentOption = ar[0]
        if(this.currentIcons != null)
            this.currentIcons.destroy()
        this.currentIcons = IconsHolder.Instance.setIconConfiguration(this.node, ar[0] , name)
        this.buttons = Helper.shuffleArray(this.buttons)
        for(let i = 0; i < this.buttons.length; i++){
            let r: number
            this.buttons[i].node.children[0].getComponent(Label).string = ar[i].toString()
            Helper.setClickEvent(this.node, this.buttons[i],"Math2","callback", ar[i]) 
        }
    }
    callback(event, customEventData){
        if(Number(customEventData) == this.currentOption)
            this.setWin()
    }
    setWin(){
        if(this.currentCycle == this.cycles.length - 1){
            console.log("Math2 Win")
            return
        }
        this.currentCycle++
        this.createGame(this.cycles[this.currentCycle])
    }
}

