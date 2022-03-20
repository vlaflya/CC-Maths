import { _decorator, Component, Node, sp, tween, Vec3, Vec2, Tween, Quat, AudioSource, System, SystemEvent, systemEvent } from 'cc';
import { GameStateMachine } from './GameStateMachine';
import { Math1 } from './Math1';
import { Math2 } from './Math2';
import { Math3 } from './Math3';
import { SoundManager } from './SoundManager';
const { ccclass, property } = _decorator;

@ccclass('Lamp')
export class Lamp extends Component {
    @property({type: sp.Skeleton}) lamp: sp.Skeleton
    @property({type: Node}) block: Node
    @property({type: AudioSource}) useLamp: AudioSource
    @property({type: AudioSource}) lampFilled: AudioSource
    @property({type: AudioSource}) lampLocked: AudioSource

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
        Tween.stopAllByTarget(this.node)
        if(!this.canHint){
            this.lampLocked.play()
            SoundManager.Instance.playHintNotAvalible()
            
            tween(this.node)
            .by(0.05, {scale: new Vec3(-0.1, -0.1, -0.1)}, {easing: 'sineIn'})
            .by(0.05, {scale: new Vec3(0.1, 0.1, 0.1)}, {easing: 'sineOut'})
            .start()
            return
        }
        this.clearLamp()
        this.useLamp.play()
        tween(this.node)
        .by(0.1, {scale: new Vec3(0.1, 0.1, 0.1), position: new Vec3(0,10,0)})
        .by(0.1, {scale: new Vec3(-0.1, -0.1, -0.1), position: new Vec3(0,-10,0)})
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
        .to(1, {x: 0, y: -150})
        .start()
    }
    private startLamp(){
        tween(this.lampBone)
        .to(8, {x: 0, y: 0})
        .call(() => {
            console.log("Can give hint");
            this.lampFilled.play()
            this.lamp.setAnimation(0.5, "Idle_Full", true)
            this.canHint = true
            Tween.stopAllByTarget(this.node)
            tween(this.node)
            .by(0.1, {scale: new Vec3(0.1, 0.1, 0.1), position: new Vec3(0,5,0)})
            .by(0.1, {scale: new Vec3(-0.1, -0.1, -0.1), position: new Vec3(0,-5,0)})
            .start()
        })
        .start()
    }
}
