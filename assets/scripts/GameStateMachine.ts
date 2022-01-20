
import { _decorator, Component, Node, JsonAsset, math, js } from 'cc';
import { GeneralStateMachine } from './GeneralStateMachine';
import { Math1 } from './Math1';
import { Math2 } from './Math2';
import { Math3 } from './Math3';
import { GridGenerator } from './Constructor/GridGenerator';
import { Firefly } from './Constructor/Firefly';
import { Bridge } from './Bridge';
import { Frame } from './Frame';
const { ccclass, property } = _decorator;

@ccclass('GameStateMachine')
export class GameStateMachine extends Component {
    private stateMachine: GeneralStateMachine;
    private stage1count: number
    private stage1revereced: string
    private stage2choice: string
    private constructorConfig: string
    private stage3: string
    public static Instance: GameStateMachine
    private conf: Array<any>
    private flyColorCount = 0
    private flyColors: Array<string> = []
    
    @property({type: Math1}) math1: Math1
    @property({type: Math2}) math2: Math2
    @property({type: Math3}) math3: Math3
    @property({type: GridGenerator}) grid: GridGenerator
    @property({type: Node}) contr: Node
    @property({type: [JsonAsset]}) configs: Array<JsonAsset> = []

    public getConstructorConfigs(){
        return this.configs
    }

    start () {
        GameStateMachine.Instance = this
        this.stateMachine = new GeneralStateMachine(this, "Game")
        this.stateMachine
        .addState("Math1", {onEnter: this.onMath1Enter, onExit: this.onMath1Exit})
        .addState("Math2", {onEnter: this.onMath2Enter, onExit: this.onMath2Exit})
        .addState("Constructor", {onEnter: this.onConstructorEnter, onExit: this.onConstructorExit})
        .addState("Math3", {onEnter: this.onMath3Enter, onExit: this.onMath3Exit})
        .addState("NextConstructor", {onEnter: this.onNextConstructorEnter, onExit: this.onNextConstructorExit})
        Bridge.Instance.gameStateMachineInitialized()
    }

    readConfig(config: JsonAsset, levelCount){
        this.conf = JSON.parse(JSON.stringify(config.json))
        let info: levelInfo = this.conf[levelCount]
        this.stage1count = info.stage1count
        this.stage1revereced = info.stage1reverced
        this.stage2choice = info.stage2choice
        this.constructorConfig = info.constructorconfig
        this.getColors()
        this.stage3 = info.stage3
        this.stateMachine.setState("Math1")
    }
    private currentConf: string
    private getColors(){
        this.configs.forEach(conf => {
            if(conf.name == this.constructorConfig){
                this.currentConf = JSON.stringify(conf)
                return
            }
        });
        let readObjects: Array<any> = []
        readObjects = JSON.parse(this.currentConf).json 
        let constructorInfo: ConstructorInformation = readObjects[0]
        let colorString = constructorInfo.fireflycolors;
        let st = ""
        for(let c = 0; c < colorString.length; c++){
            if(colorString[c] == ","){
                this.flyColors.push(st)
                console.log(st);
                st = ""
                continue
            }
            st+= colorString[c]
        }
        this.flyColors.push(st)
        console.log(st);
    }

    public colorLamp(){
        Frame.Instance.fillLamp(this.flyColors[this.flyColorCount])
        this.flyColorCount++
    }

    public winState(args?){
        this.stateMachine.exitState(args)
    }

    onMath1Enter(){
        this.math1.node.active = true
        this.math1.init(this.stage1count, this.stage1revereced)
    }
    onMath1Exit(){
        this.math1.node.active = false
        this.stateMachine.setState("Math2")
    }
    onMath2Enter(){
        this.math2.node.active = true
        this.math2.init(this.stage2choice)
    }
    onMath2Exit(fireflyCount?){
        this.math2.node.active = false
        this.stateMachine.setState("Constructor", fireflyCount + 1)
    }
    
    onConstructorEnter(fireflyCount?){
        this.contr.active = true
        console.log("Count " + fireflyCount);
        this.grid.init(this.currentConf, fireflyCount)
    }
    onConstructorExit(args?){
        if(args == 0){
            this.winLevel()
            return
        }
        console.log("Inter Win");
        this.contr.active = false
        this.stateMachine.setState("Math3")
    }
    onMath3Enter(){
        this.math3.node.active = true
        this.math3.init(this.stage3)
    }
    onMath3Exit(args?){
        this.math3.node.active = false
        this.stateMachine.setState("NextConstructor", args)
    }
    onNextConstructorEnter(args?){
        this.contr.active = true
        this.grid.NextSpawn(args)
    }
    onNextConstructorExit(){
        this.winLevel()
    }
    winLevel(){
        Bridge.Instance.win()
    }
}
interface levelInfo{
    level: number
    stage1count: number
    stage1reverced: string
    stage2choice: string
    constructorconfig: string
    stage3: string
}
interface ConstructorInformation{
    availablecolors: string
    levelnum: number
    fireflycolors: string
    slotcount: number
}
