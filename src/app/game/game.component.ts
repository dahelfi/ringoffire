import { Component, OnInit } from '@angular/core';
import { Game } from 'src/model/game';
import {MatDialog} from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';
import { EditPlayerComponent } from '../edit-player/edit-player.component';


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  gameId: string = '';
  game: Game = new Game;
  gameOver = false;



  constructor(private route: ActivatedRoute, public dialog: MatDialog, private db: AngularFirestore) { }

  ngOnInit(): void {
   this.newGame();
    this.route.params.subscribe((params: any)=>{
      console.log(params.id);
      this.gameId = params.id;



      this.db.collection('games').doc(this.gameId).valueChanges().subscribe((games: any)=>{
        console.log('Game update', games);

        this.game.currentPlayer = games.currentPlayer;
        this.game.stack = games.stack;
        this.game.players = games.players;
        this.game.playerImages = games.playerImages;
        this.game.playedCards = games.playedCards;
        this.game.currentCard = games.currentCard;
        this.game.pickCardAnimation = games.pickCardAnimation;
      });
    });

  }

  newGame(){
    this.game = new Game();
    //console.log(this.game);

  }

  editPlayer(playerId: number){
    const dialogRef = this.dialog.open(EditPlayerComponent);

    dialogRef.afterClosed().subscribe((change: string) => {
      console.log('Recieved Change', change);
      if(change){
        if(change == 'DELETE'){
          this.game.playerImages.splice(playerId, 1);
          this.game.players.splice(playerId, 1);
        }else{
          this.game.playerImages[playerId] = change;
        }
        
        this.saveGame();
      }
     
    });

  }

  
  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if(name && name.length > 0){
        this.game.players.push(name);
        this.game.playerImages.push('1.webp');
        this.saveGame();
      }
    
     
    });
  }



  takeCard(){
    if( this.game.stack.length == 0){
      this.gameOver = true;
    }else if(!this.game.pickCardAnimation){

      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
      this.game.currentCard = this.game.stack.pop() as string;
      
      this.game.pickCardAnimation = true;
      console.log('aktuelle Karte: ' +this.game.currentCard);
      console.log('Game is ',this.game);
      
      this.saveGame();

      setTimeout(()=>{
        this.game.playedCards.push(this.game.currentCard);
        this.game.pickCardAnimation = false;
        this.saveGame();
      },1000)

    }
    
  
  }

  saveGame(){
    
    this.db.collection('games').doc(this.gameId).update(this.game.toJson());
  }





}

