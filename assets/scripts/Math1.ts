
import { _decorator, Component, Node, CCFloat, CCInteger, Prefab, random, randomRangeInt, instantiate, Vec3, Label, color, Color, tween, Skeleton, sp, UIOpacity, Sprite, SpriteFrame, AudioSource } from 'cc';
import { GameStateMachine } from './GameStateMachine';
import { Tileset } from './Tileset';
import { Frame } from './Frame';
import { setMixedSkin } from './Helper';
import { MathWithIcons } from './MathWithIcons';
import { SoundManager } from './SoundManager';
import { Bridge } from './Bridge';
const { ccclass, property } = _decorator;

@ccclass('Math1')
export class Math1 extends MathWithIcons {
    @property({type: CCInteger}) tileNumber: number
    @property({type: Color}) disableColor: Color
    @property({type: Color}) activeColor: Color
    @property({type: Prefab}) colorBlock: Prefab
    @property({type: [Prefab]}) tilePrefabs2: Array<Prefab> = []
    @property({type: [Prefab]}) tilePrefabs3: Array<Prefab> = []
    @property({type: [Prefab]}) tilePrefabs4: Array<Prefab> = []
    @property({type: [Prefab]}) tilePrefabs5: Array<Prefab> = []
    @property({type: [Prefab]}) tilePrefabs6: Array<Prefab> = []
    @property({type: [Prefab]}) tilePrefabs7: Array<Prefab> = []
    @property({type: [Prefab]}) tilePrefabs8: Array<Prefab> = []
    @property({type: [Prefab]}) tilePrefabs9: Array<Prefab> = []
    @property({type: [Prefab]}) tilePrefabs10: Array<Prefab> = []
    @property({type: [sp.Skeleton]}) numberSkeletons: Array<sp.Skeleton> = []
    @property({type: Node}) container: Node
    @property({type: [SpriteFrame]}) keyFrames: Array<SpriteFrame> = []
    @property({type: [SpriteFrame]}) keyBlurFrames: Array<SpriteFrame> = []
    @property({type: Sprite}) keySprite: Sprite
    @property({type: Sprite}) keyBlurSprite: Sprite
    @property({type: UIOpacity}) blurKey: UIOpacity
    @property({type: AudioSource}) rightSound: AudioSource
    @property({type: AudioSource}) wrongSound: AudioSource

    public static Instance: Math1
    private tile: Node
    public init(count: number, rev: string, keyName:string){
        Math1.Instance = this
        let tileNumber: number = count

        let keyIndex = this.getKeyIndex(keyName)
        this.keySprite.spriteFrame = this.keyFrames[keyIndex]
        this.keyBlurSprite.spriteFrame = this.keyBlurFrames[keyIndex]

        let reversed: boolean
        if(rev == "no")
            reversed = false
        else
            reversed = true
        if(reversed){
            for(let i = 0; i < count ; i++){
                let st = "number-" + (count - i).toString() + "-off"
                setMixedSkin(this.numberSkeletons[i], "numMix", ["Slot-numbers", st])
            }
        }
        else{
            for(let i = 0; i < count ; i++){
                let st = "number-" + (i+1).toString()
                this.numberSkeletons[i].node.name = st;
                setMixedSkin(this.numberSkeletons[i], "numMix", ["Slot-numbers", st + "-off"])

            }
        }
        let prefab: Prefab
        switch(tileNumber){
            case(2):{
                let r = randomRangeInt(0, this.tilePrefabs2.length)
                prefab = this.tilePrefabs2[r]
                break
            }
            case(3):{
                let r = randomRangeInt(0, this.tilePrefabs3.length)
                prefab = this.tilePrefabs3[r]
                break
            }
            case(4):{
                let r = randomRangeInt(0, this.tilePrefabs4.length)
                prefab = this.tilePrefabs4[r]
                break
            }
            case(5):{
                let r = randomRangeInt(0, this.tilePrefabs5.length)
                prefab = this.tilePrefabs5[r]
                break
            }
            case(6):{
                let r = randomRangeInt(0, this.tilePrefabs6.length)
                prefab = this.tilePrefabs6[r]
                break
            }
            case(7):{
                let r = randomRangeInt(0, this.tilePrefabs7.length)
                prefab = this.tilePrefabs7[r]
                break
            }
            case(8):{
                let r = randomRangeInt(0, this.tilePrefabs8.length)
                prefab = this.tilePrefabs8[r]
                break
            }
            case(9):{
                let r = randomRangeInt(0, this.tilePrefabs9.length)
                prefab = this.tilePrefabs9[r]
                break
            }
            case(10):{
                let r = randomRangeInt(0, this.tilePrefabs10.length)
                prefab = this.tilePrefabs10[r]
                break
            }
        }
        this.tile = instantiate(prefab)
        this.tile.setParent(this.container)
        this.tile.setPosition(new Vec3(0,0,0))
        this.tile.setScale(new Vec3(1,1,1))
        this.tile.getComponent(Tileset).init(this, reversed)
        if(Bridge.Instance.levelCount == 0){
            SoundManager.Instance.playMath1Tutorial
        }
        else{
            SoundManager.Instance.playMath1Start(reversed)
        }
    }

    private getKeyIndex(keyName: string): number{
        for(let i = 0; i < this.keyFrames.length; i++){
            console.log(this.keyFrames[i].name);
            if(this.keyFrames[i].name == keyName)
                return i
        }
        return 0
    }

    public getNumber(): Node{
        return this.numberSkeletons[this.currentTile - 1].node
    }

    private currentTile = 0
    public setTile(count: number){
        let tile: sp.Skeleton = this.numberSkeletons[this.currentTile]
        this.currentTile++
        tween(tile.node)
        .delay(0.5)
        .call(() => {
            setMixedSkin(tile, "numMix", ["Slot-numbers", "number-" + count.toString()])
        })
        .start()
    }

    public setWin(){
        tween(this.blurKey)
        .to(0.5, {opacity: 0})
        .start()
        tween(this.node)
        .delay(2)
        .call(() =>{
            SoundManager.Instance.playMath1End()
            Frame.Instance.zebraWin()
            GameStateMachine.Instance.colorLamp()
            GameStateMachine.Instance.winState()
        })
        .start()
    }

    public playRight(){
        this.rightSound.play()
    }
    public playWrong(){
        this.wrongSound.play()
    }
    
    public giveHint(){
        this.tile.getComponent(Tileset).giveHint()
    }
}

