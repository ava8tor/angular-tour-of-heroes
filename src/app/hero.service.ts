import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable, of, catchError, map, tap, switchMap } from 'rxjs';
import { MessageService } from './message.service';
import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { HeroesComponent } from './heroes/heroes.component';

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  private heroesUrl = 'http://localhost:3000/heroes'

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  // getHeroes(): Hero[] {
  //   return HEROES;
  // }

  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }

  getHeroes(): Observable<Hero[]> {
    // this.messageService.add('HeroService: fetched heroes');
    // const heroes = of(HEROES);
    // return heroes;
    return this.http.get<Hero[]>(this.heroesUrl)
      .pipe(
        tap(_ => this.log('fetched heroes')),
        catchError(this.handleError<Hero[]>('getHeroes', []))
      );

  }

  getHero(id: Number): Observable<Hero> {
    // const hero = HEROES.find(h => h.id === id)!;
    // this.messageService.add(`HeroService: fetched hero id=${id}`);
    // return of(hero);
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap(_ => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );

  }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }

  /**POST: add a new hero to the server */
  addHero(hero: Hero): Observable<Hero> {

    return this.getHeroes().pipe(
      switchMap(heroes => {
        let rank = heroes.length + 1;
        hero.id = rank.toString();
        return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions)
        .pipe(
          tap((newHero: Hero) => this.log(`added hero w/ id=${newHero.id}`)),
          catchError(this.handleError<Hero>('addHero'))
        );
      })
    );

    // return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions)
    //   .pipe(
    //     tap((newHero: Hero) => this.log(`added hero w/ id=${newHero.id}`)),
    //     catchError(this.handleError<Hero>('addHero'))
    //   );
  }

  /** PUT: update the hero on the server */
  updateHero(hero: Hero): Observable<any> {

    const url = `${this.heroesUrl}/${hero.id}`;
    // this.log(`Updating id=${hero.id} with name=${hero.name}`);
    return this.http.put(url, hero, this.httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updatedHero'))
    );
  }

  /** DELETE: delete the hero from the server */
  deleteHero(id: string): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }

  /**
 * Handle Http operation that failed.
 * Let the app continue.
 *
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      return of(result as T);
    };

  }
}
