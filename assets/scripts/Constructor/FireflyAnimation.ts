
import { _decorator, Component, Node, sp, Color, tween, Vec3, random, randomRange, Prefab, instantiate, math, ParticleSystem, ParticleSystem2D } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('FireflyAnimation')
export class FireflyAnimation extends Component {
    @property({type: sp.Skeleton}) animation: sp.Skeleton
    @property({type: Prefab}) fireworks: Prefab
    private color

    onLoad(){
        this.setMix("1_Loop_free", "2_Selected", 0.2)
        this.setMix("2_Selected", "4_Activation", 0.5)
        this.setMix("4_Activation", "3_Loop_inserted", 0.5)
        this.setMix("1_Loop_free", "7_Color", 1)
        this.setMix("6_Incorrectly", "1_Loop_free", 0.5)
        this.setMix("5_Sing", "3_Loop_inserted", 0.5)
    }

    public SetColor(color: Color){
        this.color = color
        this.animation.setSkin(this.GetColorString(color))
        this.animation.setAnimation(0, "7_Color", false)
        this.animation.addAnimation(0,"1_Loop_free", true, 1)
    }

    public SetSelect(selected: boolean){
        
        if(selected == true)
            this.animation.setAnimation(0, "2_Selected", true)
        else
            this.animation.setAnimation(0,"1_Loop_free", true)
    }

    public Wrong(){
        this.animation.setAnimation(0,"6_Incorrectly", false)
        this.animation.addAnimation(0,"1_Loop_free", false)
    }

    public Lock(){
        tween(this)
        .call(() => {this.animation.setAnimation(0,"4_Activation", false)})
        .delay(0.5)
        .call(() => {this.animation.setAnimation(0, "3_Loop_inserted", true)})
        .start()
    }

    public sing(count){
        this.animation.setAnimation(0, "5_Sing", false)
        let startPos = this.node.worldPosition
        let newScale = new Vec3(this.node.scale.x * 6, this.node.scale.y * 6, this.node.scale.z * 6)
        let newPosition = new Vec3(this.node.position.x + 1000 * Math.sign(this.animation.node.scale.x), this.node.position.y, this.node.position.z)
        // let delay = (this.node.worldPosition.y * 4 * Math.sign(this.node.worldPosition.y)) / 1000
        let delay = count * 0.5 + 1
        console.log(delay);
        let particle = this.spawnFireworks(startPos)
        tween(this.node)
        .delay(delay)
        .call(() => {
            particle.enabled = true
        })
        .to(4, {scale: newScale, position: newPosition})
        .start()
    }

    private spawnFireworks(startPos): ParticleSystem2D{
        let fireworks = instantiate(this.fireworks)
        fireworks.parent = this.node.parent
        fireworks.worldPosition = startPos
        let particle = fireworks.getComponent(ParticleSystem2D)
        // particle.startColor = this.color
        return particle
    }
    
    GetColorString(color: Color): string{
        if(color.equals(new Color(255,0,0,255)))
            return "red"
        if(color.equals(new Color(0,125,255,255)))
            return "blue"
        if(color.equals(new Color(255,255,0,255)))
            return "yellow"
        if(color.equals(new Color(0,255,0,255)))
            return "green"
        if(color.equals(new Color(255,0,255,255)))
            return "violet"
        return "gray"
    }

    setMix(anim1, anim2, transitionTime: number){
        this.animation.setMix(anim1, anim2, transitionTime)
        this.animation.setMix(anim2, anim1, transitionTime)
    }
}

