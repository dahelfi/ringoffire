import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Game } from 'src/model/game';

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss']
})
export class StartScreenComponent implements OnInit {

  constructor(private router: Router, private db: AngularFirestore) { }

  ngOnInit(): void {
  }

  newGame(){
    //Start the Game
    let game = new Game();

    this.db.collection('games').add(game.toJson()).then((gameInfo:any)=>{
      
      this.router.navigateByUrl('/game/'+ gameInfo.id);
    });
    
  }

}
