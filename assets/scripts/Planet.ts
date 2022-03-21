
import { _decorator, Component, Node, Tween, tween, Vec3, SpriteFrame, Sprite, Skeleton, sp, animation, randomRange, Label } from 'cc';
import { Bridge } from './Bridge';
import { Transition } from './Constructor/Transition';
import { LevelMap } from './LevelMap';
const { ccclass, property } = _decorator;
 
@ccclass('Planet')
export class Planet extends Component {
    private id: number
    private isUnlocked: boolean
    @property({type: Sprite}) sprite: Sprite
    @property({type: sp.Skeleton}) anim: sp.Skeleton
    @property({type: [SpriteFrame]}) frames: Array<SpriteFrame> = []
    @property({type: Node}) zebra: Node
    @property({type: sp.Skeleton}) zebraSkeleton: sp.Skeleton
    @property({type: Node}) flag: Node
    @property({type: Label}) flagLabel: Label
    @property({type: Sprite}) pictogram: Sprite

    init(id: number, state: number, planet: string, planeNumber: number){
        this.node.on(Node.EventType.TOUCH_END, this.onTouch, this)
        
        this.anim.timeScale = randomRange(0.8, 1.2)
        this.id = id
        if(state == 0 || state == 1){
            if(state == 0){
                this.zebra.active = true
            }

            if(state == 1){
                // this.pictogram.spriteFrame = LevelMap.Instance.getPictogram()
            }
            
            this.flag.active = true
            this.flagLabel.string = planeNumber.toString()
            
            this.sprite.spriteFrame = this.findPlanet(planet)
            this.isUnlocked = true
        }
        else{
            this.sprite.spriteFrame = this.findPlanet("closed")
            this.isUnlocked = false            
        }
    }

    private findPlanet(name: string): SpriteFrame{
        for(let i = 0; i < this.frames.length; i++){

            if(this.frames[i].name == name)
                return this.frames[i]
        }
    }

    onTouch(){
        Tween.stopAllByTarget(this.sprite.node)
        if(this.isUnlocked){
            this.zebraSkeleton.setMix("idle", "win", 0.5)
            this.zebraSkeleton.setAnimation(0, "win", true)
            Transition.Instance.transitionIn()
            LevelMap.Instance.playUnlocked()
        }
        else{
            LevelMap.Instance.playLocked()
        }
        tween(this.node)
        .by(0.1, {scale:new Vec3(0.1, 0.1, 0.1)}, {easing:"bounceOut"})
        .by(0.1, {scale:new Vec3(-0.1, -0.1, -0.1)}, {easing:"bounceIn"})
        .delay(1)
        .call(() => {
            if(this.isUnlocked){
                
                Bridge.Instance.loadLevel(this.id)
            }
        })
        .start()
    }
}
