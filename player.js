function player(x, y){
    this.x = x;
    this.y = y;
    
    this.velX = 0;
    this.velY = 0;
    this.velStrafe = 0;
    this.velocity = 0;
    
    this.width = 1;
    this.height = 3;
    this.accel = 20;
    this.moveSpeed = 20;


    
    this.maxLife = 100;
    this.currentLife = 100;
    this.lifeRegen = 2;
    this.shotSpeed = 20;


    //cooldowns
    this.swapCooldown = 1;
    this.swapCooldownCurrent = 0;

    this.cameraCooldown = .25;
    this.cameraCooldownCurrent = 0;

    this.orientation = 90;

    this.state = "ship"; //ship, bot

    
    this.right = function(){return this.x + this.width/2;};
    this.left = function(){return this.x - this.width/2};
    this.top = function(){return this.y - this.height/2};
    this.bottom = function(){return this.y + this.height/2};
    
    this.printSides = function(){        
        console.log("Player Right: " + this.right() + " Left: " + this.left() + " Top" + this.top() + " Bottom" + this.bottom());
    }
    
    this.draw = function(){
        if(this.currentLife > 0){
            draw.drawPlayerRect(game.gameWidth/2, game.gameHeight/2, this.width, this.height, this.orientation);   
            draw.drawText(game.gameWidth/2, game.gameHeight/2, this.x + "," + this.y);  
        }
        else
            draw.drawText(game.gameWidth/2-8, game.gameHeight/2-6, "GAME OVER. PRESS R TO RESTART");
    }        
            
    this.update = function(dt){


        //Update Cooldowns
        this.swapCooldownCurrent -= dt;
        this.cameraCooldownCurrent -= dt;

        if(game.keys[75]){
            if(this.swapCooldownCurrent <= 0)
            {
                if(this.state =="bot")
                    this.state = "ship";
                else if(this.state == "ship")
                    this.state = "bot";
                this.swapCooldownCurrent = this.swapCooldown;
            }
        }

        if(game.keys[67]){
            if(this.cameraCooldownCurrent <= 0)
            {
                if(game.drawType =="camera"){
                    //draw = new drawPlayerCentricObject();
                    game.drawType = "player";
                }
                else if(game.drawType == "player"){
                    draw = new drawCameraCentricObject(this.x, this.y);
                    game.drawType = "camera";
                }
                this.cameraCooldownCurrent = this.cameraCooldown;
            }
        }

            if(game.drawType == "player")
            {
                draw.cameraX = this.x;
                draw.cameraY = this.y;
            }
                
        if(game.keys[66]){
            this.state = "ship";
        }
        if(this.state == "ship")
        {
            this.velStrafe/= 1.3;
            //A
            if(game.keys[65]){
                this.orientation+=2;
            }
            //D
            if(game.keys[68]){
                this.orientation-=2;
            }
                        
            if(game.keys[87]){
                this.velocity += this.accel*dt;
                if (this.velocity > this.moveSpeed*2)
                    this.velocity = this.moveSpeed*2;
            }
            
            if(game.keys[83]){
                this.velocity += -this.accel*dt;
                if (this.velocity < -this.moveSpeed*2)
                    this.velocity = -this.moveSpeed*2;
            }

            if(this.velocity < 10)
                this.velocity += this.accel*dt;
        }
        if(this.state == "bot")
        {
             //A
            if(game.keys[65]){
                this.velStrafe += -this.accel*20*dt;            
                if(this.velStrafe < -this.moveSpeed)
                    this.velStrafe = -this.moveSpeed;
            }
            //D
            else if(game.keys[68]){
                this.velStrafe += this.accel*20*dt;
                if(this.velStrafe > this.moveSpeed)
                    this.velStrafe = this.moveSpeed;
            }
            else 
                this.velStrafe /= 2;

            //A
            if(game.keys[74]){
                this.orientation+=2;            
            }
            //D
            else if(game.keys[76]){
                this.orientation-=2;;
            }
                        
            if(game.keys[87]){
                this.velocity += this.accel*20*dt;
                if (this.velocity > this.moveSpeed)
                    this.velocity = this.moveSpeed;
            }
            
            else if(game.keys[83]){
                this.velocity += -this.accel*20*dt;
                if (this.velocity < -this.moveSpeed)
                    this.velocity = -this.moveSpeed;
            }
            else
                this.velocity/=1.1;
        }

        if(game.keys[73]){
            console.log("shoot");
            this.shoot();
        }
        
        this.updateState(dt);
        
        var oldX = this.x;
        var oldY = this.y;
        
        this.x += this.velX;
        this.y += this.velY; 

        this.x += this.velocity * Math.cos(toRad(this.orientation))*dt + this.velStrafe * Math.cos(toRad(this.orientation - 90))*dt;
        this.y += this.velocity * Math.sin(toRad(this.orientation))*dt + this.velStrafe * Math.sin(toRad(this.orientation - 90))*dt;  
    }
    
    this.updateState = function(dt){
        
    }

    this.shoot = function(){        
        var pushBullet = new bullet(this.x, this.y, this.orientation, 100, 1);
        game.bullets.push(pushBullet);
    }
}