class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        this.load.setPath("./assets/");

        // Load characters spritesheet
        this.load.atlas("platformer_characters", "adventurer-v1.5-Sheet.png", "adventurer-v1.5-Sheet.json");

        //console.log('platformer_characters');

        // Load tilemap information
        this.load.image("industrial_tiles", "industrial_pack.png");   
        this.load.image("dungeon_tiles", "tiny_dungeon.png");                            // Packed tilemap
        this.load.tilemapTiledJSON("platformer-level-1", "platformer-level-1.tmj");   // Tilemap in JSON

        this.load.image("bg_back", "building_back");
        this.load.image("bg_front", "building_front");

        this.load.audio("gem_sound", ["gem.wav"]);

        // Load the tilemap as a spritesheet
        this.load.spritesheet("tilemap_sheet_industrial", "industrial_pack.png", {
            frameWidth: 18,
            frameHeight: 18
        });

        this.load.spritesheet("tilemap_sheet_dungeon", "tiny_dungeon.png", {
            frameWidth: 16,
            frameHeight: 16
        });

        // Oooh, fancy. A multi atlas is a texture atlas which has the textures spread
        // across multiple png files, so as to keep their size small for use with
        // lower resource devices (like mobile phones).
        // kenny-particles.json internally has a list of the png files
        // The multiatlas was created using TexturePacker and the Kenny
        // Particle Pack asset pack.
        this.load.multiatlas("kenny-particles", "kenny-particles.json");
    }

    create() {
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNames('platformer_characters', {
                prefix: "adventurer-",
                start: 8,
                end: 13,
                //suffix: "-0",
                zeroPad: 1
            }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'idle',
            //defaultTextureKey: "platformer_characters",
            frames: this.anims.generateFrameNames('platformer_characters', {
                prefix: "adventurer-",
                start: 38,
                end: 41,
                //suffix: "-0",
                zeroPad: 1
            }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'jump',
            //defaultTextureKey: "platformer_characters",
            frames: this.anims.generateFrameNames('platformer_characters', {
                prefix: "adventurer-",
                start: 14,
                end: 21,
                //suffix: "-0",
                zeroPad: 1
            }),
            frameRate: 16
        });

         // ...and pass to the next Scene
         this.scene.start("platformerScene");
    }

    // Never get here since a new scene is started in create()
    update() {
    }
}