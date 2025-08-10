//load event listener, which will trigger a function when webpage has fully loaded 
window.addEventListener('load', function(){
    
    //canvas setup
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 630;

    let enemies = []; //array storing multiple enemy spawns 

    let gameOver = false; //variable used in collision detection, becomes true when collision occurs (for now)
    let chaseModeBool = false; //var used to activate chase mode 


    class InputHandler {
        constructor(){
            //keys array, storing keys currently being pressed by player 
            this.keys = [];

            //keydown event listener 
            window.addEventListener("keydown", e => {
                
                //if statements, determining whether arrow keys have been pressed and aren't in array already
                if ((   e.key === "ArrowDown" ||
                        e.key === "ArrowUp" ||
                        e.key === "ArrowLeft" ||
                        e.key === "ArrowRight")
                        && this.keys.indexOf(e.key) === -1){
                    this.keys.push(e.key)
                }
                //output the key pressed and the updated keys array, every time keydown event listener is triggered
                //console.log(e.key, this.keys);
            });

            //keyup event listener 
            window.addEventListener("keyup", e => {

                //if statements, determining whether arrow keys have been raised 
                if ((   e.key === "ArrowDown" ||
                        e.key === "ArrowUp" ||
                        e.key === "ArrowLeft" ||
                        e.key === "ArrowRight")){
                    this.keys.splice(this.keys.indexOf(e.key), 1);
                }
                //output the key pressed and the updated keys array, every time keyup event listener is triggered
                //console.log(e.key, this.keys);   
            });
        }
    } 


    class Player{
        //constructor method 
        constructor(gameWidth, gameHeight){

            //Player attributes 
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.width = 140;
            this.height = 140;
            this.x = 0;
            this.y = this.gameHeight - this.height;
            this.speed = 0;
            this.vy = 0;
            this.gravity = 1; 
        }   

        //onGround() utility function 
            
        onGround(){
            return (this.y >= this.gameHeight - this.height);
        }


        update(input, enemies){

            //collision detection //altered player update method, checks for collisions

            enemies.forEach(enemy => {

                const dx = (enemy.x + enemy.width/2) - (this.x + this.width/2); //finding difference in x/y values between player and all active enemies, + OFFSET accordingly, realigns hitbox
                const dy = (enemy.y + enemy.height/2) - (this.y + this.height/2);

                const distance = Math.sqrt(dx * dx + dy * dy) //using pythag, finds linear distance between player and all active enemies

                if (distance < enemy.width/2 + this.width/2){ //if distance is less than combined radiuses of player/enemy hitboxes, collision detected
                    chaseModeBool = true; //activates chaseMode 
                    
                    if(chaseModeTimer > 3000) gameOver = true; //if collision during chase mode, game ends 
                }
            }); 

            //controls, horizontal movement
            if(!chaseModeBool){ //normal player speeds, not during chase mode 
                if (input.keys.indexOf("ArrowRight") > -1){
                    this.speed = 8;
                }
                else if (input.keys.indexOf("ArrowLeft") > -1){
                    this.speed = -8;
                }
                else{
                    this.speed = 0;
                }
            }
            else{ //altered player speeds, during chase mode 
                if (input.keys.indexOf("ArrowRight") > -1){
                    this.speed = 5;
                }
                else if (input.keys.indexOf("ArrowLeft") > -1){
                    this.speed = -11;
                }
                else{
                    this.speed = -3;
                }
            }
    
            this.x += this.speed;

            //creating canvas boundaries, prevent player going off screen

            if (this.x < 0){this.x = 0};
            if (this.x > 0.8 * this.gameWidth - this.width){this.x = 0.8 * this.gameWidth - this.width}; //adjusted player canvas border
            if (this.y > this.gameHeight - this.height){this.y = this.gameHeight - this.height};

       
            //controls, vertical movement 

            if (input.keys.indexOf("ArrowUp") > -1 && this.onGround()){
                this.vy -= 30;
            }

            this.y += this.vy;
            
            if (!this.onGround()){
                this.vy += this.gravity;
            }

            else{
                this.vy = 0;
            }

            //in chase mode event, hitting left of screen causes game to end
            if((chaseModeTimer > 3000) && (this.x <= 0)) gameOver = true;
        }

        draw(context){
            //drawing player on canvas - MODELLED AS GREEN RECT 
            //context.fillStyle = "green";
            //context.fillRect(this.x, this.y, this.width, this.height); 


            //drawing player hitbox 
            context.strokeStyle = "white";
            context.beginPath();
            context.arc(this.x + this.width/2, this.y + this.height/2, this.width/2, 0, Math.PI * 2);

            context.fillStyle = "green"; //flling circles, no longer rectangular 
            context.fill()

            context.stroke(); 


            //eye 1
            context.strokeStyle = "black";
            //context.fillStyle = this.colour;
            context.beginPath();
            context.arc(this.x + this.width/4, this.y + this.height/4, this.width/4, 0, Math.PI * 2);

            context.fillStyle = "white"; //uses random colour, stored in attribute
            context.fill()

            context.stroke(); 

            //pupil 1

            context.strokeStyle = "black";
            //context.fillStyle = this.colour;
            context.beginPath();
            context.arc(this.x + this.width/4, this.y + this.height/4, this.width/10, 0, Math.PI * 2); //bigger pupils

            context.fillStyle = "black"; //uses random colour, stored in attribute
            context.fill()

            context.stroke(); 



            //eye 2
            context.beginPath();

            context.arc(this.x + this.width/1.5, this.y + this.height/4, this.width/4, 0, Math.PI * 2);

            context.fillStyle = "white"; //uses random colour, stored in attribute
            context.fill()

            context.stroke(); 



            //pupil 2
            context.beginPath();

            context.arc(this.x + this.width/1.5, this.y + this.height/4, this.width/10, 0, Math.PI * 2);

            context.fillStyle = "black"; //uses random colour, stored in attribute
            context.fill()

            context.stroke(); 



            //mouth
            context.beginPath();

            context.ellipse(this.x + this.width/2, this.y + this.height/1.5, this.width/6, this.width/12, Math.PI, 3, Math.PI * 2); //new smile mouth shape

            context.fillStyle = "black"; //uses random colour, stored in attribute
            context.fill()

            context.stroke(); 


            //tongue

            /*context.strokeStyle = "black";
            context.beginPath();

            context.ellipse(this.x + this.width/2, this.y + this.height/1.5, this.width/12, this.width/12, 0, 0, Math.PI * 2);

            context.fillStyle = "magenta"; //uses random colour, stored in attribute
            context.fill()

            context.stroke(); */

        } //visual demo of player hitbox surrounding them
}



    class Background{
        //constructor method 
        constructor(gameWidth, gameHeight){

            //Background attributes 
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;

            this.width = 1200;
            this.height = 630;

            this.x = 0;
            this.y = 0;

            this.speed = 0;
            
            this.image = document.getElementById("backgroundImage") //background image
        }   
        
        //draw method
        draw(context){ 
            context.drawImage(this.image, this.x, this.y, this.width, this.height)
            context.drawImage(this.image, this.x + this.width, this.y, this.width, this.height)
        }

       //update method
        update(player, input){
            if (((player.x >= 500) && (input.keys.indexOf("ArrowRight") != -1)) || chaseModeBool){

                this.speed = 5 //speed 5 if player moving at right of screen or chaseMode active
                forestProgress += this.speed //tallying player progress through the forest

            }
            else this.speed = 0
            //screen begins to scroll when player is on far right of screen
            //updating background.speed (x increment)

            this.x -= this.speed //incrementing background x 

            if (this.x < -(this.width)) this.x = 0 //ensure the background image is constantly refreshing to the right of the player 

        }

    }



    class Enemy1 { //original enemy class, for enemies moving RIGHT TO LEFT
        constructor(gameWidth, gameHeight){

            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;      

            this.width = Math.floor(Math.random() * 160); //generates random enemy width/height 0-160px
            this.height = this.width;
            
            this.x = this.gameWidth;
            this.y = Math.floor(Math.random()*(this.gameHeight - this.height)/3 + (this.gameHeight - this.height)*2/3)
            //spawns enemy at random y height in bottom 3rd of the screen


            this.speed = 2

            this.colour = randomColour() //attribute storing randomly generated RGB value

            this.markedForDeletion = false; //new markedForDeletion attribute
        }

        draw(context){  //modelling enemy as red rectangle 

            //drawing enemy on canvas - MODELLED AS RED RECT 

            //context.fillStyle = this.colour; //uses random colour, stored in attribute

            //context.fillRect(this.x, this.y, this.width, this.height); 

            //drawing enemy hitbox
            context.strokeStyle = "white";
     
            context.beginPath();
            context.arc(this.x + this.width/2, this.y + this.height/2, this.width/2, 0, Math.PI * 2);

            context.fillStyle = this.colour; //uses random colour, stored in attribute
            context.fill()

            context.stroke(); 


            
            //eye 1
            context.strokeStyle = "black";
            //context.fillStyle = this.colour;
            context.beginPath();
            context.arc(this.x + this.width/4, this.y + this.height/4, this.width/4, 0, Math.PI * 2);

            context.fillStyle = "white"; //uses random colour, stored in attribute
            context.fill()

            context.stroke(); 

            //pupil 1

            context.strokeStyle = "black";
            //context.fillStyle = this.colour;
            context.beginPath();
            context.arc(this.x + this.width/4, this.y + this.height/4, this.width/20, 0, Math.PI * 2);

            context.fillStyle = "black"; //uses random colour, stored in attribute
            context.fill()

            context.stroke(); 



            //eye 2
            context.beginPath();

            context.arc(this.x + this.width/1.5, this.y + this.height/4, this.width/4, 0, Math.PI * 2);

            context.fillStyle = "white"; //uses random colour, stored in attribute
            context.fill()

            context.stroke(); 



            //pupil 2
            context.beginPath();

            context.arc(this.x + this.width/1.5, this.y + this.height/4, this.width/20, 0, Math.PI * 2);

            context.fillStyle = "black"; //uses random colour, stored in attribute
            context.fill()

            context.stroke(); 


            //mouth
            context.beginPath();

            context.ellipse(this.x + this.width/2, this.y + this.height/1.5, this.width/6, this.width/12, 0, 10, Math.PI * 2);

            context.fillStyle = "black"; //uses random colour, stored in attribute
            context.fill()

            context.stroke(); 


            //tongue

            context.strokeStyle = "black";
            context.beginPath();

            context.ellipse(this.x + this.width/2, this.y + this.height/1.5, this.width/12, this.width/12, 0, 8, Math.PI * 2);

            context.fillStyle = "magenta"; //uses random colour, stored in attribute
            context.fill()

            context.stroke(); 

            





        } //visual demo of enemy hitbox surrounding them 


        update(){
            this.x -= this.speed; //movement of enemy from right to left 

            if (this.x < -(this.width)) {
                this.markedForDeletion = true; //when enemy goes off left side of screen, markedForDeletion
            }
        }
    }


    class Enemy2 extends Enemy1{ //enemies moving UP TO DOWN, inherits all features of Enemy1
        constructor(gameWidth, gameHeight){

            super(gameWidth, gameHeight) //constructor of Enemy1

            this.x = Math.floor(Math.random() * 0.8 * (this.gameWidth - this.width)); //spawns anywhere along the width of the screen
            this.y = 0 - this.height; //spawns above the top of the screen, out of view 

        }

        update(){
            this.y += this.speed; //movement of enemy from UP TO DOWN

            if (this.y > this.gameHeight) {
                this.markedForDeletion = true; //when enemy goes off bottom of screen, markedForDeletion
            }
        } 
    }

    class Enemy3 extends Enemy1{ //enemies moving LEFT TO RIGHT, inherits all features of Enemy1
        constructor(gameWidth, gameHeight){

            super(gameWidth, gameHeight) //constructor of Enemy1

            this.x = 0 - this.width; //spawns beyond left of the screen, initially out of view
            this.y = Math.floor(Math.random()*(this.gameHeight - this.height)/3 + (this.gameHeight - this.height)*2/3); //y coordinate anywhere in bottom 3rd of screen    
        }

        update(){
            this.x += this.speed; //movement of enemy from UP TO DOWN

            if (this.x > this.gameWidth) {
                this.markedForDeletion = true; //when enemy goes off bottom of screen, markedForDeletion
            }
        } 
    }

    class BigEnemy extends Enemy1{

        constructor(gameWidth, gameHeight){ 

            super(gameWidth, gameHeight) //constructor of Enemy1

            this.width = 250
            this.height = 250


            this.x = 0 - this.width; //spawns beyond left of the screen, initially out of view
            this.y = this.gameHeight - this.height - 150
        }

        update(){
            
            if(bigEnemyTimer > bigEnemyInterval && this.x < this.width) this.x += this.speed; //moves big enemy onscreen during bigEnemyNearby mode 
            if(bigEnemyTimer < bigEnemyInterval && this.x > 0 - this.width) this.x -= this.speed; //moves big enemy offscreen when bigEnemyNearby mode ends 
            //console.log("current x", this.x)
            //console.log("timer", bigEnemyTimer)

        } 
    }

    class Progress{ //new progress bar class

        constructor(gameWidth, gameHeight){

            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;      

            this.width = 400
            this.height = 50
            
            this.x = (this.gameWidth - this.width) / 2
            this.y = 100

            //this.colour = "rgb(00 00 00)"
        }

        draw(context){
             //drawing initial bar foundation
             context.fillStyle = "black"
             context.clearRect(this.x - 5, this.y, this.width + 5, this.height);  
             //context.fillStyle = "white"
             //context.rect(this.x - 6, this.y - 1, this.width + 6, this.height + 1);  
        } 

        update(context){

            //first 3rd of bar - red section
            if(forestProgress < forestFinish/3){

                //drawing the progressive first 3rd
                context.fillStyle = "red"
                context.fillRect(this.x, this.y + 5, Math.floor((forestProgress / forestFinish) * this.width), this.height - 10);  
             }
            
            //second 3rd of bar - yellow section
            if((forestProgress > forestFinish/3) && (forestProgress < forestFinish * 2/3)){

                //solid first 3rd, now filled out
                context.fillStyle = "red"
                context.fillRect(this.x, this.y + 5, Math.floor(this.width / 3), this.height - 10);  

                //drawing the progressive second 3rd
                context.fillStyle = "yellow"
                context.fillRect(this.x + Math.floor(400/3), this.y + 5, Math.floor(((forestProgress - forestFinish/3) / forestFinish) * this.width), this.height - 10);  
            }

            //final 3rd of bar - green section
            if((forestProgress > forestFinish * 2/3)){

                //solid first 3rd, now filled out
                context.fillStyle = "red"
                context.fillRect(this.x, this.y + 5, Math.floor(this.width / 3), this.height - 10);  

                //solid second 3rd, now filled out
                context.fillStyle = "yellow"
                context.fillRect(this.x + Math.floor(400/3), this.y + 5, Math.floor(this.width / 3), this.height - 10);  
            
                //drawing the progressive final 3rd
                context.fillStyle = "green"
                context.fillRect(this.x + Math.floor(400 * 2/3), this.y + 5, Math.floor(((forestProgress - forestFinish*2/3) / forestFinish) * this.width), this.height - 10);  
            }
            

            //game completion trigger 
            if(forestProgress >= forestFinish){
                
                //game completion message 
                ctx.font = "bold 40px Helvetica";
                ctx.textAlign = "center";
                ctx.fillStyle = "black";
                ctx.fillText("You escaped the forest!", canvas.width/2, 300)
                ctx.fillStyle = "white";
                ctx.fillText("You escaped the forest!", canvas.width/2 + 2, 302)

                gameOver = true; //ends game, cuts animation loop 
            }

            //game loss trigger
            else if(gameOver){
                
                //game loss message 
                ctx.font = "bold 40px Helvetica";
                ctx.textAlign = "center";
                ctx.fillStyle = "black";
                ctx.fillText("You were caught...", canvas.width/2, 300)
                ctx.fillStyle = "white";
                ctx.fillText("You were caught...", canvas.width/2 + 2, 302)
            } 
        }


    }
    

    //predefined functions to be used 

    function handleEnemies(deltaTime){ //used to periodically spawn enemies into the game 

        if (enemyTimer > enemyInterval){
            if(!chaseModeBool) {
                enemies.push(new Enemy1(canvas.width, canvas.height));
            }
            else{ //during chase mode, multiple enemy directions become available, each with an equal chance of spawning 
                n = Math.floor(Math.random() * 3)
                if (n==0) enemies.push(new Enemy1(canvas.width, canvas.height));
                else if (n==1) enemies.push(new Enemy2(canvas.width, canvas.height));
                else enemies.push(new Enemy3(canvas.width, canvas.height));
            }

            //random enemy speed, size generation

            newEnemy = enemies[enemies.length-1] //shortcut, defines enemy that has just been added to game, at end of the array

            if(chaseModeBool){
                    
                newEnemy.speed = Math.random() * 6 + 1.5 //randomising enemy speeds during chase mode 
                newEnemy.width = Math.floor(Math.random() * 180) + 20 //increasing average size of enemies during chase mode 
            }
            else{
                newEnemy.speed = 2 //returning enemy speed to normal when not in chase mode 
                newEnemy.width = Math.floor(Math.random() * 140) + 20 //reseting enemy sizes 
            }
            
            newEnemy.height = newEnemy.width //ensuring enemies are square


            enemyTimer = 0; //resets enemyTimer back to 0, repeating enemy spawn process
            enemyInterval = Math.random() * 9000 + 1000 //randomise enemy interval 



        }
        else {
            enemyTimer += deltaTime; //incrementing enemyTimer by deltaTime
        }


        enemies.forEach(enemy => { 
            //drawing enemy onto canvas screen
            enemy.draw(ctx);
            enemy.update();

            //removing enemies when no longer on screen
            enemies = enemies.filter(enemy => !enemy.markedForDeletion); //filters out enemies with true markedForDeletion value
        })
        //console.log(enemies) //for testing, check that enemies are actually removed from the array when they should
    }

    //player.update(input, enemies)

    function bigEnemyNearby(deltaTime){

        if(bigEnemyTimer > bigEnemyInterval){ 

            //console.log("pastX is currently", pastX) //for testing, to observe player.x changes 
            //console.log("player.x is currently", player.x) //for testing, to observe player.x changes 
            

            //displaying message that a big enemy is nearby
            ctx.font = "bold 40px Helvetica";
            ctx.fillStyle = "black";
            ctx.fillText("Stop Moving! A big Enemy Is Nearby...", 20, 50)
            ctx.fillStyle = "white";
            ctx.fillText("Stop Moving! A big Enemy Is Nearby...", 22, 52) //shadowing the text, to make it look nicer

            enemyInterval = 1000000 //stoppig small enemy spawns when big enemy nearby
            enemies = [] //enemyInterval = 8000

            if(bigEnemyTimer > bigEnemyInterval + 3000){

                if((player.x != pastX) || (input.keys.indexOf("ArrowRight") != -1)){ //checking for player movement
                    //displaying message that they were spotted

                    chaseModeBool = true; //activates chase mode 
                }

                if(bigEnemyTimer > bigEnemyInterval + 5000) bigEnemyTimer = 0; //resets timer, big enemy no longer nearby 
            }
        }
       
        else{
            if(bigEnemyTimer < 2000){
                ctx.font = "bold 40px Helvetica";
                ctx.fillStyle = "black";
                ctx.fillText("All Clear!", 20, 50)
                ctx.fillStyle = "white";
                ctx.fillText("All Clear!", 22, 52) //shadowing the text, to make it look nicer 
            }
            else{ //resets text to being clear on screen
                ctx.font = "bold 40px Helvetica";
                ctx.fillStyle = "black";
                ctx.fillText("", 20, 50)
                ctx.fillStyle = "white";
                ctx.fillText("", 22, 52) //shadowing the text, to make it look nicer 
            }

            if (enemyInterval == 1000000) enemyInterval = 8000; //readjusting enemyInterval, when event not occuring //important fix, ow always 8000 when bigenemynearby event not occuring
        }

        bigEnemyTimer += deltaTime; //incrementing bigEnemyTimer

        pastX = player.x //setting pastX = playerX, allowing player.x to update before next equality check 


    }

    function chaseMode(deltaTime){
        //timer increment 

        chaseModeTimer += deltaTime //increment chaseMode timer to synchronise events 
        //console.log(chaseModeTimer) //testing timer 

        //0-3s, chase mode, run message
        if(chaseModeTimer < 3000){
            ctx.textAlign = "center";
            ctx.fillStyle = "black";
            ctx.fillText("You Were Spotted! RUN!", canvas.width/2, 200)
            ctx.fillStyle = "white";
            ctx.fillText("You Were Spotted! RUN!", canvas.width/2 + 2, 202)
        }
        else{
            ctx.textAlign = "center";
            ctx.fillStyle = "black";
            ctx.fillText("", canvas.width/2, 200)
            ctx.fillStyle = "white";
            ctx.fillText("", canvas.width/2 + 2, 202)
        }

        // - stop big enemy appearances

        bigEnemyInterval = 999999999; //ensures big enemy event doesn't occur at same time as chase mode 

        //15s, safe

        if(chaseModeTimer > 12000){

            // - appropriate message, you're safe

            ctx.textAlign = "center";
            ctx.fillStyle = "black";
            ctx.fillText("You lost them, phew!", canvas.width/2, 200)
            ctx.fillStyle = "white";
            ctx.fillText("You lost them, phew!", canvas.width/2 + 2, 202)

            if(chaseModeTimer > 15000){
                // - chaseModeBool false => everything returns to norm
                
                chaseModeBool = false; 

                // - timer reset 

                chaseModeTimer = 0;

                // - restart big enemy appearances 

                bigEnemyTimer = 0 //FIX, so once big enemy interval reset, it isn't immediately triggered 
                bigEnemyInterval = 20000
                
            }
        }
    }

    function randomColour(){ //generate random RGB value string, for different coloured enemies 
        
        return "rgb(" + String(Math.floor(Math.random() * 256)) + " " + String(Math.floor(Math.random() * 128)) + " " + String(Math.floor(Math.random() * 256)) + ")"
    }
    

    //instances of classes
    const input = new InputHandler();
    const player = new Player(canvas.width, canvas.height);
    const background = new Background(canvas.width, canvas.height); 

    const bigEnemy = new BigEnemy(canvas.width, canvas.height);

    const progress = new Progress(canvas.width, canvas.height) //bar, winning/losing messages


    let lastTime = 0; //time variables 
    let enemyTimer = 0;
    let enemyInterval = 8000; //interval between enemy spawns in ms

    let bigEnemyTimer = 0; //big enemy time variables 
    let bigEnemyInterval = 20000;

    let chaseModeTimer = 0; //synchronises chase mode event 

    let pastX = 0; //stores last player x value temporarily, for player movement detection

    let forestProgress = 0 //stores player progress through forest, incremented when background scrolls 
    let forestFinish = 16000 //value of forestProgress required to escape, complete the game


    //animation loop
    function animate(timeStamp){ //amended animation loop, with handleEnemies called, possible gameover, deltaTime, time variable function

        const deltaTime = timeStamp - lastTime //difference between current, last time
        lastTime = timeStamp

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        background.draw(ctx)
        background.update(player, input)

        player.draw(ctx);
        player.update(input, enemies)

        bigEnemy.draw(ctx)
        bigEnemy.update()

        handleEnemies(deltaTime) 

        bigEnemyNearby(deltaTime)

        progress.draw(ctx)
        progress.update(ctx)


        if(chaseModeBool) chaseMode(deltaTime) //activates chaseMode function

        if(!gameOver) requestAnimationFrame(animate) //produces timeStamp variable argument 
    }
    animate(0) //calling the animate() function 



});

