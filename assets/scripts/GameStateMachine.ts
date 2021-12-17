
import { _decorator, Component, Node, JsonAsset, math, js } from 'cc';
import { GeneralStateMachine } from './GeneralStateMachine';
import { Math1 } from './Math1';
import { Math2 } from './Math2';
import { Math3 } from './Math3';
import { GridGenerator } from './Constructor/GridGenerator';
const { ccclass, property } = _decorator;

@ccclass('GameStateMachine')
export class GameStateMachine extends Component {
    private stateMachine: GeneralStateMachine;
    private levelCount: number = 0
    private stage1count: number
    private stage1revereced: string
    private stage2choice: string
    private constructorConfig: string
    private stage3: string
    private stage3Icons: string
    public static Instance
    @property({type: JsonAsset}) config: JsonAsset
    @property({type: Math1}) math1: Math1
    @property({type: Math2}) math2: Math2
    @property({type: Math3}) math3: Math3
    @property({type: Node}) contr: Node
    @property({type: GridGenerator}) gridGenerator: GridGenerator 
    start () {
        this.stateMachine = new GeneralStateMachine(this, "Game")
        this.stateMachine
        .addState("Math1", {onEnter: this.onMath1Enter, onExit: this.onMath1Exit})
        .addState("Math2", {onEnter: this.onMath2Enter, onExit: this.onMath2Exit})
        .addState("Math3", {onEnter: this.onMath3Enter, onExit: this.onMath3Exit})
        .addState("Constructor", {onEnter: this.onConstructorEnter, onExit: this.onConstructorExit})
        this.readConfig()
        this.stateMachine.setState("Math1")
    }
    readConfig(){
        let conf = JSON.parse(JSON.stringify(this.config.json))
        let info: levelInfo = conf[this.levelCount]
        this.stage1count = info.stage1count
        this.stage1revereced = info.stage1revereced
        this.stage2choice = info.stage2choice
        this.constructorConfig = info.constructorConfig
        this.stage3 = info.stage3
        this.stage3Icons = info.stage3Icons
    }
    public winState(){
        this.stateMachine.exitState()
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
        this.math2.node.active = false
        this.math2.init(this.stage2choice)
    }
    onMath2Exit(){}
    onMath3Enter(){}
    onMath3Exit(){}
    onConstructorEnter(){}
    onConstructorExit(){}
}
interface levelInfo{
    stage1count: number
    stage1revereced: string
    stage2choice: string
    constructorConfig: string
    stage3: string
    stage3Icons: string
}
