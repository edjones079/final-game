class menu extends Phaser.Scene {

    constructor() {
        super("menuScene");
    }

    preload() {
        
    }

    create() {

        // Create background objects
        this.background = this.add.image(500, 400, "menu_background");
        

        // Create audio objects
        this.music = this.sound.add("menu_music", { loop: true });

        this.music.play();
        

        //this.scene.add.text(300, 300, 'Button', { fontFamily: 'JazzClub' });

        this.nKey = this.input.keyboard.addKey('N');

        // Create text

        this.titletext = this.add.text(400, 250, "Artifactory", { fontSize: '104px', fill: '#fff', fontFamily: 'JazzClub'});
        this.titletext.setColor("white");

        this.metext = this.add.text(600, 400, "Press N to Start", { fontSize: '32px', fill: '#fff', fontFamily: 'JazzClub'});
        this.metext.setColor("white");
    }

    update() {


        if (Phaser.Input.Keyboard.JustDown(this.nKey))
        {
            this.cameras.main.fadeOut(1000, 0, 0, 0);

            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
                this.scene.start('platformerScene');
            })

            this.music.stop();
        }
    }

}