
import { _decorator, Component, Node, Button, Prefab, SpriteFrame, instantiate, Sprite, randomRangeInt, Label, animation, sp, tween } from 'cc';
import { GameStateMachine } from './GameStateMachine';
import { Helper } from './Helper';
import { IconsHolder } from './IconsHolder';
import { SkeletonButton } from './SkeletonButton';
const { ccclass, property } = _decorator;

@ccclass('Math2')
export class Math2 extends Component {
    @property({type: [Button]}) buttons: Array<Button> = []
    @property({type: [SkeletonButton]}) buttonsSkeletons: Array<SkeletonButton> = []
    @property({type: [Prefab]}) configurations: Array<Prefab> = []
    @property({type: [SpriteFrame]}) objects: Array<SpriteFrame> = []
    @property({type: Node}) cont: Node
    
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
        this.buttons.forEach(element => {
            Helper.resetClickEvent(element, "checkCallback")
        });
        this.buttonsSkeletons.forEach(element => {
            element.reset();
        });
        
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
        for(let i = 0; i < this.buttons.length; i++){
            this.buttons[i].interactable = true
        }
        this.currentOption = ar[0]
        if(this.currentIcons != null)
            this.currentIcons.destroy()
        this.currentIcons = IconsHolder.Instance.setIconConfiguration(this.cont, ar[0] , name)
        this.buttons = Helper.shuffleArray(this.buttons)
        for(let i = 0; i < this.buttons.length; i++){
            let r: number
            this.buttons[i].node.children[1].getComponent(Label).string = ar[i].toString()
            Helper.addClickEvent(this.node, this.buttons[i],"Math2","checkCallback", ar[i])
            console.log("oke");
            // Helper.addClickEvent(this.buttonsSkeletons[i].node, this.buttons[i], "SkeletonButton", "callback", 0)
            console.log("oke1");
        }
    }
    checkCallback(event, customEventData){
        if(Number(customEventData) == this.currentOption){
            tween(this.node)
            .delay(0.2)
            .call(() => {
                this.setWin()
            })
            .start()
        }
            
        else{
            console.log(event);
            let button: Node = event.target
            Helper.resetClickEvent(button.getComponent(Button), "checkCallback")
        }
    }
    setWin(){
        GameStateMachine.Instance.colorLamp()
        if(this.currentCycle == this.cycles.length - 1){
            tween(this.node)
            .delay(3)
            .call(() =>{
                console.log("Math2 Win")
                GameStateMachine.Instance.winState(this.cycles.length)
            })
            .start()
        }
        else{
            tween(this.node)
            .delay(2)
            .call(() => {
                this.currentCycle++
                this.createGame(this.cycles[this.currentCycle])
            })
            .start()
        }
    }
}

