
import { _decorator, Component, Node, Prefab, SpriteFrame, instantiate, Sprite, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('IconsHolder')
export class IconsHolder extends Component {
    @property({type: [Prefab]}) configurations: Array<Prefab> = []
    @property({type: [SpriteFrame]}) objects: Array<SpriteFrame> = []
    public static Instance: IconsHolder;
    onLoad(){
        IconsHolder.Instance = this
    }
    public setIconConfiguration(target: Node, iconCount: number, iconName: string): Node{
        let config: Node = instantiate(this.configurations[iconCount])
        config.setParent(target)
        config.setPosition(new Vec3(0,0,0))
        let frame: SpriteFrame = null
        this.objects.forEach(element => {
            if(iconName == element.name){
                console.log(element.name);
                frame = element
            }
        });
        config.children.forEach(child => {
            child.getComponent(Sprite).spriteFrame = frame
        });
        return config
    }
}
