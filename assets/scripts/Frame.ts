
import { _decorator, Component, Node, sp, Prefab, tween, instantiate, Vec2 } from 'cc';
const { ccclass, property } = _decorator;
 
@ccclass('Frame')
export class Frame extends Component {
    @property({type: [sp.Skeleton]}) lamps: Array<sp.Skeleton> = []
    @property({type: sp.Skeleton}) background: sp.Skeleton
    @property({type: Prefab}) fly: Prefab
    @property({type: Node}) flySpawn: Node
    @property({type: sp.Skeleton}) zebra: sp.Skeleton
    private lampCount = 0
    public static Instance: Frame
    start () {
        Frame.Instance = this
        this.setZebraMix()
    }

    private setZebraMix(){
        this.zebra.setMix("idle", "win", 0.5)
        this.zebra.setMix("win", "idle", 0.5)

        this.zebra.setMix("idle", "Track-yes", 0.5)
        this.zebra.setMix("Track-yes", "idle", 0.5)

        this.zebra.setMix("idle", "Track-no", 0.5)
        this.zebra.setMix("Track-no", "idle", 0.5)

        this.zebra.setMix("Track-yes", "Track-yes", 0.5)
        this.zebra.setMix("Track-no", "Track-no", 0.5)

        this.zebra.setMix("Track-yes", "win", 0.5)
    }

    public fillLamp(color: string){
        tween(this.node)
        .call(() => {this.openDoor()})
        .delay(1)
        .call(() => {this.spawnFly(color)})
        .delay(0.5)
        .call(() => {this.closeDoor()})
        .delay(0.3)
        .call(() => {this.colorLamp(color)})
        .start()
    }

    private openDoor(){
        this.background.timeScale = 1
        this.background.setAnimation(1, "Track-Flash", false)
    }
    private closeDoor(){
        this.background.timeScale = -1
        this.background.setAnimation(1, "Track-Flash", false)
    }

    private spawnFly(color: string){
        let flyNode = instantiate(this.fly)
        flyNode.setParent(this.flySpawn)
        let flySk = flyNode.getComponent(sp.Skeleton)
        flySk.setSkin(color)
        let endBone: sp.spine.Bone = flySk.findBone("Constr-Fin")
        let lamp: Node = this.lamps[this.lampCount].node
        endBone.x = lamp.position.x
        endBone.y = lamp.position.y
        // let pos = new Vec2(lamp.position.x, lamp.position.y)
        console.log(endBone);
    }

    public zebraWin(){
        this.zebra.setAnimation(0, "win", false)
        this.zebra.addAnimation(0, "idle", true)
    }
    public zebraNod(){
        this.zebra.setAnimation(0, "Track-yes", false)
        this.zebra.addAnimation(0, "idle", true)
    }
    public zebraWrong(){
        this.zebra.setAnimation(0, "Track-no", false)
        this.zebra.addAnimation(0, "idle", true)
    }

    private colorLamp(color: string){
        color = color[0].toUpperCase() + color.substr(1)
        this.lamps[this.lampCount].setSkin(color)
        this.lamps[this.lampCount].setAnimation(0, "Light-Start", false)
        this.lamps[this.lampCount].addAnimation(0, "Light-On", true)
        this.lampCount++
    }
}
