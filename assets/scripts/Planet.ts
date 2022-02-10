
import { _decorator, Component, Node, Tween, tween, Vec3, SpriteFrame, Sprite, Skeleton, sp, animation, randomRange } from 'cc';
import { Bridge } from './Bridge';
import { Transition } from './Constructor/Transition';
const { ccclass, property } = _decorator;
 
@ccclass('Planet')
export class Planet extends Component {
    private id: number
    private isUnlocked: boolean
    @property({type: Sprite}) sprite: Sprite
    @property({type: sp.Skeleton}) anim: sp.Skeleton
    @property({type: [SpriteFrame]}) frames: Array<SpriteFrame> = []
    init(id: number, state: number, planet: string){
        this.node.on(Node.EventType.TOUCH_END, this.onTouch, this)
        this.sprite.spriteFrame = this.findPlanet(planet)
        this.anim.timeScale = randomRange(0.8, 1.2)
        this.id = id
        if(state == 0 || state == 1){
            this.isUnlocked = true
        }
        else{
            this.isUnlocked = false            
        }
    }

    private findPlanet(name: string): SpriteFrame{
        for(let i = 0; i < this.frames.length; i++){
            console.log(this.frames[i].name);
            if(this.frames[i].name == name)
                return this.frames[i]
        }
    }

    onTouch(){
        Tween.stopAllByTarget(this.node)
        Transition.Instance.transitionIn()
        tween(this.node)
        .to(0.2, {scale:new Vec3(1.1,1.1,1)}, {easing:"bounceOut"})
        .to(0.2, {scale:new Vec3(1,1,1)}, {easing:"bounceIn"})
        .delay(1)
        .call(() => {
            if(this.isUnlocked){
                Bridge.Instance.loadLevel(this.id)
            }
        })
        .start()
    }
}
