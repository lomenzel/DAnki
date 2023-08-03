import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PrivateService {

  constructor() {
  }

  // @ts-ignore
  decks: string[] = localStorage.getItem("privateDecks") ? JSON.parse(localStorage.getItem("privateDecks")) : [];

  add(id: string) {
    this.decks.push(id)
    localStorage.setItem("privateDecks", JSON.stringify(this.decks))

  }

  remove(id: string) {
    this.decks = this.decks.filter(e => e !== id)
    localStorage.setItem("privateDecks", JSON.stringify(this.decks))
  }

  get(): string[] {
    return this.decks
  }

}
