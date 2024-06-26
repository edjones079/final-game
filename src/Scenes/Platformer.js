class Platformer extends Phaser.Scene {
    constructor() {
        super("platformerScene");
    }

    init() {
        // variables and settings
        this.ACCELERATION = 100;
        this.DRAG = 100;    // DRAG < ACCELERATION = icy slide
        this.physics.world.gravity.y = 1250;
        this.JUMP_VELOCITY = -380;
        this.PARTICLE_VELOCITY = 50;
        this.SCALE = 2.0;
        this.poweredup = false;
        this.poweruptime = 1000;
        this.doubleJump = 2;
        this.collectibles = 15;

        this.tutorialTextSpawned = false;
        this.textTimer = 5000;
    }

    create() {

        this.cameras.main.fadeIn(1000, 0, 0, 0);

        console.log(this.cameras.main.x);
        console.log(this.cameras.main.y);
        // Create a new tilemap game object which uses 18x18 pixel tiles, and is
        // 45 tiles wide and 25 tiles tall.
        this.map = this.add.tilemap("platformer-level-1", 18, 18, 45, 25);

        // Load scrolling background
        this.background_back = this.add.tileSprite(0, 0, this.map.widthInPixels * 3, this.map.heightInPixels, "bg_back");
        this.background_back.setOrigin(0);
        this.background_back.setScrollFactor(0, 2.5);

        this.background_front = this.add.tileSprite(0, 0, this.map.widthInPixels * 3, this.map.heightInPixels, "bg_front");
        this.background_front.setOrigin(0);
        this.background_front.setScrollFactor(0, 2.5);

        // Load audio
        this.ding = this.sound.add("gem_sound", { loop: false });

        this.music = this.sound.add("level_1_music", { loop: true });

        this.music.play();
        

        // Load text
        this.titletext = this.add.text(100, 160, "The Artifactory", { fontSize: '16px', fill: '#fff'});
        this.titletext.setColor("white");
        //this.wintext.visible = false;
        this.titletext.setOrigin(0.5);

        this.resettext = this.add.text(142, 180, "Press 'E' near tutorial sign for help.", { fontSize: '10px', fill: '#fff'});
        this.resettext.setColor("white");
        //this.wintext.visible = false;
        this.resettext.setOrigin(0.5);

        this.wintext = this.add.text(100, 150, "Level: Incomplete", { fontSize: '8px', fill: '#fff'});
        this.wintext.setColor("white");
        //this.wintext.visible = false;
        this.wintext.setOrigin(0.4);


        // Create a game tier for power up 

        //this.startTime = new Date();


        // Add a tileset to the map
        // First parameter: name we gave the tileset in Tiled
        // Second parameter: key for the tilesheet (from this.load.image in Load.js)
        this.tileset_industrial = this.map.addTilesetImage("industrial-pack", "industrial_tiles");
        this.tileset_dungeon = this.map.addTilesetImage("tiny_dungeon-pack", "dungeon_tiles");

        // Create a layer
        this.groundLayer = this.map.createLayer("Ground-n-Platforms", this.tileset_industrial, 0, 0);
        this.secondLayer = this.map.createLayer("Background-n-Aesthetics", this.tileset_industrial, 0, 0);
        this.sludgeLayer = this.map.createLayer("Sludge", this.tileset_industrial, 0, 0);

        // Make it collidable
        this.groundLayer.setCollisionByProperty({
            collides: true
        });

        this.sludgeLayer.setCollisionByProperty({
            collides: true
        });

        // TODO: Add createFromObjects here
        this.coins = this.map.createFromObjects("Objects", {
            name: "elixir",
            key: "tilemap_sheet_dungeon",
            frame: 116
        });

        this.spawn = this.map.createFromObjects("Objects", {
            name: "spawn",
            key: "tilemap_sheet_industrial",
            frame: 65
        });

        console.log(this.spawn);

        this.powerup = this.map.createFromObjects("Objects", {
            name: "jump",
            key: "tilemap_sheet_industrial",
            frame: 61
        });

        this.tutorial = this.map.createFromObjects("Objects", {
            name: "tutorial",
            key: "tilemap_sheet_industrial",
            frame: 42,
            x: 378,
            y: 323
        });

        this.sludge = this.map.createFromObjects("Objects", {
            name: "sludge",
            key: "tilemap_sheet_industrial",
            frame: 29
        });

        // More text for the tutorial
        this.tutorialText1 = this.add.text(this.tutorial[0].x - 80, this.tutorial[0].y - 100, "You must collect all the elixirs!", { fontSize: '8px', fill: '#fff'});
        this.tutorialText2 = this.add.text(this.tutorial[0].x - 80, this.tutorial[0].y - 85, "Press 'R' to restart the current level.", { fontSize: '8px', fill: '#fff'});
        this.tutorialText3 = this.add.text(this.tutorial[0].x - 80, this.tutorial[0].y - 75, "Press 'N' to proceed to the next level.", { fontSize: '8px', fill: '#fff'});
        this.tutorialText1.visible = false;
        this.tutorialText2.visible = false;
        this.tutorialText3.visible = false;

        // TODO: Add turn into Arcade Physics here
        this.physics.world.enable(this.coins, Phaser.Physics.Arcade.STATIC_BODY);
        this.physics.world.enable(this.spawn, Phaser.Physics.Arcade.STATIC_BODY);
        this.physics.world.enable(this.powerup, Phaser.Physics.Arcade.STATIC_BODY);
        this.physics.world.enable(this.sludge, Phaser.Physics.Arcade.STATIC_BODY);

        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels, true, true, true, true);

        // set up player avatar
        my.sprite.player = this.physics.add.sprite(this.spawn[0]['x'], this.spawn[0]['y'] - 20, "platformer_characters", "adventurer-0");
        my.sprite.player.setCollideWorldBounds(true);
        my.sprite.player.body.setSize(15, 25, true);
        my.sprite.player.body.setOffset(18, 10);

        // Enable collision handling
        this.physics.add.collider(my.sprite.player, this.groundLayer);
        //this.physics.add.collider(my.sprite.player, this.sludgeLayer);

        this.coinGroup = this.add.group(this.coins);

        // TODO: Add coin collision handler
        this.physics.add.overlap(my.sprite.player, this.coinGroup, (obj1, obj2) => {
            obj2.destroy(); // remove coin on overlap
            this.ding.play();
            this.collectibles -= 1;
            //console.log(this.collectibles);

        });

        this.physics.add.overlap(my.sprite.player, this.powerup, (obj1, obj2) => {
            obj2.destroy();
            this.poweredup = true;
        });

        this.physics.add.overlap(my.sprite.player, this.sludge, (obj1, obj2) => {
            this.music.stop();
            this.scene.restart(); // remove coin on overlap
        });


        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();

        this.rKey = this.input.keyboard.addKey('R');
        this.aKey = this.input.keyboard.addKey('A');
        this.dKey = this.input.keyboard.addKey('D');
        this.nKey = this.input.keyboard.addKey('N');
        this.eKey = this.input.keyboard.addKey('E');

        this.spaceKey = this.input.keyboard.addKey('SPACE');

        // debug key listener (assigned to D key)
        this.input.keyboard.on('keydown-D', () => {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this);

        // TODO: Add movement particle vfx here
        my.vfx.walking = this.add.particles(0, 0, "kenny-particles", {
            frame: ['spark_01.png', 'spark_03.png'],
            // TODO: Try: add random: true
            scale: {start: 0.03, end: 0.1},
            // TODO: Try: maxAliveParticles: 8,
            lifespan: 350,
            // TODO: Try: gravityY: -400,
            alpha: {start: 1, end: 0.1}, 
        });

        my.vfx.walking.stop();

        my.vfx.jumping = this.add.particles(0, 0, "kenny-particles", {
            frame: ['magic_01.png', 'magic_03.png'],
            // TODO: Try: add random: true
            scale: {start: 0.03, end: 0.1},
            // TODO: Try: maxAliveParticles: 8,
            lifespan: 350,
            // TODO: Try: gravityY: -400,
            alpha: {start: 1, end: 0.1}, 
        });

        my.vfx.jumping.stop();
        

        // TODO: add camera code here
        this.cameras.main.setBounds(0, -5, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25); // (target, [,roundPixels][,lerpX][,lerpY])
        this.cameras.main.setDeadzone(200, 50);
        this.cameras.main.setZoom(this.SCALE * 1.25);

        console.log(this.tutorial[0].y);

    }

    update() {

        this.background_front.setTilePosition(this.cameras.main.scrollX);
        this.background_back.setTilePosition(this.cameras.main.scrollX);

        this.wintext.x = my.sprite.player.body.x;
        this.wintext.y = my.sprite.player.body.y - 10;

        if (Phaser.Input.Keyboard.JustDown(this.eKey) && Math.abs(my.sprite.player.x - this.tutorial[0].x) < 30)
        {
            
            this.tutorialText1.visible = !this.tutorialText1.visible;
            this.tutorialText2.visible = !this.tutorialText2.visible;
            this.tutorialText3.visible = !this.tutorialText3.visible;

        }

        if(this.aKey.isDown) {
            my.sprite.player.setAccelerationX(-this.ACCELERATION);
            my.sprite.player.setFlip(true, false);
            if (my.sprite.player.body.blocked.down)
                my.sprite.player.anims.play('walk', true);
            // TODO: add particle following code here

            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);

            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);

            // Only play smoke effect if touching the ground

            if (my.sprite.player.body.blocked.down) {

                my.vfx.walking.start();

            }

        } else if(this.dKey.isDown) {
            my.sprite.player.setAccelerationX(this.ACCELERATION);
            my.sprite.player.resetFlip();
            if (my.sprite.player.body.blocked.down)
                my.sprite.player.anims.play('walk', true);
            // TODO: add particle following code here

            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);

            my.vfx.walking.setParticleSpeed(-this.PARTICLE_VELOCITY, 0);

            // Only play smoke effect if touching the ground

            if (my.sprite.player.body.blocked.down) {

                my.vfx.walking.start();

            }

        } else {
            // Set acceleration to 0 and have DRAG take over
            my.sprite.player.setAccelerationX(0);
            my.sprite.player.setDragX(this.DRAG);

            if (my.sprite.player.body.blocked.down)
                my.sprite.player.anims.play('idle', true);
            // TODO: have the vfx stop playing

            my.vfx.walking.stop();
        }

        // player jump
        // note that we need body.blocked rather than body.touching b/c the former applies to tilemap tiles and the latter to the "ground"

        if(this.poweredup)
        {
            this.poweruptime--;
            if (this.poweruptime<= 0)
            {
                this.poweredup = false;
                this.poweruptime = 10;
            }
        }

        if(!my.sprite.player.body.blocked.down) {

            my.vfx.jumping.setParticleSpeed(-this.PARTICLE_VELOCITY, 0);
            my.sprite.player.anims.play('jump', true);
            my.vfx.jumping.start();
        }
        else
        {
            my.vfx.jumping.stop();
            this.doubleJump = 2;
        }

        if(Phaser.Input.Keyboard.JustDown(this.spaceKey) && this.doubleJump > 0) {
            if (this.poweredup)
            {
                my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY * 1.3);
            }
            else
            {
                my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);
            }
            this.doubleJump -= 1;
        }

        if(Phaser.Input.Keyboard.JustDown(this.rKey) && this.collectibles <= 0) {
            this.music.stop();
            this.scene.restart();
        }

        if (this.collectibles <= 0)
        {
            this.wintext.setText("Level: Complete");

            if (Phaser.Input.Keyboard.JustDown(this.nKey)) {

                this.cameras.main.pan(1000, 1000, 400, 'Bounce');

                this.cameras.main.once(Phaser.Cameras.Scene2D.Events.PAN_COMPLETE, (cam, effect) => {
                    this.scene.start('level2Scene');
                })

                //this.scene.start("level2Scene");
                this.music.stop();

            }
        }
    }
}