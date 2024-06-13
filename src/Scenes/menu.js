class menu extends Phaser.Scene {

    constructor() {
        super("menuScene");
    }

    preload() {

    }

    create() {
        this.background = this.add.image(500, 400, "menu_background");

        this.nKey = this.input.keyboard.addKey('N');
    }

    update() {

        if (Phaser.Input.Keyboard.JustDown(this.nKey))
        {
            this.scene.start("platformerScene");
        }
    }

}