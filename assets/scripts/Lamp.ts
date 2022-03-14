
import { _decorator, Component, Node, sp, tween, Vec3, Vec2, Tween, Quat } from 'cc';
import { GameStateMachine } from './GameStateMachine';
import { Math1 } from './Math1';
import { Math2 } from './Math2';
import { Math3 } from './Math3';
const { ccclass, property } = _decorator;

@ccclass('Lamp')
export class Lamp extends Component {
    @property({type: sp.Skeleton}) lamp: sp.Skeleton
    @property({type: Node}) block: Node
    private lampBone: sp.spine.Bone
    private canHint: boolean = false
    public static Instance: Lamp

    onLoad(){
        Lamp.Instance = this
    }

    start () {
        this.fillLamp()
    }

    public giveHint(){
        if(!this.canHint){
            Tween.stopAllByTarget(this.node)
            tween(this.node)
            .by(0.1, {scale: new Vec3(-0.1, -0.1, -0.1)}, {easing: 'sineIn'})
            .by(0.1, {scale: new Vec3(0.1, 0.1, 0.1)}, {easing: 'sineOut'})
            .start()
            return
        }
        Tween.stopAllByTarget(this.node)
        this.clearLamp()
        tween(this.node)
        .by(0.2, {scale: new Vec3(0.1, 0.1, 0.1), position: new Vec3(0,20,0)})
        .by(0.2, {scale: new Vec3(-0.1, -0.1, -0.1), position: new Vec3(0,-20,0)})
        .call(() => {
            this.canHint = false
            console.log("Give hint");
            this.block.active = true
            let stateName = GameStateMachine.Instance.getState()
            if(stateName == "Math1")
                Math1.Instance.giveHint()
            if(stateName == "Math2")
                Math2.Instance.giveHint()
            if(stateName == "Math3")
                Math3.Instance.giveHint()
        })
        .start()
    }

    public callBack(){
        this.block.active = false
        this.startLamp()
    }

    private fillLamp(){
        this.lamp.setAnimation(0.5, "Idle", true)
        this.lampBone = this.lamp.findBone("Mask_transform")
        this.lampBone.x = 0
        this.lampBone.y = 0
        console.log("Can give hint");
        this.lamp.setAnimation(0.5, "Idle_Full", true)
        this.canHint = true
    }

    private clearLamp(){
        this.lamp.setAnimation(0.5, "Idle", true)
        this.lampBone = this.lamp.findBone("Mask_transform")
        tween(this.lampBone)
        .to(2, {x: 0, y: -3000})
        .start()
    }
    private startLamp(){
        tween(this.lampBone)
        .to(8, {x: 0, y: 0})
        .call(() => {
            console.log("Can give hint");
            this.lamp.setAnimation(0.5, "Idle_Full", true)
            this.canHint = true
        })
        .start()
    }
}
