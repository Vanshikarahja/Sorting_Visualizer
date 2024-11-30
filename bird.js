class Bird{
    constructor(lFoot,rFoot,height){
        this.lFoot=lFoot;
        this.rFoot=rFoot;
        this.height=height;
        this.head=null;
        this.lKnee=null;
        this.rKnee=null;
        this.queue=[];
        this.#update();
        this.legLength=distance(this.lFoot,this.head)*1.36;
        this.#update();
    }

    moveTo(lFoot,rFoot,doBounce=false,frameCount=40){
        for(let i=1;i<=frameCount;i++){
            const t=i/frameCount;
            const u=Math.sin(t*Math.PI);
            
            const w=doBounce?t*1.5-0.5:t;
            const frame={
                lFoot:vLerp(this.lFoot,lFoot,Math.max(0,w)),
                rFoot:vLerp(this.rFoot,rFoot,Math.max(0,w))
            };

            if(doBounce){
                frame.lFoot.y-=Math.max(0,w)*u*this.legLength*0.3;
                frame.rFoot.y-=Math.max(0,w)*u*this.legLength*0.3;
            }

            frame["head"]=average(frame.lFoot,frame.rFoot);
            frame["head"].y-=this.height;
            
            if(doBounce){
                const v=easeInOutBack(t);
                frame["head"].y-=v*this.legLength*0.28;
            }

            this.queue.push(frame);
        }
        if(doBounce){
            this.queue.push(this.queue[this.queue.length-1]);
            this.queue.push(this.queue[this.queue.length-1]);
            this.queue.push(this.queue[this.queue.length-1]);
            this.queue.push(this.queue[this.queue.length-1]);
        }

    }

    #update(){
        let changed=false;
        if(this.queue.length>0){
            const info=this.queue.shift();
            this.lFoot=info.lFoot;
            this.rFoot=info.rFoot;
            this.head=info.head;
            changed=true;
        }

        if(this.legLength){
            this.lKnee=this.#getKnee(this.head,this.lFoot);
            this.rKnee=this.#getKnee(this.head,this.rFoot,Math.PI);
        }else{
            this.head=average(this.lFoot,this.rFoot);
            this.head.y-=this.height;
            this.lKnee=average(this.lFoot,this.head);
            this.rKnee=average(this.rFoot,this.head);
        }

        return changed;
    }

    #getKnee(head,foot,angleOffset=0){
        const center=average(foot,head);
        const angle=Math.atan2(
            foot.y-head.y,
            foot.x-head.x
        );
        const base=distance(foot,head);
        const heightAbsoluteAngle=angle+Math.PI/2+angleOffset;
        const height=Math.sqrt(
            (this.legLength/2)**2-
            (base/2)**2
        );

        return{
            x:center.x+Math.cos(heightAbsoluteAngle)*height,
            y:center.y+Math.sin(heightAbsoluteAngle)*height
        }
    }

    #drawFeathers(ctx,center,radius,spread=1,count=3){
        const angle=Math.PI;
        for(let i=0;i<=count;i++){
            const t=i/count;
            const u=Math.sin(t*Math.PI)
            ctx.beginPath();
            ctx.ellipse(
                center.x+Math.cos(angle)*radius*spread*(t-1),
                center.y,
                radius*0.22,
                radius*0.72,
                angle+(1-t)*spread,
                0,Math.PI*2);
            ctx.fill();
            ctx.stroke();
        }
        for(let i=0;i<=count;i++){
            const t=i/count;
            const u=Math.sin(t*Math.PI)
            ctx.beginPath();
            ctx.ellipse(
                center.x-Math.cos(angle)*radius*spread*(t-1),
                center.y+Math.sin(angle)*radius*(1.32+u*0.3),
                radius*0.22,
                radius*0.72,
                angle-(1-t)*spread,
                0,Math.PI*2);
            ctx.fill();
            ctx.stroke();
        }
    }

    #drawHead(ctx){
        // head
        ctx.fillStyle="blue";
        ctx.strokeStyle="darkblue";
        const radius=15;
        
        ctx.save();
        ctx.translate(this.head.x-radius*1.3,this.head.y);
        ctx.rotate(-Math.PI/2);
        this.#drawFeathers(ctx,{
            x:0,
            y:0
        },radius,0.5,2);
        ctx.restore();
        
        ctx.save();
        ctx.translate(this.head.x+radius*1.3,this.head.y);
        ctx.rotate(Math.PI/2);
        this.#drawFeathers(ctx,{
            x:0,
            y:0
        },radius,0.5,2);
        ctx.restore();


        ctx.fillStyle="darkblue";
        
        ctx.beginPath();
        ctx.arc(this.head.x,this.head.y,radius,0,Math.PI*2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle="blue";
        ctx.save();
        ctx.translate(this.head.x,this.head.y-radius*1.3);
        this.#drawFeathers(ctx,{
            x:0,
            y:0
        },radius);
        ctx.restore();
        
        // beak
        ctx.fillStyle="orange";
        ctx.strokeStyle="black";
        ctx.beginPath();
        ctx.moveTo(
            this.head.x-radius*0.32,
            this.head.y+radius*0.3
        );
        ctx.lineTo(
            this.head.x,
            this.head.y+radius*1.5
        );
        ctx.lineTo(
            this.head.x+radius*0.32,
            this.head.y+radius*0.3
        );
        ctx.fill();
        ctx.stroke();

        const eyeSize=radius*0.8;
        ctx.beginPath();
        ctx.fillStyle="white";
        ctx.ellipse(
            this.head.x-radius*0.32,
            this.head.y,
            eyeSize*0.4,
            eyeSize*0.5,
            -0.3,
            0,Math.PI*2);
        ctx.fill();
        ctx.strokeStyle="black";
        ctx.stroke();
        ctx.beginPath();
        ctx.fillStyle="black";
        ctx.ellipse(
            this.head.x-radius*0.22,
            this.head.y+radius*0.1,
            eyeSize*0.2,
            eyeSize*0.2,
            -0.3,
            0,Math.PI*2);
        ctx.fill();

        
        ctx.beginPath();
        ctx.fillStyle="white";
        ctx.ellipse(
            this.head.x+radius*0.32,
            this.head.y,
            eyeSize*0.4,
            eyeSize*0.5,
            0.3,
            0,Math.PI*2);
        ctx.fill();
        ctx.strokeStyle="black";
        ctx.stroke();
        ctx.beginPath();
        ctx.fillStyle="black";
        ctx.ellipse(
            this.head.x+radius*0.22,
            this.head.y+radius*0.1,
            eyeSize*0.2,
            eyeSize*0.2,
            0.3,
            0,Math.PI*2);
        ctx.fill();

    }

    #drawFoot(ctx,knee,foot){
        ctx.strokeStyle="black";
        ctx.lineWidth=6;
        ctx.lineJoin="round";
        ctx.lineCap="round";

        ctx.beginPath();
        ctx.moveTo(this.head.x,this.head.y);
        ctx.lineTo(knee.x,knee.y);
        ctx.lineTo(foot.x,foot.y);
        const ankle=vLerp(knee,foot,0.7);
        const angle=Math.atan2(
            foot.y-knee.y,
            foot.x-knee.x
        );
        const dist=distance(ankle,foot);
        const finger1={
            x:ankle.x+dist*Math.cos(angle+0.5),
            y:ankle.y+dist*Math.sin(angle+0.5),
        }
        const finger2={
            x:ankle.x+dist*Math.cos(angle-0.5),
            y:ankle.y+dist*Math.sin(angle-0.5),
        }
        ctx.moveTo(finger1.x,finger1.y);
        ctx.lineTo(ankle.x,ankle.y);
        ctx.lineTo(finger2.x,finger2.y);
        
        ctx.stroke();
        
        ctx.strokeStyle="yellow";
        ctx.lineWidth=4;
        ctx.stroke();

        ctx.setLineDash([2,8]);
        ctx.strokeStyle="orange"; 
        ctx.stroke();
        ctx.setLineDash([]);
    }

    draw(ctx){
        const changed=this.#update();
        
        this.#drawFoot(ctx,this.rKnee,this.rFoot);
        this.#drawFoot(ctx,this.lKnee,this.lFoot);
        
        ctx.lineWidth=1;

        this.#drawHead(ctx);

        return changed;
    }
}