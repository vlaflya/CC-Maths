
import { _decorator, Component, Node, AudioSource, AudioClip, randomRange, randomRangeInt, tween, Tween, math, systemEvent, SystemEvent, find, game } from 'cc';
import { Bridge } from './Bridge';
import { GameStateMachine } from './GameStateMachine';
import { Math1 } from './Math1';
const { ccclass, property } = _decorator;

@ccclass('SoundManager')
export class SoundManager extends Component {
    @property({type: AudioSource}) voiceSource: AudioSource
    @property({type: AudioSource}) hintSource: AudioSource
    

    @property({type: AudioClip}) firstMetaEnter: AudioClip
    @property({type: AudioClip}) firstMetaEnterEN: AudioClip

    @property({type: [AudioClip]}) gameStart: Array<AudioClip> = []
    @property({type: [AudioClip]}) gameStartEN: Array<AudioClip> = []

    @property({type: [AudioClip]}) Math1Tutorial: Array<AudioClip> = []
    @property({type: [AudioClip]}) Math1TutorialEN: Array<AudioClip> = []

    @property({type: [AudioClip]}) Math1Start: Array<AudioClip> = []
    @property({type: [AudioClip]}) Math1StartReverce: Array<AudioClip> = []

    @property({type: [AudioClip]}) Math1StartEN: Array<AudioClip> = []
    @property({type: [AudioClip]}) Math1StartReverceEN: Array<AudioClip> = []

    @property({type: [AudioClip]}) Math1Hint: Array<AudioClip> = []
    @property({type: [AudioClip]}) Math1HintReverce: Array<AudioClip> = []

    @property({type: [AudioClip]}) Math1HintEN: Array<AudioClip> = []
    @property({type: [AudioClip]}) Math1HintReverceEN: Array<AudioClip> = []

    @property({type: [AudioClip]}) MathWrong: Array<AudioClip> = []
    @property({type: [AudioClip]}) MathWrongEn: Array<AudioClip> = []
    @property({type: [AudioClip]}) MathWrongZebra: Array<AudioClip> = []

    @property({type: [AudioClip]}) ZebraSounds: Array<AudioClip> = []

    @property({type: [AudioClip]}) Math1End: Array<AudioClip> = []
    @property({type: [AudioClip]}) Math1EndEN: Array<AudioClip> = []

    @property({type: AudioClip}) Math2Tutorial: AudioClip
    @property({type: AudioClip}) Math2TutorialEN: AudioClip

    @property({type: [AudioClip]}) Math2Start: Array<AudioClip> = []
    @property({type: [AudioClip]}) Math2StartEN: Array<AudioClip> = []
    
    @property({type: [AudioClip]}) Math2Right: Array<AudioClip> = []
    @property({type: [AudioClip]}) Math2RightEN: Array<AudioClip> = []
    
    @property({type: AudioClip}) Math3Tutorial: AudioClip
    @property({type: AudioClip}) Math3TutorialEN: AudioClip

    @property({type: [AudioClip]}) Math3Start: Array<AudioClip> = []
    @property({type: [AudioClip]}) Math3StartEN: Array<AudioClip> = []

    @property({type: [AudioClip]}) Math3Right: Array<AudioClip> = []
    @property({type: [AudioClip]}) Math3RightEN: Array<AudioClip> = []

    @property({type: [AudioClip]}) HintNotAvalible: Array<AudioClip> = []
    @property({type: [AudioClip]}) HintNotAvalibleEN: Array<AudioClip> = []

    @property({type: [AudioClip]}) IconCounts: Array<AudioClip> = []
    @property({type: [AudioClip]}) IconCountsEN: Array<AudioClip> = []

    @property({type: AudioClip}) ConstructorTutorial: AudioClip
    @property({type: AudioClip}) ConstructorTutorialEN: AudioClip

    @property({type: [AudioClip]}) ConstructorPhase1Start: Array<AudioClip> = []
    @property({type: [AudioClip]}) ConstructorPhase1StartEN: Array<AudioClip> = []

    @property({type: [AudioClip]}) ConstructorPhase1End: Array<AudioClip> = []
    @property({type: [AudioClip]}) ConstructorPhase1EndEN: Array<AudioClip> = []

    @property({type: [AudioClip]}) ConstructorPhase2Start: Array<AudioClip> = []
    @property({type: [AudioClip]}) ConstructorPhase2StartEN: Array<AudioClip> = []

    @property({type: [AudioClip]}) ConstructorFinish: Array<AudioClip> = []
    @property({type: [AudioClip]}) ConstructorFinishEN: Array<AudioClip> = []
    

    public static Instance: SoundManager

    onLoad(){
        if(SoundManager.Instance != null)
            this.node.destroy()
        game.addPersistRootNode(this.node)
        SoundManager.Instance = this
    }

    public playFirstMeta(){
        this.playVoice(this.firstMetaEnter)
    }
    public playGameStart(){
        let r = randomRangeInt(0, this.gameStart.length)
        this.playVoice(this.gameStart[r])
    }
    public playMath1Tutorial(){
        this.playVoice(this.Math1Tutorial[0], true, true)
        this.playVoice(this.Math1Tutorial[1], false, true)
    }
    public playMath1Start(reverce = false){
        if(reverce){
            let r = randomRangeInt(0, this.Math1StartReverce.length)
            this.playVoice(this.Math1StartReverce[r], false, true)
            return;
        }
        let r = randomRangeInt(0, this.Math1Start.length)
        this.playVoice(this.Math1Start[r], false, true)
    }
    prevhint1 = ""
    public playMath1Hint(reverce = false){
        if(reverce){
            let tmp = this.Math1Hint.slice()
            for(let i = 0; i < tmp.length; i++){
                if(tmp[i].name == this.prevhint1){
                    tmp.splice(i, 1)
                    break
                }
            }
            let r = randomRangeInt(0, tmp.length)
            this.prevhint1 = tmp[r].name
            this.playVoice(tmp[r])
            Math1.Instance.idleHint(tmp[r].getDuration())
            return;
        }
        let tmp = this.Math1HintReverce.slice()
        for(let i = 0; i < tmp.length; i++){
            if(tmp[i].name == this.prevhint1){
                tmp.splice(i, 1)
                break
            }
        }
        let r = randomRangeInt(0, tmp.length)
        this.prevhint1 = tmp[r].name
        this.playVoice(tmp[r])
        Math1.Instance.idleHint(tmp[r].getDuration())
        Math1.Instance.idleHint(tmp[r].getDuration())
    }
    public playMathWrong(){
        let isTutorial: boolean = Bridge.Instance.levelCount == 0
        let random = randomRangeInt(0, 100)
        if(random < 60 || isTutorial){
            let r = randomRangeInt(0, this.MathWrong.length)
            this.playVoice(this.MathWrong[r])
            return
        }
        let r = randomRangeInt(0, this.MathWrongZebra.length)
        this.playVoice(this.MathWrongZebra[r])
    }
    public playMath1End(){
        let r = randomRangeInt(0, this.Math1End.length)
        this.playVoice(this.Math1End[r], false, true)
        return
    }
    public playMath2Tutorial(){
        this.playVoice(this.Math2Tutorial)
    }
    public playMath2Start(){
        let r = randomRangeInt(0, this.Math2Start.length)
        this.playVoice(this.Math2Start[r])
    }
    private prevRandomMath2 = ""
    public playMath2Right(count){
        let tmp = this.Math2Right.slice()
        for(let i = 0; i < tmp.length; i++){
            if(tmp[i].name == this.prevRandomMath2){
                tmp.splice(i, 1)
                break
            }
        }
        let r = randomRangeInt(0, tmp.length)
        this.prevRandomMath2 = tmp[r].name
        this.playIconCount(count)
        // tween(this.node)
        // .delay(1)
        // .call(() =>{
        //     this.playVoice(tmp[r], true, false)
        // })
        // .start()
    }
    public playMath3Tutorial(){
        this.playVoice(this.Math2Tutorial)
    }
    public playMath3Start(){
        let r = randomRangeInt(0, this.Math3Start.length)
        this.playVoice(this.Math3Start[r], false, true)
    }
    private prevRandomMath3 = ""
    public playMath3Right(count){
        let tmp = this.Math3Right.slice()
        for(let i = 0; i < tmp.length; i++){
            if(tmp[i].name == this.prevRandomMath3){
                tmp.splice(i, 1)
                break
            }
        }
        let r = randomRangeInt(0, tmp.length)
        this.prevRandomMath3 = tmp[r].name
        this.playIconCount(count)
        // tween(this.node)
        // .delay(1)
        // .call(() =>{
        //     this.playVoice(tmp[r], true, false)
        // })
        // .start()
    }
    public playHintNotAvalible(){
        let r = randomRangeInt(0, this.HintNotAvalible.length)
        this.playVoice(this.HintNotAvalible[r])
    }
    public playIconCount(count = 0){
        count--
        console.log("Icon " + count);
        this.playVoice(this.IconCounts[count], false, true)
    }

    public playConstructorTutorial(){
        this.playVoice(this.ConstructorTutorial)
    }
    public playConstructorStartPhase1(){
        let r = randomRangeInt(0, this.ConstructorPhase1Start.length)
        this.playVoice(this.ConstructorPhase1Start[r]) 
    }
    public playConstructorEndPhase1(count): number{
        this.playVoice(this.ConstructorPhase1End[count])
        return this.ConstructorPhase1End[count].getDuration()
    }
    public playConstructorStartPhase2(){
        let r = randomRangeInt(0, this.ConstructorPhase2Start.length)
        this.playVoice(this.ConstructorPhase2Start[r]) 
    }
    public playConstructorFinish(){
        let r = randomRangeInt(0, this.ConstructorFinish.length)
        this.playVoice(this.ConstructorFinish[r]) 
    }

    private clipQeue: Array<AudioClip> = []
    private playVoice(clip: AudioClip, addToQeue = false, interapt = false){
        if(this.voiceSource.playing && !interapt){
            console.log("no voice");
            if(addToQeue){
                this.clipQeue.push(clip)
                this.waitFor()
            }
            return
        }
        console.log("voice");
        Tween.stopAllByTarget(this.hintSource.node)
        this.voiceSource.stop()
        this.hintSource.stop()
        this.voiceSource.clip = clip
        this.voiceSource.play()
        this.waitFor()
    }
    private waitFor(){
        tween(this.voiceSource.node)
        .delay(this.voiceSource.clip.getDuration())
        .call(() => {
            console.log("Audio stoped " + this.voiceSource.clip.getDuration());
            if(this.clipQeue.length > 0)
                this.playVoice(this.clipQeue.pop())
        })
        .start()
    }
    
}
