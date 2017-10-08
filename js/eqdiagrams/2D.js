var eps=0.0001; //error to zero;
//var color=["#ff8888", "#33ff88", "#6666ff","#f9e796", "#28fcff", "#f6085", "#ddb860"]; //strategy's color
var x_shift=400;
var y_space;
var moving_point;


function D2draw_canvas(i){ //draw the canvas of the 2D drawing for player i

    y_space=Number(2*GTE.diag.height-4*GTE.diag.margin)/20;

    temp = document.createElementNS("http://www.w3.org/2000/svg", "text");
    if (i==0){
        temp.textContent="Payoff to I";
        temp.setAttribute("class", "canvas0 player1 player1_title title up");
    }else{
        temp.textContent="Payoff to II";
        temp.setAttribute("class", "canvas1 player2 player2_title title up");
    }
    temp.setAttribute("x",Number(i*x_shift+150));
    temp.setAttribute("y",40);
    GTE.svg.appendChild(temp);


    temp = document.createElementNS("http://www.w3.org/2000/svg", "text");
    if (i==0){
        var j=2;
    }
    else{
        var j=1;}

    //strategies name on the upper part (adversary's strategies, always 2 of them)
    temp.textContent="d";
    temp.setAttribute("class", "canvas"+i+" player"+j+" strat"+Number(j-1)+"0 legendh up");
    temp.setAttribute("x",Number(i*x_shift+50));
    temp.setAttribute("y",372);
    GTE.svg.appendChild(temp);

    temp = document.createElementNS("http://www.w3.org/2000/svg", "text");
    temp.textContent="d";
    temp.setAttribute("class", "canvas"+i+" player"+j+" strat"+Number(j-1)+"1 legendh up");
    temp.setAttribute("x",Number(i*x_shift+250));
    temp.setAttribute("y",372);
    GTE.svg.appendChild(temp);

//strategies name on the lower part, "d=0"
temp = document.createElementNS("http://www.w3.org/2000/svg", "text");
temp.textContent="d";
temp.setAttribute("class", "canvas"+i+" player"+j+" strat_right strat"+Number(j-1)+"1_0 bottom");
temp.setAttribute("x",Number(i*x_shift+40));
temp.setAttribute("y",455);
GTE.svg.appendChild(temp);

temp = document.createElementNS("http://www.w3.org/2000/svg", "text");
temp.textContent="d";
temp.setAttribute("class", "canvas"+i+" player"+j+" strat_left strat"+Number(j-1)+"0_0 bottom");
temp.setAttribute("x",Number(i*x_shift+260));
temp.setAttribute("y",455);
GTE.svg.appendChild(temp);

temp = document.createElementNS("http://www.w3.org/2000/svg", "line");
temp.setAttribute("class","canvas"+i+" line"+j+ " bottom");
temp.setAttribute("x1", Number(GTE.diag.margin+i*x_shift));
temp.setAttribute("y1",Number(GTE.diag.height+GTE.diag.margin));
temp.setAttribute("x2", Number(GTE.diag.margin+i*x_shift+200));
temp.setAttribute("y2",Number(GTE.diag.height+GTE.diag.margin));
GTE.svg.appendChild(temp);

temp = document.createElementNS("http://www.w3.org/2000/svg", "line");
temp.setAttribute("class","canvas"+i+" stick bottom");
temp.setAttribute("x1", Number(GTE.diag.margin+i*x_shift));
temp.setAttribute("y1",Number(GTE.diag.height+GTE.diag.margin-5));
temp.setAttribute("x2", Number(GTE.diag.margin+i*x_shift));
temp.setAttribute("y2",Number(GTE.diag.height+GTE.diag.margin+5));
GTE.svg.appendChild(temp);

temp = document.createElementNS("http://www.w3.org/2000/svg", "line");
temp.setAttribute("class","canvas"+i+" stick bottom");
temp.setAttribute("x1", Number(GTE.diag.margin+i*x_shift+200));
temp.setAttribute("y1",Number(GTE.diag.height+GTE.diag.margin-5));
temp.setAttribute("x2", Number(GTE.diag.margin+i*x_shift+200));
temp.setAttribute("y2",Number(GTE.diag.height+GTE.diag.margin+5));
GTE.svg.appendChild(temp);

//<line class="line2 bottom" x1="50" y1="450" x2="250" y2="450"/>
//<line class="stick bottom" x1="50" y1="445" x2="50" y2="455"/>
//<line class="stick bottom" x1="250" y1="445" x2="250" y2="455"/>

//Fix bottom line of the upper part.
    temp = document.createElementNS("http://www.w3.org/2000/svg", "line");
    temp.setAttribute("class","canvas"+i+" contour up");
    temp.setAttribute("x1", Number(GTE.diag.margin+i*x_shift));
    temp.setAttribute("y1",Number(GTE.diag.height-GTE.diag.margin));
    temp.setAttribute("x2", Number(GTE.diag.margin+i*x_shift+200));
    temp.setAttribute("y2",Number(GTE.diag.height-GTE.diag.margin));

    GTE.svg.appendChild(temp);
//2 fix vertical lines of the upper part;
    temp = document.createElementNS("http://www.w3.org/2000/svg", "line");
    temp.setAttribute("class","canvas"+i+" contour up");
    temp.setAttribute("x1", Number(GTE.diag.margin+i*x_shift));
    temp.setAttribute("y1",Number(GTE.diag.margin));
    temp.setAttribute("x2", Number(GTE.diag.margin+i*x_shift));
    temp.setAttribute("y2",Number(GTE.diag.height-GTE.diag.margin));
    GTE.svg.appendChild(temp);

    temp = document.createElementNS("http://www.w3.org/2000/svg", "line");
    temp.setAttribute("class","canvas"+i+" contour up");
    temp.setAttribute("x1", Number(GTE.diag.margin+i*x_shift+200));
    temp.setAttribute("y1",Number(GTE.diag.margin));
    temp.setAttribute("x2", Number(GTE.diag.margin+i*x_shift+200));
    temp.setAttribute("y2",Number(GTE.diag.height-GTE.diag.margin));
    GTE.svg.appendChild(temp);

//sticks and labels.
    for (var k=0;k<9;k++){
        temp = document.createElementNS("http://www.w3.org/2000/svg", "line");
        temp.setAttribute("class", "canvas"+i+" stick up");
        temp.setAttribute("x1",Number(i*x_shift+50));
        temp.setAttribute("x2",Number(i*x_shift+45));
        temp.setAttribute("y1",Number(50+y_space+k*y_space));
        temp.setAttribute("y2",Number(50+y_space+k*y_space));
        GTE.svg.appendChild(temp);
        temp = document.createElementNS("http://www.w3.org/2000/svg", "text");
        temp.setAttribute("class", "canvas"+i+" sticklabel up");
        temp.setAttribute("x",Number(i*x_shift+35));
        temp.setAttribute("y",Number(55+y_space+k*y_space));
        temp.textContent=Number(9-k);
        GTE.svg.appendChild(temp);
        temp = document.createElementNS("http://www.w3.org/2000/svg", "line");
        temp.setAttribute("class", "canvas"+i+" stick up");
        temp.setAttribute("x1",Number(i*x_shift+250));
        temp.setAttribute("x2",Number(i*x_shift+255));
        temp.setAttribute("y1",Number(50+y_space+k*y_space));
        temp.setAttribute("y2",Number(50+y_space+k*y_space));
        GTE.svg.appendChild(temp);
        temp = document.createElementNS("http://www.w3.org/2000/svg", "text");
        temp.setAttribute("class", "canvas"+i+" sticklabel up");
        temp.setAttribute("x",Number(i*x_shift+35+230));
        temp.setAttribute("y",Number(55+y_space+k*y_space));
        temp.textContent=Number(9-k);
        GTE.svg.appendChild(temp);
    }
}

function draw_line([p1,p2],i,y){ //draw the payoff line for player i strategy y
    var q1=projection2D(p1,i);
    var q2=projection2D(p2,i);
    var temp = document.createElementNS("http://www.w3.org/2000/svg", "line");
    temp.setAttribute("class","canvas"+i+" line"+Number(i+1)+" strat"+y+" face up");
    temp.setAttribute("x1", Number(q1[0]));
    temp.setAttribute("y1", Number(q1[1]));
    temp.setAttribute("x2", Number(q2[0]));
    temp.setAttribute("y2", Number(q2[1]));

    GTE.svg.appendChild(temp);
    if (y>=0){
        if (i==0){
            var strat0=Number(GTE.diag.nb_strat[1]*y+0);
            var strat1=Number(GTE.diag.nb_strat[1]*y+1);
        }
        else{
            var strat0=Number(GTE.diag.nb_strat[1]*0+y);
            var strat1=Number(GTE.diag.nb_strat[1]*1+y);

        }
        var e=document.createElementNS("http://www.w3.org/2000/svg", "circle");
        e.setAttribute("cx",q1[0]);
        e.setAttribute("cy",q1[1]);
        e.setAttribute("r",GTE.POINT_RADIUS);
        e.setAttribute("class","canvas"+i+" pay line"+Number(i+1));
        e.setAttribute("strat",strat0);
        e.setAttribute("stratp",0);
        e.setAttribute("player",i);
        e.addEventListener("mousedown", D3MouseDownEndpoint);
        GTE.svg.appendChild(e);
        var e=document.createElementNS("http://www.w3.org/2000/svg", "circle");
        e.setAttribute("cx",q2[0]);
        e.setAttribute("cy",q2[1]);
        e.setAttribute("r",GTE.POINT_RADIUS);
        e.setAttribute("class","canvas"+i+" pay line"+Number(i+1));
        e.setAttribute("strat",strat1);
        e.setAttribute("stratp",1);
        e.setAttribute("player",i);
        e.addEventListener("mousedown", D2MouseDownEndpoint);
        GTE.svg.appendChild(e);
    }
}

function D2MouseDownEndpoint (event) {
    moving_point=event.currentTarget;
    document.addEventListener("mousemove", D2MouseMoveEndpoint);
    document.addEventListener("mouseup", D2MouseupEndpoint);
    event.currentTarget.removeEventListener("mousedown", D2MouseDownEndpoint);
};

function D2MouseMoveEndpoint (event) {

    y_space=Number(2*GTE.diag.height-4*GTE.diag.margin)/20;
    var mousePosition = GTE.getMousePosition(event);
    var svgPosition = GTE.svg.getBoundingClientRect();
    var stratp=moving_point.getAttribute("stratp");
    var strat=moving_point.getAttribute("strat");
    var player=moving_point.getAttribute("player");
    //console.log(stratp+" "+player);
    var ratio=2*GTE.diag.height/(svgPosition.bottom-svgPosition.top);
    if (stratp<2){
        var newPos=Math.round((GTE.diag.height-GTE.diag.margin-ratio*(mousePosition.y-svgPosition.top))/y_space*GTE.diag.precision)/GTE.diag.precision;
        //console.log(newPos);
    }
    else{
        var newPos=Math.round((ratio*(-mousePosition.y+svgPosition.top)+GTE.diag.height-3*GTE.diag.margin)/y_space*GTE.diag.precision)/GTE.diag.precision;
    }
    if (Number(newPos)<GTE.diag.min) newPos=GTE.diag.min; //if too low, stay to the minimum.
    if (Number(newPos)>GTE.diag.max) newPos=GTE.diag.max; //if too high, stay to the maximum.
    //Only redraw if the payoff changed.
    if( (Number(newPos)-moving_point.getAttribute("cy"))*(Number(newPos)-moving_point.getAttribute("cy"))>GTE.diag.precision*GTE.diag.precision*20){
        //change the matirx, according to the new payoffs.
        GTE.tree.matrix.matrix[strat].strategy.payoffs[player].value=newPos;
        GTE.tree.matrix.matrix[strat].strategy.payoffs[player].text=newPos;
        D2delete_canvas(player);
        D2draw_canvas(player);
        GTE.diag.redraw();
    }
};

function D2MouseupEndpoint (event) {
    var mousePosition = GTE.getMousePosition(event)
    document.removeEventListener("mousemove", D2MouseMoveEndpoint);
    document.removeEventListener("mouseup", D2MouseupEndpoint);
    moving_point.addEventListener("mousedown", D2MouseDownEndpoint);
    moving_point=null;
};

function projection2D(vector,i) { //from theory to reality
    y_space=Number(2*GTE.diag.height-4*GTE.diag.margin)/20;
    var shift=Number(2*this.margin+this.width);
    var vec0=[200,0];
    var vec1=[0,y_space];
    var temp=add2D(mul2D(vector[0],vec0),mul2D(vector[1],vec1));
    return [Number(temp[0]+GTE.diag.margin+i*(2*GTE.diag.margin+GTE.diag.width)),Number(GTE.diag.margin+300-temp[1])];
}

function projection_line(vector,i) { //from theory to reality
    var shift=Number(2*this.margin+this.width);
    var vec0=[200];
    var temp=Number(vector[0]*vec0);

    return [Number(temp+GTE.diag.margin+i*(2*GTE.diag.margin+GTE.diag.width)),450];
}

function add2D(vec1, vec2){
    return [Number(vec1[0]+vec2[0]),Number(vec1[1]+vec2[1])];
}

function sub2D(vec1, vec2){
    return [Number(vec1[0]-vec2[0]),Number(vec1[1]-vec2[1])];
}


function mul2D(a, vec1){
    return [a*vec1[0],a*vec1[1]];
}


function scal2D(vec1,vec2){
    return Number(vec1[0]*vec2[0]+vec1[1]*vec2[1]);
}

function equal2D(vec1, vec2){
    for (var i=0;i<2;i++){
        if ((vec1[i]-vec2[i])*(vec1[i]-vec2[i])>eps*eps)
        return false;
    }
    return true;
}

function equal_num (vec1, vec2){
    if ((vec1-vec2)*(vec1-vec2)>eps*eps)
    return false;
    return true;
}

function is_parallel2D(vec1,vec2){
    if (equal_num(vec1[0],0))
       if (equal_num(vec2[0],0))
          return equal_num(vec1[1],vec2[1]);
        else {
          return false;
        }
    var temp = Number(vec1[1]/vec1[0]);
    if (equal2D(temp,Number(-vec2[1]/vec0[0])))
       return true;
    return equal2D(temp,Number(vec2[1]/vec0[0]));
}

function normalize2D(vec){
    var norm=Math.sqrt(Number(vec[0]*vec[0]+vec[1]*vec[1]));
    return mul2D(1/norm,vec);
}

function line_intersect([p1,p2],[q1,q2]){
  if (equal_num(p1[0],p2[0]) && equal_num(p1[0], q1[0]) && equal_num(p1[0],q2[0]))
     return "all"; //two identical vertical lines.
  if (equal_num(p1[0],p2[0]),equal_num(q2[0], q1[0]))
     return null; // two different vertical lines.
  if (equal_num(p1[0],p2[0])){ // one vertical line, the other is not.
     a= Number(Number(q1[1]-q2[1])/Number(q1[0]-q2[0]));
     b= Number(q1[1]-q1[0]*a);
     return [p1[0],Number(p1[0]*a+b)];
  }
  if (equal_num(q1[0],q2[0])){ // one vertical line, the other is not.
    a= Number(Number(p1[1]-p2[1])/Number(p1[0]-p2[0]));
    b= Number(p1[1]-p1[0]*a);
  return [q1[0],Number(q1[0]*a+b)];
  }
  ap= Number(Number(p1[1]-p2[1])/Number(p1[0]-p2[0]));
  bp= Number(p1[1]-p1[0]*ap);

  aq= Number(Number(q1[1]-q2[1])/Number(q1[0]-q2[0]));
  bq= Number(q1[1]-q1[0]*aq);

  if (equal_num(ap,aq) && equal_num(bp,bq)) //identical
   return "all";
  if (equal_num(ap,aq))   //parallel
     return null;
  x= Number(Number(bq-bp)/Number(ap-aq));
  return [x,Number(x*ap+bp)];
}


function y_coor(x, [p1,p2]){ //return the z-coordinate of the point (x) in the line [p1,p2]
    if (equal_num(p1[0],p2[0])){
      console.log("Probleme intersection with vertical line.")
      return -1;
    }
    a= Number(Number(p1[1]-p2[1])/Number(p1[0]-p2[0]));
    b= Number(p1[1]-p1[0]*a);
    return Number(a*x+b);
}

function is_possible2D(vec,line){ //check if vec is a point in the convex envelope.
    if( vec[0]>Number(1+eps) || vec[0]<Number(0-eps))
        return false;
    for (var i=3;i<line.length;i++){ //not checking with the vetrical lines.
        var temp=y_coor(vec[0],line[i]);
        if (vec[1]<Number(temp-eps))
        return false;
    }
    return true;
}

function D2compute_best_response(player){ //main function uses all previous functions
    // the adversary of player has 2 strategies.
    //draw_canvas(player);
    var nb_strat=GTE.diag.nb_strat[player];
    var payoffs=[];
    //3 fix lines, the bottom and the 2 "sides"
    var line=[[[0,0],[1,0]],[[0,0],[0,1]],[[1,0],[1,1]]];
    for (var i=0;i<nb_strat;i++){
        payoffs.push([]);
        for (var j=0;j<2;j++){
            if (player==0)
            payoffs[i].push(GTE.diag.payoffs[0][i][j]);
            else
            payoffs[i].push(GTE.diag.payoffs[1][j][i]);
        }
        line[i+3]=[[0,payoffs[i][0]],[1,payoffs[i][1]]];
        draw_line(line[i+3],player,i);
    }
    //computing intersection of all pairs of lines
    var points=[];
    var points_to_line=[];
    var line_to_point=[];
    for (var i=0;i<line.length;i++)
        line_to_point.push([]);
    var nb_points=0
    for (var i=0;i<line.length-1;i++){
        var equals=[];
        nb_points=points.length;
        for (var j=i+1;j<line.length;j++){
            var temp=line_intersect(line[i],line[j]);
            if (temp==null)
            continue;
            if (temp=="all"){
                equals.push(j);
                continue;
            }
            points.push(temp);
            points_to_line.push([i,j]);
            line_to_point[i].push(points.length-1);
            line_to_point[j].push(points.length-1);

        }
        for (var k=0;k<equals.length;k++){ //add equals plans to associated plans.
            for (var l=nb_points;l<points.length;l++){
                points_to_line[l].push[equals[k]];
                line_to_point[equals[k]].push(l);
            }
        }
    }
    //check for unicity and inside points
    var u_points=[];
    var u_points_to_line=[];
    var u_line_to_points=[];
    for (var i=0;i<line.length;i++)
    u_line_to_points.push([]);
    for (var i=0;i<points.length-1;i++){
        if (is_possible2D(points[i],line)){
            var test=true;
            for (var j=i+1;j<points.length;j++){
                if (equal2D(points[i],points[j])){
                    for (var k=0;k<points_to_line[i].length;k++){
                        var test2=true;
                        for (l=0;l<points_to_line[j].length;l++){
                            if (points_to_line[j][l]==points_to_line[i][k]){
                                test2=false;
                                break;
                            }
                        }
                        if(test2)
                        points_to_line[j].push(points_to_line[i][k]);
                    }
                    test=false;
                }
            }
            if (test){
                u_points.push(points[i]);
                u_points_to_line.push([]);
                for (var k=0;k<points_to_line[i].length;k++){
                    u_points_to_line[u_points_to_line.length-1].push(points_to_line[i][k]);
                    u_line_to_points[points_to_line[i][k]].push(points[i]);
                }
            }
        }
    }

    var i=points.length-1;
    if (is_possible2D(points[i], line)){
        u_points.push(points[i]);
        u_points_to_line.push([]);
        for (var k=0;k<points_to_line[i].length;k++){
            u_points_to_line[u_points_to_line.length-1].push(points_to_line[i][k]);
            u_line_to_points[points_to_line[i][k]].push(points[i]);
        }
    }
    bpoints=[]; //bottom points;
    for (var i=3;i<u_line_to_points.length; i++){
        bpoints.push(draw_envelope2D(u_line_to_points[i],player,Number(i-3)));
    }
    return bpoints;
}

function draw_envelope2D(points2D,player,strat){ //draw the faces of the upper envelope. Based on the graham algorithm
    var points=[];
    var points1=[];
    var points2=[];
    var centeru=[0,0];
    var centerb=[0,0];
    var nb_points=0;
    var order_points2=[]
    for (var i=0;i<points2D.length;i++){
        points1.push(projection2D(points2D[i],player));
        points2.push(projection_line(points2D[i],player));
        points.push([points2D[i][0],points2D[i][1]]);
    }
    if (points.length <1)
    return [];
    if (points.lenght>2)
       console.log("more than two points.");
    var left_point=0;
    for (var i=0;i<points.length;i++){
        if(points[i][0]<points[left_point][0])
        left_point=i;
        else{
            if(points[i][0]==points[left_point][0] &&points[i][1]>points[left_point][1]){
                left_point=i;
            }
        }
    }
    centerb[0]=points2[left_point][0];
    centerb[1]=points2[left_point][1];
    centeru[0]=points1[left_point][0];
    centeru[1]=points1[left_point][1];
    order_points2.push(points2[left_point][0]);
    nb_points=1;
    var s=points1[left_point][0]+","+ Number(GTE.diag.margin)+" "+points1[left_point][0]+","+points1[left_point][1]+" ";
    var s2=points2[left_point][0]+","+points2[left_point][1]+" ";
    var test=true;
    var last_point=left_point;
    while (test){
        var increase_rate=-100000;
        var y_coor=0;
        var new_point=-1;
        for (var i=0;i<points.length;i++){
            if(i!=last_point && points[i][0]>points[last_point][0]-eps){
                if ((Number(points[last_point][1]-points[i][1]))/Number(points[i][0]-points[last_point][0])>increase_rate+eps){
                    increase_rate=(Number(points[last_point][1]-points[i][1]))/Number(points[i][0]-points[last_point][0]);
                    new_point=i;
                }
            }
        }
        for (var i=0;i<points.length;i++){
            if(i!=last_point && equal_num(points[i][0],points[last_point][0])){
                if (points[i][1]<y_coor+eps && points[i][1]>points[last_point][1]-eps){
                    y_coor=points[i][1]
                    new_point=i;
                }
            }
        }
        if (equal_num(new_point,-1))
        test=false;
        else{
            s=s+points1[new_point][0]+","+points1[new_point][1]+" "+ points1[new_point][0]+","+ Number(GTE.diag.margin);
            s2=s2+points2[new_point][0]+","+points2[new_point][1]+" ";
            centerb[0]=centerb[0]+points2[new_point][0];
            centerb[1]=centerb[1]+points2[new_point][1];
            centeru[0]=centeru[0]+points1[new_point][0];
            centeru[1]=centeru[1]+points1[new_point][1];
            order_points2.push(points2[new_point][0]);
            nb_points=nb_points+1;
            last_point=new_point;
            if (!equal_num(points2D[new_point][0],1)){
              var j=1;
              if (player==0)
                 j=2;
              var stick=document.createElementNS("http://www.w3.org/2000/svg", "line");
              stick.setAttribute("x1",points2[new_point][0]);
              stick.setAttribute("y1",455);
              stick.setAttribute("x2",points2[new_point][0]);
              stick.setAttribute("y2",445);
              stick.setAttribute("class","canvas"+player+" line"+j);
              GTE.svg.appendChild(stick);
              stick=document.createElementNS("http://www.w3.org/2000/svg", "text");
              stick.textContent=Math.round(points2D[new_point][0]*10)/10;
              stick.setAttribute("x",points2[new_point][0]);
              stick.setAttribute("y",435);
              stick.setAttribute("class","canvas"+player+" player"+j);
              GTE.svg.appendChild(stick);
            }
        }
    }

    var temp = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
    temp.setAttribute("class","canvas"+player+" project"+Number(player+1)+" face contour up");
    temp.setAttribute("points", s);
    GTE.svg.appendChild(temp);
    var temp2=GTE.svg.getElementsByClassName("line"+Number(player+1)+" strat"+strat)[0];
    GTE.svg.insertBefore(temp2,temp);
    GTE.svg.insertBefore(temp,temp2);
    var j;
    if (player==0){
       j=2;
    }
    else{
      j=1;
    }

    temp = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
    temp.setAttribute("class","canvas"+player+" line"+j+" face contour up");
    temp.setAttribute("points", s2);
    GTE.svg.appendChild(temp);

    if (nb_points>0){
        temp = document.createElementNS("http://www.w3.org/2000/svg", "text");
        temp.textContent="d";
        temp.setAttribute("class", "canvas"+player+" player"+Number(player+1)+" strat"+Number(player)+""+strat+" legendh up");
        temp.setAttribute("x",Number(centerb[0]/nb_points));
        temp.setAttribute("y",Number(centerb[1]/nb_points)+20);
        GTE.svg.appendChild(temp);
        temp = document.createElementNS("http://www.w3.org/2000/svg", "text");
        temp.textContent="d";
        temp.setAttribute("class", "canvas"+player+" player"+Number(player+1)+" strat"+Number(player)+""+strat+" legendh up");
        temp.setAttribute("x",Number(centeru[0]/nb_points));
        temp.setAttribute("y",Number(centeru[1]/nb_points)-20);
        GTE.svg.appendChild(temp);
    }
    return order_points2;
}

function D2delete_faces(){
    var temp=document.getElementsByClassName("face").length;
    for (var i=0;i<temp;i++)
    GTE.svg.removeChild(document.getElementsByClassName("face")[0]);

}

function D2delete_canvas(player){
    var temp=document.getElementsByClassName("canvas"+player).length;
    for (var i=0;i<temp;i++)
    GTE.svg.removeChild(document.getElementsByClassName("canvas"+player)[0]);
}
