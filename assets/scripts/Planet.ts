
import { _decorator, Component, Node, Tween, tween, Vec3 } from 'cc';
import { Bridge } from './Bridge';
import { Transition } from './Constructor/Transition';
const { ccclass, property } = _decorator;
 
@ccclass('Planet')
export class Planet extends Component {
    private id: number
    private isUnlocked: boolean

    init(id: number, state: number){
        this.node.on(Node.EventType.TOUCH_END, this.onTouch, this)
        this.id = id
        if(state == 0 || state == 1){
            this.isUnlocked = true
        }
        else{
            this.isUnlocked = false            
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
