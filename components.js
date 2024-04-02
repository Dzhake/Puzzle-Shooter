"use strict";


const Personc = {
    props : ['person','index'],
    data() {
        return {
        }
    },
    computed:{
        angle() {
            return 360/alivePeopleCount()*this.index
        },
        color() {return this.person.color},
        weaponSVG() {
            if (weaponSVGs[this.person.weapon.sprite] != null) {
                return weaponSVGs[this.person.weapon.sprite](RGB.invertHex(this.person.color),this.person.weapon.translateX,this.person.weapon.scaleX)
            } else return ``
        }
    },
    template: `
    <div :class="{hide:person.isDead}" class="person" :style="{transform:'rotate('+angle+'deg) translateY(-240px)', 'background-color':color}">
        <Healthc v-for="(healthPoint,index) in person.health" :index="index" :person="person"></Healthc>
        <div class="weaponWrapper" v-html="weaponSVG"></div>
    </div>`  
};

const Healthc = {
    props: ['person','index'],
    template:`<div class="healthPoint" :style="{transform:'translateY(-40px) translateX('+(index*12-((person.health-1)*6))+'px)'}"></div>`
};


const Bulletc = {
    props: ['bullet'],
    template:`<div class="bullet" :style="{transform:'rotate('+bullet.x+'deg) translateY(-242px)'}"></div>`,
}