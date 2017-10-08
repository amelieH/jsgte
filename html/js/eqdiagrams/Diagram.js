GTE = (function(parentModule) {
    "use strict";
    /**
     * Creates a new Diagrams Class.
     * @class
     */
    function Diagram() {
        this.precision = 1/document.getElementById("precision").value; // precision for payoffs.
        this.endpoints = []; //two dimension array [player][strat] that contains endpoints.
        this.lines = []; //two dimension array [player][strat_player] that contains lines.
        this.payoffs = []; //three dimension array [player][strat_p1][strat_p2] that contains payoffs
        this.best_response = []; // two dimensions array [player][strat_other_player] that contains the best respons of a player. -1 means the two strategies are equivalent.
        this.nb_strat= [2,2];// Player's number of strategies.
        this.intersect= []; // 2 arrays containing the mixed equilibrium.
        this.equilibrium=[[],[]];
        this.moving_endpoint;
        this.moving_line;
        this.moving;
        this.prev_pos;
        this.rad=GTE.POINT_RADIUS;
        this.side=200;
        this.height=400;
        this.width=300;
        this.margin=50;
        this.max=10;
        this.min=0;
        this.strat=[[0,1],[0,1]];
        this.step= (this.height-Number(2*this.margin))/(this.max-Number(this.min));

    };

    Diagram.prototype.ini =function (){
        this.clear();
        this.strat=[[0,1],[0,1]];
        this.nb_strat=[GTE.tree.matrix.strategies[1].length,GTE.tree.matrix.strategies[2].length];
        this.ini_arrays();
        D3delete_canvas(0);
        D3delete_canvas(1);
        D2delete_canvas(0);
        D2delete_canvas(1);
        if (this.nb_strat[1]==3)
            D3draw_canvas(0);
        if (this.nb_strat[1]==2)
            D2draw_canvas(0);
        if (this.nb_strat[0]==3)
            D3draw_canvas(1);
        if (this.nb_strat[0]==2)
            D2draw_canvas(1);

    }

    Diagram.prototype.update_from_matrix = function (){
        if (Number(document.getElementById("precision").value) >0){
            GTE.diag.precision=1/Number(document.getElementById("precision").value);
            document.getElementById("precision").value=Number(document.getElementById("precision").value);
        }
        else{
            document.getElementById("precision").value=1/GTE.diag.precision;
        }
        this.nb_strat=[GTE.tree.matrix.strategies[1].length,GTE.tree.matrix.strategies[2].length];
        for( var i=0;i<this.nb_strat[0];i++){
            for (var j=0;j<this.nb_strat[1];j++){
                this.payoffs[0][i][j]=(Math.round(GTE.tree.matrix.matrix[Number(i*this.nb_strat[1]+j)].strategy.payoffs[0].value*GTE.diag.precision)/GTE.diag.precision);
                GTE.tree.matrix.matrix[Number(i*this.nb_strat[1]+j)].strategy.payoffs[0].value=this.payoffs[0][i][j];;
                this.payoffs[1][i][j]=(Math.round(GTE.tree.matrix.matrix[Number(i*this.nb_strat[1]+j)].strategy.payoffs[1].value*GTE.diag.precision)/GTE.diag.precision);
                GTE.tree.matrix.matrix[Number(i*this.nb_strat[1]+j)].strategy.payoffs[1].value=this.payoffs[1][i][j];

            }
        }

        //upates player's names
        var name_player=GTE.svg.getElementsByClassName("player1_name");
        for (var i=0;i<name_player.length;i++){
            name_player[i].textContent=GTE.tree.matrix.players[1].name;
        }
        var name_player=GTE.svg.getElementsByClassName("player1_title");
        for (var i=0;i<name_player.length;i++){
            name_player[i].textContent="Payoff to "+GTE.tree.matrix.players[1].name;
        }
        name_player=GTE.svg.getElementsByClassName("player2_name");
        for (var i=0;i<name_player.length;i++)
        name_player[i].textContent=GTE.tree.matrix.players[2].name;
        name_player=GTE.svg.getElementsByClassName("player2_title");
        for (var i=0;i<name_player.length;i++)
        name_player[i].textContent="Payoff to "+GTE.tree.matrix.players[2].name;

        //update strategies name
        for (var i=0;i<2;i++){
            for (var j=0;j<this.nb_strat[i];j++){
                var temp=GTE.svg.getElementsByClassName("strat"+i+""+j);
                for (var k=0;k<temp.length;k++)
                temp[k].textContent=GTE.tree.matrix.strategies[Number(i+1)][j].moves[0].name;
            }
        }
        for (var i=0;i<2;i++){
            for (var j=0;j<this.nb_strat[i];j++){
                var temp=GTE.svg.getElementsByClassName("strat"+i+""+j+"_0 ");
                for (var k=0;k<temp.length;k++)
                temp[k].textContent=GTE.tree.matrix.strategies[Number(i+1)][j].moves[0].name+"=0";
            }
        }


    };

    Diagram.prototype.ini_arrays = function() {
        for (var i=0; i<2; i++){
            this.payoffs.push([]);
            this.best_response.push([]);
            for (var j=0; j<this.nb_strat[0]; j++){
                this.payoffs[i].push([]);
                for (var k=0;k<this.nb_strat[1] ; k++){
                    this.payoffs[i][j].push(0);
                }
            }
            for (var j=0; j<GTE.tree.matrix.strategies[1+i].length; j++){
                this.best_response[i].push(-1);
            }
        }
    };

    Diagram.prototype.redraw = function (){

        GTE.tree.clear();
        document.getElementById('matrix-player-1').value = GTE.tree.matrix.getMatrixInStringFormat(0);
        document.getElementById('matrix-player-2').value = GTE.tree.matrix.getMatrixInStringFormat(1);
        GTE.tree.matrix.drawMatrix();
        this.clear();
        this.ini();
        this.update_from_matrix();
        var x=[196,225,596,625];
        var p=[2,1];
        D2delete_faces();
        D3delete_faces();
        var point1=[];
        var point2=[];
        if (this.nb_strat[0]==2)
        point2=D2compute_best_response(1);
        if (this.nb_strat[0]==3)
        D3compute_best_response(1);
        if (this.nb_strat[1]==2)
        point1=D2compute_best_response(0);
        if (this.nb_strat[1]==3)
        D3compute_best_response(0);
        if (this.nb_strat[1]==2&&this.nb_strat[0]==2){
        this.draw_square_down(point1,point2);
        }
        this.update_from_matrix();
    };

    Diagram.prototype.add_eq_text = function(s1,s2, id){
        var div= document.getElementById("eq_list");
        var h=document.createElement("h3");
        var temp = document.createTextNode("equilibrium     ");
        var temp2 = document.createElement("img");
        temp2.setAttribute("src", "images/eq"+id+".png");
        temp2.setAttribute("width", 11);
        h.appendChild(temp);
        h.appendChild(temp2);
        div.appendChild(h);
        var h = document.createElement("p");
        var font1 = document.createElement("font");
        var temp = document.createTextNode(GTE.tree.matrix.players[1].name);
        font1.style.cssText ='color:red;';
        var temp2 = document.createTextNode(" plays "+s1);
        font1.appendChild(temp);
        font1.appendChild(temp2);
        h.appendChild(font1);
        div.appendChild(h);
        var h = document.createElement("p");
        var font2 = document.createElement("font");
        font2.style.cssText ='color:blue;';
        var temp = document.createTextNode(GTE.tree.matrix.players[2].name);
        var temp2 = document.createTextNode(" plays "+s2);
        font2.appendChild(temp);
        font2.appendChild(temp2);
        h.appendChild(font2);
        div.appendChild(h);

    }


    Diagram.prototype.draw_line_down = function(strat_point,point, max){
        var temp= document.getElementsByClassName("line_down").length;
        for (var i=0;i<temp;i++){
            GTE.svg.removeChild(document.getElementsByClassName("line_down")[0]);
        }
        for (var j=0;j<this.equilibrium.length;j++){
            for (var i=0;i<this.equilibrium[j].length;i++){
                this.equilibrium[j][i].clear();
            }
        }
        this.equilibrium=[[],[],[]];
        var div=document.getElementById("eq_list");
        temp= div.children.length;
        for (var i=0;i<temp;i++){
            div.removeChild(div.children[0]);}

        var temp = document.createElementNS("http://www.w3.org/2000/svg", "line");
        temp.setAttribute("class", "line2 line_down");
        temp.setAttribute("x1",this.margin);
        temp.setAttribute("x2",this.width-this.margin);
        temp.setAttribute("y1",Number(this.height+this.margin));
        temp.setAttribute("y2",Number(this.height+this.margin));
        GTE.svg.appendChild(temp);
        temp = document.createElementNS("http://www.w3.org/2000/svg", "line");
        temp.setAttribute("class", "stick line_down");
        temp.setAttribute("x1",this.margin);
        temp.setAttribute("x2",this.margin);
        temp.setAttribute("y1",445);
        temp.setAttribute("y2",455);
        GTE.svg.appendChild(temp);
        temp = document.createElementNS("http://www.w3.org/2000/svg", "line");
        temp.setAttribute("class", "stick line_down");
        temp.setAttribute("x1",this.width-this.margin);
        temp.setAttribute("x2",this.width-this.margin);
        temp.setAttribute("y1",445);
        temp.setAttribute("y2",455);
        GTE.svg.appendChild(temp);
        var cmp=0;
        var x1;
        var x2;
        //degenerated equilibrium
        for (var i=0;i<strat_point[0].length;i++){
            var dege=[];
            var dege2=[];
            for (var j=0;j<strat_point[0][i].length;j++){
                if (this.payoffs[1][strat_point[0][i][j]][this.strat[1][0]]== this.payoffs[1][strat_point[0][i][j]][this.strat[1][1]]){
                    var in_test=false;
                    if (i<strat_point[0].length-1){
                        for (var k=0;k<strat_point[0][i+1].length;k++){
                            if (strat_point[0][i][j]==strat_point[0][i+1][k]){
                                in_test=false;
                                for (var l=0;l<dege.length;l++){
                                    if (dege[l]==strat_point[0][i][j])
                                    in_test=true;
                                }
                                if (in_test==false){
                                    dege.push(strat_point[0][i][j]);
                                    in_test=true;}
                            }
                        }
                    }
                    if ((i<strat_point[0].length-1 || this.best_response[0][1]==-1) &&((this.best_response[1][this.strat[0][0]]!=1 &&this.best_response[1][this.strat[0][1]]!=1 && i==0) || (this.best_response[1][this.strat[0][0]]!=0 &&this.best_response[1][this.strat[0][1]]!=0 &&i>0) )){
                        if (in_test==false && ((point[0][i][0]==50 || point[0][i][0]==250)||(this.payoffs[1][this.strat[0][0]][this.strat[1][0]]== this.payoffs[1][this.strat[0][0]][this.strat[1][1]]&&this.payoffs[1][this.strat[0][1]][this.strat[1][0]]== this.payoffs[1][this.strat[0][1]][this.strat[1][1]]))){
                            for (var l=0;l<dege2.length;l++){
                                if (dege2[l]==strat_point[0][i][j])
                                in_test=true;
                            }
                            for (var l=0;l<dege.length;l++){
                                if (dege[l]==strat_point[0][i][j])
                                in_test=true;
                            }
                            if (in_test==false){
                                dege2.push(strat_point[0][i][j]);
                                in_test=true;}
                        }
                    }
                }
            }
            if (dege.length>0){
                this.equilibrium[0][cmp]=new GTE.Marker(cmp,point[0][i][0],Number(this.height+this.margin),"#00ff00");
                this.equilibrium[0][cmp].degenerated(point[0][i+1][0]);
                if (max>1){
                    if (dege.length==1 && dege[0]==this.strat[0][0]){
                        this.equilibrium[1][cmp]=new GTE.Marker(cmp,Number(2*this.margin+this.width+this.margin),Number(this.height+this.margin),"#00ff00");
                        this.equilibrium[2][cmp]=new GTE.Marker(cmp,Number(point[0][i][0]/2+point[0][i+1][0]/2),Number(this.height+2*this.margin),"#00ff00");
                        var s2=GTE.tree.matrix.strategies[2][this.strat[1][1]].moves[0].name+" between "+this.pos_to_prob(0,point[0][i][0])+" and "+this.pos_to_prob(0,point[0][i+1][0]);
                        var s1=GTE.tree.matrix.strategies[1][dege[0]].moves[0].name;
                        this.add_eq_text(s1,s2,cmp);
                    }
                    if (dege.length==1 && dege[0]==this.strat[0][1]){
                        this.equilibrium[1][cmp]=new GTE.Marker(cmp,Number(2*this.width+this.margin),Number(this.height+this.margin),"#00ff00");
                        this.equilibrium[2][cmp]=new GTE.Marker(cmp,Number(point[0][i][0]/2+point[0][i+1][0]/2),Number(2*this.height-2*this.margin),"#00ff00");
                        var s2=GTE.tree.matrix.strategies[2][this.strat[1][1]].moves[0].name+" between "+this.pos_to_prob(0,point[0][i][0])+" and "+this.pos_to_prob(0,point[0][i+1][0]);
                        var s1=GTE.tree.matrix.strategies[1][dege[0]].moves[0].name;
                        this.add_eq_text(s1,s2,cmp);
                    }
                    if (dege.length==2){
                        this.equilibrium[1][cmp]=new GTE.Marker(cmp,Number(2*this.margin+this.width+this.margin),Number(this.height+this.margin),"#00ff00");
                        this.equilibrium[1][cmp].degenerated(Number(2*this.width+this.margin));
                        this.equilibrium[2][cmp]=new GTE.Marker(cmp,Number(point[0][i][0]/2+point[0][i+1][0]/2),Number(3*this.height/2),"#00ff00");
                        var s2=GTE.tree.matrix.strategies[2][this.strat[1][1]].moves[0].name+" between "+this.pos_to_prob(0,point[0][i][0])+" and "+this.pos_to_prob(0,point[0][i+1][0]);
                        var s1=GTE.tree.matrix.strategies[1][dege[0]].moves[0].name+" between 0 and 1";
                        this.add_eq_text(s1,s2,cmp);
                        break;
                    }
                }
                cmp=cmp+1;
            }
            if(dege2.length>0){
                this.equilibrium[0][cmp]=new GTE.Marker(cmp,point[0][i][0],Number(this.height+this.margin),"#00ff00");
                if (max==2){
                    this.equilibrium[1][cmp]=new GTE.Marker(cmp,Number(2*this.margin+this.width+this.margin),Number(this.height+this.margin),"#00ff00");
                    this.equilibrium[1][cmp].degenerated(Number(2*this.width+this.margin));
                    this.equilibrium[2][cmp]=new GTE.Marker(cmp,Number(point[0][i][0]),Number(3*this.margin+3/2*this.width),"#00ff00");
                    var s1=GTE.tree.matrix.strategies[1][this.strat[0][1]].moves[0].name+" between 0 and 1";

                    // }
                    var s2=GTE.tree.matrix.strategies[2][this.strat[1][1]].moves[0].name+" with probability "+this.pos_to_prob(0,point[0][i][0]);
                    this.add_eq_text(s1,s2,cmp);
                }
                cmp=cmp+1;

            }
        }

        //Adding the sible case not dealed
        if( this.best_response[0][0]==-1 && this.best_response[0][1]==1 && this.best_response[1][0]==0 && (this.best_response[1][1]==-1 || this.best_response[1][1]==0)){
            this.equilibrium[0][cmp]=new GTE.Marker(cmp,this.margin,Number(this.height+this.margin),"#00ff00");
            this.equilibrium[1][cmp]=new GTE.Marker(cmp,Number(2*this.margin+this.width+this.margin),Number(this.height+this.margin),"#00ff00");
            this.equilibrium[1][cmp].degenerated(Number(2*this.width+this.margin));
            this.equilibrium[2][cmp]=new GTE.Marker(cmp,Number(this.margin),Number(3*this.margin+3/2*this.width),"#00ff00");
            var s1=GTE.tree.matrix.strategies[1][this.strat[0][1]].moves[0].name+" between 0 and 1";
            var s2=GTE.tree.matrix.strategies[2][this.strat[1][1]].moves[0].name+" with probabilty 0 ";
            this.add_eq_text(s1,s2,cmp);
            cmp=cmp+1;
        }

        //Non degenerated equilibrium for the first player.
        for (var i=0;i<strat_point[0].length;i++){
            var test=false;
            var dege=false;
            for (var j=0;j<strat_point[0][i].length;j++){
                if (i==0&&strat_point[0][i].length==1 && this.payoffs[1][strat_point[0][i][j]][this.strat[1][0]]> this.payoffs[1][strat_point[0][i][j]][this.strat[1][1]]){
                    test=true;
                    x1=this.margin;
                    if (strat_point[0][i][j]==this.strat[0][1]){
                        x2=Number(2*this.width+this.margin);
                    }else{
                        x2=Number(2*this.margin+this.width+this.margin);

                    }
                }
                if (i==0 &&strat_point[0][i].length>1&&this.best_response[0][1]== strat_point[0][i][j]&& this.payoffs[1][this.strat[0][0]][this.strat[1][0]]== this.payoffs[1][this.strat[0][0]][this.strat[1][1]]&&this.payoffs[1][this.strat[0][1]][this.strat[1][1]]> this.payoffs[1][this.strat[0][1]][this.strat[1][0]]){
                    test=true;
                    x1=this.margin;
                    if (strat_point[0][i][j]==this.strat[0][1]){
                        x2=Number(2*this.margin+this.width+this.margin);
                    }else{
                        test=false;

                    }
                }
                if (i==0&&strat_point[0][i].length>1 &&this.best_response[0][1]!= strat_point[0][i][j]&&this.best_response[0][1]!= -1 && this.payoffs[1][this.strat[0][0]][this.strat[1][0]]<this.payoffs[1][this.strat[0][0]][this.strat[1][1]]&&this.payoffs[1][this.strat[0][1]][this.strat[1][1]]== this.payoffs[1][this.strat[0][1]][this.strat[1][0]]){
                    test=true;
                    x1=this.margin;
                    if (strat_point[0][i][j]==this.strat[0][1]){
                        x2=Number(2*this.width+this.margin);
                    }else{
                        test=false;

                    }
                }
                if (i>0 && i<strat_point[0].length-1&& this.payoffs[1][strat_point[0][i][j]][this.strat[1][0]] > this.payoffs[1][strat_point[0][i][j]][this.strat[1][1]]){
                    for (var k=0;k<strat_point[0][i].length;k++){
                        if (k!=j && this.payoffs[1][strat_point[0][i][k]][this.strat[1][0]] < this.payoffs[1][strat_point[0][i][k]][this.strat[1][1]]){
                            test=true;
                            x1=point[0][i][0];
                            x2=this.intersect[1][0].getPosx();
                        }
                    }
                }
                if (i==strat_point[0].length-1&&strat_point[0][i].length==1  && this.payoffs[1][strat_point[0][i][j]][this.strat[1][0]]< this.payoffs[1][strat_point[0][i][j]][this.strat[1][1]]){
                    test=true;
                    x1=this.width-this.margin;
                    if (strat_point[0][i][j]==this.strat[0][1]){
                        x2=Number(2*this.width+this.margin);
                    }else{
                        x2=Number(2*this.margin+this.width+this.margin);
                    }
                }

                if (i==strat_point[0].length-1&&strat_point[0][i].length>1 &&this.best_response[0][0]== strat_point[0][i][j]&& this.payoffs[1][this.strat[0][0]][this.strat[1][0]]> this.payoffs[1][this.strat[0][0]][this.strat[1][1]] && this.payoffs[1][this.strat[0][1]][this.strat[1][1]]== this.payoffs[1][this.strat[0][1]][this.strat[1][0]]){
                    test=true;
                    x1=this.width-this.margin;
                    if (strat_point[0][i][j]==this.strat[0][1]){
                        //x2=Number(2*this.margin+this.width+this.margin);
                        test=false;
                    }else{
                        x2=Number(2*this.width+this.margin);
                    }
                }

                if (i==strat_point[0].length-1&&strat_point[0][i].length>1 &&this.best_response[0][0]!= strat_point[0][i][j]&&this.best_response[0][0]!= -1&& this.payoffs[1][this.strat[0][0]][this.strat[1][0]]== this.payoffs[1][this.strat[0][0]][this.strat[1][1]] && this.payoffs[1][this.strat[0][1]][this.strat[1][1]]< this.payoffs[1][this.strat[0][1]][this.strat[1][0]]){
                    test=true;
                    x1=this.width-this.margin;
                    if (strat_point[0][i][j]==this.strat[0][0]){
                        //x2=Number(2*this.width+this.margin);
                        x2=Number(2*this.margin+this.width+this.margin);

                    }else{
                        test=false;
                    }
                }
            }

            if (test){
                this.equilibrium[0][cmp]=new GTE.Marker(cmp,x1,Number(this.height+this.margin),"#00ff00");
                if (max==2){
                    if (x2==Number(2*this.margin+this.width+this.margin)){
                        this.equilibrium[1][cmp]=new GTE.Marker(cmp,x2,Number(this.height+this.margin),"#00ff00");
                        if ((this.payoffs[0][this.strat[0][0]][this.strat[1][0]]== this.payoffs[0][this.strat[0][1]][this.strat[1][0]] && (this.best_response[1][0]==0||this.best_response[1][0]==-1)) ||( this.payoffs[0][this.strat[0][0]][this.strat[1][1]]== this.payoffs[0][this.strat[0][1]][this.strat[1][1]] && (this.best_response[1][0]==1||this.best_response[1][0]==-1))){
                            //if(this.intersect[1][0].getPosx()>Number(2*this.margin+this.width+this.margin) && this.intersect[1][0].getPosx()>Number(2*this.width+this.margin)){
                            this.equilibrium[1][cmp].degenerated(this.intersect[1][0].getPosx());
                            this.equilibrium[2][cmp]=new GTE.Marker(cmp,x1,Number(x2/2+this.intersect[1][0].getPosx()/2+this.margin),"#00ff00");
                            var s2=GTE.tree.matrix.strategies[2][this.strat[1][1]].moves[0].name+" with probability "+this.pos_to_prob(0,x1);
                            var s1=GTE.tree.matrix.strategies[1][this.strat[0][1]].moves[0].name+" between 0 and "+this.pos_to_prob(1,this.intersect[1][0].getPosx());
                            this.add_eq_text(s1,s2,cmp);
                        }
                        else {
                            this.equilibrium[2][cmp]=new GTE.Marker(cmp,x1,Number(x2+this.margin),"#00ff00");
                            var s2=GTE.tree.matrix.strategies[2][this.strat[1][1]].moves[0].name+" with probability "+this.pos_to_prob(0,x1);
                            var s1=GTE.tree.matrix.strategies[1][this.strat[0][1]].moves[0].name+" with probability "+this.pos_to_prob(1,x2);
                            this.add_eq_text(s1,s2,cmp);
                        }
                    }
                    else{

                        if (x2==Number(2*this.width+this.margin)){
                            if ((this.payoffs[0][this.strat[0][0]][this.strat[1][0]]== this.payoffs[0][this.strat[0][1]][this.strat[1][0]] && (this.best_response[1][1]==0||this.best_response[1][1]==-1)) ||(this.payoffs[0][this.strat[0][0]][this.strat[1][1]]== this.payoffs[0][this.strat[0][1]][this.strat[1][1]] && (this.best_response[1][1]==1||this.best_response[1][1]==-1))){
                                if (this.intersect[1][0].getPosx()>Number(2*this.margin+this.width+this.margin) && this.intersect[1][0].getPosx()<Number(2*this.width+this.margin)){
                                    this.equilibrium[1][cmp]=new GTE.Marker(cmp,this.intersect[1][0].getPosx(),Number(this.height+this.margin),"#00ff00");
                                }

                                else{
                                    this.equilibrium[1][cmp]=new GTE.Marker(cmp,Number(2*this.margin+this.width+this.margin),Number(this.height+this.margin),"#00ff00");}
                                this.equilibrium[1][cmp].degenerated(x2);
                                this.equilibrium[2][cmp]=new GTE.Marker(cmp,x1,Number(this.intersect[1][0].getPosx()/2+this.margin/2+this.width+this.margin),"#00ff00");
                                var s2=GTE.tree.matrix.strategies[2][this.strat[1][1]].moves[0].name+" with probability "+this.pos_to_prob(0,x1);
                                var s1=GTE.tree.matrix.strategies[1][this.strat[0][1]].moves[0].name+" between 0 and 1";
                                this.add_eq_text(s1,s2,cmp);
                            }else{

                                this.equilibrium[1][cmp]=new GTE.Marker(cmp,x2,Number(this.height+this.margin),"#00ff00");
                                this.equilibrium[2][cmp]=new GTE.Marker(cmp,x1,Number(x2+this.margin),"#00ff00");
                                var s2=GTE.tree.matrix.strategies[2][this.strat[1][1]].moves[0].name+" with probability "+this.pos_to_prob(0,x1);
                                var s1=GTE.tree.matrix.strategies[1][this.strat[0][1]].moves[0].name+" with probability "+this.pos_to_prob(1,x2);
                                this.add_eq_text(s1,s2,cmp);
                            }
                        }else {
                            this.equilibrium[1][cmp]=new GTE.Marker(cmp,x2,Number(this.height+this.margin),"#00ff00");
                            this.equilibrium[2][cmp]=new GTE.Marker(cmp,x1,Number(x2+this.margin),"#00ff00");
                            var s2=GTE.tree.matrix.strategies[2][this.strat[1][1]].moves[0].name+" with probability "+this.pos_to_prob(0,x1);
                            var s1=GTE.tree.matrix.strategies[1][this.strat[0][1]].moves[0].name+" with probability "+this.pos_to_prob(1,x2);
                            this.add_eq_text(s1,s2,cmp);
                        }
                    }
                }
                cmp=cmp+1;
            }
        }
    }

    function equal_arr(arr1,arr2){ //return the z-coordinate of the point (x) in the line [p1,p2]
        if (arr1.length==undefined)
        return false
        if (!arr1.length==arr2.length)
           return false;
        for (var i=0;i<arr1.length;i++){
          if (!equal_num(arr1[i],arr2[i]))
            return false;
        }
        return true;
    }

    Diagram.prototype.draw_square_down = function(points1=[],points2=[]){
      <!-- Drawing the contour-->
      var temp = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
      temp.setAttribute("class","canvas0 contour bottom");
      temp.setAttribute("points", "50,500 50,700 250,700, 250,500, 50,500");
      GTE.svg.appendChild(temp);

      <!-- Adding strategies name-->
      temp = document.createElementNS("http://www.w3.org/2000/svg", "text");
      temp.textContent="S1";
      temp.setAttribute("class", "canvas0 player1 strat_right strat00 bottom");
      temp.setAttribute("x",35);
      temp.setAttribute("y",505);
      GTE.svg.appendChild(temp);
      temp = document.createElementNS("http://www.w3.org/2000/svg", "text");
      temp.textContent="S2";
      temp.setAttribute("class", "canvas0 player1 strat_right strat01 bottom");
      temp.setAttribute("x",35);
      temp.setAttribute("y",705);
      GTE.svg.appendChild(temp);
      temp = document.createElementNS("http://www.w3.org/2000/svg", "text");
      temp.textContent="S1";
      temp.setAttribute("class", "canvas0 player2 strat strat10 bottom");
      temp.setAttribute("x",50);
      temp.setAttribute("y",720);
      GTE.svg.appendChild(temp);
      temp = document.createElementNS("http://www.w3.org/2000/svg", "text");
      temp.textContent="S2";
      temp.setAttribute("class", "canvas0 player2 strat strat11 bottom");
      temp.setAttribute("x",250);
      temp.setAttribute("y",720);
      GTE.svg.appendChild(temp);
      //<text class="player1 strat_right strat00 change bottom" x="35" y="505">S1 </text>
      //<text class="player1 strat_right strat01 change bottom" x="35" y="705">S2 </text>
      //<text class="player2 strat strat10 change bottom" x="50" y="720">S1 </text>
      //<text class="player2 strat strat11 change bottom" x="250" y="720">S2 </text>


     <!--Add strockes-->
     temp = document.createElementNS("http://www.w3.org/2000/svg", "line");
     temp.setAttribute("class", "canvas0 stick bottom");
     temp.setAttribute("x1",Number(50));
     temp.setAttribute("x2",Number(50));
     temp.setAttribute("y1",Number(460));
     temp.setAttribute("y2",Number(480));
     temp.setAttribute("marker-end","url(#triangle_down)");
     GTE.svg.appendChild(temp);
     temp = document.createElementNS("http://www.w3.org/2000/svg", "line");
     temp.setAttribute("class", "canvas0 stick bottom");
     temp.setAttribute("x1",Number(250));
     temp.setAttribute("x2",Number(250));
     temp.setAttribute("y1",Number(460));
     temp.setAttribute("y2",Number(480));
     temp.setAttribute("marker-end","url(#triangle_down)");
     GTE.svg.appendChild(temp);
     //Looking for a middle point.
     var x_mid=250;
     for (var i=0;i<points1.length;i++){
       for (var j=0;j<points1[i].length;j++){
         if (!equal_num(points1[i][j],250) && !equal_num(points1[i][j],50)){
           x_mid=points1[i][j];
         }
       }
     }
     temp = document.createElementNS("http://www.w3.org/2000/svg", "line");
     temp.setAttribute("class", "canvas0 stick player1 bottom");
     temp.setAttribute("x1",Number(x_mid));
     temp.setAttribute("x2",Number(x_mid));
     temp.setAttribute("y1",Number(460));
     temp.setAttribute("y2",Number(480));
     temp.setAttribute("marker-end","url(#triangle_down)");
     GTE.svg.appendChild(temp);
     //<line class="stick bottom" x1="50" y1="460" x2="50" y2="480" marker-end="url(#triangle_down)"/>
     //<line class="stick bottom" x1="250" y1="460" x2="250" y2="480" marker-end="url(#triangle_down)"/>
     //<line class="stick player1 bottom" x1="250" y1="460" x2="250" y2="480" marker-end="url(#triangle_down)"/>

     temp = document.createElementNS("http://www.w3.org/2000/svg", "path");
     temp.setAttribute("class", "canvas0 arc bottom");
     temp.setAttribute("d","M450,460 A40,40 0 0,1 410,500");
     GTE.svg.appendChild(temp);
     temp = document.createElementNS("http://www.w3.org/2000/svg", "path");
     temp.setAttribute("class", "canvas0 arc bottom");
     temp.setAttribute("d","M650,460 A240,240 0 0,1 410,700");
     GTE.svg.appendChild(temp);
     //Looking for a middle point.
     var x_mid=650;
     for (var i=0;i<points2.length;i++){
       for (var j=0;j<points2[i].length;j++){
         if (!equal_num(points2[i][j],450) && ! equal_num(points2[i][j],650)){
           x_mid=points2[i][j];
         }
       }
     }
     var diff=Number(x_mid-450);
     temp = document.createElementNS("http://www.w3.org/2000/svg", "path");
     temp.setAttribute("class", "canvas0 arc bottom player2");
     temp.setAttribute("d","M"+x_mid+",460 A"+Number(40+diff)+","+Number(40+diff)+" 0 0,1 410,"+Number(500+diff));
     GTE.svg.appendChild(temp);
     //<path class="arc bottom" d="M450,460 A40,40 0 0,1 410,500"/>
     //<path class="arc bottom" d="M650,460 A240,240 0 0,1 410,700"/>
     //<path class="arc player2 bottom" d="M650,460 A240,240 0 0,1 410,700"/>

     temp = document.createElementNS("http://www.w3.org/2000/svg", "line");
     temp.setAttribute("class", "canvas0 stick bottom");
     temp.setAttribute("x1",Number(410));
     temp.setAttribute("x2",Number(280));
     temp.setAttribute("y1",Number(500));
     temp.setAttribute("y2",Number(500));
     temp.setAttribute("marker-end","url(#triangle_down)");
     GTE.svg.appendChild(temp);
     temp = document.createElementNS("http://www.w3.org/2000/svg", "line");
     temp.setAttribute("class", "canvas0 stick bottom");
     temp.setAttribute("x1",Number(410));
     temp.setAttribute("x2",Number(280));
     temp.setAttribute("y1",Number(700));
     temp.setAttribute("y2",Number(700));
     temp.setAttribute("marker-end","url(#triangle_down)");
     GTE.svg.appendChild(temp);
     temp = document.createElementNS("http://www.w3.org/2000/svg", "line");
     temp.setAttribute("class", "canvas0 stick player2 bottom");
     temp.setAttribute("x1",Number(410));
     temp.setAttribute("x2",Number(280));
     temp.setAttribute("y1",Number(500+diff));
     temp.setAttribute("y2",Number(500+diff));
     temp.setAttribute("marker-end","url(#triangle_down)");
     GTE.svg.appendChild(temp);
     //<line class="stick bottom" x1="410" y1="500" x2="280" y2="500" marker-end="url(#triangle_down)"/>
     //<line class="stick bottom" x1="410" y1="700" x2="280" y2="700" marker-end="url(#triangle_down)"/>
     //<line class="stick player2 bottom" x1="410" y1="700" x2="280" y2="700" marker-end="url(#triangle_down)"/>


      <!-- Best player1 --->
      var NE1_candidate=[];
      var NE2_candidate=[];
      var NE=[];
      if (points1[0].length==0){ //S1 is strictly dominated.
         temp = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
         temp.setAttribute("class","canvas0 brline line1 bottom");
         temp.setAttribute("points", "50,700 250,700");
         GTE.svg.appendChild(temp);
         NE1_candidate.push(1);
         NE2_candidate.push([0,1]);
      }
      if (points1[1].length==0){ //S2 is strictly dominated.
         temp = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
         temp.setAttribute("class","canvas0 brline line1 bottom");
         temp.setAttribute("points", "50,500 250,500");
         GTE.svg.appendChild(temp);
         NE1_candidate.push(0);
         NE2_candidate.push([0,1]);
      }
      if (points1[0].length==1){ //S1 is weakly dominated.
         NE1_candidate.push([0,1]);
         NE1_candidate.push(1);
         var s="50,700 250,700";
         if (equal_num(points1[0][0],50)){
           s="50,500 "+s;
           NE2_candidate.push(0);
           NE2_candidate.push([0,1]);
         }
         else {
           s=s+" 250,500";
           NE2_candidate.push(1);
           NE2_candidate.push([0,1]);
         }
         temp = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
         temp.setAttribute("class","canvas0 brline line1 bottom");
         temp.setAttribute("points", s);
         GTE.svg.appendChild(temp);
      }
      if (points1[1].length==1){ //S2 is weakly dominated.
        NE1_candidate.push([0,1]);
        NE1_candidate.push(0);
         var s="50,500 250,500";
         if (equal_num(points1[1][0],50)){
           s="50,700 "+s;
           NE2_candidate.push(0);
           NE2_candidate.push([0,1]);
         }
         else {
           s=s+" 250,700";
           NE2_candidate.push(1);
           NE2_candidate.push([0,1]);
         }
         temp = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
         temp.setAttribute("class","canvas0 brline line1 bottom");
         temp.setAttribute("points", s);
         GTE.svg.appendChild(temp);
      }
      if (points1[0].length==2 && points1[1].length==2){
        if (equal_num(points1[0][0],points1[1][0])){ // Game highly degenerated
          var s="50,500 250,500 250,700, 50,700, 50,500";
          temp = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
          temp.setAttribute("class","canvas0 brline line1 bottom");
          temp.setAttribute("points", s);
          GTE.svg.appendChild(temp);
          NE1_candidate.push([0,1]);
          NE2_candidate.push([0,1]);
        }
        if(points1[0][0]<points1[1][0]){ //S1 First.
          var s="50,500 "+points1[0][1]+",500 "+points1[0][1]+",700 250,700";
          temp = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
          temp.setAttribute("class","canvas0 brline line1 bottom");
          temp.setAttribute("points", s);
          GTE.svg.appendChild(temp);
          NE1_candidate.push(0);
          NE1_candidate.push("any");
          NE1_candidate.push(1);
          NE2_candidate.push(0);
          NE2_candidate.push(Number(Number(points1[0][1]-GTE.diag.margin)/200));
          NE2_candidate.push(1);
        }
        if(points1[0][0]>points1[1][0]){ //S2 First.
          var s="50,700 "+points1[1][1]+",700 "+points1[1][1]+",500 250,500";
          temp = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
          temp.setAttribute("class","canvas0 brline line1 bottom");
          temp.setAttribute("points", s);
          GTE.svg.appendChild(temp);
          NE1_candidate.push(1);
          NE1_candidate.push("any");
          NE1_candidate.push(0);
          NE2_candidate.push(0);
          NE2_candidate.push(Number(Number(points1[1][1]-GTE.diag.margin)/200));
          NE2_candidate.push(1);
        }
      }

      <!-- Best player2 --->
      if (points2[0].length==0){ //S1 is strictly dominated.
         temp = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
         temp.setAttribute("class","canvas0 brline line2 bottom");
         temp.setAttribute("points", "250,500 250,700");
         GTE.svg.appendChild(temp);
         for (var i=0;i<NE1_candidate.length;i++){
           if (NE2_candidate[i]==1){
             NE.push([NE1_candidate[i],NE2_candidate[i]]);
           }
         }
      }
      if (points2[1].length==0){ //S2 is strictly dominated.
         temp = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
         temp.setAttribute("class","canvas0 brline line2 bottom");
         temp.setAttribute("points", "50,500 50,700");
         GTE.svg.appendChild(temp);
         for (var i=0;i<NE1_candidate.length;i++){
           if (NE2_candidate[i]==0){
             NE.push([NE1_candidate[i],NE2_candidate[i]]);
           }
         }
      }
      if (points2[0].length==1){ //S1 is weakly dominated.
        for (var i=0;i<NE1_candidate.length;i++){
          if (NE2_candidate[i]==1){
            NE.push([NE1_candidate[i],NE2_candidate[i]]);
          }
        }
         var s="250,500 250,700";
         if (equal_num(points2[0][0],450)){
           for (var i=0;i<NE1_candidate.length;i++){
             if (NE1_candidate[i]==0){
               NE.push([NE1_candidate[i],NE2_candidate[i]]);
             }
             if (NE1_candidate[i]=="any"){
               NE.push([0,NE2_candidate[i]]);
             }
           }
           s="50,500 "+s;
         }
         else {
           for (var i=0;i<NE1_candidate.length;i++){
             if (NE1_candidate[i]==1){
               NE.push([NE1_candidate[i],NE2_candidate[i]]);
             }
             if (NE1_candidate[i]=="any"){
               NE.push([1,NE2_candidate[i]]);
             }
           }
           s=s+" 50,700";
         }
         temp = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
         temp.setAttribute("class","canvas0 brline line2 bottom");
         temp.setAttribute("points", s);
         GTE.svg.appendChild(temp);
      }
      if (points2[1].length==1){ //S2 is weakly dominated.
        for (var i=0;i<NE1_candidate.length;i++){
          if (NE2_candidate[i]==0){
            NE.push([NE1_candidate[i],NE2_candidate[i]]);
          }
        }
         var s="50,500 50,700";
         if (equal_num(points2[1][0],450)){
           for (var i=0;i<NE1_candidate.length;i++){
             if (NE1_candidate[i]==0){
               NE.push([NE1_candidate[i],NE2_candidate[i]]);
             }
             if (NE1_candidate[i]=="any"){
               NE.push([0,NE2_candidate[i]]);
             }
           }
           s="250,500 "+s;
         }
         else {
           for (var i=0;i<NE1_candidate.length;i++){
             if (NE1_candidate[i]==1){
               NE.push([NE1_candidate[i],NE2_candidate[i]]);
             }
             if (NE1_candidate[i]=="any"){
               NE.push([1,NE2_candidate[i]]);
             }
           }
           s=s+" 250,700";
         }
         temp = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
         temp.setAttribute("class","canvas0 brline line2 bottom");
         temp.setAttribute("points", s);
         GTE.svg.appendChild(temp);
      }
      if (points2[0].length==2 && points2[1].length==2){
        if (equal_num(points2[0][0],points2[1][0])){ // Game highly degenerated
          var s="50,500 250,500 250,700, 50,700, 50,500";
          temp = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
          temp.setAttribute("class","canvas0 brline line2 bottom");
          temp.setAttribute("points", s);
          GTE.svg.appendChild(temp);
          for (var i=0;i<NE1_candidate.length;i++){
              NE.push([NE1_candidate[i],NE2_candidate[i]]);
          }
        }
        if(points2[0][0]<points2[1][0]){ //S1 First.
          var s="50,500 50,"+Number(points2[0][1]+50)+" 250,"+Number(points2[0][1]+50)+" 250,700";
          temp = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
          temp.setAttribute("class","canvas0 brline line2 bottom");
          temp.setAttribute("points", s);
          GTE.svg.appendChild(temp);
          for (var i=0;i<NE1_candidate.length;i++){
            if ((NE1_candidate[i]==0 || equal_arr(NE1_candidate[i],[0,1]))  && (NE2_candidate[i]==0 ||equal_arr(NE2_candidate[i],[0,1]))){
              NE.push([0,0]);
            }
            if( NE1_candidate[i]=="any"|| equal_arr(NE1_candidate[i],[0,1])){
              if (NE2_candidate[i]==0){
              NE.push([[0,Number(points2[0][1]-450)/200],NE2_candidate[i]]);
              }else{
                if (NE2_candidate[i]==1){
                NE.push([[Number(points2[0][1]-450)/200,1],NE2_candidate[i]]);
                }else {
                NE.push([Number(points2[1][1]-450)/200,NE2_candidate[i]]);
              }
              }
            }
            if ((NE1_candidate[i]==1|| equal_arr(NE1_candidate[i],[0,1])) && (NE2_candidate[i]==1||equal_arr(NE2_candidate[i],[0,1]))){
              NE.push([1,1]);
            }
          }
        }
        if(points2[0][0]>points2[1][0]){ //S2 First.
          var s="250,500 250,"+Number(points2[1][1]+50)+" 50,"+Number(points2[1][1]+50)+" 50,700";
          temp = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
          temp.setAttribute("class","canvas0 brline line2 bottom");
          temp.setAttribute("points", s);
          GTE.svg.appendChild(temp);
          for (var i=0;i<NE1_candidate.length;i++){

            if ((NE1_candidate[i]==0 || equal_arr(NE1_candidate[i],[0,1]))  && (NE2_candidate[i]==1||equal_arr(NE2_candidate[i],[0,1]))){
              NE.push([0,1]);
            }
            if( NE1_candidate[i]=="any"|| equal_arr(NE1_candidate[i],[0,1])){
              if (NE2_candidate[i]==1){
              NE.push([[0,Number(points2[1][1]-450)/200],NE2_candidate[i]]);
            }else{
              if (NE2_candidate[i]==0){
                NE.push([[Number(points2[1][1]-450)/200,1],NE2_candidate[i]]);
              }else {
                NE.push([Number(points2[1][1]-450)/200,NE2_candidate[i]]);
              }
              }
            }
            if ((NE1_candidate[i]==1|| equal_arr(NE1_candidate[i],[0,1])) && (NE2_candidate[i]==0||equal_arr(NE2_candidate[i],[0,1]))){
              NE.push([1,0]);
            }
          }
        }
      }
      console.log(NE.length);
      for (var i=0;i<NE.length;i++){
        console.log(NE[i][0]+" "+NE[i][1]);
      }
    }


  /*  Diagram.prototype.draw_square_down = function(strat11=0, strat12=1, strat21=0, strat22=1){
        var strat=[[strat11,strat12],[strat21,strat22]];
        var inter=[[0,0],[0,0]];
        for (var i=0;i<this.intersect[0].length;i++){
            if ((this.intersect[0][i].getStrat1()==strat11 &&this.intersect[0][i].getStrat2()==strat12) || (this.intersect[0][i].getStrat2()==strat11 &&this.intersect[0][i].getStrat1()==strat12)){
                inter[0]=[this.intersect[0][i].getPosx(),this.intersect[0][i].getPosy()];
            }
        }
        for (var i=0;i<this.intersect[1].length;i++){
            if ((this.intersect[1][i].getStrat1()==strat21 &&this.intersect[1][i].getStrat2()==strat22) || (this.intersect[1][i].getStrat2()==strat21 &&this.intersect[1][i].getStrat1()==strat22)){
                inter[1]=[this.intersect[1][i].getPosx(),this.intersect[1][i].getPosy()];
            }
        }
        for (var i=0;i<2;i++){
            for (var j=0;j<2;j++){
                var temp=GTE.svg.getElementsByClassName("strat"+i+""+j+" change");
                for (var k=0;k<temp.length;k++)
                temp[k].textContent=GTE.tree.matrix.strategies[Number(i+1)][strat[i][j]].moves[0].name;
            }
        }
        for (var i=0;i<2;i++){
            for (var j=0;j<2;j++){
                var temp=GTE.svg.getElementsByClassName("strat"+i+""+j+"_0 change");
                for (var k=0;k<temp.length;k++)
                temp[k].textContent=GTE.tree.matrix.strategies[Number(i+1)][strat[i][j]].moves[0].name+"=0";
            }
        }



        var temp=[];
        var temp2= GTE.svg.getElementsByClassName("brline");
        var path1="";
        var path2="";
        var path1_2="";
        var path2_2="";
        var path1_3="";
        var path2_3="";
        var nb=0;
        temp.push(GTE.svg.getElementsByClassName("p1")[0]);
        temp.push(GTE.svg.getElementsByClassName("p2")[0]);
        temp.push(GTE.svg.getElementsByClassName("p3")[0]);
        temp.push(GTE.svg.getElementsByClassName("p4")[0]);
        temp.push(GTE.svg.getElementsByClassName("m1")[0]);
        temp.push(GTE.svg.getElementsByClassName("m2")[0]);
        temp.push(GTE.svg.getElementsByClassName("m3")[0]);
        temp.push(GTE.svg.getElementsByClassName("m4")[0]);
        temp.push(GTE.svg.getElementsByClassName("m5")[0]);

        for (var i=4;i<9;i++){ //Initializing mixed equilibria
            temp[i].setAttributeNS(null, "fill", "green");
            temp[i].setAttributeNS(null, "height", 0);
            temp[i].setAttributeNS(null, "width", 0);
        }
        //setting player 1 path
        // We remove pure equilibria that don't correspond to player 1.
        if (this.best_response[0][0]==this.best_response[0][1]){
            if (this.best_response[0][1]==-1){
                path1=this.margin+","+Number(2*this.margin+this.height)+", "+Number(this.margin+this.side)+","+Number(2*this.margin+this.height)+", "+Number(this.margin+this.side)+","+Number(2*this.margin+this.height+this.side)+", "+this.margin+","+Number(2*this.margin+this.height+this.side)+", "+this.margin+","+Number(2*this.margin+this.height); //"50,500, 250,500, 250,700, 50,700, 50,500";
                temp[8].setAttributeNS(null, "x", Number(this.margin-this.rad));
                temp[8].setAttributeNS(null, "y", Number(2*this.margin+this.height-this.rad));
                temp[8].setAttributeNS(null, "height", Number(this.side+2*this.rad));
                temp[8].setAttributeNS(null, "width", Number(this.side+2*this.rad));
                temp[8].setAttributeNS(null, "fill", "pink");
                GTE.svg.insertBefore(temp[8],temp[7]);
                GTE.svg.insertBefore(temp[6],temp[7]);
                GTE.svg.insertBefore(temp[5],temp[7]);
                GTE.svg.insertBefore(temp[4],temp[7]);

                temp[4].setAttributeNS(null, "x", Number(this.margin-this.rad));
                temp[4].setAttributeNS(null, "y", Number(2*this.margin+this.height-this.rad));
                temp[4].setAttributeNS(null, "height", Number(2*this.rad));
                temp[4].setAttributeNS(null, "width", Number(this.side+2*this.rad));


                temp[5].setAttributeNS(null, "x", Number(this.side+this.margin-this.rad));
                temp[5].setAttributeNS(null, "y", Number(2*this.margin+this.height-this.rad));
                temp[5].setAttributeNS(null, "height", Number(this.side+2*this.rad));
                temp[5].setAttributeNS(null, "width", Number(2*this.rad));


                temp[6].setAttributeNS(null, "x", Number(this.margin-this.rad));
                temp[6].setAttributeNS(null, "y", Number(this.height+2*this.margin+this.side-this.rad));
                temp[6].setAttributeNS(null, "height", Number(2*this.rad));
                temp[6].setAttributeNS(null, "width", Number(this.side+2*this.rad));


                temp[7].setAttributeNS(null, "x", Number(this.margin-this.rad));
                temp[7].setAttributeNS(null, "y", Number(2*this.margin+this.height-this.rad));
                temp[7].setAttributeNS(null, "height", Number(this.side+2*this.rad));
                temp[7].setAttributeNS(null, "width", Number(2*this.rad));
            }
            else{
                if (this.best_response[0][1]==0){
                    path1=Number(this.margin)+","+Number(this.height+2*this.margin)+","+ Number(this.margin+this.side)+","+Number(this.height+2*this.margin);
                    temp[4].setAttributeNS(null, "x", Number(this.margin-this.rad));
                    temp[4].setAttributeNS(null, "y", Number(2*this.margin+this.height-this.rad));
                    temp[4].setAttributeNS(null, "height", Number(2*this.rad));
                    temp[4].setAttributeNS(null, "width", Number(this.side+2*this.rad));
                }
                else {
                    path1=Number(this.margin)+","+Number(2*this.margin+this.height+this.side)+","+ Number(this.margin+this.side)+","+Number(2*this.margin+this.height+this.side);

                    temp[6].setAttributeNS(null, "x", Number(this.margin-this.rad));
                    temp[6].setAttributeNS(null, "y", Number(this.height+2*this.margin+this.side-this.rad));
                    temp[6].setAttributeNS(null, "height", Number(2*this.rad));
                    temp[6].setAttributeNS(null, "width", Number(this.side+2*this.rad));
                }
            }

        }
        else{
            if (this.best_response[0][0]==-1){
                temp[7].setAttributeNS(null, "x", Number(this.margin-this.rad));
                temp[7].setAttributeNS(null, "y", Number(2*this.margin+this.height-this.rad));
                temp[7].setAttributeNS(null, "height", Number(this.side+2*this.rad));
                temp[7].setAttributeNS(null, "width", Number(2*this.rad));
                if (this.best_response[0][1]==0){
                    path1=Number(this.margin)+","+Number(2*this.margin+this.height+this.side)+", "+ Number(this.margin)+","+Number(this.height+2*this.margin)+", "+ Number(this.margin+this.side)+","+Number(this.height+2*this.margin);

                    temp[4].setAttributeNS(null, "x", Number(this.margin-this.rad));
                    temp[4].setAttributeNS(null, "y", Number(2*this.margin+this.height-this.rad));
                    temp[4].setAttributeNS(null, "height", Number(2*this.rad));
                    temp[4].setAttributeNS(null, "width", Number(this.side+2*this.rad));
                }
                else{
                    path1=Number(this.margin)+","+Number(this.height+2*this.margin)+", "+ Number(this.margin)+","+Number(2*this.margin+this.height+this.side)+", "+ Number(this.margin+this.side)+","+Number(2*this.margin+this.height+this.side);

                    temp[6].setAttributeNS(null, "x", Number(this.margin-this.rad));
                    temp[6].setAttributeNS(null, "y", Number(this.height+2*this.margin+this.side-this.rad));
                    temp[6].setAttributeNS(null, "height", Number(2*this.rad));
                    temp[6].setAttributeNS(null, "width", Number(this.side+2*this.rad));
                }
            }
            else{
                if (this.best_response[0][0]==0){
                    if (this.best_response[0][1]==-1){
                        path1=Number(this.margin)+","+Number(this.height+2*this.margin)+", "+ Number(this.margin+this.side)+","+Number(this.height+2*this.margin)+", "+ Number(this.margin+this.side)+","+Number(2*this.margin+this.height+this.side);

                        temp[5].setAttributeNS(null, "x", Number(this.side+this.margin-this.rad));
                        temp[5].setAttributeNS(null, "y", Number(2*this.margin+this.height-this.rad));
                        temp[5].setAttributeNS(null, "height", Number(this.side+2*this.rad));
                        temp[5].setAttributeNS(null, "width", Number(2*this.rad));

                        temp[4].setAttributeNS(null, "x", Number(this.margin-this.rad));
                        temp[4].setAttributeNS(null, "y", Number(2*this.margin+this.height-this.rad));
                        temp[4].setAttributeNS(null, "height", Number(2*this.rad));
                        temp[4].setAttributeNS(null, "width", Number(this.side+2*this.rad));
                    }
                    else{
                        path1=Number(this.margin)+","+Number(this.height+2*this.margin)+", "+inter[0][0]+","+Number(this.height+2*this.margin)+", "+inter[0][0]+","+Number(2*this.margin+this.height+this.side)+", "+ Number(this.margin+this.side)+","+Number(2*this.margin+this.height+this.side);
                        temp[8].setAttributeNS(null, "x", inter[0][0]-5);
                        temp[8].setAttributeNS(null, "y", Number(2*this.margin+this.height-this.rad));
                        temp[8].setAttributeNS(null, "height", Number(this.side+2*this.rad));
                        temp[8].setAttributeNS(null, "width", Number(2*this.rad));

                        temp[4].setAttributeNS(null, "x", Number(this.margin-this.rad));
                        temp[4].setAttributeNS(null, "y", Number(2*this.margin+this.height-this.rad));
                        temp[4].setAttributeNS(null, "height", Number(2*this.rad));
                        temp[4].setAttributeNS(null, "width", ~~(inter[0][0]-Number(this.margin))+Number(2*this.rad));

                        temp[6].setAttributeNS(null, "x", inter[0][0]-5);
                        temp[6].setAttributeNS(null, "y", Number(this.height+2*this.margin+this.side-this.rad));
                        temp[6].setAttributeNS(null, "height", Number(2*this.rad));
                        temp[6].setAttributeNS(null, "width", ~~(Number(this.margin+this.side)-inter[0][0])+Number(2*this.rad));
                    }
                }
                else{
                    if (this.best_response[0][1]==0){
                        path1=Number(this.margin)+","+Number(2*this.margin+this.height+this.side)+", "+inter[0][0]+","+Number(2*this.margin+this.height+this.side)+", "+inter[0][0]+","+Number(this.height+2*this.margin)+", "+Number(this.margin+this.side)+","+Number(this.height+2*this.margin);
                        temp[6].setAttributeNS(null, "x", Number(this.margin-this.rad));
                        temp[6].setAttributeNS(null, "y", Number(this.height+2*this.margin+this.side-this.rad));
                        temp[6].setAttributeNS(null, "height", Number(2*this.rad));
                        temp[6].setAttributeNS(null, "width", ~~(inter[0][0]-Number(this.margin))+Number(2*this.rad));

                        temp[8].setAttributeNS(null, "x", inter[0][0]-5);
                        temp[8].setAttributeNS(null, "y", Number(2*this.margin+this.height-this.rad));
                        temp[8].setAttributeNS(null, "height", Number(this.side+2*this.rad));
                        temp[8].setAttributeNS(null, "width", Number(2*this.rad));

                        temp[4].setAttributeNS(null, "x", inter[0][0]-5);
                        temp[4].setAttributeNS(null, "y", Number(2*this.margin+this.height-this.rad));
                        temp[4].setAttributeNS(null, "height", Number(2*this.rad));
                        temp[4].setAttributeNS(null, "width", ~~(Number(this.margin+this.side)-inter[0][0])+Number(2*this.rad));
                    }
                    else{
                        path1=Number(this.margin)+","+Number(2*this.margin+this.height+this.side)+", "+Number(this.margin+this.side)+","+Number(2*this.margin+this.height+this.side)+", "+Number(this.margin+this.side)+","+Number(this.height+2*this.margin);

                        temp[5].setAttributeNS(null, "x", Number(this.side+this.margin-this.rad));
                        temp[5].setAttributeNS(null, "y", Number(2*this.margin+this.height-this.rad));
                        temp[5].setAttributeNS(null, "height", Number(this.side+2*this.rad));
                        temp[5].setAttributeNS(null, "width", Number(2*this.rad));

                        temp[6].setAttributeNS(null, "x", Number(this.margin-this.rad));
                        temp[6].setAttributeNS(null, "y", Number(this.height+2*this.margin+this.side-this.rad));
                        temp[6].setAttributeNS(null, "height", Number(2*this.rad));
                        temp[6].setAttributeNS(null, "width", Number(this.side+2*this.rad));
                    }
                }
            }
        }

        //setting player 2 path
        // We remove pure and mixed equilibria that don't correspond to player 2.
        if (this.best_response[1][0]==this.best_response[1][1]){
            if (this.best_response[1][1]==-1){
                path2=Number(this.margin)+","+Number(this.height+2*this.margin)+", "+Number(this.margin+this.side)+","+Number(this.height+2*this.margin)+", "+Number(this.margin+this.side)+","+Number(2*this.margin+this.height+this.side)+", "+Number(this.margin)+","+Number(2*this.margin+this.height+this.side)+", "+Number(this.margin)+","+Number(this.height+2*this.margin);
                if (this.best_response[0][0]==-1 && this.best_response[0][1]==-1){
                    temp[8].setAttributeNS(null, "fill", "green");
                    GTE.svg.insertBefore(temp[8],temp[7]);
                    GTE.svg.insertBefore(temp[6],temp[7]);
                    GTE.svg.insertBefore(temp[5],temp[7]);
                    GTE.svg.insertBefore(temp[4],temp[7]);}
                else {
                    if (temp[8].getAttribute("width")==0){
                        temp[8].setAttributeNS(null, "x", Number(this.margin-this.rad));
                        temp[8].setAttributeNS(null, "y", Number(2*this.margin+this.height-this.rad));
                        temp[8].setAttributeNS(null, "height", Number(this.side+2*this.rad));
                        temp[8].setAttributeNS(null, "width", Number(this.side+2*this.rad));
                        temp[8].setAttributeNS(null, "fill", "cyan");
                        GTE.svg.insertBefore(temp[8],temp[7]);
                        GTE.svg.insertBefore(temp[6],temp[7]);
                        GTE.svg.insertBefore(temp[5],temp[7]);
                        GTE.svg.insertBefore(temp[4],temp[7]);
                    }
                    else{
                        if (temp[5].getAttribute("width")==0){
                            temp[5].setAttributeNS(null, "x", Number(this.margin-this.rad));
                            temp[5].setAttributeNS(null, "y", Number(2*this.margin+this.height-this.rad));
                            temp[5].setAttributeNS(null, "height", Number(this.side+2*this.rad));
                            temp[5].setAttributeNS(null, "width", Number(this.side+2*this.rad));
                            temp[5].setAttributeNS(null, "fill", "cyan");
                            GTE.svg.insertBefore(temp[5],temp[8]);
                            GTE.svg.insertBefore(temp[4],temp[8]);
                            GTE.svg.insertBefore(temp[6],temp[8]);
                            GTE.svg.insertBefore(temp[7],temp[8]);
                        }
                        else {
                            temp[7].setAttributeNS(null, "x", Number(this.margin-this.rad));
                            temp[7].setAttributeNS(null, "y", Number(2*this.margin+this.height-this.rad));
                            temp[7].setAttributeNS(null, "height", Number(this.side+2*this.rad));
                            temp[7].setAttributeNS(null, "width", Number(this.side+2*this.rad));
                            temp[7].setAttributeNS(null, "fill", "cyan");
                            GTE.svg.insertBefore(temp[7],temp[8]);
                            GTE.svg.insertBefore(temp[6],temp[8]);
                            GTE.svg.insertBefore(temp[5],temp[8]);
                            GTE.svg.insertBefore(temp[4],temp[8]);
                        }
                    }
                }
            }
            else{
                if (this.best_response[1][1]==0){
                    path2=Number(this.margin)+","+Number(this.height+2*this.margin)+", "+Number(this.margin)+","+Number(2*this.margin+this.height+this.side);
                    temp[4].setAttributeNS(null, "height", 0);
                    temp[5].setAttributeNS(null, "height", 0);
                    temp[6].setAttributeNS(null, "height", 0);
                    if (this.best_response[0][0] >-1 || this.best_response[0][1] >-1){
                        temp[8].setAttributeNS(null, "height", 0);
                        temp[8].setAttributeNS(null, "width", 0);}
                    temp[4].setAttributeNS(null, "width", 0);
                    temp[5].setAttributeNS(null, "width", 0);
                    temp[6].setAttributeNS(null, "width", 0);
                }
                else {
                    path2=Number(this.margin+this.side)+","+Number(this.height+2*this.margin)+", "+Number(this.margin+this.side)+","+Number(2*this.margin+this.height+this.side);
                    temp[4].setAttributeNS(null, "height", 0);
                    temp[6].setAttributeNS(null, "height", 0);
                    temp[7].setAttributeNS(null, "height", 0);
                    if (this.best_response[0][0] >-1 || this.best_response[0][1] >0){
                        temp[8].setAttributeNS(null, "height", 0);
                        temp[8].setAttributeNS(null, "width", 0);
                    }
                    temp[4].setAttributeNS(null, "width", 0);
                    temp[6].setAttributeNS(null, "width", 0);
                    temp[7].setAttributeNS(null, "width", 0);
                }
            }

        }
        else {
            if (this.best_response[1][0]==-1){
                if (this.best_response[1][1]==0){
                    path2=Number(this.margin)+","+Number(2*this.margin+this.height+this.side)+", "+Number(this.margin)+","+Number(this.height+2*this.margin)+", "+Number(this.margin+this.side)+","+Number(this.height+2*this.margin);
                    temp[5].setAttributeNS(null, "height", 0);
                    temp[6].setAttributeNS(null, "height", 0);
                    if (this.best_response[0][0] >-1 || this.best_response[0][1] >0){
                        temp[8].setAttributeNS(null, "height", 0);
                        temp[8].setAttributeNS(null, "width", 0);
                    }
                    temp[5].setAttributeNS(null, "width", 0);
                    temp[6].setAttributeNS(null, "width", 0);
                }
                else{
                    path2=Number(this.margin)+","+Number(this.height+2*this.margin)+", "+Number(this.margin+this.side)+","+Number(this.height+2*this.margin)+", "+Number(this.margin+this.side)+","+Number(2*this.margin+this.height+this.side);                    temp[6].setAttributeNS(null, "height", 0);
                    temp[7].setAttributeNS(null, "height", 0);
                    if (this.best_response[0][0] >-1 || this.best_response[0][1] >-1){
                        temp[8].setAttributeNS(null, "height", 0);
                        temp[8].setAttributeNS(null, "width", 0);
                    }
                    temp[6].setAttributeNS(null, "width", 0);
                    temp[7].setAttributeNS(null, "width", 0);
                }
            }
            else{
                if (this.best_response[1][0]==0){
                    if (this.best_response[1][1]==-1){
                        path2=Number(this.margin)+","+Number(this.height+2*this.margin)+", "+Number(this.margin)+","+Number(2*this.margin+this.height+this.side)+", "+Number(this.margin+this.side)+","+Number(2*this.margin+this.height+this.side);
                        temp[4].setAttributeNS(null, "height", 0);
                        temp[5].setAttributeNS(null, "height", 0);
                        if (this.best_response[0][0] >-1 || this.best_response[0][1] >-1){
                            temp[8].setAttributeNS(null, "height", 0);
                            temp[8].setAttributeNS(null, "width", 0);
                        }
                        temp[4].setAttributeNS(null, "width", 0);
                        temp[5].setAttributeNS(null, "width", 0);
                    }
                    else{
                        path2=Number(this.margin)+","+Number(this.height+2*this.margin)+", "+Number(this.margin)+","+Number(inter[1][0]+this.margin)+", "+Number(this.margin+this.side)+","+Number(inter[1][0]+Number(this.margin))+", "+Number(this.margin+this.side)+","+Number(2*this.margin+this.height+this.side);
                        if (this.best_response[0][1]>-1 && this.best_response[0][0]>-1){
                            temp[4].setAttributeNS(null, "height", 0);
                            temp[5].setAttributeNS(null, "height", 0);
                            temp[6].setAttributeNS(null, "height", 0);
                            temp[7].setAttributeNS(null, "height", 0);
                            temp[8].setAttributeNS(null, "height", Number(2*this.rad));
                            temp[4].setAttributeNS(null, "width", 0);
                            temp[5].setAttributeNS(null, "width", 0);
                            temp[6].setAttributeNS(null, "width", 0);
                            temp[7].setAttributeNS(null, "width", 0);
                            temp[8].setAttributeNS(null, "y", Number(inter[1][0]+Number(Number(this.margin-this.rad))));
                            if (this.best_response[0][0] ==-1 || this.best_response[0][1] ==-1){
                                temp[4].setAttributeNS(null, "height", Number(this.side+2*this.rad));
                                temp[4].setAttributeNS(null, "width", Number(this.side+2*this.rad));
                                temp[4].setAttributeNS(null, "x", Number(this.margin-this.rad));
                                temp[4].setAttributeNS(null, "y", Number(2*this.margin+this.height-this.rad));
                                temp[4].setAttributeNS(null, "fill", "pink");
                                GTE.svg.insertBefore(temp[4],temp[7]);
                                GTE.svg.insertBefore(temp[6],temp[7]);
                                GTE.svg.insertBefore(temp[5],temp[7]);
                                GTE.svg.insertBefore(temp[8],temp[7]);
                            }
                        }
                        if (this.best_response[0][0]==-1 && this.best_response[0][1]>-1){
                            temp[4].setAttributeNS(null, "height", 0);
                            temp[5].setAttributeNS(null, "height", 0);
                            temp[6].setAttributeNS(null, "height", 0);
                            temp[7].setAttributeNS(null, "height", Number(inter[1][0]-Number(Number(this.height+2*this.margin))+Number(60)));
                            if (this.best_response[0][0] >-1 || this.best_response[0][1] >-1){
                                temp[8].setAttributeNS(null, "height", 0);
                                temp[8].setAttributeNS(null, "width", 0);
                            }
                            temp[4].setAttributeNS(null, "width", 0);
                            temp[5].setAttributeNS(null, "width", 0);
                            temp[6].setAttributeNS(null, "width", 0);
                        }
                        if (this.best_response[0][1]==-1 && this.best_response[0][0]>-1){
                            temp[4].setAttributeNS(null, "height", 0);
                            temp[7].setAttributeNS(null, "height", 0);
                            temp[6].setAttributeNS(null, "height", 0);
                            if (this.best_response[0][0] >-1 || this.best_response[0][1] >-1){
                                temp[8].setAttributeNS(null, "height", 0);
                                temp[8].setAttributeNS(null, "width", 0);
                            }
                            temp[4].setAttributeNS(null, "width", 0);
                            temp[5].setAttributeNS(null, "height",Number(Number(2*this.margin+this.height+this.side)-Number(inter[1][0])-Number(40)) );
                            temp[5].setAttributeNS(null, "y", Number(inter[1][0]+Number(Number(this.margin-this.rad))));
                            temp[7].setAttributeNS(null, "width", 0);
                            temp[6].setAttributeNS(null, "width", 0);
                        }
                        if (this.best_response[0][1]==-1 && this.best_response[0][0]==-1){

                            temp[4].setAttributeNS(null, "height", 0);
                            temp[6].setAttributeNS(null, "height", 0);
                            temp[4].setAttributeNS(null, "width", 0);
                            temp[6].setAttributeNS(null, "width", 0);

                            temp[7].setAttributeNS(null, "x", Number(this.margin-this.rad));
                            temp[7].setAttributeNS(null, "y", Number(2*this.margin+this.height-this.rad));
                            temp[7].setAttributeNS(null, "height", Number(inter[1][0]-Number(Number(this.height+2*this.margin))+Number(60)));
                            temp[7].setAttributeNS(null, "width", Number(2*this.rad));

                            temp[8].setAttributeNS(null, "x", Number(this.margin-this.rad));
                            temp[8].setAttributeNS(null, "y", Number(inter[1][0]+Number(Number(this.margin-this.rad))));
                            temp[8].setAttributeNS(null, "height", Number(2*this.rad));
                            temp[8].setAttributeNS(null, "width", Number(this.side+2*this.rad));

                            temp[5].setAttributeNS(null, "x", Number(this.side+this.margin-this.rad));
                            temp[5].setAttributeNS(null, "y", Number(inter[1][0]+Number(Number(this.margin-this.rad))));
                            temp[5].setAttributeNS(null, "height",Number(Number(2*this.margin+this.height+this.side)-Number(inter[1][0])-Number(40)) );
                            temp[5].setAttributeNS(null, "width", Number(2*this.rad));

                            if (this.best_response[0][0] ==-1 || this.best_response[0][1] ==-1){
                                temp[4].setAttributeNS(null, "height", Number(this.side+2*this.rad));
                                temp[4].setAttributeNS(null, "width", Number(this.side+2*this.rad));
                                temp[4].setAttributeNS(null, "x", Number(this.margin-this.rad));
                                temp[4].setAttributeNS(null, "y", Number(2*this.margin+this.height-this.rad));
                                temp[4].setAttributeNS(null, "fill", "pink");
                                GTE.svg.insertBefore(temp[4],temp[7]);
                                GTE.svg.insertBefore(temp[6],temp[7]);
                                GTE.svg.insertBefore(temp[5],temp[7]);
                                GTE.svg.insertBefore(temp[8],temp[7]);
                            }
                        }
                    }
                }
                else{
                    if (this.best_response[1][1]==0){
                        path2=Number(this.margin)+","+Number(2*this.margin+this.height+this.side)+", "+Number(this.margin)+","+Number(inter[1][0]+this.margin)+", "+Number(this.margin+this.side)+","+Number(inter[1][0]+Number(Number(this.margin)))+", "+Number(this.margin+this.side)+","+Number(this.height+2*this.margin);
                        if (this.best_response[0][1]>-1 && this.best_response[0][0]>-1){
                            temp[4].setAttributeNS(null, "height", 0);
                            temp[5].setAttributeNS(null, "height", 0);
                            temp[6].setAttributeNS(null, "height", 0);
                            temp[7].setAttributeNS(null, "height", 0);
                            temp[8].setAttributeNS(null, "height", Number(2*this.rad));
                            temp[4].setAttributeNS(null, "width", 0);
                            temp[5].setAttributeNS(null, "width", 0);
                            temp[6].setAttributeNS(null, "width", 0);
                            temp[7].setAttributeNS(null, "width", 0);
                            temp[8].setAttributeNS(null, "y", Number(inter[1][0]+Number(Number(this.margin-this.rad))));
                            if (this.best_response[0][0] ==-1 || this.best_response[0][1] ==-1){
                                temp[4].setAttributeNS(null, "height", Number(this.side+2*this.rad));
                                temp[4].setAttributeNS(null, "width", Number(this.side+2*this.rad));
                                temp[4].setAttributeNS(null, "x", Number(this.margin-this.rad));
                                temp[4].setAttributeNS(null, "y", Number(2*this.margin+this.height-this.rad));
                                temp[4].setAttributeNS(null, "fill", "pink");
                                GTE.svg.insertBefore(temp[4],temp[7]);
                                GTE.svg.insertBefore(temp[6],temp[7]);
                                GTE.svg.insertBefore(temp[5],temp[7]);
                                GTE.svg.insertBefore(temp[8],temp[7]);
                            }
                        }
                        if (this.best_response[0][0]==-1 && this.best_response[0][1]>-1){
                            temp[4].setAttributeNS(null, "height", 0);
                            temp[5].setAttributeNS(null, "height", 0);
                            temp[6].setAttributeNS(null, "height", 0);
                            temp[7].setAttributeNS(null, "height", Number(Number(2*this.margin+this.height+this.side)-Number(inter[1][0])-Number(40)));
                            temp[7].setAttributeNS(null, "y", Number(inter[1][0]+Number(Number(this.margin-this.rad))));
                            if (this.best_response[0][0] >-1 || this.best_response[0][1] >-1){
                                temp[8].setAttributeNS(null, "height", 0);
                                temp[8].setAttributeNS(null, "width", 0);
                            }
                            temp[4].setAttributeNS(null, "width", 0);
                            temp[5].setAttributeNS(null, "width", 0);
                            temp[6].setAttributeNS(null, "width", 0);
                        }
                        if (this.best_response[0][1]==-1 && this.best_response[0][0]>-1){
                            temp[4].setAttributeNS(null, "height", 0);
                            temp[7].setAttributeNS(null, "height", 0);
                            temp[6].setAttributeNS(null, "height", 0);
                            if (this.best_response[0][0] >-1 || this.best_response[0][1] >-1){
                                temp[8].setAttributeNS(null, "height", 0);
                                temp[8].setAttributeNS(null, "width", 0);
                            }
                            temp[4].setAttributeNS(null, "width", 0);
                            temp[5].setAttributeNS(null, "height", Number(inter[1][0]-Number(Number(this.height+2*this.margin))+Number(60) ));
                            temp[7].setAttributeNS(null, "width", 0);
                            temp[6].setAttributeNS(null, "width", 0);
                        }
                        if (this.best_response[0][1]==-1 && this.best_response[0][0]==-1){

                            temp[4].setAttributeNS(null, "height", 0);
                            temp[6].setAttributeNS(null, "height", 0);
                            temp[4].setAttributeNS(null, "width", 0);
                            temp[6].setAttributeNS(null, "width", 0);

                            temp[7].setAttributeNS(null, "x", Number(this.margin-this.rad));
                            temp[7].setAttributeNS(null, "y", Number(inter[1][0]+Number(Number(this.margin-this.rad))));
                            temp[7].setAttributeNS(null, "height", Number(Number(2*this.margin+this.height+this.side)-Number(inter[1][0])-Number(40)));
                            temp[7].setAttributeNS(null, "width", Number(2*this.rad));

                            temp[8].setAttributeNS(null, "x", Number(this.margin-this.rad));
                            temp[8].setAttributeNS(null, "y", Number(inter[1][0]+Number(Number(this.margin-this.rad))));
                            temp[8].setAttributeNS(null, "height", Number(2*this.rad));
                            temp[8].setAttributeNS(null, "width", Number(this.side+2*this.rad));

                            temp[5].setAttributeNS(null, "x", Number(this.side+this.margin-this.rad));
                            temp[5].setAttributeNS(null, "y", Number(2*this.margin+this.height-this.rad));
                            temp[5].setAttributeNS(null, "height",Number(inter[1][0]-Number(Number(this.height+2*this.margin))+Number(60) ));
                            temp[5].setAttributeNS(null, "width", Number(2*this.rad));

                            if (this.best_response[0][0] ==-1 || this.best_response[0][1] ==-1){
                                temp[4].setAttributeNS(null, "height", Number(this.side+2*this.rad));
                                temp[4].setAttributeNS(null, "width", Number(this.side+2*this.rad));
                                temp[4].setAttributeNS(null, "x", Number(this.margin-this.rad));
                                temp[4].setAttributeNS(null, "y", Number(2*this.margin+this.height-this.rad));
                                temp[4].setAttributeNS(null, "fill", "pink");
                                GTE.svg.insertBefore(temp[4],temp[7]);
                                GTE.svg.insertBefore(temp[6],temp[7]);
                                GTE.svg.insertBefore(temp[5],temp[7]);
                                GTE.svg.insertBefore(temp[8],temp[7]);
                            }
                        }
                    }
                    else{
                        path2=Number(this.margin)+","+Number(2*this.margin+this.height+this.side)+", "+Number(this.margin+this.side)+","+Number(2*this.margin+this.height+this.side)+", "+Number(this.margin+this.side)+","+Number(this.height+2*this.margin);
                        temp[4].setAttributeNS(null, "height", 0);
                        temp[7].setAttributeNS(null, "height", 0);
                        if (this.best_response[0][0] >-1 || this.best_response[0][1] >-1){
                            temp[8].setAttributeNS(null, "height", 0);
                            temp[8].setAttributeNS(null, "width", 0);
                        }
                        temp[4].setAttributeNS(null, "width", 0);
                        temp[7].setAttributeNS(null, "width", 0);
                    }
                }
            }
        }

        temp2[0].setAttributeNS(null, "points", path1);
        temp2[1].setAttributeNS(null, "points", path2);

        var stick=GTE.svg.getElementsByClassName("interstick1");
        for (i=0;i<stick.length;i++){
            stick[i].setAttributeNS(null, "x1",inter[0][0]);
            stick[i].setAttributeNS(null, "x2",inter[0][0]);
        }
        var stick=GTE.svg.getElementsByClassName("interstick2");
        for (i=0;i<stick.length;i++){
            stick[i].setAttributeNS(null, "x1",Number(inter[1][0]));
            stick[i].setAttributeNS(null, "x2",Number(inter[1][0]));
        }


        if (inter[1][0]>450 && inter[1][0] <650){
            var t1=Number(inter[1][0])-Number(410);
            var t2=460+Number(inter[1][0])-Number(410);
            GTE.svg.getElementsByClassName("arc player2")[0].setAttributeNS(null, "d", "M"+inter[1][0]+",460 A"+t1+","+t1+" 0 0,1 410,"+t2);
            GTE.svg.getElementsByClassName("stick player2")[0].setAttributeNS(null, "y1", t2);
            GTE.svg.getElementsByClassName("stick player2")[0].setAttributeNS(null, "y2", t2);
        }
        if (inter[1][0]==450){
            GTE.svg.getElementsByClassName("arc player2")[0].setAttributeNS(null, "d","M450,460 A40,40 0 0,1 410,500");
            GTE.svg.getElementsByClassName("stick player2")[0].setAttributeNS(null, "y1", 500);
            GTE.svg.getElementsByClassName("stick player2")[0].setAttributeNS(null, "y2", 500);
        }
        if (inter[1][0]==650){
            GTE.svg.getElementsByClassName("arc player2")[0].setAttributeNS(null, "d","M650,460 A240,240 0 0,1 410,700");
            GTE.svg.getElementsByClassName("stick player2")[0].setAttributeNS(null, "y1", 700);
            GTE.svg.getElementsByClassName("stick player2")[0].setAttributeNS(null, "y2", 700);
        }

        GTE.svg.getElementsByClassName("stick player1")[0].setAttributeNS(null, "x1", Number(this.margin));
        GTE.svg.getElementsByClassName("stick player1")[0].setAttributeNS(null, "x2", Number(this.margin));
        if (inter[0][0]>Number(this.margin) && inter[0][0]<Number(this.margin+this.side)){
            GTE.svg.getElementsByClassName("stick player1")[0].setAttributeNS(null, "x1", inter[0][0]);
            GTE.svg.getElementsByClassName("stick player1")[0].setAttributeNS(null, "x2", inter[0][0]);
        }


    };*/

    Diagram.prototype.clear = function(){
        var max =1;
        if(this.nb_strat[0]==2 && this.nb_strat[1]==2)
        max=2
        for (var i=0;i<this.lines.length;i++){
            if (i==0 || max >1){
                for (var j=0;j<this.lines[i].length;j++){
                    var temp=this.lines[i][j].html_element[0];
                    GTE.svg.removeChild(temp);
                    temp=this.lines[i][j].html_element[1];
                    GTE.svg.removeChild(temp);
                    temp=this.lines[i][j].txt;
                    GTE.svg.removeChild(temp);
                    temp=this.lines[i][j].txt2;
                    GTE.svg.removeChild(temp);
                }
            }
        }
        for (var i=0;i<this.endpoints.length;i++){
            if (i==0 || max >1){
                for (var j=0;j<this.endpoints[i].length;j++){
                    temp=this.endpoints[i][j].html_element;
                    GTE.svg.removeChild(temp);
                }
            }
        }
        this.endpoints=[];
        this.lines=[];
        this.best_response=[];
        this.payoffs=[];
        for (var i=0;i<this.intersect.length;i++){
            if (i==0 || max >1){
                for (var j=0; j<this.intersect[i].length;j++){
                    this.intersect[i][j].clear();
                }
            }
        }
        this.intersect=[];
        var envelope1=document.getElementById("envelope1");
        if (envelope1!=null)
        envelope1.setAttributeNS(null,"points", "50,50, 50,350, 250,350, 250,50");
        if (this.nb_strat[0]==2 && this.nb_strat[1]==2 ){
            var envelope2=document.getElementById("envelope2");
            if (envelope2!=null)
            envelope2.setAttributeNS(null,"points", "450,50, 450,350, 650,350,  650,50");}
        var temp= GTE.svg.getElementsByClassName("up").length;
        for( var k=0;k<temp;k++){
            GTE.svg.removeChild(GTE.svg.getElementsByClassName("up")[0]);
        }
        this.cleanForeign();

    }

    Diagram.prototype.cleanForeign = function (){

        var temp=GTE.svg.getElementsByTagName("foreignObject").length;
        for( var k=0;k<temp;k++){
            GTE.svg.removeChild(GTE.svg.getElementsByTagName("foreignObject")[0]);
        }
    }

    // Add class to parent module
    parentModule.Diagram = Diagram;

    return parentModule;
}(GTE)); // Add to GTE.TREE sub-module
