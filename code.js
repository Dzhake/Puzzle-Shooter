"use strict";

const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

let lastUpdate = Date.now()
let updateGame = true;
let time = 0;
let whosTurn = {
    person:0,
    state:"startTurn",
    dir:"right",
};
let turnsTimeout

const app = Vue.createApp({
    data() {
        return { 
            content: {
            },
        }
    },
});

app.component('Personc',Personc)
app.component('Healthc',Healthc)
app.component('Bulletc',Bulletc)

let game = app.mount("#game");

function onKeydown(event) {
    if (whosTurn.state == "awaitingInput") {
        if (event.code == "KeyA" || event.code == "ArrowLeft") {
            whosTurn.dir = "left"
            whosTurn.state = "awaitingBullet"
            game.content.people[whosTurn.person].turn()
        }
        if (event.code == "KeyD" || event.code == "ArrowRight") {
            whosTurn.dir = "right"
            whosTurn.state = "awaitingBullet"
            game.content.people[whosTurn.person].turn()
        }
    }
    
}



// DEBUG COMMANDS

// ahahaha who ever cares about debugging

// End of debug commands

function alivePeopleCount() {
    return game.content.people.filter(person => !person.isDead).length
}

function alivePeople() {
    return game.content.people.filter(person => !person.isDead)
}

function loadLevel(campaing,id) {
    loadLevelFromArray(levels[campaing][id]);
}

function loadLevelFromArray(array) {
    game.content = clone(array);
    // Clean everything
    game.content.orbBullets = [];
    game.content.winningMsg = {
        scale: 0,
        rotation: 0,
        text: "lorem ipsum :D",
        color: "#000000"
    }
    clearTimeout(turnsTimeout)
    whosTurn = {
        person:0,
        state:"startTurn"
    };
    // Set metadata
    if (game.content.metadata != null) {
        if (game.content.metadata.whoStarts != null) whosTurn.person = game.content.metadata.whoStarts;
    }

    let winning = checkWin()
    if (winning == "none") {
        if (alivePeople()[whosTurn.person].tags.includes("controllable")) {
            turns()
        } else {
            turnsTimeout = setTimeout(turns, 500)
        }
    } else {
        game.content.winningMsg.scale = 2
        game.content.winningMsg.rotation += 1
        game.content.winningMsg.text = winning + " " + randomArrayElement(peopleSynonyms) + " won"
        game.content.winningMsg.color = teamColors[winning] || "#000000"
    }
}


function nextTurn() {
    whosTurn.person = (whosTurn.person + 1) % alivePeopleCount()
    let winning = checkWin()
    if (winning == "none") {
        if (alivePeople()[whosTurn.person].tags.includes("controllable")) {
            turns()
        } else {
            turnsTimeout = setTimeout(turns, 500)
        }
    } else {
        game.content.winningMsg.scale = 2
        game.content.winningMsg.rotation += 1
        game.content.winningMsg.text = winning + " " + randomArrayElement(peopleSynonyms) + " won"
        game.content.winningMsg.color = teamColors[winning] || "#000000"
    }
}

function summonOrbBullet(x,offset,dir,liveTime,whoToDamage){
    let bullet = new OrbitalBullet(x + offset*dir,dir,liveTime - (Math.abs(offset/ORB_BULLET_SPEED)) - 30,whoToDamage)
    game.content.orbBullets.push(bullet)
    return bullet
}

/**
 * 
 * @param {int} index index from where to spawn bullet
 * @param {int} offset weapon offset, added to bullet's x
 * @param {int} dir 0 or 1
 * @returns {Bullet} bullet which was shooted
 */
function summonOrbBulletFromIndex(index,offset,dir) {
    let alivePeople = alivePeopleCount()
    let x = 360/alivePeople*index;
    let liveTime = 2000/alivePeople
    let whoToDamage = index+(1*dir)%alivePeople
    return summonOrbBullet(x,offset,dir,liveTime,whoToDamage)
}

function onLoad() {
    document.addEventListener('keydown', onKeydown)
}

function tick() {
    let now = Date.now();
    let dt = now - lastUpdate;
    lastUpdate = now;

    
    if (updateGame) {
        update(dt);
    }
    setTimeout(tick);
}

function update(dt) {
    time += dt;
    game.content.orbBullets.forEach(element => {
        element.update(dt)
    });
};

async function turns() {
    let bullet
    if (alivePeople()[whosTurn.person].tags.includes("controllable")) {
        whosTurn.state = "awaitingInput"
        await waitFor(() => whosTurn.state == "awaitingBullet")
    } else {
        whosTurn.state = "awaitingBullet"
        bullet = await game.content.people[whosTurn.person].turn()
    }

    await waitFor(() => game.content.orbBullets.length == 0) // await until bullet is dead

    nextTurn()
}

function checkWin() {
    let aliveTeams = []
    for (let person of alivePeople()) {
        for (let tag of person.tags) {
            if (!aliveTeams.includes(tag) && teams.includes(tag)) {
                aliveTeams.push(tag)
            }
        }
    }
    console.log("Alive teams: " + aliveTeams)
    if (aliveTeams.length == 1) return aliveTeams[0]
    else if (aliveTeams.length > 1) return "none"
    else if (aliveTeams.length == 0) console.log(new Error("0 teams are alive! Critical error! (maybe)! Please report this to developer (if you didn't expect this)"))
    else return "none" //no clue how can this happen
}


loadLevel("mainCampaing","level_1_2")

setTimeout(tick);