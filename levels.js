let levels = {
    tutorialCampaing:{

    },
    mainCampaing:{
        level_1_1:{
            people:
            [
            Person.templates.player(5,Gun.templates.pistol()),
            Person.templates.enemy(3,Gun.templates.pistol()),
            Person.templates.enemy(2,Gun.templates.pistol()),
            Person.templates.loyal(3,Gun.templates.pistol()),
            Person.templates.enemy(2,Gun.templates.pistol()),
            ],
        },
        level_1_2:{
            people:
            [
            Person.templates.player(2,Gun.templates.pistol()),
            Person.templates.loyal(1,Gun.templates.pistol()),
            Person.templates.enemy(4,Gun.templates.pistol()),
            Person.templates.loyal(1,Gun.templates.pistol()),
            ],
        },
    }
}