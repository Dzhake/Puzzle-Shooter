class RGB {
    r = 255
    g = 255
    b = 255

    constructor(r,g,b) {
        this.r = r
        this.g = g
        this.b = b
    }


    static hexRegex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i // https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb

    static fromHex(hex) {
        let result = this.hexRegex.exec(hex);
        if (result != null) {
            return new RGB(parseInt(result[1], 16),parseInt(result[2], 16),parseInt(result[3], 16))
        };
        return new RGB(255,255,255) // invalid hex
    }

    static invert(rgb) {
        rgb.r = 255 - rgb.r;
        rgb.g = 255 - rgb.g;
        rgb.b = 255 - rgb.b;
        return rgb;
    }

    static colorToHex(c) {
        let hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    static toHex(rgb) {
        return "#" + this.colorToHex(rgb.r) + this.colorToHex(rgb.g) + this.colorToHex(rgb.b)
    }

    static invertHex(hex) {
        return this.toHex(this.invert(this.fromHex(hex)))
    }
}



class Person {
    constructor(health, behaviour, color, weapon, tags) {
        this.health = health;
        this.behaviour = behaviour;
        this.color = color;
        this.weapon = weapon;
        this.tags = tags;
        this.isDead = false;
    };

    async turn() {
        let dirString
        if ( this.behaviour) {
            dirString = this.behaviour(this.getIndex(),alivePeople(),this.weapon);
        } else {
            dirString = whosTurn.dir;
        }
        let dir = 0
        if (dirString == "right") dir = 1
        else if (dirString == "left") dir = -1
        //Move weapon, wait,
        await this.weapon.move(dir);

        return this.shoot(dir)
    }

    shoot(dir) {
        return summonOrbBulletFromIndex(this.getIndex(),this.weapon.offset,dir, true)
    }

    damage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.death()
        }
    };

    death() {
        this.isDead = true;
    };

    getIndex() {
        return game.content.people.indexOf(this)
    };

    personToThe(diff,evenDead = false) {
        let list
        evenDead ? list = alivePeople() : list = game.content.people
        return list[this.getIndex() + diff % list.length]
    };

    static personAt(index,diff,evenDead = false) {
        let list
        evenDead ? list = alivePeople() : list = game.content.people
        return list[(index + diff) % list.length]
    }

    static templates = {
        behaviours: {
            enemy(index,people,weapon) {
                if (people[(index + 1) % people.length].tags.includes("good")) return "right"
                else return "left"
            },
            loyal(index,people,weapon) {
                if (people[(index + 1) % people.length].tags.includes("bad")) return "right"
                else return "left"
            },
        },
        player(health,weapon) {
            return new Person(health, null,"#26fa5b",weapon,["player","good","controllable"])
        },
        enemy(health,weapon) {
            return new Person(health, Person.templates.behaviours.enemy,"#E63C28",weapon,["enemy","bad"])
        },
        loyal(health,weapon) {
            return new Person(health, Person.templates.behaviours.loyal,"#1f2fc2",weapon,["loyal","good"])
        },
    };
};



class OrbitalBullet{
    constructor(x, dir,liveTime,whoToDamage) {
        this.whoToDamage = whoToDamage;
        this.offset = x;
        this.x = x;
        this.dir = dir;
        this.liveTime = liveTime;
        this.totalTime = 0;
    }
    destroy() {
        game.content.people.filter(person => !person.isDead).at(this.whoToDamage % alivePeopleCount()).damage(1)
        game.content.orbBullets.splice(game.content.orbBullets.indexOf(this),1);
    }
    update(dt) {
        this.totalTime += dt;
        if (this.totalTime >= this.liveTime) {this.destroy(); return}
        this.x = this.totalTime*this.dir*ORB_BULLET_SPEED + this.offset;
    }
};


class Gun{
    constructor(sprite,damage,maxBullets,currentBullets = maxBullets,offset) {
        this.sprite = sprite;
        this.damage = damage;
        this.maxBullets = maxBullets;
        this.currentBullets = currentBullets;
        this.offset = offset;
        this.translateX = 225;
        this.scaleX = 1;
    }
    async shoot() {

    }
    async move(dir) {
        let newTranslateX;
        let newScaleX;
        if (dir == 1) {
            newScaleX = 1;
            newTranslateX = 225;
        } else if (dir == -1) {
            newScaleX = -1;
            newTranslateX = -225;
        }
        if (newTranslateX != this.translateX || newScaleX != this.scaleX)
        this.translateX = newTranslateX;
        this.scaleX = newScaleX;
        return "done";
    }
    static templates = {
        pistol() {
            return new Gun("pistol",1,10,10,15)
        }
    }
};
