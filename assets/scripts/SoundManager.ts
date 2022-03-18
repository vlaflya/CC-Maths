
import { _decorator, Component, Node, AudioSource, AudioClip, randomRange, randomRangeInt, tween, Tween, math } from 'cc';
import { Bridge } from './Bridge';
import { GameStateMachine } from './GameStateMachine';
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

    public static Instance: SoundManager

    onLoad(){
        this.giveHint()
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
    public playMath1Hint(reverce = false){
        if(reverce){
            let r = randomRangeInt(0, this.Math1Hint.length)
            this.playVoice(this.Math1Hint[r])
            return;
        }
        let r = randomRangeInt(0, this.Math1HintReverce.length)
        this.playVoice(this.Math1HintReverce[r])
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
        let random = randomRangeInt(0, 100)
        if(random < 60 || Bridge.Instance.levelCount == 0){
            let r = randomRangeInt(0, this.Math1End.length)
            this.playVoice(this.Math1End[r], false, true)
            return
        }
        let r = randomRangeInt(0, this.ZebraSounds.length)
        this.playVoice(this.ZebraSounds[r], false, true)
    }
    public playMath2Tutorial(){
        this.playVoice(this.Math2Tutorial)
    }
    public playMath2Start(){
        let r = randomRangeInt(0, this.Math2Start.length)
        this.playVoice(this.Math2Start[r])
    }
    public playMath2Right(count){
        this.playIconCount(count, true, true)
        let r = randomRangeInt(0, this.Math2Right.length)
        this.playVoice(this.Math2Right[r], false, true)
    }
    public playMath3Tutorial(){
        this.playVoice(this.Math2Tutorial)
    }
    public playMath3Start(){
        let r = randomRangeInt(0, this.Math3Start.length)
        this.playVoice(this.Math3Start[r])
    }
    public playMath3Right(count){
        this.playIconCount(count, true, true)
        let r = randomRangeInt(0, this.Math3Right.length)
        this.playVoice(this.Math3Right[r], false, true)
    }
    public playHintNotAvalible(){
        let r = randomRangeInt(0, this.HintNotAvalible.length)
        this.playVoice(this.HintNotAvalible[r])
    }
    public playIconCount(count = 0,  addToQeue = false, interapt = false){
        count--
        console.log("Icon " + count);
        this.playVoice(this.IconCounts[count], addToQeue, interapt)
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
        Tween.stopAllByTarget(this.node)
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
            console.log("Audio stoped");
            this.giveHint()
            if(this.clipQeue.length > 0)
                this.playVoice(this.clipQeue.pop())
        })
        .start()
    }
    private giveHint(){
        console.log("Hint start");
        tween(this.node)
        .delay(10)
        .call(() => {
            if(GameStateMachine.Instance != null && !this.hintSource.playing){
                if(GameStateMachine.Instance.node.active){
                    let state = GameStateMachine.Instance.getState()
                    let audio: AudioClip
                    if(state == "Math1")
                        audio = this.Math1Hint[randomRangeInt(0, this.Math1Hint.length)]
                    console.log(state + " " + this.Math1Hint.length);
                    this.hintSource.clip = audio
                    this.hintSource.play()
                }
            }
            this.giveHint()
        })
        .start()
    }
}
