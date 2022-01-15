import { Component, OnInit } from '@angular/core';
import { Game } from 'src/model/game';
import {MatDialog} from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  pickCardAnimation = false;
  game: Game = new Game;
  currentCard: string = '';
  gameValue: any[] = [];


  constructor(public dialog: MatDialog, private db: AngularFirestore) { }

  ngOnInit(): void {
    this.newGame();
    this.db.collection('game').valueChanges().subscribe((tool)=>{
      console.log('Game update', tool);
    });
  }

  newGame(){
    this.game = new Game();
    console.log(this.game);
  }

  takeCard(){
    if(!this.pickCardAnimation){

      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
      this.currentCard = this.game.stack.pop() as string;
      
      this.pickCardAnimation = true;
      console.log('aktuelle Karte: ' +this.currentCard);
      console.log('Game is ',this.game);

      setTimeout(()=>{
        this.game.playedCards.push(this.currentCard);
        this.pickCardAnimation = false;
      },1000)

    }
    
  
  }


  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if(name && name.length > 0){
        this.game.players.push(name);
      }
    
     
    });
  }

}

