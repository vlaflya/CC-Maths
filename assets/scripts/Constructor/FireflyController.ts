
import { _decorator, Component, Node, CCFloat, systemEvent, SystemEvent, Event, EventTouch, Touch, Vec2, Vec3, UITransform, macro, Color, color, tween, AudioSource } from 'cc';
import { Firefly } from './Firefly';
import { Slot } from './Slot';
import { FireflyMoveState } from './FireflyMoveState';
const { ccclass, property } = _decorator;

@ccclass('FireflyController')
export class FireflyController extends Component {
    @property({type: CCFloat}) moveTime: number
    fireflies: Array<Firefly> = []
    @property({type: CCFloat}) minDistance: number
    @property({type: CCFloat}) connectDistance: number
    @property({type: [Node]}) roamingPoints: Array<Node> = []
    @property({type: AudioSource}) afterFx: AudioSource
    private slots: Array<Slot> = []
    private currentFirefly: Firefly
    public static Instance: FireflyController
    private addFlies: number = 0

    onLoad(){
        FireflyController.Instance = this
    }

    public init(slots: Array<Slot>, roamingPoints: Array<Node>){
        this.slots = slots
        this.roamingPoints = roamingPoints
    }
    public getClosestPoint(pos: Vec3): Node{
        let minPos: Vec3 = new Vec3(5000,5000,5000)
        let target: Node = null 
        this.roamingPoints.forEach(tar => {
            if(Vec3.distance(pos, tar.worldPosition) < Vec3.distance(pos, minPos)){
                minPos = tar.worldPosition
                target = tar
            }
        });
        let i: number = this.roamingPoints.indexOf(target)
        this.roamingPoints.splice(i, 1)
        return target
    }
    public pushRoamigPOint(point: Node){
        this.roamingPoints.push(point)
    }

    public checkConnection(): string{
        let closestSlot: Slot = null
        if(this.currentFirefly == null)
            return
        this.slots.forEach(slot => {
            let dis: number = Vec3.distance(this.currentFirefly.node.worldPosition, slot.node.worldPosition)
            if(dis < this.connectDistance){
                if(closestSlot == null){
                    closestSlot = slot
                    return
                }
                if(dis < Vec3.distance(this.currentFirefly.node.worldPosition, slot.node.worldPosition)){
                    closestSlot = slot
                    return
                }
            }
        });
        
        if(closestSlot == null)
            return "far"
        if(!closestSlot.CheckColor(this.currentFirefly.GetColor()))
            return "wrongColor"
        if(closestSlot.isLit)
            return "taken"

        this.currentFirefly.setSlotPos(closestSlot)
        //this.currentFirefly.endMove("lock")
        this.currentFirefly = null
        if(this.outsideArray.length > 0){
            this.moveInside(1)
        }
        return "lock"
    } 
    moveInside(count){
        for(let i = 0; i < count; i++){
            if(this.addFlies == 0)
                break
            console.log("moveInside")
            let fly = null
            fly = this.outsideArray.pop()
            if(fly != null){
                fly.moveInside()
                this.addFlies--
            }
        }
    }
    public NextMoveIn(count: number){
        console.log("Next left " + this.outsideArray.length)
        this.addFlies = -1
        this.moveInside(count)
    }
    setFireFly(fireFly: Firefly){
        if(fireFly == this.currentFirefly)
            return
        let pos: Vec3
        if(this.currentFirefly != null){
            this.currentFirefly.endMove("change")
            pos = this.currentFirefly.node.position
            this.currentFirefly.node.position = new Vec3(pos.x, pos.y, 0)
        }
        this.currentFirefly = fireFly
        pos = this.currentFirefly.node.position
        this.currentFirefly.node.position = new Vec3(pos.x, pos.y, 1)
        this.node.children.sort((a,b) => a.position.z - b.position.z)
    }
    outsideArray: Array<Firefly> = []
    
    addOutsideArray(outside:Firefly, maxAdd: number){
        // console.log("Addd" + maxAdd)
        // this.addFlies += maxAdd 
        this.outsideArray.push(outside)
    }
    public async spawnEnded(flies: Array<Firefly>, maxFlies: number){
        this.fireflies = flies
        this.addFlies += maxFlies
        if(this.addFlies < 0)
            this.addFlies = 0
        console.log("Add " + this.addFlies);
        // SoundManager.Instance.setSound(this.node, "AfterFX", false, true)
        this.afterFx.play()
        delay(1000).then(() => {this.node.emit("spawnEnded")})
    }
    public sing(){
        let count = 0
        this.fireflies.forEach(element => {
            count++
            element.sing(count)
        });
    }

    public blinkLines(){
        this.slots.forEach(slot => {
            slot.blinkLines()
        });
    }
}
function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}
