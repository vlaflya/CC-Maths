
import { _decorator, Component, Event, Node, Color, tween, Vec2, Vec3, Sprite, color, easing, SkeletalAnimation, Skeleton, sp, find, randomRange, randomRangeInt, RigidBody2D, Collider2D, CircleCollider2D, systemEvent, animation } from 'cc';
import { FireflyController } from './FireflyController';
import { FireflyFreeRoamState } from './FireflyFreeRoamState';
import { FireflyMoveState } from './FireflyMoveState';
import { FireflyAnimation } from './FireflyAnimation';
import { WinChecker } from './WinChecker';
import { Slot } from './Slot';
import { GeneralStateMachine } from './../GeneralStateMachine';
const { ccclass, property } = _decorator;

@ccclass('Firefly')
export class Firefly extends Component {

    @property({type:FireflyFreeRoamState}) freeRoam: FireflyFreeRoamState = null!
    @property({type: FireflyMoveState}) move: FireflyMoveState = null!
    @property({type: FireflyAnimation}) animation: FireflyAnimation = null!
    @property({type: Color}) color: Color = new Color()
    stateMachine: GeneralStateMachine
    fireflyController: FireflyController
    private isLocked: boolean = false
    private startScale: Vec3
    private inside: boolean
    private small: boolean

    public Initialize(isLocked: boolean,color: Color, inside: boolean, small: boolean){
        this.isLocked = isLocked
        this.color = color
        this.freeRoam.Initialize()
        this.inside = inside
        this.small = small
    }
    onLoad(){
        this.stateMachine = new GeneralStateMachine(this, this.node.name)
        this.stateMachine
        .addState("init", {onEnter: this.onInitializeEnter, onExit: this.onInitializeExit})
        .addState("firstColor", {onEnter: this.onFirstColorEnter, onExit: this.onFirstColorExit})
        .addState("outside", {onEnter: this.onMoveOutsideEnter, onExit: this.onMoveOutsideExit})
        .addState("roam", {onEnter: this.onRoamEnter, onExit: this.onRoamExit})
        .addState("controledMove", {onEnter: this.onControlMoveEnter, onExit: this.onControlMoveExit})
        .addState("lock", {onEnter: this.onSetLockedEnter})
    }

    start(){
        this.stateMachine.setState("init")
    }

    //init
    onInitializeEnter(){
        this.fireflyController = FireflyController.Instance
        this.fireflyController.node.on("spawnEnded", () => {this.endInitialization()})
        this.move.Initialize(this, this.animation)
        this.node.scale = new Vec3(0,0,0)
        let sc: Vec3
        if(this.small)
            sc = new Vec3(0.7,0.7,1)
        else
            sc = new Vec3(0.8,0.8,1)
        tween(this.node).to(2, {scale: sc}).start()
    }
    endInitialization(){
        this.stateMachine.exitState()
    }
    onInitializeExit(){
        this.stateMachine.setState("firstColor");
    }
    //firstColor
    onFirstColorEnter(){
        // tween(this.node).by(0.5, {position: this.node.position.multiplyScalar(1.05)})
        // .call(() => {this.onFirstColorTweenCallback()}).start()
        this.onFirstColorTweenCallback()
    }
    onFirstColorTweenCallback(){
        this.animation.SetColor(this.color)
        this.stateMachine.exitState()
    }
    onFirstColorExit(){
        if(!this.isLocked){
            if(this.inside){
                tween(this.node)
                .delay(1)
                .call(() => {
                    this.stateMachine.setState("roam")
                })
                .start()
                return
            }
            this.stateMachine.setState("outside")
        }
    }
    //outside
    onMoveOutsideEnter(){
        let dir: number = randomRangeInt(-1, 2)
        if(dir == 0)
            dir = 1
        let pos: Vec3 = new Vec3(1500 * dir,randomRange(-500, 500), 0)
        //tween(this.node).to(2, {worldPosition: pos}).call(() => {this.animation.node.active = false}).start()
        this.animation.node.active = false
    }
    moveInside(){
        this.animation.node.active = true
        // tween(this.node).to(1, {position: Vec3.ZERO}).call(() => {this.stateMachine.exitState()}).start()
        tween(this.node)
        .delay(1)
        .call(() => {
            this.stateMachine.exitState()
        })
        .start()
    }
    onMoveOutsideExit(){
        this.stateMachine.setState("roam")
    }

    //roam
    onRoamEnter(){
        this.node.on(Node.EventType.TOUCH_START, this.onTouch, this)
        this.freeRoam.enabled = true
        this.freeRoam.closestPoint()
    }
    onTouch(){
        if(this.stateMachine.isCurrentState("roam"))
            this.stateMachine.exitState()
    }
    onRoamExit(){
        this.freeRoam.disable()
        this.freeRoam.enabled = false
        this.stateMachine.setState("controledMove")
    }

    timePassed: boolean = false
    //controledMove
    onControlMoveEnter(){
        this.timePassed = false
        this.checked = false
        this.animation.SetSelect(true)
        this.startScale = this.node.getScale()
        tween(this.node).to(0.2 ,{scale: this.startScale.multiplyScalar(2)},{easing: "bounceIn"}).
                        to(0.2,{scale: this.startScale.multiplyScalar(0.5)},{easing: "bounceIn"}).start()
        this.fireflyController.setFireFly(this)

        tween(this)
        .delay(0.5)
        .call(() => {
            this.timePassed = true
            this.endMove("change")
        })
        .start()
    }
    checked = false
    checksEnded(st: string){
        console.log("oke")
        this.checked = true
        this.endMove(st)
        console.log(this.timePassed)
    }
    endMove(st: string){
        if((!this.checked || !this.timePassed) && st != "color" && st != "lock")
            return
        
        if(this.stateMachine.isCurrentState("controledMove")){          
            this.timePassed = false
            this.checked = false
            this.stateMachine.exitState(st)
        }
    }

    onControlMoveExit(condition?: string){
        this.animation.SetSelect(false)
        if(condition == null){
            console.warn("null condition on exitMove for firefly");
            return
        }
        console.log(condition)
        if(condition == "change" || condition == "far"){
            this.stateMachine.setState("roam")
            return
        }
        if(condition == "wrongColor"){
            this.animation.Wrong()
            tween(this)
            .delay(0.6)
            .call(() => {
                this.stateMachine.setState("roam")
            })
            .start()
        }
        if(condition == "color"){
            this.stateMachine.setState("colorChange")
            return
        }
        if(condition == "lock"){
            this.stateMachine.setState("lock")
            return
        }
    }

    //lock
    slot: Slot
    setSlotPos(s: Slot){
        this.slot = s
    }
    onSetLockedEnter(){
        this.slot.TryLock()
        let startScale: Vec3 = new Vec3(this.node.scale)
        tween(this.node)
        .to(0.1, {worldPosition: this.slot.GetPosition(this.node.worldPosition)})
        .delay(0.2)
        .call(() => {
            this.animation.Lock()
        })
        .delay(0.7)
        .to(0.5, {scale: startScale.multiplyScalar(0.5)})
        .call(() => {this.Lock()})
        .start()
    }
    public Lock(){
        this.isLocked = true
        this.node.setParent(this.slot.GetParent(this.node.worldPosition))
        this.slot.TryLock()
        this.node.setPosition(Vec3.ZERO)
        WinChecker.Instance.CheckWin()
    }
    public sing(count){
        this.animation.sing(count)
        tween(this.node)
        .to(0.5, {scale: new Vec3(0.8,0.8,0.8)})
        .start()
    }
    public GetColor(): Color{
        return this.color
    }
}

