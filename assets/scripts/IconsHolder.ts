
import { _decorator, Component, Node, Prefab, SpriteFrame, instantiate, Sprite, Vec3, UITransform, tween, Tween } from 'cc';
import { MathWithIcons } from './MathWithIcons';
const { ccclass, property } = _decorator;

@ccclass('IconsHolder')
export class IconsHolder extends Component {
    @property({type: [Prefab]}) configurations: Array<Prefab> = []
    @property({type: [SpriteFrame]}) objects: Array<SpriteFrame> = []
    private iconLists: Array<IconList> = []
    public static Instance: IconsHolder;
    onLoad(){
        IconsHolder.Instance = this
    }

    public setIconConfiguration(target: Node, iconCount: number, iconName: string, listName: string){
        let config: Node = instantiate(this.configurations[iconCount])
        config.setParent(target)
        config.setPosition(new Vec3(0,0,0))
        let frame: SpriteFrame = null
        this.objects.forEach(element => {
            if(iconName == element.name){
                frame = element
            }
        });
        
        let list = this.getList(listName)
        if(list == null){
            list = new IconList(listName)
            this.iconLists.push(list)
        }
            
        config.children.forEach(child => {
            child.getComponent(Sprite).spriteFrame = frame
            let sc = new Vec3(child.scale)
            child.scale = new Vec3(0,0,0)
            tween(child)
            .delay(0.3)
            .to(0.2, {scale: sc})
            .start()
            list.icons.push(child)
        });
        return config
    }

    public deleteIcons(name: string){
        if(this.iconLists.length == 0)
            return
        
        let ret = this.getList(name)
        if(ret == null)
            return

        this.iconLists = this.iconLists.filter(function(value, index, arr){
            return value != ret
        })

        ret.icons.forEach(icon => {
            Tween.stopAllByTarget(icon)
            tween(icon)
            .to(0.2, {scale: new Vec3(0,0,0)})
            .start()
        });
    }

    private getList(name: string): IconList{
        for(let i = 0; i < this.iconLists.length; i++){
            if(this.iconLists[i].name == name){
                console.log("Found list " +name);
                return this.iconLists[i]
            }
        }
        let listNames = ""
        this.iconLists.forEach(element => {
            listNames += " " + element.name
        });
        console.log("No list");
        return null
    }

    public giveHint(listName: string, math: MathWithIcons){
        let list = this.getList(listName)
        if(list == null)
            return
        this.lightIcon(0, list, math)
    }

    private lightIcon(count: number, iconList: IconList, math: MathWithIcons){
        console.log("oke");
        tween(iconList.icons[count])
        .by(0.3, {scale: new Vec3(0.5, 0.5, 0.5)})
        .call(() => {
            math.singleIconLightUp(count)
        })
        .by(0.3, {scale: new Vec3(-0.5, -0.5, -0.5)})
        .delay(0.4)
        .call(() =>{       
            count++
            if(count == iconList.icons.length){
                math.allIconsLightUp()
            }
            else{
                this.lightIcon(count, iconList, math)
            }
        })
        .start()
    }
}
class IconList {
    public name: string
    public icons: Array<Node>
    constructor(n: string) {
        this.name = n
        this.icons = []
    }
}
