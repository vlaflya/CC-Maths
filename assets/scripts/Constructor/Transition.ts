
import { _decorator, Component, Node, UITransform, tween, Vec2, game, AudioSource } from 'cc';
const { ccclass, property } = _decorator;
 
@ccclass('Transition')
export class Transition extends Component {
    @property({type: UITransform}) circle: UITransform
    @property({type: AudioSource}) sound: AudioSource
    public static Instance: Transition;
    onLoad () {
        game.addPersistRootNode(this.node)
        Transition.Instance = this
    }
    public transitionIn(){
        tween(this.circle)
        .to(1, {width: 0, height: 0})
        .call(() => {
            this.sound.play()
        })
        .delay(1)
        .to(1, {width: 3000, height: 3000})
        .start()
    }
}
