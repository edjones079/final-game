class credits extends Phaser.Scene {

    constructor() {
        super("creditsScene");
    }

    preload() {

    }

    create() {

        // Create background objects
        this.background = this.add.image(500, 400, "credits_background");

        //Create audio objects
        this.music = this.sound.add("credits_music", { loop: true });

        this.music.play();
        
        // Create input
        this.rKey = this.input.keyboard.addKey('R');

        // Create text

        this.restarttext = this.add.text(25, 25, "Press 'R' to return to the title screen", { fontSize: '20px', fill: '#fff', fontFamily: 'JazzClub'});
        this.restarttext.setColor("white");

        this.titletext = this.add.text(400, 1000, "Artifactory", { fontSize: '104px', fill: '#fff', fontFamily: 'JazzClub'});
        this.titletext.setColor("white");

        this.metext = this.add.text(500, 1150, "Developed by Emmett Jones", { fontSize: '32px', fill: '#fff', fontFamily: 'JazzClub'});
        this.metext.setColor("white");

        this.arttext = this.add.text(400, 1000, "Art Assets", { fontSize: '104px', fill: '#fff', fontFamily: 'JazzClub'});
        this.arttext.setColor("white");

        this.audiotext = this.add.text(400, 1000, "Audio Assets", { fontSize: '104px', fill: '#fff', fontFamily: 'JazzClub'});
        this.audiotext.setColor("white");



    }

    update() {

        this.titletext.y -= 3;
        this.metext.y -= 3;

        if (Phaser.Input.Keyboard.JustDown(this.rKey))
        {
            this.scene.start("menuScene");
            this.music.stop();
        }

    }

}