
import { _decorator, Component, Node, Button, Prefab, SpriteFrame, instantiate, Sprite, randomRangeInt, Label, animation, sp, tween, AudioSource } from 'cc';
import { GameStateMachine } from './GameStateMachine';
import { Helper } from './Helper';
import { IconsHolder } from './IconsHolder';
import { SkeletonButton } from './SkeletonButton';
import { Frame } from './Frame';
import { MathWithIcons } from './MathWithIcons';
import { Lamp } from './Lamp';
import { Bridge } from './Bridge';
import { SoundManager } from './SoundManager';
const { ccclass, property } = _decorator;

@ccclass('Math2')
export class Math2 extends MathWithIcons {
    @property({type: [Button]}) buttons: Array<Button> = []
    @property({type: [Prefab]}) configurations: Array<Prefab> = []
    @property({type: [SpriteFrame]}) objects: Array<SpriteFrame> = []
    @property({type: Node}) cont: Node
    @property({type: AudioSource}) rightButton: AudioSource
    @property({type: AudioSource}) wrongButton: AudioSource


    public static Instance: Math2
    private currentOption: number = 0

    private currentCycle = 0
    private cycles: Array<string> = []
    init(config: string){
        Math2.Instance = this
        let index = config.indexOf(",")
        if(index == -1){
            tween(this.node)
            .delay(0)
            .call(() => {
                this.createGame(this.cycles[0])
            })
            .start()
        }
        else{
            this.cycles.pop()
            let st1 =  config.slice(0,index)
            this.cycles.push(st1)
            st1 = config.slice(index+1)
            this.cycles.push(st1)
            this.init(st1)
        }
        if(Bridge.Instance.levelCount == 0)
            SoundManager.Instance.playMath2Tutorial()
        else
            SoundManager.Instance.playMath2Start()
    }

    public createGame(config: string){
        this.buttons.forEach(element => {
            element.getComponent(SkeletonButton).reset()
            Helper.resetClickEvent(element, "checkCallback")
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
        
        IconsHolder.Instance.deleteIcons("Math2")    
        IconsHolder.Instance.setIconConfiguration(this.cont, ar[0] , name, "Math2")
        this.buttons = Helper.shuffleArray(this.buttons)
        this.buttons[0].getComponent(SkeletonButton).isCurrent = true;
        for(let i = 0; i < this.buttons.length; i++){
            let r: number
            this.buttons[i].node.children[1].getComponent(Label).string = ar[i].toString()
            Helper.addClickEvent(this.node, this.buttons[i],"Math2","checkCallback", ar[i])
            console.log("oke1");
        }
    }

    checkCallback(event, customEventData){
        if(this.givingHint)
            return
        if(Number(customEventData) == this.currentOption){
            this.rightButton.play()
            SoundManager.Instance.playMath2Right(this.currentOption)
            this.buttons.forEach(element => {
                Helper.resetClickEvent(element, "checkCallback")
            });
            IconsHolder.Instance.deleteIcons("Math2")
            Frame.Instance.zebraNod()
            GameStateMachine.Instance.colorLamp()
            tween(this.node)
            .delay(0.2)
            .call(() => {
                this.setWin()
            })
            .start()
        }
            
        else{
            this.wrongButton.play()
            SoundManager.Instance.playMathWrong()
            Frame.Instance.zebraWrong()
            console.log(event);
            let button: Node = event.target
            Helper.resetClickEvent(button.getComponent(Button), "checkCallback")
        }
    }

    setWin(){
        if(this.currentCycle == this.cycles.length - 1){
            GameStateMachine.Instance.block.active = true
            tween(this.node)
            .delay(2.5)
            .call(() =>{
                console.log("Math2 Win")
                Frame.Instance.zebraWin()
                GameStateMachine.Instance.winState(this.cycles.length)
            })
            .start()
        }
        else{
            GameStateMachine.Instance.block.active = true
            tween(this.node)
            .delay(2.8)
            .call(() => {
                GameStateMachine.Instance.block.active = false
                this.currentCycle++
                this.createGame(this.cycles[this.currentCycle])
            })
            .start()
        }
    }

    iconCount = 0
    public singleIconLightUp(count){
        SoundManager.Instance.playIconCount(this.iconCount + 1)
        this.iconCount++
    }

    public allIconsLightUp(){
        this.iconCount = 0
        this.givingHint = false
        Lamp.Instance.callBack()
    }

    private givingHint = false;
    public giveHint(){
        this.givingHint = false
        IconsHolder.Instance.giveHint("Math2", this)
    }
}

